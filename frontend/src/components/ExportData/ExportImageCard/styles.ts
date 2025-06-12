import styled from "styled-components";

export const CartaoImagemEstilizado = styled.div`
  width: 100%;
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 1.5rem 1rem;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TextoInfo = styled.p`
  margin: 4px 0;
  font-size: 13px;
  color: #333;
  text-align: center;
  font-weight: bold;

  a {
    color: #1a73e8;
    text-decoration: underline;
    font-size: 12px;
  }
`;

export const BotaoExportar = styled.button`
  width: 100%;
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

export const PreviewImagem = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 8px;
  margin: 0.5rem 0;
`;
