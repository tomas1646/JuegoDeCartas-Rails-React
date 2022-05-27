import { Subject } from "rxjs";
import { User } from "../user/userService";
import { useState, useLayoutEffect } from "react";
import axios from "axios";

let currentUser: User | undefined;

const userSubject = new Subject<User | undefined>();

export function useSessionUser() {
  const [user, setUser] = useState(currentUser);

  useLayoutEffect(() => {
    userSubject.subscribe((newState) => {
      setUser(newState);
    });
  }, []);

  return user;
}

export function updateSessionUser(user: User) {
  currentUser = user;
  axios.defaults.headers.common.Authorization = user.token
  userSubject.next(currentUser);
}

export function cleanupSessionUser() {
  currentUser = undefined;
  axios.defaults.headers.common.Authorization = ""
  userSubject.next(currentUser);
}
