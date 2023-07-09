import React, { useState } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Control from "./components/Control";
import Client from "./components/Client";
import Result from "./components/control/Result";
import styled from "@emotion/styled";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";

const Container = styled.div`
  padding: 16px;
`;

const router = createBrowserRouter([
  {
    path: "/run",
    element: <Client></Client>,
  },
  {
    path: "/control",
    element: <Control></Control>,
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
