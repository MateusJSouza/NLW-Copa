import { Heading, VStack } from "native-base";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Header } from "../components/Header";

export function FindPool() {
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
        />

        <Button
          title="BUSCAR BOLÃO"
        />
      </VStack>
    </VStack>
  )
}