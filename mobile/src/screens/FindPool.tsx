import { Heading, useToast, VStack } from "native-base";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Header } from "../components/Header";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function FindPool() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { navigate } = useNavigation()

  const toast = useToast()

  async function handleJoinPool() {

    if (!code.trim()) {
      return toast.show({
        title: 'Informe o código',
        placement: 'top',
        bgColor: 'red.500',
      })
    }
    
    try {
      setIsLoading(true);

      await api.post('/pools/join', { code })
      
      toast.show({
        title: 'Você entrou no bolão com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      })
      
      setCode('')
      navigate('pools')
      
    } catch (error) {
      if (error.response?.data?.message === 'Pool not found.') {
        return toast.show({
          title: 'Bolão não encontrado!',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      if (error.response?.data?.message === 'You already joined this pool.') {
        return toast.show({
          title: 'Você já está nesse bolão!',
          placement: 'top',
          bgColor: 'red.500'
        })
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} bg="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">

        <Heading
          color="white"
          fontFamily="heading"
          fontSize="xl"
          textAlign="center"
          mb={8}
        >
          Encontrar o bolão através de {'\n'}
          seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          autoCapitalize="characters"
          value={code}
          onChangeText={setCode}
        />

        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  )
}