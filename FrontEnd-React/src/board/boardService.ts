import axios from "axios";
import backEndUrl from "../environment";
import { ApiResponse } from "../utils/utils";

const boardUrl = backEndUrl + "/boards";

export interface Board {
  token: string;
  player1_name: string;
  player2_name?: string;
  player3_name?: string;
  player4_name?: string;
  status: string;
  cards: string[];
  scores: string[];
  wins: string[];
  players: number;
  round_card_number: number;
  curr_round_left: number;
  winner?: string;
}

export async function createGame(): Promise<ApiResponse<Board>> {
  const response: ApiResponse<Board> = (await axios.post(boardUrl)).data;

  return response;
}

export async function getBoards(
  searchUser?: boolean,
  status?: number[]
): Promise<ApiResponse<Board[]>> {
  let queryParams = "?";

  if (searchUser) {
    queryParams += "player=true&";
  }
  status && status.forEach((state) => (queryParams += `status[]=${state}&`));

  const response: ApiResponse<Board[]> = (
    await axios.get(boardUrl + queryParams)
  ).data;

  return response;
}

export async function getBoard(
  boardToken: string
): Promise<ApiResponse<Board>> {
  const response: ApiResponse<Board> = (
    await axios.get(boardUrl + "/" + boardToken)
  ).data;

  return response;
}

export async function joinGame(
  boardToken: string
): Promise<ApiResponse<Board>> {
  const response: ApiResponse<Board> = (
    await axios.post(boardUrl + `/${boardToken}/join`, {})
  ).data;

  return response;
}

export async function startGame(
  boardToken: string
): Promise<ApiResponse<Board>> {
  const response: ApiResponse<Board> = (
    await axios.post(boardUrl + `/${boardToken}/start_game`, {})
  ).data;

  return response;
}

export async function setWins(
  boardToken: string,
  wins: number
): Promise<ApiResponse<Board>> {
  const response: ApiResponse<Board> = (
    await axios.post(boardUrl + `/${boardToken}/set_wins`, { wins })
  ).data;

  return response;
}

export async function startCardThrow(
  boardToken: string
): Promise<ApiResponse<Board>> {
  const response: ApiResponse<Board> = (
    await axios.post(boardUrl + `/${boardToken}/start_card_round`, {})
  ).data;

  return response;
}

export async function getCards(
  boardToken: string
): Promise<ApiResponse<string[]>> {
  const response: ApiResponse<string[]> = (
    await axios.get(boardUrl + `/${boardToken}/cards`)
  ).data;

  return response;
}

export async function updateScores(
  boardToken: string,
  scores: string[]
): Promise<ApiResponse<Board>> {
  const response: ApiResponse<Board> = (
    await axios.post(`${boardUrl}/${boardToken}/update_score`, { scores })
  ).data;

  return response;
}

export async function throwCard(
  boardToken: string,
  card: string
): Promise<ApiResponse<Board>> {
  const response: ApiResponse<Board> = (
    await axios.post(`${boardUrl}/${boardToken}/throw_card`, { card })
  ).data;

  return response;
}

export async function endCardRound(
  boardToken: string,
  round_card_number?: number
): Promise<ApiResponse<Board>> {
  const response: ApiResponse<Board> = (
    await axios.post(`${boardUrl}/${boardToken}/end_card_round`, {
      round_card_number,
    })
  ).data;

  return response;
}

export async function finishGame(
  boardToken: string,
  winner: string
): Promise<ApiResponse<Board>> {
  const response: ApiResponse<Board> = (
    await axios.post(`${boardUrl}/${boardToken}/end_game`, {
      winner,
    })
  ).data;

  return response;
}
