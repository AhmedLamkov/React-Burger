import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './components/app/app';
import { IngredientsProvider } from './services/ingredients-context';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <IngredientsProvider>
      <App />
    </IngredientsProvider>
  </React.StrictMode>
);
