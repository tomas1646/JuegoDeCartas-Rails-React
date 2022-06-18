import axios from "axios";
import backEndUrl from "../environment";
import { ApiResponse } from "../utils/utils";

const boardUrl = backEndUrl + "/boards";

export interface Board {
  token: string;
  player_1_name: string;
  player_2_name: string;
  player_3_name: string;
  player_4_name: string;
  board_status: string;
  round_status: string;
  cards: string[];
  scores: string[];
  wins: string[];
  players: number;
  currRound: number;
}

export async function createGame(players: number): Promise<ApiResponse<Board>> {
  const response: ApiResponse<Board> = (await axios.post(boardUrl, { players }))
    .data;

  return response;
}

export async function getBoards(): Promise<ApiResponse<Board[]>> {
  const response: ApiResponse<Board[]> = (await axios.get(boardUrl)).data;

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
  card_number: number
): Promise<ApiResponse<string[]>> {
  const response: ApiResponse<string[]> = (
    await axios.get(boardUrl + `/cards?card_number=${card_number}`)
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
  boardToken: string
): Promise<ApiResponse<Board>> {
  const response: ApiResponse<Board> = (
    await axios.post(`${boardUrl}/${boardToken}/end_card_round`)
  ).data;

  return response;
}
