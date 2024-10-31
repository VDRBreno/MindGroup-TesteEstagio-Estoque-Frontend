import { ToastContainerProps } from 'react-toastify';

export const toastStyle = {
  error: {
    style: {
      border: '1px solid #FF4B4B',
      padding: '4px',
      color: '#FF4B4B'
    },
    autoClose: 10000
  },
  
  success: {
    style: {
      border: '1px solid #61D345',
      padding: '4px',
      color: '#61D345'
    },
    autoClose: 1500
  },

  info: {
    style: {
      border: '1px solid #18B1DB',
      padding: '4px',
      color: '#18B1DB'
    },
    autoClose: 3000
  }
}

export const toastOptions: ToastContainerProps = {
  position: 'top-right',
  autoClose: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
}