import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const AppComponent = (
  <App />
);

const appElement = document.getElementById('app');
if(appElement) {
  ReactDOM.createRoot(appElement).render(AppComponent);
}