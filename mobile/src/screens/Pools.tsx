import { VStack, Icon, useToast, FlatList } from 'native-base';
import { Octicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native'

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { api } from '../services/api';
import { useEffect, useState, useCallback } from 'react';
import { Loading } from '../components/Loading'
import { PoolCard, PoolCardProps } from '../components/PoolCard';
import { EmptyPoolList } from '../components/EmptyPoolList';

export function Pools() {
  const [isLoading, setIsLoading] = useState(true);
  const [pools, setPools] = useState<PoolCardProps[]>([]);

  const toast = useToast();
  const { navigate } = useNavigation();

  async function fetchPools() {
    try {
      setIsLoading(true)
      const { data } = await api.get('/pools')

      setPools(data.pools)
    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Não foi possível carregar os bolões. Por favor, tente novamente!',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  /*
    useFocusEffect -> executa a função sempre que a interface receber o foco,
    ou seja, que o usuário entrar na interface;
    useCallback -> garante que a função não seja executava múltiplas vezes,
    anotando a referência dessa função.
  */
  useFocusEffect(useCallback(() => {
    fetchPools();
  }, []))

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title="Meus bolões"
      />
      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
      >
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
          onPress={() => navigate('find')}
        />
      </VStack>

      {
        isLoading ? <Loading /> :
          <FlatList
            data={pools}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <PoolCard
                data={item} 
                onPress={() => navigate('details', { id: item.id })}
              />
            )}
            ListEmptyComponent={<EmptyPoolList />} // componente que será exibido caso a nossa lista estiver vazia
            showsVerticalScrollIndicator={false} // desabilitando barra de rolagem
            _contentContainerStyle={{ pb: 10, }} // paddingBottom
            px={5} // padding na horizontal
          />  
      }

      {/* <Loading /> */}
    </VStack>
  )
}