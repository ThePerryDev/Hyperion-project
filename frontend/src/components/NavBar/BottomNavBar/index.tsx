import { ReactNode } from "react";
import { BottomNavBarSld } from "./styles";

type BottomNavBarProps = {
  children: ReactNode;
};

export default function BottomNavbar({ children }: BottomNavBarProps) {
  return <BottomNavBarSld>{children}</BottomNavBarSld>;
}
