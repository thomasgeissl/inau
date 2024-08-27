import useStore from "../stores/control";
import { useParams } from "react-router-dom";
import _ from "lodash";
import {
  Badge,
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Group, Person, PlayArrow } from "@mui/icons-material";
import Inspector from "./Inspector";
import Player from "./player/Player";
import SceneCard from "./SceneCard";
import OnAir from "./OnAir";
import Modal from "./Modal";
interface ShowsProps {}

const Show: React.FC<ShowsProps> = ({}) => {
  const { id } = useParams();
  const init = useStore((state) => state.init);
  const shows = useStore((state) => state.shows);
  const show = shows.find((show) => show.id === id);
  const users = useStore((state) => state.users);
  const startedShow = useStore((state) => state.show);
  const startTime = useStore((state) => state.startTime);
  const playerScene = useStore((state) => state.playerScene);
  const setPreviewScene = useStore((state) => state.setPreviewScene);
  const setPlayerScene = useStore((state) => state.setPlayerScene);
  const startShow = useStore((state) => state.startShow);

  const [usersModalOpen, setUsersModalOpen] = useState(false);

  const theme = useTheme();
  useEffect(() => {
    init();
  }, []);

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      gap={3}
      width={"100%"}
      flex={1}
      padding={"24px"}
    >
      <Box display={"flex"}>
        <Typography variant="h4" flex={1}>
          Show: {show?.title}
        </Typography>
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <IconButton onClick={()=>setUsersModalOpen(true)}>
            <Badge badgeContent={users.filter(user => user.showId === id).length}>
              <Group></Group>
            </Badge>
          </IconButton>
          {(!startedShow || startedShow?.id !== show?.id) && (
            <IconButton onClick={() => startShow(show)}>
              <PlayArrow></PlayArrow>
            </IconButton>
          )}
          {startedShow?.id === show?.id && <OnAir></OnAir>}
        </Box>
      </Box>
      <Grid container spacing={3} flex={1}>
        <Grid item xs={4}>
          <Box
            display={"flex"}
            flexDirection={"column"}
            gap={3}
            sx={{ overflowY: "auto" }}
          >
            {show?.scenes?.map((scene: any) => {
              return (
                <Card
                  key={`scene-${scene?.scenes_id?.id}`}
                  sx={{
                    width: "100%",
                    backgroundColor:
                      playerScene?.id === scene?.scenes_id?.id
                        ? theme.palette.secondary.main
                        : theme.palette.background.paper,
                    color:
                      playerScene?.id === scene?.scenes_id?.id
                        ? theme.palette.secondary.contrastText
                        : theme.palette.text.primary,
                  }}
                  onClick={() => setPreviewScene(scene?.scenes_id)}
                >
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
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setPlayerScene(scene?.scenes_id);
                        }}
                      ></Button>
                    </Grid>
                  </Grid>
                </Card>
              );
            })}
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Inspector height="100%"></Inspector>
        </Grid>
        <Grid item xs={4}>
          <Player height="100%"></Player>
        </Grid>
      </Grid>
      <Modal open={usersModalOpen} onClose={() => setUsersModalOpen(false)} title="Users">
        <Box sx={{ width: 400 }}>
          {users.filter((user) => user.showId === id).map((user) =>{
            return (
              <Box key={user.uuid} display={"flex"} gap={2} alignItems={"center"}>
                <Typography>{user.uuid}</Typography>
              </Box>
            );
          })}
        </Box>
      </Modal>
    </Box>
  );
};

export default Show;
