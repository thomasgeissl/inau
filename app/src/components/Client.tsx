import { useEffect } from "react";
import useStore from "../stores/client";
import Question from "./client/Question";
import styled from "@emotion/styled";
import Scene from "./client/Scene";

const Container = styled.div`
  /* padding: 64px; */
  height: 100%;
  width: 100%;
`;
interface ClientProps {}
const Client: React.FC<ClientProps> = ({}) => {
  const init = useStore((state) => state.init);
  const scene = useStore((state) => state.scene);
  useEffect(() => {
    init();
  }, []);
  return (
    <Container>
      {scene && <Scene scene={scene} />}
    </Container>
  );
};

export default Client;
