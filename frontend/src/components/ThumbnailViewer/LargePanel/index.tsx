import { ReactNode } from "react";
import { PainelEstilizado } from "./styles";

interface LargePanelProps {
  children: ReactNode;
}

export default function LargePanel({ children }: LargePanelProps) {
  return <PainelEstilizado>{children}</PainelEstilizado>;
}
