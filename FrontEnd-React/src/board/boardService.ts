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
  status: string;
  cards: string[];
  scores: string[];
  players: number;
}

export async function createGame(players: number): Promise<ApiResponse<Board>> {
  const response: ApiResponse<Board> = (await axios.post(boardUrl, { players }))
    .data;

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

export async function getBoards(): Promise<ApiResponse<Board[]>> {
  const response: ApiResponse<Board[]> = (await axios.get(boardUrl)).data;

  return response;
}

export async function getOpenBoards(): Promise<ApiResponse<Board[]>> {
  const response: ApiResponse<Board[]> = (
    await axios.get(boardUrl + "/find_open_boards")
  ).data;

  return response;
}

export async function getUserBoards(): Promise<ApiResponse<Board[]>> {
  const response: ApiResponse<Board[]> = (
    await axios.get(boardUrl + "/find_user_boards")
  ).data;

  return response;
}

export async function getUserOpenBoards(): Promise<ApiResponse<Board[]>> {
  const response: ApiResponse<Board[]> = (
    await axios.get(boardUrl + "/find_user_open_boards")
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

export async function moveBoard(
  boardToken: string,
  position: number
): Promise<ApiResponse<Board>> {
  const response: ApiResponse<Board> = (
    await axios.post(boardUrl + `/${boardToken}/move`, { position })
  ).data;

  return response;
}
