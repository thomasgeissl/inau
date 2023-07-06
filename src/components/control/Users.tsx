import { useEffect } from "react";
import useStore from "../../stores/control";

interface UsersProps {}

const Users: React.FC<UsersProps> = ({}) => {
  const users = useStore((state) => state.users);
  return <>number of users: {users.length}</>;
};

export default Users;
