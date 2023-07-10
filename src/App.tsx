import React, { useState } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Control from "./components/Control";
import Client from "./components/Client";
import Result from "./components/control/Result";
import styled from "@emotion/styled";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import Header from "./components/control/Header";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #242424;
  a{
    color: white;
    text-decoration: none;
  }
`;

const router = createBrowserRouter([
  {
    path: "/run",
    element: <Client></Client>,
  },
  {
    path: "/control",
    element: (
      <>
        <Header></Header>
        <Control></Control>,
      </>
    ),
  },
  {
    path: "/control/result/:uuid",
    element: <Result></Result>,
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <React.StrictMode>
          <RouterProvider router={router} />
        </React.StrictMode>
      </Container>
    </ThemeProvider>
  );
}

export default App;
