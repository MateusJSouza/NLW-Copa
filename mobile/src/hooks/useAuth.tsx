import { useContext } from 'react'

// Importando a função authContext e a interface AuthContextDataProps
import { AuthContext, AuthContextDataProps, } from '../contexts/AuthContext'

export function useAuth(): AuthContextDataProps {
  // Criando uma constante com o hook e passando o nosso contexo como parâmetro
  const context = useContext(AuthContext)

  return context
}