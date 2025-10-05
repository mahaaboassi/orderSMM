import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './store.jsx';
// import i18n
import './i18n';
import AddBalance from './pages/commonElements/transactions/addBalance.jsx';
import TransferBalance from './pages/commonElements/transactions/transferBalance.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <AddBalance/>
      <TransferBalance/>
    </Provider>
  </StrictMode>,
)
