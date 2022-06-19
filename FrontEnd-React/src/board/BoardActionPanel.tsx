import { Button, Divider, Paper } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { showSuccessMessage, showErrorMessage } from "../components/SnackBar";
import FormTextField, { FormNumberField } from "../components/TextField";
import { useSessionUser } from "../store/userStore";
import {
  Board,
  endCardRound,
  getCards,
  setWins,
  startCardThrow,
  startGame,
  throwCard,
  updateScores,
} from "./boardService";
import { BoardStatus, RoundStatus } from "./BoardTypes";

interface BoardActionPanelProps {
  board: Board;
}

export default function BoardActionPanel(props: BoardActionPanelProps) {
  const user = useSessionUser();
  const [win, setWin] = useState<number>(0);
  const [cards, setCards] = useState<string[]>([]);
  const [cardNumber, setCardNumber] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [roundCardNumber, setRoundCardNumber] = useState<number>(0);
  const [scoreP1, setScoreP1] = useState<string>("");
  const [scoreP2, setScoreP2] = useState<string>("");
  const [scoreP3, setScoreP3] = useState<string>("");
  const [scoreP4, setScoreP4] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showWinDialog, setShowWinDialog] = useState<boolean>(false);
  const [showCardDialog, setShowCardDialog] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const {
    scores,
    players,
    token,
    player1_name,
    round_status,
    board_status,
    round_card_number,
    curr_round_left,
  } = props.board;
  const prevRoundStatus = useRef<string>("");
  const prevRoundCardNumber = useRef<number>(0);

  useEffect(() => {
    prevRoundStatus.current = board_status;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsAdmin(player1_name === user?.name);
    setShowWinDialog(round_status === RoundStatus.waiting_wins_asked.name);
    setShowCardDialog(round_status === RoundStatus.waiting_card_throw.name);
    setGameStarted(board_status === BoardStatus.in_course.name);

    if (prevRoundCardNumber.current !== round_card_number) {
      prevRoundCardNumber.current = round_card_number;
    }

    if (prevRoundStatus.current !== round_status) {
      prevRoundStatus.current === RoundStatus.waiting_card_throw.name &&
        setCards([]);

      prevRoundStatus.current = round_status;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.board]);

  useEffect(() => {
    setScoreP1(scores[0]);
    setScoreP2(scores[1]);
    setScoreP3(scores[2]);
    setScoreP4(scores[3]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setRoundCardNumber(prevRoundCardNumber.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevRoundCardNumber.current]);

  const finishCardRoundAction = (n: number) => {
    if (token) {
      endCardRound(token, n).then((response) => {
        showSuccessMessage(response.message);
      });
    }
  };

  const startGameAction = () => {
    if (token) {
      startGame(token).then((response) => {
        showSuccessMessage(response.message);
      });
    }
  };

  const winNumberAction = (wins: number) => {
    if (token) {
      setWins(token, wins).then((response) => {
        showSuccessMessage(response.message);
      });
    }
  };

  const startCardThrowAction = () => {
    if (token) {
      startCardThrow(token).then((response) => {
        showSuccessMessage(response.message);
      });
    }
  };

  const getCardAction = () => {
    getCards(token).then((response) => {
      showSuccessMessage(response.message);
      setCards(response.content);
    });
  };

  const updateScoresAction = (scores: string[]) => {
    if (token) {
      updateScores(token, scores).then((response) => {
        showSuccessMessage(response.message);
      });
    }
  };

  const throwCardAction = () => {
    let card = cards[cardNumber - 1];

    if (!card) {
      showErrorMessage("Carta no existe");
      return;
    }

    if (token) {
      throwCard(token, card).then((response) => {
        setCards((currCards) => currCards.filter((cardD) => cardD !== card));
        showSuccessMessage(response.message);
      });
    }
  };

  return (
    <Paper
      elevation={2}
      style={{ padding: 6, display: "flex", flexDirection: "column" }}
    >
      {gameStarted && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "30px",
          }}
        >
          {cards.length === 0 && (
            <>
              <Button variant="outlined" onClick={() => getCardAction()}>
                Pedir Cartas
              </Button>
              <Divider orientation="vertical" flexItem />
            </>
          )}
          {cards.length !== 0 && (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <h3>Cards</h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "6px",
                  }}
                >
                  {cards &&
                    cards.map((card) => (
                      <div
                        style={{
                          backgroundColor: "lightgray",
                          width: "90px",
                          height: "60px",
                        }}
                      >
                        {card}
                      </div>
                    ))}
                </div>
              </div>
              <Divider orientation="vertical" flexItem />
            </>
          )}

          {showWinDialog && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "200px",
              }}
            >
              <FormNumberField
                title="How many rounds are you going to win?"
                label="Wins"
                name="wins"
                value={win}
                setValue={setWin}
              />
              <Button variant="outlined" onClick={() => winNumberAction(win)}>
                Confirm
              </Button>
            </div>
          )}
          {showCardDialog && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "200px",
              }}
            >
              <FormNumberField
                title="Throw Cards"
                label="Card Number"
                name="card_number"
                value={cardNumber}
                setValue={setCardNumber}
              />
              <Button variant="outlined" onClick={() => throwCardAction()}>
                Throw Card
              </Button>
            </div>
          )}
        </div>
      )}
      {isAdmin && (
        <>
          <h3>Admin Actions:</h3>
          <div style={{ display: "flex", flexDirection: "row", gap: "9px" }}>
            {showCardDialog && (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "200px",
                  }}
                >
                  <h3>Finish Card Throw Round</h3>
                  {curr_round_left === 1 && (
                    <FormNumberField
                      title="Next Round Card number?"
                      label="cardNumber"
                      name="card number"
                      value={roundCardNumber}
                      setValue={setRoundCardNumber}
                    />
                  )}

                  <Button
                    variant="outlined"
                    onClick={() => finishCardRoundAction(roundCardNumber)}
                  >
                    Confirm
                  </Button>
                </div>
                <Divider orientation="vertical" flexItem />
              </>
            )}
            {!gameStarted && (
              <>
                <Button variant="outlined" onClick={() => startGameAction()}>
                  Empezar juego
                </Button>
                <Divider orientation="vertical" flexItem />
              </>
            )}
            {showWinDialog && (
              <>
                <Button
                  variant="outlined"
                  onClick={() => startCardThrowAction()}
                >
                  Empezar a tirar cartas
                </Button>
                <Divider orientation="vertical" flexItem />
              </>
            )}
            <div
              style={{
                maxWidth: "300px",
                display: "flex",
                flexDirection: "column",
                gap: "9px",
              }}
            >
              <h3>Update Scores</h3>
              <FormTextField
                label="Player 1 Score"
                name="scoreP1"
                value={scoreP1}
                setValue={setScoreP1}
              />
              {players >= 2 && (
                <FormTextField
                  label="Player 2 Score"
                  name="scoreP2"
                  value={scoreP2}
                  setValue={setScoreP2}
                />
              )}
              {players >= 3 && (
                <FormTextField
                  label="Player 3 Score"
                  name="scoreP3"
                  value={scoreP3}
                  setValue={setScoreP3}
                />
              )}
              {players === 4 && (
                <FormTextField
                  label="Player 4 Score"
                  name="scoreP4"
                  value={scoreP4}
                  setValue={setScoreP4}
                />
              )}
              <Button
                variant="outlined"
                onClick={() =>
                  updateScoresAction([scoreP1, scoreP2, scoreP3, scoreP4])
                }
              >
                Update Scores
              </Button>
            </div>
          </div>
        </>
      )}
    </Paper>
  );
}
