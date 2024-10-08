import useStore from "../stores/control";
import { useParams } from "react-router-dom";
import _ from "lodash";
import {
  Box,
  BoxProps,
  Button,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import Scene from "./client/Scene";
import Results from "./Results";
import { PlayArrow } from "@mui/icons-material";
interface ScenePreviewProps extends BoxProps {}

const Inspector: React.FC<ScenePreviewProps> = (props: ScenePreviewProps) => {
  const theme = useTheme();
  const { id } = useParams();
  const previewScene = useStore((state) => state.previewScene);
  const setPlayerScene = useStore((state) => state.setPlayerScene);
  const shows = useStore((state) => state.shows);
  const show = shows.find((show) => show.id === id);
  const [selectedTab, setSelectedTab] = useState("preview");

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      gap={3}
      width={"100%"}
      sx={{
        overflow: "auto",
        padding: "24px",
        backgroundColor: theme.palette.background.paper,
      }}
      flex={1}
      {...props}
    >
      <Typography
        variant="h6"
        fontStyle={"bold"}
        color="primary"
        textAlign="right"
        textTransform="uppercase"
      >
        inspector
      </Typography>
      <Box display="flex">
        <Button
          color="secondary"
          variant={selectedTab === "preview" ? "contained" : "outlined"}
          onClick={() => {
            setSelectedTab("preview");
          }}
        >
          preview
        </Button>
        <Button
          color="secondary"
          variant={selectedTab === "results" ? "contained" : "outlined"}
          onClick={() => setSelectedTab("results")}
        >
          results
        </Button>
        <Box flex={1}></Box>
        <IconButton onClick={()=>setPlayerScene(previewScene)}>
          <PlayArrow></PlayArrow>
        </IconButton>
      </Box>
      {previewScene && (
        <Box display="flex" flexDirection="column" gap={3} flex={1}>
          <Typography variant="h5">{previewScene.title}</Typography>
          <Divider></Divider>
          {selectedTab === "preview" && <Scene scene={previewScene}></Scene>}
          {selectedTab === "results" && id && (
            <Results showId={id} scene={previewScene} flex={1}></Results>
          )}
        </Box>
      )}
      {!previewScene && (
        <>
          <Typography variant="body2">no scene selected</Typography>
        </>
      )}
    </Box>
  );
};

export default Inspector;
