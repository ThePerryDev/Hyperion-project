import { ReactNode } from "react";
import styled from "styled-components";

const TopNavBarSld = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.75rem;
`;

type TopNavBarProps = {
  children: ReactNode;
};

export default function TopNavbar({ children }: TopNavBarProps) {
  return <TopNavBarSld>{children}</TopNavBarSld>;
}
