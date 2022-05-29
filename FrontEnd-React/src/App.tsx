import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import BoardHome from "./board/BoardHome";
import AppContainer from "./components/AppContainer";
import SnackbarComponent from "./components/SnackBar";
import { useSessionUser } from "./store/userStore";
import Login from "./user/Login";
import Register from "./user/Register";
import Profile from "./user/Profile";

import { getOptions } from "./utils/utils";
import ShowBoard from "./board/ShowBoard";
import { useEffect } from "react";

function App() {
  const navigation = useNavigate();
  const user = useSessionUser();

  useEffect(() => {
    !user && navigation("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <AppContainer title="Calera" navigation={getOptions()}>
        <Routes>
          <Route
            path="/board"
            element={user ? <BoardHome /> : <Navigate to={"/"} />}
          />
          <Route
            path="/board/:token"
            element={user ? <ShowBoard /> : <Navigate to={"/"} />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to={"/"} />}
          />
          <Route path="/register-user" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<h1>Welcome to CALERA</h1>} />
        </Routes>
      </AppContainer>
      <SnackbarComponent />
    </>
  );
}

export default App;
