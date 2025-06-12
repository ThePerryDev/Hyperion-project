import { ButtonHTMLAttributes } from "react";
import { StyledButton } from "./styles";

type ButtonCustomProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function ButtonCustom(props: ButtonCustomProps) {
  return <StyledButton {...props} />;
}
