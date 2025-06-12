import { InputHTMLAttributes } from "react";
import { InputCustomSld } from "./styles";

type InputCustomProps = InputHTMLAttributes<HTMLInputElement>;

export default function InputCustom(props: InputCustomProps) {
  return <InputCustomSld {...props} />;
}
