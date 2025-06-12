import { ReactNode } from "react";
import { InputWrapperSld } from "./styles";

type InputWrapperProps = {
  children: ReactNode;
};

export default function InputWrapper({ children }: InputWrapperProps) {
  return <InputWrapperSld>{children}</InputWrapperSld>;
}
