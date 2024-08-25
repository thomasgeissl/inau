import useStore from "../stores/control";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { Box, Button, Card, Grid, IconButton, Typography } from "@mui/material";
import { useEffect } from "react";
import { PlayArrow } from "@mui/icons-material";
import ScenePreview from "./ScenePreview";
import Player from "./player/Player";
import SceneCard from "./SceneCard";
import OnAir from "./OnAir";
interface ShowsProps {}

const Show: React.FC<ShowsProps> = ({}) => {
  const { id } = useParams();
  const init = useStore((state) => state.init);
  const shows = useStore((state) => state.shows);
  const show = shows.find((show) => show.id === id);
  const startedShow = useStore((state) => state.show)
  const startTime = useStore((state) => state.startTime)
  const setPreviewScene = useStore((state) => state.setPreviewScene)
  const setPlayerScene = useStore((state) => state.setPlayerScene)
  const startShow = useStore((state) => state.startShow)
  useEffect(() => {
    init();
  }, []);

  return (
    <Box display={"flex"} flexDirection={"column"} gap={3} width={"100%"} flex={1} padding={"24px"}>
      <Box display={"flex"}>
      <Typography variant="h4" flex={1}>Show {id}</Typography>
      <Box>
        {(!startedShow || startedShow?.id !== show?.id) && <IconButton onClick={()=>startShow(show)}><PlayArrow></PlayArrow></IconButton>}
        {startedShow?.id === show?.id && <OnAir></OnAir>}
      </Box>
      </Box>
      <Grid container spacing={3} flex={1}>
        <Grid item xs={6}>
          <Box display={"flex"} flexDirection={"column"} gap={3} sx={{overflowY: "auto"}}>
            {show?.scenes?.map((scene: any) => {
              return (
                <Card key={`scene-${scene?.scenes_id?.id}`} sx={{ width: "100%" }} onClick={()=>setPreviewScene(scene?.scenes_id)}>
                  <Grid container>
                    <Grid item xs={11}>
                      <SceneCard scene={scene?.scenes_id}></SceneCard>
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {" "}
                      <Button
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        startIcon={<PlayArrow />}
                        onClick={(event)=>{
                          event.preventDefault();
                          event.stopPropagation();
                          setPlayerScene(scene?.scenes_id)
                        }}
                      >
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              );
            })}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <ScenePreview height={"50%"}></ScenePreview>
          {startedShow && <Player height={"50%"}></Player>}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Show;
