import { Avatar, Button, Grid, Paper } from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";
import ButtonPanel from "../components/ButtonPanel";
import { showErrorMessage, showSuccessMessage } from "../components/SnackBar";
import FormTextField from "../components/TextField";
import { Title } from "../components/Title";
import backEndUrl from "../environment";
import { useSessionUser } from "../store/userStore";
import { update, updatePicture } from "./userService";

export default function Profile() {
  const [name, setName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const user = useSessionUser();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setUserName(user.user_name);
      setAvatarUrl(user.avatar_url);
    }
  }, [user]);

  const handleUpdate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userName || !name) {
      return showErrorMessage("Inputs cant be empty");
    }

    if (password !== repeatPassword) {
      return showErrorMessage("Passwords doesn't match");
    }

    update(name, userName, password)
      .then((response) => {
        showSuccessMessage(response.message);
        setPassword("");
        setRepeatPassword("");
      })
      .catch((err) =>
        showErrorMessage(err.response.data.message || "Unexcpected Error")
      );
  };

  const handlePictureUpdate = (file: File) => {
    updatePicture(file)
      .then((response) => {
        showSuccessMessage("Picture Updated");
        setAvatarUrl(response.content.avatar_url);
      })
      .catch((err) =>
        showErrorMessage(err.response.data.message || "Unexcpected Error")
      );
  };

  return (
    <>
      <Grid container component={Paper} elevation={10} p={2}>
        <Grid
          md={6}
          sm={12}
          item
          style={{
            display: "flex",
            gap: "10px",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Title text="Avatar" />
          <Avatar
            src={avatarUrl ? backEndUrl + "/" + avatarUrl : ""}
            sx={{ width: 100, height: 100 }}
          ></Avatar>
          <Button variant="outlined" component="label">
            Upload New Picture
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) =>
                e.target.files && handlePictureUpdate(e.target.files[0])
              }
            />
          </Button>
        </Grid>
        <Grid md={6} sm={12} item>
          <form onSubmit={(e) => handleUpdate(e)}>
            <FormTextField
              label="Full Name"
              name="name"
              title="Full Name"
              value={name}
              setValue={setName}
            />
            <FormTextField
              label="User"
              name="user"
              title="User Name"
              value={userName}
              setValue={setUserName}
            />
            <FormTextField
              label="Password"
              name="password"
              title="New Password"
              value={password}
              setValue={setPassword}
              password
            />
            <FormTextField
              label="Password"
              name="password"
              title="Repeat Password"
              value={repeatPassword}
              setValue={setRepeatPassword}
              password
            />
            <ButtonPanel button={[{ submit: true, text: "Update Fields" }]} />
            <input type="submit" hidden />
          </form>
        </Grid>
      </Grid>
    </>
  );
}
