interface Props {
  text: string;
}

export function Title(props: Props) {
  return <h2>{props.text}</h2>;
}

export function SubTitle(props: Props) {
  return <h4>{props.text}</h4>;
}

export function Text(props: Props) {
  return <h4 style={{ fontWeight: "lighter" }}>{props.text}</h4>;
}
