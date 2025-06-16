import { Button, Center, Container, Table, Text, VStack } from '@chakra-ui/react'
import { useLeaderboardStore } from '../store/leaderboard'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const {fetchLeaderboard, leaderboard} = useLeaderboardStore();

  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);
  console.log("leaderboard", leaderboard);

  return (
    <Container maxW={'container.xl'} py={12}>

      <Center>
        <VStack gap={8}>

          <Text
            fontWeight={"Bold"}
            fontSize={30}
          >Touch Grass</Text>

          <Text textAlign={'center'} maxW={"3/4"}>

            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam condimentum ligula quis ex tempor, eu pharetra lorem iaculis. Proin dictum nunc dui, sed fermentum diam convallis vel. Etiam dapibus, dolor quis pellentesque volutpat, metus turpis mattis odio, vitae molestie lectus sem eu justo. Fusce lobortis ultricies turpis ac placerat.

          </Text>

          <Button 
          size={"xl"} 
          onClick={() => navigate('/challenge')}>
            Play
          </Button>

          <Table.Root size={'lg'} maxW={"30rem"}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>User</Table.ColumnHeader>
                <Table.ColumnHeader>Score</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            {/* TODO: add table body */}
            <Table.Body>
              {leaderboard.map((entry) => (
                <Table.Row key={entry._id}>
                  <Table.Cell>{entry.name}</Table.Cell>
                  <Table.Cell>{entry.score}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {leaderboard.length === 0 && (
            // TODO: Improve
            <Text> No entries yet </Text>
          )}

        </VStack>
      </Center>


    </Container>
  )
}

export default HomePage