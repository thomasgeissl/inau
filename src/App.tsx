import React, { useState } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Actions from "./components/Actions";
import Client from "./components/Client";
import Result from "./components/control/Result";
import styled from "@emotion/styled";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import Header from "./components/control/Header";
import Users from "./components/control/Users";
import Run from "./components/control/Run";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #242424;
  a {
    color: white;
    text-decoration: none;
  }
  color: white;
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
        <Content>
          <Run></Run>
        </Content>
      </Container>
    ),
  },

  {
    path: "/control/actions",
    element: (
      <Container>
        <Header></Header>
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
        <Header></Header>
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
        <Header></Header>
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
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </ThemeProvider>
  );
}

export default App;
