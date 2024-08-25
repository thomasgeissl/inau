import { useState } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import useStore from "../../stores/client";
import { ThumbDown, ThumbUp } from "@mui/icons-material";
import DirectusFile from "../DirectusFile";

interface SceneProps {
  scene: any;
}

const Scene: React.FC<SceneProps> = ({ scene }) => {
  console.log(scene);
  return (
    <Box display={"flex"} flexDirection={"column"} height="100%">
      {scene?.text && (
        <Box dangerouslySetInnerHTML={{ __html: scene?.text }}></Box>
      )}
      {scene?.media && <DirectusFile file={scene.media}></DirectusFile>}
      <Box flex={1}></Box>
      <Box className="actions">
        {scene?.type === "bool" && (
          <Box display={"flex"} gap={3} justifyContent={"center"}>
            <Button variant="outlined" color="primary">
              <ThumbUp></ThumbUp>
            </Button>
            <Button variant="outlined" color="primary">
              <ThumbDown></ThumbDown>
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Scene;
