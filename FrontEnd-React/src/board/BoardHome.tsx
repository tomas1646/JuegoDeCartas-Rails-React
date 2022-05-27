import { Divider, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonPanel from "../components/ButtonPanel";
import { showErrorMessage, showSuccessMessage } from "../components/SnackBar";
import FormTextField from "../components/TextField";
import { Title, Text } from "../components/Title";
import { useSessionUser } from "../store/userStore";
import {
  createGame,
  joinGame,
  Board,
  getOpenBoards,
  getUserOpenBoards,
} from "./boardService";

export default function BoardHome() {
  const navigate = useNavigate();
  const user = useSessionUser();

  const [boardId, setBoardId] = useState<string>("");
  const [openBoards, setOpenBoards] = useState<Board[]>([]);
  const [userOpenBoards, setUserOpenBoards] = useState<Board[]>([]);

  useEffect(() => {
    if (!user) {
      showErrorMessage("User isn't logged in");
      return navigate("/login");
    }

    //fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchData() {
    await getOpenBoards()
      .then((response) => setOpenBoards(response.content))
      .catch((err) =>
        showErrorMessage(err.response.data.message || "Unexcpected Error")
      );

    await getUserOpenBoards()
      .then((response) => setUserOpenBoards(response.content))
      .catch((err) =>
        showErrorMessage(err.response.data.message || "Unexpected Error")
      );
  }

  const handleNewGameButton = async () => {
    await createGame()
      .then((response) => {
        showSuccessMessage(response.message);
        navigate("/board/" + response.content.token);
      })
      .catch((err) =>
        showErrorMessage(err.response.data.message || "Unexcpected Error")
      );
  };

  const handleJoinButton = async () => {
    await joinGame(boardId)
      .then((response) => {
        showSuccessMessage(response.message);
        navigate("/board/" + response.content.token);
      })
      .catch((err) =>
        showErrorMessage(err.response.data.message || "Unexcpected Error")
      );
  };

  const resetForm = () => {
    setBoardId("");
  };

  return (
    <>
      <Title text="Create New Game" />
      <Text text="To create a new board press the bottom below" />
      <ButtonPanel
        button={[{ text: "Create New Game", onClick: handleNewGameButton }]}
      />
      <Divider style={{ marginTop: "30px", marginBottom: "30px" }} />
      <Title text="Join Game" />
      <FormTextField
        name="boardId"
        label="Board Id"
        setValue={setBoardId}
        title="Enter Board Id"
        value={boardId}
      />
      <ButtonPanel
        button={[
          { text: "Clear", onClick: resetForm },
          { text: "Join Game", onClick: handleJoinButton },
        ]}
      />
      <Divider style={{ marginTop: "30px", marginBottom: "30px" }} />
      <Title text="Your Games In Course" />

      {userOpenBoards &&
        userOpenBoards.map((board) => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            key={"1-" + board.token}
          >
            <Text text={"Board Id: " + board.token} />
            <Text text={"Status: " + board.status} />
            <Button
              variant="outlined"
              style={{ height: "30px" }}
              onClick={() => setBoardId(board.token)}
            >
              Copy Id
            </Button>
          </div>
        ))}
      <Divider style={{ marginTop: "30px", marginBottom: "30px" }} />
      <Title text="Games waiting for players" />

      {openBoards &&
        openBoards.map((board) => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            key={"2-" + board.token}
          >
            <Text text={"Board Id: " + board.token} />
            <Button
              variant="outlined"
              style={{ height: "30px" }}
              onClick={() => setBoardId(board.token)}
            >
              Copy Id
            </Button>
          </div>
        ))}
    </>
  );
}
