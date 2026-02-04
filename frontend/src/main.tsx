import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Auth0Provider
    domain="dev-d2l2uyw511hsvvru.us.auth0.com"
    clientId="Yak2f2K9SkMlAES2B0LH8qJdMHc2BhD6"
    authorizationParams={{ redirect_uri: window.location.origin }}
  >
    <App />
  </Auth0Provider>
);