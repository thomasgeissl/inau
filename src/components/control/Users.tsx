import { useEffect } from "react";
import styled from "@emotion/styled"
import useStore from "../../stores/control";

const Container = styled.div``
const List = styled.ul`list-style-type: none;`

interface UsersProps {}
const Users: React.FC<UsersProps> = ({}) => {
  const users = useStore((state) => state.users);
  return <Container>
    number of users: {users.length}
    <List>
      {users.map((user) =>{
        return <li key={user}>{user}</li>
      })}
    </List>
    </Container>
};

export default Users;
