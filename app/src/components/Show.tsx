import useStore from "../stores/control";
import { useParams } from "react-router-dom";
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

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";

import { keyframes } from "@mui/system";
import { useEffect, useState } from "react";
import { Group, PlayArrow } from "@mui/icons-material";
import Inspector from "./Inspector";
import Player from "./player/Player";
import SceneCard from "./SceneCard";
import OnAir from "./OnAir";
import Modal from "./Modal";

const blinkAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;
interface ShowsProps {}

const Show: React.FC<ShowsProps> = ({}) => {
  const { id } = useParams();
  const init = useStore((state) => state.init);
  const shows = useStore((state) => state.shows);
  const show = shows.find((show) => show.id === id);
  const users = useStore((state) => state.users);
  const startedShow = useStore((state) => state.show);
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
      display="flex"
      flexDirection="column"
      gap={3}
      width="100%"
      height="100vh" // Ensure the component takes up the full viewport height
    >
      <AppBar position="static">
        <Toolbar display="flex" justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h4" flex={1}>
            {show?.title}
          </Typography>
          <Box display="flex" justifyContent={"center"} alignItems="center" gap={2} flex={1} sx={{position: "absolute", left: "50%", transform: "translateX(-50%)"}}>
            {(!startedShow || startedShow?.id !== show?.id) && (
              <IconButton onClick={() => startShow(show)}>
                <PlayArrow />
              </IconButton>
            )}
            {startedShow?.id === show?.id && <OnAir />}
          </Box>
          <IconButton onClick={() => setUsersModalOpen(true)}>
            <Badge
              badgeContent={users.filter((user) => user.show?.id === id).length}
            >
              <Group />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Grid container spacing={3} flex={1} minHeight={0}>
        {" "}
        {/* Ensure the grid takes up the remaining space */}
        <Grid item xs={4} sx={{ height: "100%", overflowY: "auto" }}>
          <Box
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{ overflowY: "auto" }}
          >
            {show?.scenes?.map((scene: any, index: number) => {
              return (
                <Card
                  key={`scene-${scene?.scenes_id?.id}-${index}`}
                  sx={{
                    width: "100%",
                    // animation:
                    //   playerScene?.id === scene?.scenes_id?.id ? blinkAnimation : "none",
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
                    <Grid item xs={10}>
                      <SceneCard scene={scene?.scenes_id} />
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        startIcon={<PlayArrow />}
                        onClick={(event: any) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setPlayerScene(scene?.scenes_id);
                        }}
                      />
                    </Grid>
                  </Grid>
                </Card>
              );
            })}
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Inspector height="100%" />
        </Grid>
        <Grid item xs={4}>
          <Player height="100%" />
        </Grid>
      </Grid>
      <Modal
        open={usersModalOpen}
        onClose={() => setUsersModalOpen(false)}
        title="Users"
      >
        <Box sx={{ width: 400 }}>
          {users
            .filter((user) => user.show?.id === id)
            .map((user) => (
              <Box
                key={user.id}
                display="flex"
                flexDirection={"column"}
                marginBottom={"12px"}
              >
                <Typography variant="body1">{user.id}</Typography>
                <Typography variant="body2" fontStyle={"italic"}>
                  {user.date_updated}
                </Typography>
              </Box>
            ))}
        </Box>
      </Modal>
    </Box>
  );
};

export default Show;
