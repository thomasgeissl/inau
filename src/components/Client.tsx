import { useEffect } from "react";
import useStore from "../stores/client";
import Question from "./client/Question";
import styled from "@emotion/styled";

const Container = styled.div`
  /* padding: 64px; */
  height: 100%;
  width: 100%;
`;
interface ClientProps {}
const Client: React.FC<ClientProps> = ({}) => {
  const init = useStore((state) => state.init);
  const question = useStore((state) => state.question);
  useEffect(() => {
    init();
  }, []);
  return (
    <Container>
      {question && <Question question={question} showActions={true} />}
    </Container>
  );
};

export default Client;
