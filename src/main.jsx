import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import { store, persistor } from './store/configureStore.jsx';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from 'primereact/api';
import 'flowbite';
import 'flowbite-react'
import { ScrollTop } from 'primereact/scrolltop';
ReactDOM.createRoot(document.getElementById('root')).render(
  <PrimeReactProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ScrollTop />
          <ToastContainer />
          <App />
          {/* <Cursor/> */}
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </PrimeReactProvider>
);
