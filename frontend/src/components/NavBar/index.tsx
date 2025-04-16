import styled from "styled-components";
import { exportIcon, mapIcon, settings } from "../../assets";
import { useState } from "react";

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
  position: absolute;
  bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FilterPanel = styled.div`
  position: absolute;
  top: 0;
  left: -16vw;
  width: 280px;
  height: 100%;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 12px 0px 0px 12px;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
  z-index: 1500;
`;

export default function NavigationBar() {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <NavBar>
      {showFilter && (
        <FilterPanel>
          <h3>Filtros</h3>
          <div>
            <label>Data Início</label>
            <input type="date" />
          </div>
          <div>
            <label>Data Fim</label>
            <input type="date" />
          </div>
          <button>Aplicar Filtros</button>
        </FilterPanel>
      )}

      <Top>
        <NavButton
          title="Filter"
          onClick={() => setShowFilter((prev) => !prev)}
        >
          <img src={mapIcon} alt="Filter" />
        </NavButton>
        <NavButton title="Export">
          <img src={exportIcon} alt="Export" />
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
