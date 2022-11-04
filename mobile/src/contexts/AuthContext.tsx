import { createContext, ReactNode } from "react";

interface UserProps {
  name: string;
  // email: string;
  avatarUrl: string;
}

export interface AuthContextDataProps {
  user: UserProps;
  signIn: () => Promise<void>; // processo de autenticação
}

interface AuthProviderProps {
  children: ReactNode;
}

// Armazenar o conteúdo do contexto
export const AuthContext = createContext({} as AuthContextDataProps)

// Compartilhamento do contexto com toda a aplicação
export function AuthContextProvider({ children }: AuthProviderProps) {

  // Definição de função de signIn
  async function signIn() {
    console.log('Vamos logar!')
  }
  
  return (
    <AuthContext.Provider value={{
      signIn,
      user: {
        name: 'Mateus',
        avatarUrl: 'https://github.com/MateusJSouza.png'
      }
    }}>
      {children}
    </AuthContext.Provider>
  )
}