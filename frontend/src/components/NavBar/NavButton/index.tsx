import styled from "styled-components";

const NavButtonWrapper = styled.button`
  align-items: center;
  background-color: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  height: 40px;
  justify-content: center;
  padding: 0.6rem;
  width: 40px;

  img {
    height: 100%;
    object-fit: contain;
    width: 100%;
  }
`;

interface NavButtonProps {
  activeIcon: string;
  icon: string;
  isActive: boolean;
  onCloseOthers?: () => void;
  onToggle: () => void;
  title: string;
}

export default function NavButton({
  title,
  isActive,
  icon,
  activeIcon,
  onToggle,
  onCloseOthers,
}: NavButtonProps) {
  const handleClick = () => {
    if (!isActive && onCloseOthers) {
      onCloseOthers();
    }
    onToggle();
  };

  return (
    <NavButtonWrapper title={title} onClick={handleClick}>
      <img alt={title} src={isActive ? activeIcon : icon} />
    </NavButtonWrapper>
  );
}
