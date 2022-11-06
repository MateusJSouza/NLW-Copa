import { Box, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface Props {
  poolId: string;
}

export function Guesses({ poolId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  async function fetchGames() {
    try {
      setIsLoading(true);

      const { data } = await api.get(`/pools/${poolId}/games`);
      console.log(data.games);

    } catch (error) {
      console.log(error)

      toast.show({
        title: 'Não foi possível carregar os jogos',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  }, [poolId])

  return (
    <Box>

    </Box>
  );
}
