import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'polotno/model/store';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';

// Create a Polotno store without adding any initial page or element
const polotnoStore = createStore();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App store={polotnoStore} /> {/* Pass the Polotno store as a prop */}
  </React.StrictMode>
);

reportWebVitals();
