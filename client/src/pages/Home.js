// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import '../styles/Home.css';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [showDecksModal, setShowDecksModal] = useState(false);
  const [showNewDeckModal, setShowNewDeckModal] = useState(false);

  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const [rooms, setRooms] = useState([]);
  const [decks, setDecks] = useState([]);

  const [roomName, setRoomName] = useState('');
  const [roomPrivacy, setRoomPrivacy] = useState('Public');

  const [deckName, setDeckName] = useState('');
  const [commander, setCommander] = useState('');
  const [deckList, setDeckList] = useState('');
  const [isSaving, setIsSaving] = useState(false); // Add a state to track if saving is in progress
  const [editingDeckId, setEditingDeckId] = useState(null); // State for the deck being edited


  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("Logged in as: ", user.email);  // Ensure this shows the correct email
      axios.post('/api/users/find-or-create', { email: user.email, name: user.name, auth0Id: user.sub })
        .then(response => {
          console.log('User verified or created:', response.data);
        })
        .catch(error => {
          console.error('Error verifying/creating user:', error);
        });
    }
  }, [isAuthenticated, user]);

  // Fetch rooms from the backend
  useEffect(() => {
    axios.get('/api/rooms')
      .then((response) => setRooms(response.data))
      .catch((error) => console.error('Error fetching rooms:', error));
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      const email = user.email;  // Should be Hotmail or Gmail based on the logged-in user
      axios
        .get(`/api/decks/${email}`)
        .then((response) => {
          setDecks(response.data);
        })
        .catch((error) => {
          console.error('Error fetching decks:', error);
        });
    }
  }, [isAuthenticated, user]);  

  const handleCreateRoom = () => {
    if (!user) return;
    const newRoom = {
      name: roomName,
      privacy: roomPrivacy,
      host: user.sub, // Using Auth0 user ID as the host identifier
    };
  
    axios
      .post('/api/rooms', newRoom)
      .then((response) => {
        setRooms([...rooms, response.data]); // Update rooms with the new room
        setShowNewRoomModal(false);
        setRoomName(''); // Reset form fields
        setRoomPrivacy('Public');
      })
      .catch((error) => {
        console.error('Error creating room:', error);
      });
  };  

  const handleCreateDeck = () => {
    if (isSaving) return; // Prevent function from executing if already saving
    
    setIsSaving(true); // Set to true when saving starts
    const email = user.email;
  
    // Parse the deckList textarea input into an array of card objects
    const parsedDeckList = deckList.split('\n').map(line => {
      const [quantity, ...nameParts] = line.trim().split(' ');
      return { cardName: nameParts.join(' '), quantity: parseInt(quantity) };
    });
  
    const deckData = {
      name: deckName,
      commander: commander,
      deckList: parsedDeckList, // Array of card objects including cardName
    };
  
    if (editingDeckId) {
      // If editingDeckId is set, update the existing deck
      axios
        .put(`/api/decks/${editingDeckId}`, deckData)
        .then((response) => {
          setDecks(decks.map(deck => deck._id === editingDeckId ? response.data : deck)); // Update the deck in the local state
          setShowNewDeckModal(false);
          setEditingDeckId(null); // Clear editing state after save
        })
        .catch((error) => {
          console.error('Error updating deck:', error);
        })
        .finally(() => {
          setIsSaving(false); // Re-enable the button after save is done
        });
    } else {
      // If no editingDeckId, create a new deck
      axios
        .post('/api/decks', { email, ...deckData })
        .then((response) => {
          setDecks([...decks, response.data]); // Add new deck to the list
          setShowNewDeckModal(false);
        })
        .catch((error) => {
          console.error('Error creating deck:', error);
        })
        .finally(() => {
          setIsSaving(false); // Re-enable the button after save is done
        });
    }
  };  

  const handleEditDeck = (deck) => {
    setEditingDeckId(deck._id); // Track the deck being edited
    setDeckName(deck.name);
    setCommander(deck.commander); // Prefill the commander name
    setDeckList(deck.cards.map(card => `${card.quantity} ${card.cardName}`).join('\n')); // Map cardName and quantity to the deckList textarea
    setShowNewDeckModal(true); // Show the modal
  };
  
  
  const handleDeleteDeck = (deckId) => {
    axios
      .delete(`/api/decks/${deckId}`)
      .then(() => {
        setDecks(decks.filter(deck => deck._id !== deckId)); // Remove the deck from local state
        if (editingDeckId === deckId) {
          setEditingDeckId(null); // Clear editing state if the deleted deck was being edited
        }
      })
      .catch((error) => {
        console.error('Error deleting deck:', error);
      });
  };  

  return (
    <Container fluid>
      <Row>
        {/* Side Navigation */}
        <Col xs={12} md={3} className="sidebar">
          <div className="d-flex flex-column align-items-start px-3">
            <Button
              variant=""
              className="nav-button button-newRoom mb-3"
              onClick={() => {
                console.log('New Room button clicked');
                if (isAuthenticated) {
                  setShowNewRoomModal(true);
                  console.log('showNewRoomModal changed:', showNewRoomModal);
                } else {
                  loginWithRedirect();
                }
              }}
            >
              New Room
            </Button>
            <Button
              variant=""
              className="nav-button button-decks mb-3"
              onClick={() => { 
                console.log('Decks button clicked');
                if (isAuthenticated) {
                  setShowDecksModal(true);
                  console.log('showDecksModal changed:', showNewRoomModal);
                } else {
                  loginWithRedirect();
                }
              }}
            >
              Decks
            </Button>
            <Button
              variant=""
              className="nav-button button-login mb-3"
              onClick={() => {

                if (isAuthenticated) {
                  logout({ returnTo: window.location.origin });
                } else {
                  loginWithRedirect();
                }
              }}
            >
              {isAuthenticated ? 'Log Out' : 'Log In'}
            </Button>
          </div>
        </Col>

        {/* Main Content Area */}
        <Col xs={12} md={9} className="main-content">
        <div className="title-container">
            <h1 className="site-title">Replacement Effect</h1>
            <h4 className="rooms-title">Join or Create a Room to Play Some Commander!</h4>
        </div>
        <div className="rooms-list mt-4">
            {rooms.map((room) => (
            <div key={room.id} className="room-item">
                <div className="room-details">
                <span className="room-host">{room.hostName}</span>
                <span className="room-occupants">{room.occupants.length}</span>
                <span className="room-name">{room.name}</span>
                <span className="room-privacy">{room.privacy}</span>
                <Button
                    className="join-button"
                    onClick={() => navigate(`/room/${room._id}`)}
                >
                    Join Room
                </Button>
                </div>
            </div>
            ))}
        </div>
        </Col>
      </Row>

      {/* New Room Modal */}
      <Modal
        show={showNewRoomModal}
        onHide={() => setShowNewRoomModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group controlId="roomName">
                    <Form.Label>Room Name</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Enter room name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="roomPrivacy">
                    <Form.Label>Privacy</Form.Label>
                    <Form.Control
                    as="select"
                    value={roomPrivacy}
                    onChange={(e) => setRoomPrivacy(e.target.value)}
                    >
                    <option>Public</option>
                    <option>Private</option>
                    </Form.Control>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewRoomModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateRoom}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Decks Modal */}
      <Modal
        show={showDecksModal}
        onHide={() => setShowDecksModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Your Decks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {/* List of decks */}
            {decks.map((deck) => (
                <div key={deck.id} className="deck-item">
                <div className="deck-details">
                    <h5>{deck.name}</h5>
                    <Button 
                    variant="warning" 
                    className="mr-2"
                    onClick={() => handleEditDeck(deck)}
                    >
                    Edit
                    </Button>
                    <Button 
                    variant="danger" 
                    onClick={() => handleDeleteDeck(deck._id)}
                    >
                    Delete
                    </Button>
                </div>
                </div>
            ))}
            {/* Option to add a new deck */}
            <Button variant="primary" onClick={() => {
                setDeckName('');
                setCommander('');
                setDeckList('');
                setEditingDeckId(null); // Reset editing state
                setShowNewDeckModal(true);
                }}>
                Add New Deck
            </Button>
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDecksModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    {/* New Deck Modal */}
    <Modal show={showNewDeckModal} onHide={() => setShowNewDeckModal(false)} centered>
    <Modal.Header closeButton>
        <Modal.Title>Create New Deck</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form>
        <Form.Group controlId="deckName">
            <Form.Label>Deck Name</Form.Label>
            <Form.Control
            type="text"
            placeholder="Enter deck name"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            />
        </Form.Group>

        <Form.Group controlId="commander">
            <Form.Label>Commander (optional)</Form.Label>
            <Form.Control
            type="text"
            placeholder="Enter commander card name"
            value={commander}
            onChange={(e) => setCommander(e.target.value)}
            />
        </Form.Group>

        <Form.Group controlId="deckList">
            <Form.Label>Deck List (Enter each card name and quantity, one per line)</Form.Label>
            <Form.Control
            as="textarea"
            rows={5}
            placeholder="Example: \n4 Lightning Bolt\n2 Black Lotus"
            value={deckList}
            onChange={(e) => setDeckList(e.target.value)}
            />
        </Form.Group>
        </Form>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowNewDeckModal(false)}>
        Close
        </Button>
        <Button 
        variant="primary" 
        onClick={handleCreateDeck} 
        disabled={isSaving} // Disable button while saving
        >
        {isSaving ? 'Saving...' : 'Save Deck'}
        </Button>
    </Modal.Footer>
    </Modal>

    </Container>
  );
}

export default Home;
