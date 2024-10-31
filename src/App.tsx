import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '@/styles/global.scss';
import { toastOptions } from '@/styles/toastify';
import AuthProvider from '@/contexts/AuthContext';
import Router from '@/router';

function App() {
  return (<>
    <ToastContainer {...toastOptions} />
    <AuthProvider>
      <Router />
    </AuthProvider>
  </>);
}

export default App;