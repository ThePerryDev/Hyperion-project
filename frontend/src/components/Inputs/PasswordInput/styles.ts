import styled from "styled-components";

export const EyeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);

  img {
    height: 20px;
    width: 20px;
  }
`;

export const InputUser = styled.input`
  background-color: #d9d9d9;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  height: 40px;
  padding: 8px 40px 8px 12px;
  width: 100%;
`;