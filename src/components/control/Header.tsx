import { useEffect } from "react";
import useStore from "../../stores/control";
import { Link, useParams } from "react-router-dom";
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

const MenuContainer = styled.ul`
padding-left: 0;
li{
  display: inline-block;
}
`;
interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  const responses = useStore((state) => state.responses);
  const questions = useStore((state) => state.questions);
  const uuid = useParams().uuid ?? "";
  const question = questions.find((question) => question.uuid === uuid);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <MenuContainer>
            <MenuItem>
              <Link to="/control">actions</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/results">results</Link>
            </MenuItem>
          </MenuContainer>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
