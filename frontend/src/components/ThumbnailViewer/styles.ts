import styled from "styled-components";

export const BotaoExportar = styled.button`
  width: 90%;
  padding: 10px;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  background-color: #fe5000;
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s ease, transform 0.15s ease;

  &:hover {
    background-color: #e24600;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;
