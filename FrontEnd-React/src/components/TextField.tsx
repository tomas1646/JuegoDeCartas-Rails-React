import { TextField } from "@mui/material";
import { CSSProperties } from "react";
import { SubTitle } from "./Title";

interface Props {
  label: string;
  name: string;
  title?: string;
  value: string;
  setValue: (e: any) => void;
  password?: boolean;
  customStyle?: CSSProperties;
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
        style={props.customStyle}
        type={props.password ? "password" : "text"}
      />
    </>
  );
}

export default FormTextField;

interface NumberFieldProps {
  label: string;
  name: string;
  title?: string;
  value: number;
  setValue: (e: any) => void;
  customStyle?: CSSProperties;
}

export function FormNumberField(props: NumberFieldProps) {
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
        style={props.customStyle}
        type={"number"}
      />
    </>
  );
}
