import styled from "styled-components";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

const PageContainer = styled.div`
  height: 92vh;
  width: 96vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #121212;
`;

const MapWrapper = styled.div`
  flex: 1;
  border-radius: 12px;
  margin: 1rem;
  background-color: #ccc;
  position: relative;

  .leaflet-container {
    height: 100%;
    width: 100%;
    border-radius: 12px;
  }
`;

export default function Home() {
  return (
    <PageContainer>
      <MapWrapper>
        <MapContainer center={[-23.55, -46.63]} zoom={8} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </MapWrapper>
    </PageContainer>
  );
}

/*      
  <NavBar>
    <NavBarButton title="Icon 1">📁</NavBarButton>
    <NavBarButton title="Icon 2">📍</NavBarButton>
    <NavBarButton title="Icon 3">⚙️</NavBarButton>
  </NavBar>
*/
