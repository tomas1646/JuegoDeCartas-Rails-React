import { Button } from "@mui/material";
import React from "react";

interface ButtonProps {
  onClick?: (e?: any) => void;
  submit?: boolean;
  text: string;
}

interface Props {
  button: ButtonProps[];
}

export default function ButtonPanel(props: Props) {
  return (
    <div
      style={{
        display: "flex",
        marginTop: "10px",
        justifyContent: "flex-end",
        gap: "7px",
      }}
    >
      {props.button.map((button, index) => (
        <Button
          key={button.text + index}
          type={button.submit ? "submit" : "button"}
          variant="outlined"
          onClick={button.onClick}
        >
          {button.text}
        </Button>
      ))}
    </div>
  );
}
