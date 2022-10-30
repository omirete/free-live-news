import InterestingChannels from "./sections/InterestingChannels";
import NewsChannels from "./sections/NewsChannels";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Search from "./sections/Search";
import MyNavbar from "./components/MyNavbar";

const router = createBrowserRouter([
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
]);

const App = () => {
  return (
    <div>
      <MyNavbar />
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
