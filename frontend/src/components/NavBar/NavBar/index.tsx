import { useState } from "react";
import { NavBar } from "./styles";
import {
  exportIcon,
  mapIcon,
  openExportIcon,
  openMapIcon,
  openOverlayIcon,
  openUserIcon,
  overlayIcon,
  users,
} from "../../../assets";
import {
  BottomNavbar,
  ExportPanel,
  FilterPanel,
  NavButton,
  OverlayManualPanel,
  TopNavbar,
  UsersPanel,
} from "../..";

export default function NavigationBar() {
  const [showExport, setShowExport] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showOverlayManual, setShowOverlayManual] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  //Mock de resultados, excluir quando estiver comunicando com o backend
  const imagensProcessadasMock = [
    {
      id: "CBERS_4A_WFI_20240830_202_140",
      bbox: [-45.123, -12.345, -44.678, -11.890],
      colecao: "CBERS_4A_WFI",
      data: "2024-08-30",
      bandas: {
        Verde: "http://localhost:8000/downloads/band_verde.tif",
        Azul: "http://localhost:8000/downloads/band_azul.tif",
        Vermelho: "http://localhost:8000/downloads/band_vermelho.tif",
        NIR: "http://localhost:8000/downloads/band_nir.tif",
      },
      ndviUrl: "http://localhost:8000/downloads/ndvi.png",
      processadaUrl: "http://localhost:8000/downloads/segmentada.png",
    },
    {
      id: "AMAZONIA_1_WFI_20240831_203_141",
      bbox: [-55.123, -5.123, -54.456, -4.789],
      colecao: "AMAZONIA_1_WFI",
      data: "2024-08-31",
      bandas: {
        Verde: "http://localhost:8000/downloads/verde_amz.tif",
        Azul: "http://localhost:8000/downloads/azul_amz.tif",
        Vermelho: "http://localhost:8000/downloads/vermelho_amz.tif",
        NIR: "http://localhost:8000/downloads/nir_amz.tif",
      },
      ndviUrl: "http://localhost:8000/downloads/ndvi_amz.png",
      processadaUrl: "http://localhost:8000/downloads/segmentada_amz.png",
    },
  ];
  
  return (
    <NavBar>
      {showExport && <ExportPanel imagens={imagensProcessadasMock} onClose={() => setShowExport(false)} />}
      {showFilter && <FilterPanel onClose={() => setShowFilter(false)} />}
      {showOverlayManual && (
        <OverlayManualPanel onClose={() => setShowOverlayManual(false)} />
      )}
      {showUsers && <UsersPanel onClose={() => setShowUsers(false)} />}

      <TopNavbar>
        <NavButton
          activeIcon={openMapIcon}
          icon={mapIcon}
          isActive={showFilter}
          onCloseOthers={() => {
            setShowExport(false);
            setShowUsers(false);
            setShowOverlayManual(false);
          }}
          onToggle={() => setShowFilter((prev) => !prev)}
          title="Filtro"
        />
        <NavButton
          activeIcon={openExportIcon}
          icon={exportIcon}
          isActive={showExport}
          onCloseOthers={() => {
            setShowFilter(false);
            setShowUsers(false);
            setShowOverlayManual(false);
          }}
          onToggle={() => setShowExport((prev) => !prev)}
          title="Exportar"
        />
        <NavButton
          activeIcon={openOverlayIcon}
          icon={overlayIcon}
          isActive={showOverlayManual}
          onCloseOthers={() => {
            setShowFilter(false);
            setShowExport(false);
            setShowUsers(false);
          }}
          onToggle={() => setShowOverlayManual((prev) => !prev)}
          title="Overlay Manual"
        />
      </TopNavbar>
      <BottomNavbar>
        <NavButton
          activeIcon={openUserIcon}
          icon={users}
          isActive={showUsers}
          onCloseOthers={() => {
            setShowFilter(false);
            setShowExport(false);
            setShowOverlayManual(false);
          }}
          onToggle={() => setShowUsers((prev) => !prev)}
          title="Users"
        />
      </BottomNavbar>
    </NavBar>
  );
}
