const express = require('express');
const router = express.Router();
const Deck = require('../models/Deck');
const User = require('../models/User');
const axios = require('axios');

// Function to add delay between requests (to respect Scryfall rate limits)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get user's decks using email
router.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Find the user by email and populate decks
    const user = await User.findOne({ email }).populate('decks');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.decks); // Return the user's decks
  } catch (error) {
    console.error('Error fetching decks:', error);
    res.status(500).json({ error: 'Failed to fetch decks' });
  }
});

// Create a new deck
router.post('/', async (req, res) => {
    const { email, name, commander, deckList } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      console.log('Received deckList:', deckList); // Add this for debugging
  
      // Fetch card data from Scryfall with rate limiting
      const cards = [];
      for (let i = 0; i < deckList.length; i++) {
        const card = deckList[i];
  
        // Check if the card name is valid and not empty
        if (!card.cardName || card.cardName.trim() === '') {
          console.error(`Card name missing for card at index ${i}. Skipping.`);
          continue; // Skip this card if the name is invalid
        }
  
        try {
          const response = await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(card.cardName)}`);
          cards.push({
            cardId: response.data.id,
            cardName: response.data.name,
            quantity: card.quantity,
          });
        } catch (error) {
          console.error(`Error fetching card ${card.cardName}:`, error);
          return res.status(400).json({ error: `Failed to fetch card: ${card.cardName}` });
        }
        
        // Add a delay of 100ms between each request to avoid hitting rate limits
        await delay(100);
      }
  
      console.log('Final cards array:', cards); // Add this for debugging
  
      // Create the new deck
      const newDeck = new Deck({
        name,
        commander,
        cards,  // Save the cards array to the deck
        owner: user._id,
      });
  
      await newDeck.save();
      user.decks.push(newDeck);
      await user.save();
  
      res.status(201).json(newDeck);
    } catch (error) {
      console.error('Error creating deck:', error);
      res.status(500).json({ error: 'Failed to create deck' });
    }
  });

    // Delete a deck by ID
    router.delete('/:id', async (req, res) => {
        try {
        const deckId = req.params.id;
    
        // Find the deck and the associated user
        const deck = await Deck.findById(deckId);
        if (!deck) {
            return res.status(404).json({ error: 'Deck not found' });
        }
    
        // Remove the deck reference from the user's decks array
        await User.updateOne(
            { _id: deck.owner },
            { $pull: { decks: deckId } }
        );
    
        // Delete the deck from the Deck collection
        await Deck.findByIdAndDelete(deckId);
    
        res.status(200).json({ message: 'Deck deleted successfully' });
        } catch (error) {
        res.status(500).json({ error: 'Failed to delete deck' });
        }
    });

// PUT route to update a deck by its ID
router.put('/:id', async (req, res) => {
    const { id } = req.params; // Deck ID from the request parameters
    const { name, commander, deckList } = req.body;
  
    try {
      // Find and update the deck by its ID
      const updatedDeck = await Deck.findByIdAndUpdate(
        id,
        {
          name,
          commander, // Update commander name
          cards: deckList.map(card => ({
            cardId: card.cardId,
            cardName: card.cardName,
            quantity: card.quantity
          })),
        },
        { new: true } // Return the updated document
      );
  
      if (!updatedDeck) {
        return res.status(404).json({ error: 'Deck not found' });
      }
  
      // Now ensure that the user's decks array still references the updated deck
      const user = await User.findById(updatedDeck.owner);
      if (user) {
        // Since we're updating, the deck reference should already exist.
        // There's no need to re-add it unless it was accidentally removed.
        const deckExistsInUser = user.decks.includes(updatedDeck._id);
        if (!deckExistsInUser) {
          user.decks.push(updatedDeck._id); // In case the deck was missing from user's array
          await user.save();
        }
      }
  
      res.json(updatedDeck); // Send back the updated deck
    } catch (error) {
      console.error('Error updating deck:', error);
      res.status(500).json({ error: 'Failed to update deck' });
    }
  });
  

module.exports = router;
