import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from 'polotno/model/store';
import { Provider } from 'react-redux';
import store from './store/store';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css';

// Create a Polotno store without adding any initial page or element
const polotnoStore = createStore();
polotnoStore.setSize(1700,1000,true)
// polotnoStore.activePage.setSize({ width, height, useMagic, softChange, })
// polotnoStore.clear();
polotnoStore.addPage()

const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);
const deviceType = urlParams.get("deviceType");
const templateId = urlParams.get("templateId");

// if(deviceType === 'mobile'){
//   polotnoStore.setSize(1600, 720, true);
// }else if(deviceType === 'tv'){
//   polotnoStore.setSize(1280, 720, true);
// }else{
//   polotnoStore.setSize(1280, 800, true);
// }

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <App 
    polotnoStore={polotnoStore} 
    />
    </Provider>
  // </React.StrictMode>
);

reportWebVitals();
