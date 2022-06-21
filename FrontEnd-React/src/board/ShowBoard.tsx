import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Grid,
  Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SubTitle, Title } from "../components/Title";
import useInterval from "../components/useInterval";
import BoardActionPanel from "./BoardActionPanel";
import { Board, getBoard } from "./boardService";
import { BoardStatus } from "./BoardTypes";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DefaultButton } from "../components/ButtonPanel";

export default function ShowBoard() {
  const { token } = useParams();
  const [board, setBoard] = useState<Board>();
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  useInterval(() => fetchBoard(), gameFinished ? null : 2000);

  useEffect(() => {
    fetchBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fetchBoard() {
    console.log("Fetching Data..");
    if (token) {
      getBoard(token).then((response) => {
        const board = response.content;
        if (
          board.board_status === BoardStatus.player1_win.name ||
          board.board_status === BoardStatus.player2_win.name ||
          board.board_status === BoardStatus.player3_win.name ||
          board.board_status === BoardStatus.player4_win.name
        ) {
          setGameFinished(true);
        }
        setBoard(board);
      });
    }
  }

  return board ? (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <StatsPanel board={board} />
        <GamePanel board={board} />
        {!gameFinished && <BoardActionPanel board={board} />}
      </div>
    </>
  ) : (
    <h1>Loading</h1>
  );
}

interface CardProps {
  card: string;
}

export function Card(props: CardProps) {
  const stringSplitted = props.card.split("-");
  const cardNumber = stringSplitted[0];
  const cardType = stringSplitted[1];
  const cardImgUrl = getCardImage();

  function getCardImage(): string {
    switch (cardType) {
      case "Or":
        return "oro.png";
      case "Ba":
        return "basto.png";
      case "Es":
        return "espada.png";
      default:
        return "copa.png";
    }
  }

  return (
    <Paper
      elevation={15}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: "70px",
        height: "90px",
      }}
    >
      <h3>{cardNumber}</h3>

      <Avatar
        alt="Type"
        src={require("../static/" + cardImgUrl)}
        variant="square"
        sx={{ height: 50, width: 50 }}
        imgProps={{
          style: { objectFit: "contain" },
        }}
      />
    </Paper>
  );
}

interface StatsPanelProps {
  board: Board;
}

