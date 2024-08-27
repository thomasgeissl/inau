import useStore from "../stores/control";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { Box, BoxProps, Button, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import Scene from "./client/Scene";
import Results from "./Results";
interface ScenePreviewProps extends BoxProps {}

const Inspector: React.FC<ScenePreviewProps> = (props: ScenePreviewProps) => {
  const theme = useTheme();
  const { id } = useParams();
  const init = useStore((state) => state.init);
  const previewScene = useStore((state) => state.previewScene);
  const responses = useStore((state) => state.responses);
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
      {...props}
    >
      <Typography
        variant="h6"
        fontStyle={"bold"}
        textTransform={"uppercase"}
        textAlign={"center"}
      >
        inspector
      </Typography>
      <Box>
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
      </Box>
      {previewScene && (
        <Box display="flex" flexDirection="column" gap={3}>
          <Typography variant="h5">{previewScene.title}</Typography>
          {selectedTab === "preview" && <Scene scene={previewScene}></Scene>}
          {selectedTab === "results" && id && (
            <Results showId={id} scene={previewScene}></Results>
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
