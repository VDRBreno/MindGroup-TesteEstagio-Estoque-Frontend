import { createContext, ReactNode, useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import Loading from '@/layouts/Loading';
import api from '@/services/api';
import { toastStyle } from '@/styles/toastify';
import getAxiosErrorResponse from '@/utils/getAxiosErrorResponse';
import getLocalStorageOrDefault from '@/utils/getLocalStorageOrDefault';
import { FormattedError } from '@/utils/HandleError';
import env from '@/utils/env';

interface AuthContextProps {
  authToken: string;
  isAuthenticated: boolean;
  removeFullAuthentication: () => void;
  authenticateUser: (authToken: string) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps);

const AUTH_TOKEN_STORE_KEY = 'AUTH_TOKEN';

export default function AuthProvider({
  children
}: AuthProviderProps) {

  const [authToken, setAuthToken] = useState<string>(getLocalStorageOrDefault(AUTH_TOKEN_STORE_KEY, ''));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuthentication, setIsLoadingAuthentication] = useState(true);

  async function validSession() {
    if(authToken==='') {
      setIsLoadingAuthentication(false);
      return;
    }

    try {

      const { data } = await api.post('/user/session/valid', {}, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if(data.success) {
        setIsAuthenticated(true);
      } else {
        removeFullAuthentication();
      }

      setIsLoadingAuthentication(false);

    } catch(error) {
      console.error(error);
      
      if(env.MODE==='development') {
        const axiosError = getAxiosErrorResponse(error);
        if(axiosError) {
          toast.error(`Erro no servidor: ${axiosError.error_description}`, toastStyle.error);
        } else if(error instanceof FormattedError) {
          toast.error(`Erro: ${error.description}`, toastStyle.error);
        } else {
          toast.error('Não foi possível fazer o cadastro', toastStyle.error);
        }
      }

      removeFullAuthentication();
      setIsLoadingAuthentication(false);
    }
  }

  function removeFullAuthentication() {
    setAuthToken('');
    localStorage.removeItem(AUTH_TOKEN_STORE_KEY);
    setIsAuthenticated(false);
  }

  function authenticateUser(authToken: string) {
    setAuthToken(authToken);
    localStorage.setItem(AUTH_TOKEN_STORE_KEY, authToken);
    setIsAuthenticated(true);
  }

  useEffect(() => {
    validSession();
  }, []);

  return (
    <AuthContext.Provider value={{
      authToken,
      isAuthenticated,
      removeFullAuthentication,
      authenticateUser
    }}>
      {isLoadingAuthentication ?<Loading message='Verificando sessão..' /> :children}
    </AuthContext.Provider>
  );
}