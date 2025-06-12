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