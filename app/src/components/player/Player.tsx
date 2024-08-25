import useStore from "../../stores/control";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { Box, BoxProps, Button, Card, Grid, IconButton, Typography } from "@mui/material";
import { useEffect } from "react";
import { PlayArrow } from "@mui/icons-material";
import Control from "./Control";
import Scene from "../client/Scene";
interface PlayerProps extends BoxProps {}

const Player: React.FC<PlayerProps> = (props: PlayerProps) => {
  const { id } = useParams();
  const init = useStore((state) => state.init);
  const playerScene = useStore((state) => state.playerScene);
  useEffect(() => {
    init();
  }, []);

  return (
    <Box display={"flex"} flexDirection={"column"} gap={3} width={"100%"}{...props}>
      <Typography variant="h6" fontStyle={"italic"}>
        player
      </Typography>
      <Box flex={1}>
        {playerScene && <Scene scene={playerScene}></Scene>}
        {!playerScene && <>this show is not currently active</>}
      </Box>
      <Control></Control>
    </Box>
  );
};

export default Player;
