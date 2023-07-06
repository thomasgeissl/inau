import React, { useState } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Control from "./components/Control";
import Client from "./components/Client";

const router = createBrowserRouter([
  {
    path: "/run",
    element: <Client></Client>,
  },
  {
    path: "/control",
    element: <Control></Control>,
  },
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
