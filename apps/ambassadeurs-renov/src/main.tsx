import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/home";
import { Simulation } from "./pages/simulation";
import { Ressources } from "./pages/ressources";
import { MonLogement } from "./pages/mon-logement";
import { MesTravaux } from "./pages/mes-travaux";
import { NotFound } from "./pages/404";

import "@open-dpe-logement/web-components"
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <Home /> },
      { path: "/simulation", element: <Simulation /> },
      { path: "/mon-logement", element: <MonLogement /> },
      { path: "/mes-travaux", element: <MesTravaux /> },
      { path: "/ressources", element: <Ressources /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
