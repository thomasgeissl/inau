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
import { useEffect, useState } from "react";
import { PlayArrow } from "@mui/icons-material";
import Scene from "./client/Scene";
interface ScenePreviewProps extends BoxProps {}

const ScenePreview: React.FC<ScenePreviewProps> = (
  props: ScenePreviewProps
) => {
  const { id } = useParams();
  const init = useStore((state) => state.init);
  const previewScene = useStore((state) => state.previewScene);
  const shows = useStore((state) => state.shows);
  const show = shows.find((show) => show.id === id);
  const [selectedTab, setSelectedTab] = useState("preview")
  useEffect(() => {
    init();
  }, []);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      gap={3}
      width={"100%"}
      sx={{ overflow: "auto" }}
      {...props}
    >
      <Box>
        <Button color="secondary" variant={selectedTab === "preview" ? "contained" : "outlined"} onClick={()=>{setSelectedTab("preview")}}>
          preview
        </Button>
        <Button color="secondary" variant={selectedTab === "results" ? "contained" : "outlined"} onClick={()=>setSelectedTab("results")}>
          results
        </Button>
      </Box>
      {previewScene && <>
        {selectedTab === "preview" && <Scene scene={previewScene}></Scene>}
        {selectedTab === "results" && <>results</>}
      </>}
      {!previewScene && <>
      <Typography variant="body2">no scene selected</Typography>
      </>}
    </Box>
  );
};

export default ScenePreview;
