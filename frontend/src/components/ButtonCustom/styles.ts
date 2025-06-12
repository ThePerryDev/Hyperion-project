import styled from "styled-components";

export const StyledButton = styled.button`
  background-color: #fe5000;
  border: none;
  border-radius: 25px;
  color: #ffffff;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  height: 40px;
  letter-spacing: 1px;
  padding: 8px;
  transition: background-color 0.2s ease, transform 0.15s ease;
  width: 100%;

  &:active {
    transform: scale(0.98);
  }

  &:hover {
    background-color: #e24600;
    transform: scale(1.02);
  }
`;