import styled from "styled-components";
import { ReactNode } from "react";

const StyledPanel = styled.div`
  position: absolute;
  top: 0;
  right: 100%;
  width: 280px;
  height: 100%;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 12px 0px 0px 12px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
  z-index: 1500;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;

  @media (max-width: 1024px) {
    width: 320px;
  }

  @media (max-width: 768px) {
    width: 80vw;
    border-radius: 0px;
    right: 0;
  }

  @media (max-width: 480px) {
    width: 100vw;
    height: 100vh;
    padding-top: 2rem;
    border-radius: 0px;
    right: 0;
  }
`;

type PanelProps = {
  children: ReactNode;
};

export default function Panel({ children }: PanelProps) {
  return <StyledPanel>{children}</StyledPanel>;
}
