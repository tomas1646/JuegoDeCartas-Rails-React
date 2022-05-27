import { Navigate, Route, Routes } from "react-router-dom";
import BoardHome from "./board/BoardHome";
import AppContainer from "./components/AppContainer";
import SnackbarComponent from "./components/SnackBar";
import { useSessionUser } from "./store/userStore";
import Login from "./user/Login";
import Register from "./user/Register";
import Profile from "./user/Profile";

import { getOptions } from "./utils/utils";

function App() {
  const user = useSessionUser();

  return (
    <>
      <AppContainer navigation={getOptions()}>
        <Routes>
          <Route path="/board" element={<BoardHome />} />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to={"/"}></Navigate>}
          />
          <Route path="/register-user" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<h1>Welcome To Ta Te Ti</h1>} />
        </Routes>
      </AppContainer>
      <SnackbarComponent />
    </>
  );
}

export default App;
