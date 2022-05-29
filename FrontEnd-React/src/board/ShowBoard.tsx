import { Button, Grid, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SubTitle, Title } from "../components/Title";
import { Board, getBoard } from "./boardService";

export default function ShowBoard() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [board, setBoard] = useState<Board>();

  useEffect(() => {
    fetchBoard();
  }, []);

  async function fetchBoard() {
    if (token) {
      getBoard(token).then((response) => {
        const board = response.content;
        setBoard(board);
      });
    }
  }

  return board ? (
    <>
      <StatsPanel
        boardToken={token}
        status={board.status}
        player1Name={board?.player_1_name}
        player2Name={board?.player_2_name}
        player3Name={board?.player_3_name}
        player4Name={board?.player_4_name}
        players={board.players}
        scores={board.scores}
      />
      <Button onClick={() => navigate(-1)}>Atras</Button>
    </>
  ) : (
    <h1>Loading</h1>
  );
}

interface StatsPanelProps {
  boardToken?: string;
  status?: string;
  player1Name?: string;
  player2Name?: string;
  player3Name?: string;
  player4Name?: string;
  players?: number;
  scores?: string[];
}

function StatsPanel(props: StatsPanelProps) {
  const {
    boardToken,
    status,
    player1Name,
    player2Name,
    player3Name,
    player4Name,
    players,
  } = props;
  return (
    <>
      <Paper style={{ padding: "10px" }} elevation={12}>
        <Title text="Board" />

        <Grid container>
          <Grid item md={6} xs={12}>
            <SubTitle text={"Board Id: " + boardToken} />
            <SubTitle text={"Players: " + players} />
            <SubTitle text={"Status: " + status} />
          </Grid>

          <Grid item md={6} xs={12}>
            <SubTitle text={"Player 1: " + player1Name} />
            {player2Name && <SubTitle text={"Player 2: " + player2Name} />}
            {player3Name && <SubTitle text={"Player 3: " + player3Name} />}
            {player4Name && <SubTitle text={"Player 4: " + player4Name} />}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
