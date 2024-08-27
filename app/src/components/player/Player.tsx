import {
  Box,
  BoxProps,
  Button,
  Card,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect } from "react";
import Scene from "../client/Scene";
import useStore from "../../stores/control";
import Control from "./Control";

interface PlayerProps extends BoxProps {}

const Player: React.FC<PlayerProps> = (props: PlayerProps) => {
  const theme = useTheme();
  const playerScene = useStore((state) => state.playerScene);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      gap={3}
      width={"100%"}
      sx={{ backgroundColor: theme.palette.background.paper, padding: "24px" }}
      {...props}
    >
      <Typography
        variant="h6"
        fontStyle={"bold"}
        textTransform={"uppercase"}
        textAlign={"center"}
      >
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
