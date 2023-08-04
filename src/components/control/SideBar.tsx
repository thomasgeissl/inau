import { useEffect, useState } from "react";
import useStore from "../../stores/control";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import PlayIcon from "@mui/icons-material/PlayCircle";
import StopIcon from "@mui/icons-material/StopCircle";
import { BarChart, Group, Settings } from "@mui/icons-material";

const Container = styled.div`
  background-color: rgb(24, 24, 24);
`;
const MenuContainer = styled.ul`
  padding-left: 0;
  li {
    /* display: inline-block; */
  }
`;
interface HeaderProps {}

const SideBar: React.FC<HeaderProps> = ({}) => {
  const responses = useStore((state) => state.responses);
  const questions = useStore((state) => state.questions);
  const uuid = useParams().uuid ?? "";
  const question = questions.find((question) => question.uuid === uuid);
  const location = useLocation();
  return (
    <Container>
      <MenuContainer>
        {location.pathname === "/control/run" && (
          <MenuItem>
            <Link to="/control/actions">
              <IconButton color="primary">
                <StopIcon></StopIcon>
              </IconButton>
            </Link>
          </MenuItem>
        )}
        {location.pathname !== "/control/run" && (
          <>
            <MenuItem>
              <Link to="/control/run">
                <IconButton color="primary">
                  <PlayIcon></PlayIcon>
                </IconButton>
              </Link>
            </MenuItem>
            <MenuItem>
              <Link to="/control/config">
                <IconButton color="primary">
                  <Settings></Settings>
                </IconButton>
              </Link>
            </MenuItem>
            {/* <MenuItem>
              <Link to="/control/actions">actions</Link>
            </MenuItem> */}
            <MenuItem>
              <Link to="/control/results">
                <IconButton color="primary">
                  <BarChart></BarChart>
                </IconButton>
              </Link>
            </MenuItem>
            <MenuItem>
              <Link to="/control/users">
                <IconButton color="primary">
                  <Group></Group>
                </IconButton>
              </Link>
            </MenuItem>
          </>
        )}
      </MenuContainer>
    </Container>
  );
};

export default SideBar;
