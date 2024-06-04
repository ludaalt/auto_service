import React from 'react';
import ReactDOM from 'react-dom/client';
import { createGlobalStyle } from 'styled-components';
import { Provider } from 'react-redux';

import store from './store/store';
import App from './App.tsx';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  img {
    width: 100%;
    height: auto;
  }

  a {
      text-transform: uppercase;
      font-family: 'Arial', sans-serif;
      color: inherit;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
`;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <GlobalStyle />
      <App />
    </Provider>
  </React.StrictMode>,
);
