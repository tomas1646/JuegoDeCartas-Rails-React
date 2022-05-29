import { Divider, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonPanel from "../components/ButtonPanel";
import { showErrorMessage, showSuccessMessage } from "../components/SnackBar";
import FormTextField from "../components/TextField";
import { Title, Text } from "../components/Title";
import { createGame, joinGame, Board, getBoards } from "./boardService";

export default function BoardHome() {
  const navigate = useNavigate();
  const [boardId, setBoardId] = useState<string>("");
  const [players, setPlayers] = useState<number>(4);
  const [boards, setBoards] = useState<Board[]>([]);
  //const [userOpenBoards, setUserOpenBoards] = useState<Board[]>([]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fetchData() {
    getBoards()
      .then((response) => setBoards(response.content))
      .catch((err) =>
        showErrorMessage(err.response.data.message || "Unexcpected Error")
      );
  }

  const handleNewGameButton = () => {
    createGame(players)
      .then((response) => {
        showSuccessMessage(response.message);
        navigate("/board/" + response.content.token);
      })
      .catch((err) =>
        showErrorMessage(err.response.data.message || "Unexcpected Error")
      );
  };

  const handleJoinButton = () => {
    joinGame(boardId)
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

      {/*userOpenBoards &&
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
          ))*/}
      <Divider style={{ marginTop: "30px", marginBottom: "30px" }} />
      <Title text="Games waiting for players" />

      {boards &&
        boards.map((board) => (
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
