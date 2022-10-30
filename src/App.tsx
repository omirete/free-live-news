import { Outlet } from "react-router-dom";
import MyNavbar from "./components/MyNavbar";

const App = () => {
  return (
    <div>
      <MyNavbar />
      <Outlet />
    </div>
  );
};

export default App;
