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

  const [roomName, setRoomName] = useState('');
  const [roomPrivacy, setRoomPrivacy] = useState('Public');

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

  const handleCreateRoom = () => {
    const newRoom = {
      name: roomName,
      privacy: roomPrivacy,
      hostName: user.nickname, // Using user's nickname from Auth0 as the host
      occupants: [], // Initialize occupants as an empty array
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
              onClick={() => setShowDecksModal(true)}
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
                    onClick={() => navigate(`/room/${room.id}`)}
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
