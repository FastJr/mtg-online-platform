// client/src/App.js
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './pages/Home';
import Room from './pages/Room';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;
