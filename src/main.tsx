import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import "./custom.scss";
import InterestingChannels from "./sections/InterestingChannels";
import NewsChannels from "./sections/NewsChannels";
import Search from "./sections/Search";

const childRoutes: RouteObject[] = [
  {
    path: "/",
    element: <NewsChannels />,
    index: true,
  },
  {
    path: "/interesting-channels",
    element: <InterestingChannels />,
  },
  {
    path: "/search",
    element: <Search />,
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: childRoutes,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
