import { useEffect } from "react";
import useStore from "../stores/client";
import Scene from "./client/Scene";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import Idle from "./client/Idle";

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
    <Box width="100%" height="100%">
      {scene && <Scene scene={scene} />}
      {!scene && <Idle></Idle>}
    </Box>
  );
};

export default Client;
