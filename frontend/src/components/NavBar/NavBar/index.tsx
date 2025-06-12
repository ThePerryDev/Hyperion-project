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

  return (
    <NavBar>
      {showExport && <ExportPanel onClose={() => setShowExport(false)} />}
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
