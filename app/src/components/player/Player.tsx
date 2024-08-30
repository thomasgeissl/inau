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
import { useParams } from "react-router-dom";

interface PlayerProps extends BoxProps {}

const Player: React.FC<PlayerProps> = (props: PlayerProps) => {
  const { id } = useParams();
  const theme = useTheme();
  const shows = useStore((state) => state.shows);
  const startedShow = useStore((state) => state.show);
  const show = shows.find((show) => show.id === id);
  const playerScene = useStore((state) => state.playerScene);
  const startShow = useStore((state) => state.startShow);

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
        color="primary"
        textAlign="right"
        textTransform="uppercase"
      >
        player
      </Typography>
      <Box flex={1}>
        {playerScene && <Scene scene={playerScene}></Scene>}
        {!startedShow && (
          <Box display="flex" flexDirection="column" gap={3}>
            <Typography variant="h6">
              this show is not currently active
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                startShow(show);
              }}
            >
              start
            </Button>
          </Box>
        )}
      </Box>
      <Control></Control>
    </Box>
  );
};

export default Player;
