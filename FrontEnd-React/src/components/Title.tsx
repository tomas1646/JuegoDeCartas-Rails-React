import { CSSProperties } from "react";

interface Props {
  text: string;
  customStyle?: CSSProperties;
}

export function Title(props: Props) {
  return <h2 style={props.customStyle}>{props.text}</h2>;
}

export function SubTitle(props: Props) {
  return <h4 style={props.customStyle}>{props.text}</h4>;
}

export function Text(props: Props) {
  return <h4 style={{ fontWeight: "lighter" }}>{props.text}</h4>;
}
