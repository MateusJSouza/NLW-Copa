import { createContext, ReactNode, useEffect, useState } from "react";
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { api } from '../services/api'

// Garantindo o redirecionamento do navegador
WebBrowser.maybeCompleteAuthSession();

interface UserProps {
  name: string;
  avatarUrl: string;
}

export interface AuthContextDataProps {
  user: UserProps;
  isUserLoading: boolean;
  signIn: () => Promise<void>; // processo de autenticação
}

interface AuthProviderProps {
  children: ReactNode;
}

// Armazenar o conteúdo do contexto
export const AuthContext = createContext({} as AuthContextDataProps)

// Compartilhamento do contexto com toda a aplicação
export function AuthContextProvider({ children }: AuthProviderProps) {
  // Começa como um objeto vazio, mas o tipo dele é o UserProps
  const [user, setUser] = useState<UserProps>({} as UserProps)

  const [isUserLoading, setIsUserLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '942960564473-v85te5vflt1tftqmno9ik6ab5gsknsek.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['profile', 'email']
  })

  async function signInWithGoogle(access_token: string) {
    try {
      setIsUserLoading(true);
      const tokenResponse = await api.post('/users', { access_token })

      console.log(tokenResponse.data)

    } catch (err) {
      console.log(err)
      throw err;
    } finally {
      setIsUserLoading(false);
    }
  }
  
  // Definição de função de signIn
  async function signIn() {
    try {
      setIsUserLoading(true)
      await promptAsync(); // inicia o fluxo de autenticação
    } catch (err) {
      console.error(err)
      throw err;
    } finally {
      setIsUserLoading(false)
    }
  }

  // O useEffect é executado sempre que a resposta mudar
  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      signInWithGoogle(response.authentication.accessToken)
    }
  }, [response])
  
  return (
    <AuthContext.Provider value={{
      signIn,
      isUserLoading,
      user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}