import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import styled from "@emotion/styled";
import { CssBaseline, ThemeProvider } from "@mui/material";

import Client from "./components/Client";
import theme from "./theme";
import Shows from "./components/Shows";
import Show from "./components/Show";

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

const router = createBrowserRouter([
  {
    path: "shows",
    element: (
      <Container>
        <Shows></Shows>
      </Container>
    ),
  },
  {
    path: "shows/:id/control",
    element: (
      <Container>
        <Show></Show>
      </Container>
    ),
  },
  {
    path: "shows/:id/run",
    element: (
      <Container>
        <Client></Client>
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
