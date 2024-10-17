// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <Auth0Provider
    domain="dev-1blwqc7ms7ys8cym.us.auth0.com"
    clientId="GzALtx413Sb9vqdRogyusLMJJKIkKmTe"
    redirectUri={window.location.origin}
    cacheLocation="localstorage" // Store session in localStorage
    useRefreshTokens={true}      // Use refresh tokens for long-lived sessions
  >
    <App />
  </Auth0Provider>
);
