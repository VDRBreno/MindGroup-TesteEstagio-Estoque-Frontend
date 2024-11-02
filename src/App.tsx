import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '@/styles/global.scss';
import { toastOptions } from '@/styles/toastify';
import AuthProvider from '@/contexts/AuthContext';
import ModalProvider from '@/contexts/ModalContext';
import Router from '@/router';

function App() {
  return (<>
    <ToastContainer {...toastOptions} />
    <AuthProvider>
      <ModalProvider>
        <Router />
      </ModalProvider>
    </AuthProvider>
  </>);
}

export default App;