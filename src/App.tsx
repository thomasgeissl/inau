import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import styled from "@emotion/styled";
import { CssBaseline, ThemeProvider } from "@mui/material";

import Actions from "./components/Actions";
import Client from "./components/Client";
import Result from "./components/control/Result";
import theme from "./theme";
import Users from "./components/control/Users";
import Run from "./components/control/Run";
import SideBar from "./components/control/SideBar";
import Config from "./components/control/Config";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #242424;
  a {
    color: white;
    text-decoration: none;
  }
  color: white;
  display: flex;
`;
const Content = styled.div`
  /* margin: 24px; */
  flex: 1;
  overflow: scroll;
`;

const router = createBrowserRouter([
  {
    path: "/run",
    element: (
      <Container>
        <Client></Client>
      </Container>
    ),
  },

  {
    path: "/control/run",
    element: (
      <Container>
        <SideBar></SideBar>
        <Content>
          <Run></Run>
        </Content>
      </Container>
    ),
  },
  {
    path: "/control/config",
    element: (
      <Container>
        <SideBar></SideBar>
        <Content>
          <Config></Config>
        </Content>
      </Container>
    ),
  },
  {
    path: "/control/actions",
    element: (
      <Container>
        {/* <Header></Header> */}
        <SideBar></SideBar>
        <Content>
          <Actions></Actions>
        </Content>
      </Container>
    ),
  },
  {
    path: "/control/result/:uuid",
    element: (
      <Container>
        {/* <Header></Header> */}
        <SideBar></SideBar>
        <Content>
          <Result></Result>
        </Content>
      </Container>
    ),
  },
  {
    path: "/control/users",
    element: (
      <Container>
        {/* <Header></Header> */}
        <SideBar></SideBar>
        <Content>
          <Users></Users>
        </Content>
      </Container>
    ),
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </ThemeProvider>
  );
}

export default App;
