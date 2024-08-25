import useStore from "../../stores/control";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { Box, BoxProps, Button, Card, Grid, IconButton, Typography } from "@mui/material";
import { useEffect } from "react";
import { PlayArrow, SkipNext, SkipPrevious } from "@mui/icons-material";
interface ControlProps extends BoxProps {}

const Control: React.FC<ControlProps> = (props: ControlProps) => {
  const { id } = useParams();
  const init = useStore((state) => state.init);
  const shows = useStore((state) => state.shows);
  const show = shows.find((show) => show.id === id);
  const playerScene = useStore((state) => state.playerScene)
  const previousScene = useStore((state) => state.setPreviousScene)
  const nextScene = useStore((state) => state.setNextScene)
  useEffect(() => {
    init();
  }, []);

  return (
    <Box display={"flex"} flexDirection={"row"} gap={3} width={"100%"} {...props}>
      <Box flex={1}>
        <Typography variant="body1">{playerScene?.title}</Typography>
      </Box>
      <Box display={"flex"} gap={3}>
        <Button variant="outlined" onClick={()=>{previousScene()}}><SkipPrevious></SkipPrevious></Button>
        <Box display={"flex"}>
          <Typography variant="body1">
            {show?.scenes?.map((scene:any) => scene.scenes_id)?.findIndex((scene:any)=>scene?.id == playerScene?.id) +1}
            /
          {show?.scenes?.length}
          </Typography>
        </Box>
        <Button variant="outlined" onClick={()=>{nextScene()}}><SkipNext></SkipNext></Button>
      </Box>
    </Box>
  );
};

export default Control;