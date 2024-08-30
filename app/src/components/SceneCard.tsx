import useStore from "../stores/control";
import { useParams } from "react-router-dom";
import _ from "lodash";
import {
  Box,
  BoxProps,
  Button,
  Card,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { PlayArrow } from "@mui/icons-material";
interface SceneCardProps extends BoxProps {
  scene: any;
}

const SceneCard: React.FC<SceneCardProps> = (props: SceneCardProps) => {
  const scene = props?.scene;
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
      <Typography variant="h4">{scene?.title}</Typography>
      <Typography variant="body1">{scene?.description}</Typography>
    </Box>
  );
};

export default SceneCard;
