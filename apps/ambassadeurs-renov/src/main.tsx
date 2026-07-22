import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/home";
import { Avant } from "./pages/home/avant";
import { Apres } from "./pages/home/apres";
import { Ressources } from "./pages/ressources";
import { MonLogement } from "./pages/mon-logement";
import { MesTravaux } from "./pages/mes-travaux";
import { NotFound } from "./pages/404";

import { engine } from "@open-dpe-logement/engine";
import "@open-dpe-logement/web-components"
import "./index.css";

await engine.init();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { index: true, element: <Avant /> },
      { path: "apres", element: <Apres /> },
    ],
  },
  {
    path: "/mon-logement",
    Component: MonLogement,
  },
  {
    path: "/mes-travaux",
    Component: MesTravaux,
  },
  {
    path: "/ressources",
    Component: Ressources,
  },
  {
    path: "*",
    Component: NotFound,
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
