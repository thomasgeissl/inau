import { useEffect } from "react";
import useStore from "../stores/client";
import Question from "./client/Question";
import styled from "@emotion/styled";
import Scene from "./client/Scene";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";

interface ClientProps {}
const Client: React.FC<ClientProps> = ({}) => {
  const { id } = useParams()
  const init = useStore((state) => state.init);
  const scene = useStore((state) => state.scene);
  useEffect(() => {
    if(id){
      init(id);
    }
  }, [id]);
  return (
    <Box width="100%" height="100%" sx={{padding: "24px"}}>
      {scene && <Scene scene={scene} />}
    </Box>
  );
};

export default Client;
