import { ReactNode } from "react";
import styled from "styled-components";

const OptionLabel = styled.label`
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
`;

const OptionWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 11px;
  justify-content: center;
  width: 100%;
`;

interface OptionDivProps {
  children: ReactNode;
  label?: string;
}

export default function OptionDiv({ label, children }: OptionDivProps) {
  return (
    <OptionWrapper>
      {label && <OptionLabel>{label}</OptionLabel>}
      {children}
    </OptionWrapper>
  );
}
