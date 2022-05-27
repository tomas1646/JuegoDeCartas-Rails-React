import { TextField } from "@mui/material";
import { SubTitle } from "./Title";

interface Props {
  label: string;
  name: string;
  title?: string;
  value: string;
  setValue: (e: any) => void;
  password?: boolean;
}

function FormTextField(props: Props) {
  return (
    <>
      {props.title && <SubTitle text={props.title} />}

      <TextField
        name={props.name}
        label={props.label}
        autoComplete="off"
        value={props.value}
        fullWidth
        onChange={(e) => props.setValue(e.target.value)}
        type={props.password ? "password" : "text"}
      />
    </>
  );
}

export default FormTextField;
