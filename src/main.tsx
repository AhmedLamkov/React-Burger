import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import AppComponent from './components/app/app';
import { store } from './services/store';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <AppComponent />
        </DndProvider>
      </Provider>
    </HashRouter>
  </React.StrictMode>
);
