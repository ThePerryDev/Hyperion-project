import styled from "styled-components";
import { returnIcon } from "../../../assets";

const StyledCloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  align-self: flex-start;
  margin-bottom: 10px;

  img {
    height: 24px;
    width: 24px;
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

interface CloseButtonProps {
  altText?: string;
  iconSrc?: string;
  onClick: () => void;
}

export default function CloseButton({
  onClick,
  iconSrc = returnIcon,
  altText = "Fechar",
}: CloseButtonProps) {
  return (
    <StyledCloseButton onClick={onClick}>
      <img alt={altText} src={iconSrc} />
    </StyledCloseButton>
  );
}
