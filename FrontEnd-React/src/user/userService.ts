import axios from "axios";
import backEndUrl from "../environment";
import { updateSessionUser } from "../store/userStore";
import { ApiResponse } from "../utils/utils";

const userUrl = backEndUrl + "/users";

export interface User {
  token: string;
  name: string;
  user_name: string;
  avatar_url: string;
}

export async function login(
  user_name: string,
  password: string
): Promise<ApiResponse<User>> {
  const response: ApiResponse<User> = (
    await axios.post(userUrl + "/login", { user_name, password })
  ).data;

  updateSessionUser(response.content);
  return response;
}

export async function register(
  user_name: string,
  password: string,
  name: string
): Promise<ApiResponse<User>> {
  const response: ApiResponse<User> = (
    await axios.post(userUrl + "/register", { name, user_name, password })
  ).data;

  return response;
}

export async function update(
  name: string,
  user_name: string,
  password: string
): Promise<ApiResponse<User>> {
  const response: ApiResponse<User> = (
    await axios.put(
      userUrl + "/update",
      password ? { user_name, password, name } : { user_name, name }
    )
  ).data;
  updateSessionUser(response.content);

  return response;
}

export async function updatePicture(avatar: File): Promise<ApiResponse<User>> {
  let body = new FormData();
  body.append("avatar", avatar, avatar.name);

  const response: ApiResponse<User> = (
    await axios.put(userUrl + "/update_picture", body, {
      headers: {
        "Content-Type": `multipart/form-data;`,
      },
    })
  ).data;
  updateSessionUser(response.content);

  return response;
}
