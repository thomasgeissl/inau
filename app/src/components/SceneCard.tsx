import useStore from "../stores/control";
import _ from "lodash";
import {
  Box,
  BoxProps,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
interface SceneCardProps extends BoxProps {
  scene: any;
}

const SceneCard: React.FC<SceneCardProps> = (props: SceneCardProps) => {
  const scene = props?.scene;
  const playerScene = useStore(state => state.playerScene)
  // const previewScene = useStore(state => state.previewScene)
  useEffect(() => {}, []);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      gap={3}
      width={"100%"}
      padding={"12px"}
      sx={{
        // backgroundColor: scene.color ?? null,
      }}
      {...props}
    >
      <Typography variant="h5" color={playerScene?.id === scene?.id ? "text.primary" : "primary"}>{scene?.title}</Typography>
      <Typography variant="body1">{scene?.description}</Typography>
    </Box>
  );
};

export default SceneCard;
