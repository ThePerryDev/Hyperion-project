import styled from "styled-components";
import { exportIcon, mapIcon, naoSeiIcon, settings } from "../../assets";

const NavBar = styled.div`
  position: absolute;
  right: 0rem;
  display: flex;
  flex-direction: column;
  background-color: #222223;
  z-index: 1000;
  height: 92vh;
  width: 4vw;
  min-width: 40px;
  align-items: center;
  position: relative;
`;

const Top = styled.div`
  margin-top: 0.75rem;
  gap: 0.75rem;
  display: flex;
  flex-direction: column;
`;

const NavButton = styled.button`
  background-color: transparent;
  border: none;
  padding: 0.6rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Bottom = styled.div`
  position: absolute; /* Coloca o Bottom na parte inferior da NavBar */
  bottom: 0.75rem; /* Distância do fundo */
  display: flex;
  flex-direction: column;
  align-items: center; /* Garante que os botões do Bottom fiquem centralizados */
`;

export default function NavigationBar() {
  return (
    <NavBar>
      <Top>
        <NavButton title="Location">
          <img src={mapIcon} alt="Location" />
        </NavButton>
        <NavButton title="Export">
          <img src={exportIcon} alt="Export" />
        </NavButton>
        <NavButton title="naoSei">
          <img src={naoSeiIcon} alt="naoSei" />
        </NavButton>
      </Top>
      <Bottom>
        <NavButton title="Settings">
          <img src={settings} alt="Settings" />
        </NavButton>
      </Bottom>
    </NavBar>
  );
}
