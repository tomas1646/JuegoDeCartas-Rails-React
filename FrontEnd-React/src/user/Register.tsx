import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonPanel from "../components/ButtonPanel";
import { showErrorMessage, showSuccessMessage } from "../components/SnackBar";
import FormTextField from "../components/TextField";
import { Title } from "../components/Title";
import { register } from "./userService";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userName || !password || !name) {
      return showErrorMessage("Inputs cant be empty");
    }

    register(userName, password, name)
      .then((response) => {
        showSuccessMessage(response.message);
        navigate("/login");
      })
      .catch((err) =>
        showErrorMessage(err.response.data.message || "Unexcpected Error")
      );
  };

  const resetFields = () => {
    setName("");
    setPassword("");
    setUserName("");
  };

  return (
    <>
      <Title text="Create User" />
      <form onSubmit={(e) => handleRegister(e)}>
        <FormTextField
          label="Full Name"
          name="name"
          title="Enter Full Name"
          value={name}
          setValue={setName}
        />
        <FormTextField
          label="User"
          name="user"
          title="Enter Username"
          value={userName}
          setValue={setUserName}
        />
        <FormTextField
          label="Password"
          name="password"
          title="Enter Password"
          value={password}
          setValue={setPassword}
          password
        />
        <ButtonPanel
          button={[
            { onClick: resetFields, text: "Clear Fields" },
            { submit: true, text: "Register" },
          ]}
        />
        <input type="submit" hidden />
      </form>
    </>
  );
}
