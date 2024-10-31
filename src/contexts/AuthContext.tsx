import { createContext, ReactNode } from 'react';

interface AuthContextProps {

}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps);

export default function AuthProvider({
  children
}: AuthProviderProps) {

  

  return (
    <AuthContext.Provider value={{

    }}>
      {children}
    </AuthContext.Provider>
  );
}