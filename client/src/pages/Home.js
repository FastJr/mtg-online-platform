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

  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const [rooms, setRooms] = useState([]);
  const [decks, setDecks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/api/rooms')
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.error('Error fetching rooms:', error);
      });
  }, []);

  useEffect(() => {
    axios
      .get('/api/decks')
      .then((response) => {
        setDecks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching decks:', error);
      });
  }, []);

  const [roomName, setRoomName] = useState('');
const [roomPrivacy, setRoomPrivacy] = useState('Public');

const handleCreateRoom = () => {
  // Build the room data object
  const newRoom = {
    name: roomName,
    privacy: roomPrivacy,
    hostName: user.name, // Assuming `user.name` contains the host's name
    occupants: 1, // Since the host is the first occupant
  };

  // Send the room data to the backend
  axios
    .post('/api/rooms', newRoom)
    .then((response) => {
      // Update the rooms list with the new room
      setRooms([...rooms, response.data]);
      // Close the modal
      setShowNewRoomModal(false);
      // Reset form fields
      setRoomName('');
      setRoomPrivacy('Public');
    })
    .catch((error) => {
      console.error('Error creating room:', error);
    });
};

  return (
    <Container fluid>
      <Row>
        {/* Side Navigation */}
        <Col xs={12} md={3} className="sidebar">
          <div className="d-flex flex-column align-items-start px-3">
            <Button
              variant="primary"
              className="mb-3"
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
              variant="secondary"
              className="mb-3"
              onClick={() => setShowDecksModal(true)}
            >
              Decks
            </Button>
            <Button
              variant="outline-primary"
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
          <div className="d-flex justify-content-between align-items-center">
            <h2>Rooms</h2>
            <div>
              {isAuthenticated ? (
                <span>
                  Signed in as <strong>{user.name}</strong>
                </span>
              ) : (
                <span>Not signed in</span>
              )}
            </div>
          </div>
          <div className="rooms-list mt-4">
            {rooms.map((room) => (
                <div key={room.id} className="room-item p-3 mb-3 border rounded">
                    <h5>{room.name}</h5>
                    <p>Occupants: {room.occupants}</p>
                    <p>Host: {room.hostName}</p>
                    <Button variant="success" onClick={() => navigate(`/room/${room.id}`)}>
                    Join Room
                    </Button>
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
                <h5>{deck.name}</h5>
                {/* Deck details */}
              </div>
            ))}
            {/* Option to add a new deck */}
            <Button variant="primary">Add New Deck</Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDecksModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Home;
