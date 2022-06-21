import { Divider, Paper } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { DefaultButton } from "../components/ButtonPanel";
import { showSuccessMessage, showErrorMessage } from "../components/SnackBar";
import FormTextField, { FormNumberField } from "../components/TextField";
import { useSessionUser } from "../store/userStore";
import {
  Board,
  endCardRound,
  finishGame,
  getCards,
  setWins,
  startCardThrow,
  startGame,
  throwCard,
  updateScores,
} from "./boardService";
import { BoardStatus } from "./BoardTypes";
import { Card } from "./ShowBoard";

interface BoardActionPanelProps {
  board: Board;
}

export default function BoardActionPanel(props: BoardActionPanelProps) {
  const user = useSessionUser();
  const [win, setWin] = useState<number>(0);
  const [cards, setCards] = useState<string[]>([]);
  const [cardNumber, setCardNumber] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [winnerNumber, setWinnerNumber] = useState<1 | 2 | 3 | 4>(1);
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
    setShowWinDialog(board_status === BoardStatus.waiting_wins_asked.name);
    setShowCardDialog(board_status === BoardStatus.waiting_card_throw.name);
    setGameStarted(
      board_status === BoardStatus.waiting_card_throw.name ||
        board_status === BoardStatus.waiting_wins_asked.name
    );

    if (prevRoundCardNumber.current !== round_card_number) {
      prevRoundCardNumber.current = round_card_number;
    }

    if (prevRoundStatus.current !== board_status) {
      prevRoundStatus.current === BoardStatus.waiting_card_throw.name &&
        setCards([]);

      prevRoundStatus.current = board_status;
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
    endCardRound(token, n)
      .then((response) => {
        showSuccessMessage(response.message);
      })
      .catch((err) =>
        showErrorMessage(err.response.data.message || "Unexcpected Error")
      );
  };

  const startGameAction = () => {
    startGame(token)
      .then((response) => {
        showSuccessMessage(response.message);
      })
      .catch((err) =>
        showErrorMessage(err.response.data.message || "Unexcpected Error")
      );
  };

  const winNumberAction = (wins: number) => {
    setWins(token, wins)
      .then((response) => {
        showSuccessMessage(response.message);
      })
      .catch((err) =>
        showErrorMessage(err.response.data.message || "Unexcpected Error")
      );
  };

  const startCardThrowAction = () => {
    startCardThrow(token)
      .then((response) => {
        showSuccessMessage(response.message);
      })
      .catch((err) =>
        showErrorMessage(err.response.data.message || "Unexcpected Error")
      );
  };

  const getCardAction = () => {
    getCards(token)
      .then((response) => {
        showSuccessMessage(response.message);
        setCards(response.content);
      })
      .catch((err) =>
        showErrorMessage(err.response.data.message || "Unexcpected Error")
      );
  };

  const updateScoresAction = (scores: string[]) => {
    updateScores(token, scores)
      .then((response) => {
        showSuccessMessage(response.message);
      })
      .catch((err) =>
        showErrorMessage(err.response.data.message || "Unexcpected Error")
      );
  };

  const finishGameAction = () => {
    finishGame(token, winnerNumber)
      .then((response) => {
        showSuccessMessage(response.message);
      })
      .catch((err) =>
        showErrorMessage(err.response.data.message || "Unexcpected Error")
      );
  };

  const throwCardAction = () => {
    let card = cards[cardNumber - 1];

    if (!card) {
      showErrorMessage("Card doesnt exists");
      return;
    }

    throwCard(token, card)
      .then((response) => {
        setCards((currCards) => currCards.filter((cardD) => cardD !== card));
        showSuccessMessage(response.message);
      })
      .catch((err) =>
        showErrorMessage(err.response.data.message || "Unexcpected Error")
      );
  };

  return (
    <Paper
      elevation={2}
      style={{
        padding: 6,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {gameStarted && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "30px",
            alignItems: "center",
          }}
        >
          {cards.length === 0 && (
            <>
              <DefaultButton text="Get Cards" onClick={() => getCardAction()} />
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
                  alignItems: "center",
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
                    cards.map((card, index) => (
                      <Card key={index} card={card} />
                    ))}
                </div>
              </div>
              <Divider orientation="vertical" flexItem />
              {showCardDialog && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "200px",
                    gap: "7px",
                    alignItems: "center",
                  }}
                >
                  <FormNumberField
                    title="Throw Cards"
                    label="Card Number"
                    name="card_number"
                    value={cardNumber}
                    setValue={setCardNumber}
                  />
                  <DefaultButton
                    text="Throw Card"
                    onClick={() => throwCardAction()}
                    style={{ width: "100%" }}
                  />
                </div>
              )}
            </>
          )}

          {showWinDialog && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "7px",
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
              <DefaultButton
                text="Confirm"
                onClick={() => winNumberAction(win)}
              />
            </div>
          )}
        </div>
      )}
      {isAdmin && (
        <>
          <Divider />
          <h3>Admin Actions:</h3>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "9px",
              alignItems: "center",
            }}
          >
            {showCardDialog && (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "200px",
                    gap: "3px",
                    alignItems: "center",
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
                  <DefaultButton
                    text="Confirm"
                    onClick={() => finishCardRoundAction(roundCardNumber)}
                  />
                </div>
                <Divider orientation="vertical" flexItem />
              </>
            )}
            {!gameStarted && (
              <>
                <DefaultButton
                  text="Start Game"
                  onClick={() => startGameAction()}
                />
                <Divider orientation="vertical" flexItem />
              </>
            )}
            {showWinDialog && (
              <>
                <DefaultButton
                  text="Start Throwing Cards"
                  onClick={() => startCardThrowAction()}
                />
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
              <DefaultButton
                text="Update Scores"
                onClick={() =>
                  updateScoresAction([scoreP1, scoreP2, scoreP3, scoreP4])
                }
              />
            </div>
            <Divider orientation="vertical" flexItem />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "200px",
                gap: "3px",
              }}
            >
              <h3>Finish Game</h3>

              <FormNumberField
                title="Who won?"
                label="winnerNumber"
                name="winner Number"
                value={winnerNumber}
                setValue={setWinnerNumber}
              />

              <DefaultButton
                text="Confirm"
                onClick={() => finishGameAction()}
              />
            </div>
          </div>
        </>
      )}
    </Paper>
  );
}