function StatsPanel(props: StatsPanelProps) {
  const {
    token,
    board_status,
    player1_name,
    player2_name,
    player3_name,
    player4_name,
    players,
  } = props.board;
  const navigate = useNavigate();
  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div
            style={{
              width: "95%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title text="Board" />

            <DefaultButton text="Go Back" onClick={() => navigate(-1)} />
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container>
            <Grid item md={6} xs={12}>
              <SubTitle text={"Board Id: " + token} />
              <SubTitle text={"Players: " + players} />
              <SubTitle text={"Board Status: " + board_status} />
            </Grid>

            <Grid item md={6} xs={12}>
              <SubTitle text={"Player 1: " + player1_name} />
              {player2_name && <SubTitle text={"Player 2: " + player2_name} />}
              {player3_name && <SubTitle text={"Player 3: " + player3_name} />}
              {player4_name && <SubTitle text={"Player 4: " + player4_name} />}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

interface GamePanelProps {
  board: Board;
}

function GamePanel(props: GamePanelProps) {
  const {
    player1_name,
    player2_name,
    player3_name,
    player4_name,
    players,
    cards,
    scores,
    wins,
    board_status,
  } = props.board;

  return (
    <>
      <Paper style={{ padding: 6 }} elevation={2}>
        <Grid container direction={"column"} alignItems={"center"} spacing={1}>
          {players >= 3 && (
            <Grid item sm={4}>
              <Player
                position={3}
                name={player3_name}
                scores={scores[2]}
                wins={wins[2]}
              />
            </Grid>
          )}

          <Grid container item sm={12}>
            <Grid
              item
              sm={4}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Player
                position={1}
                name={player1_name}
                scores={scores[0]}
                wins={wins[0]}
              />
            </Grid>
            <Grid
              item
              sm={4}
              style={{
                display: "grid",
                gridTemplateColumns: `1fr 1fr 1fr`,
                gridTemplateRows: `1fr 1fr 1fr`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {board_status === BoardStatus.waiting_wins_asked.name ? (
                <>
                  {players >= 3 && (
                    <h3
                      style={{ gridColumn: 2, gridRow: 1, textAlign: "center" }}
                    >
                      {wins[2] ? wins[2] : "Waiting Player 3"}
                    </h3>
                  )}
                  <h3
                    style={{ gridColumn: 1, gridRow: 2, textAlign: "center" }}
                  >
                    {wins[0] ? wins[0] : "Waiting Player 1"}
                  </h3>
                  {players >= 2 && (
                    <h3
                      style={{ gridColumn: 3, gridRow: 2, textAlign: "center" }}
                    >
                      {wins[1] ? wins[1] : "Waiting Player 2"}
                    </h3>
                  )}
                  {players === 4 && (
                    <h3
                      style={{ gridColumn: 2, gridRow: 3, textAlign: "center" }}
                    >
                      {wins[3] ? wins[3] : "Waiting Player 4"}
                    </h3>
                  )}
                </>
              ) : (
                <>
                  {players >= 3 && (
                    <div
                      style={{
                        gridColumn: 2,
                        gridRow: 1,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {cards[2] ? (
                        <Card card={cards[2]} />
                      ) : (
                        <h3 style={{ textAlign: "center" }}>
                          Waiting Player 3
                        </h3>
                      )}
                    </div>
                  )}
                  <div
                    style={{
                      gridColumn: 1,
                      gridRow: 2,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {cards[0] ? (
                      <Card card={cards[0]} />
                    ) : (
                      <h3 style={{ textAlign: "center" }}>Waiting Player 1</h3>
                    )}
                  </div>
                  {players >= 2 && (
                    <div
                      style={{
                        gridColumn: 3,
                        gridRow: 2,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {cards[1] ? (
                        <Card card={cards[1]} />
                      ) : (
                        <h3 style={{ textAlign: "center" }}>
                          Waiting Player 2
                        </h3>
                      )}
                    </div>
                  )}
                  {players === 4 && (
                    <div
                      style={{
                        gridColumn: 2,
                        gridRow: 3,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {cards[3] ? (
                        <Card card={cards[3]} />
                      ) : (
                        <h3 style={{ textAlign: "center" }}>
                          Waiting Player 4
                        </h3>
                      )}
                    </div>
                  )}
                </>
              )}
            </Grid>
            <Grid
              item
              sm={4}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              {players >= 2 && (
                <Player
                  position={2}
                  name={player2_name}
                  scores={scores[1]}
                  wins={wins[1]}
                />
              )}
            </Grid>
          </Grid>
          {players === 4 && (
            <Grid item sm={4}>
              <Player
                position={4}
                name={player4_name}
                scores={scores[3]}
                wins={wins[3]}
              />
            </Grid>
          )}
        </Grid>
      </Paper>
    </>
  );
}

interface PlayerProps {
  name?: string;
  position?: number;
  scores?: string;
  wins?: string;
}

function Player(props: PlayerProps) {
  return (
    <Paper
      elevation={10}
      style={{
        height: "150px",
        width: "320px",
        padding: 10,
        display: "grid",
        gridTemplateColumns: `1fr 1fr`,
        gridTemplateRows: `1fr 1fr`,
      }}
    >
      <SubTitle text={"Player: " + props.position?.toString()} />
      <SubTitle text={"Name: " + props.name} />
      <SubTitle text={"Going to Win:" + props.wins} />
      <SubTitle text={"Score: " + props.scores} />
    </Paper>
  );
}
