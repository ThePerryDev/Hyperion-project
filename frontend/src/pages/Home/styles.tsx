import styled from "styled-components";

export const PageContainer = styled.div`
  height: 92vh;
  width: 96vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #121212;
`;

export const MapWrapper = styled.div`
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

export const ClearButton = styled.button`
  position: absolute;
  background-color: #fe5000;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  z-index: 999;

  &:hover {
    background-color: #e24600;
  }
`;
