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
  userId: string;
  sessionId: string;
  isAuthenticated: boolean;
  removeFullAuthentication: () => void;
  authenticateUser: (userId: string, sessionId: string) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps);

const USER_ID_STORE_KEY = 'USER_ID';
const SESSION_ID_STORE_KEY = 'SESSION_ID';

export default function AuthProvider({
  children
}: AuthProviderProps) {

  const [userId, setUserId] = useState<string>(getLocalStorageOrDefault(USER_ID_STORE_KEY, ''));
  const [sessionId, setSessionId] = useState<string>(getLocalStorageOrDefault(SESSION_ID_STORE_KEY, ''));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuthentication, setIsLoadingAuthentication] = useState(true);

  async function validSession() {
    if(userId==='' && sessionId==='') {
      setIsLoadingAuthentication(false);
      return;
    }

    try {

      const { data } = await api.post('/user/session/valid', {
        user_id: userId,
        session_id: sessionId
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
    setUserId('');
    localStorage.removeItem(USER_ID_STORE_KEY);
    setSessionId('');
    localStorage.removeItem(SESSION_ID_STORE_KEY);
    setIsAuthenticated(false);
  }

  function authenticateUser(userId: string, sessionId: string) {
    setUserId(userId);
    localStorage.setItem(USER_ID_STORE_KEY, userId);
    setSessionId(sessionId);
    localStorage.setItem(SESSION_ID_STORE_KEY, sessionId);
    setIsAuthenticated(true);
  }

  useEffect(() => {
    validSession();
  }, []);

  return (
    <AuthContext.Provider value={{
      userId,
      sessionId,
      isAuthenticated,
      removeFullAuthentication,
      authenticateUser
    }}>
      {isLoadingAuthentication ?<Loading message='Verificando sessão..' /> :children}
    </AuthContext.Provider>
  );
}