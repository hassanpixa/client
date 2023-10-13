import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from 'polotno/model/store';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';

// Create a Polotno store without adding any initial page or element
const polotnoStore = createStore();
// polotnoStore.clear();
polotnoStore.addPage()

polotnoStore.setSize(1280, 800, true);

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <App store={polotnoStore} />
  // </React.StrictMode>
);

reportWebVitals();
