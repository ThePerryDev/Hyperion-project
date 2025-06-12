import { ReactNode } from "react";
import styled from "styled-components";

const ScrollContainerSld = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 22px;
  overflow-y: auto;
  padding-bottom: 1rem;
  padding-right: 1rem;
  width: 100%;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c0c0c0;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

type ScrollContainerProps = {
  children: ReactNode;
};

export default function ScrollContainer({ children }: ScrollContainerProps) {
  return <ScrollContainerSld>{children}</ScrollContainerSld>;
}
