import React from "react";
import styled from "styled-components";

export interface BandaLinks {
  BAND13?: string;
  BAND14?: string;
  BAND15?: string;
  BAND16?: string;
}

export interface ImagemProcessada {
  id: string;
  bbox?: number[];
  colecao?: string;
  data?: string;
  bandas?: BandaLinks;
  cmask?: string;
  ndvi_tif?: string;
  ndvi_png?: string;
  segmentado_tif?: string;
  segmentado_png?: string;
}

export interface ExportDataProps {
  imagens: ImagemProcessada[];
  onExport: (id: string) => void;
}

// 🔗 Função para forçar download
const handleDownload = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 🎨 Estilização
const Card = styled.div`
  width: 100%;
  background-color: #eeeeee;
  border-radius: 20px;
  padding: 1.5rem 1rem;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TextoInfo = styled.p`
  margin: 4px 0;
  font-size: 13px;
  color: #333;
  text-align: center;
  font-weight: bold;
`;

const BotaoLink = styled.button`
  background: none;
  border: none;
  color: #1a73e8;
  text-decoration: underline;
  cursor: pointer;
  font-size: 12px;
  padding: 0;

  &:hover {
    color: #1558b0;
  }
`;

const BotaoExportar = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  background-color: #fe5000;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s ease, transform 0.15s ease;

  &:hover {
    background-color: #e24600;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

// 🚀 Componente
export default function ExportData({ imagens, onExport }: ExportDataProps) {
  return (
    <>
      {imagens.map((img) => (
        <Card key={img.id}>
          <TextoInfo>
            <strong>ID:</strong> {img.id}
          </TextoInfo>
          {img.bbox && img.bbox.length === 4 && (
            <TextoInfo>
              <strong>BBOX:</strong> {img.bbox.join(", ")}
            </TextoInfo>
          )}
          {img.colecao && (
            <TextoInfo>
              <strong>Coleção:</strong> {img.colecao}
            </TextoInfo>
          )}
          {img.data && (
            <TextoInfo>
              <strong>Data:</strong> {new Date(img.data).toLocaleDateString()}
            </TextoInfo>
          )}

          {img.bandas?.BAND13 && (
            <TextoInfo>
              Banda 13:
              <BotaoLink
                onClick={() =>
                  handleDownload(img.bandas!.BAND13!, `BAND13_${img.id}.tif`)
                }
              >
                Download
              </BotaoLink>
            </TextoInfo>
          )}
          {img.bandas?.BAND14 && (
            <TextoInfo>
              Banda 14:
              <BotaoLink
                onClick={() =>
                  handleDownload(img.bandas!.BAND14!, `BAND14_${img.id}.tif`)
                }
              >
                Download
              </BotaoLink>
            </TextoInfo>
          )}
          {img.bandas?.BAND15 && (
            <TextoInfo>
              Banda 15:
              <BotaoLink
                onClick={() =>
                  handleDownload(img.bandas!.BAND15!, `BAND15_${img.id}.tif`)
                }
              >
                Download
              </BotaoLink>
            </TextoInfo>
          )}
          {img.bandas?.BAND16 && (
            <TextoInfo>
              Banda 16:
              <BotaoLink
                onClick={() =>
                  handleDownload(img.bandas!.BAND16!, `BAND16_${img.id}.tif`)
                }
              >
                Download
              </BotaoLink>
            </TextoInfo>
          )}

          {img.cmask && (
            <TextoInfo>
              Máscara:
              <BotaoLink
                onClick={() =>
                  handleDownload(img.cmask!, `Mascara_${img.id}.tif`)
                }
              >
                Download
              </BotaoLink>
            </TextoInfo>
          )}
          {img.ndvi_tif && (
            <TextoInfo>
              NDVI (TIF):
              <BotaoLink
                onClick={() =>
                  handleDownload(img.ndvi_tif!, `NDVI_${img.id}.tif`)
                }
              >
                Download
              </BotaoLink>
            </TextoInfo>
          )}
          {img.ndvi_png && (
            <TextoInfo>
              NDVI (PNG):
              <BotaoLink
                onClick={() =>
                  handleDownload(img.ndvi_png!, `NDVI_${img.id}.png`)
                }
              >
                Download
              </BotaoLink>
            </TextoInfo>
          )}
          {img.segmentado_tif && (
            <TextoInfo>
              Segmentado (TIF):
              <BotaoLink
                onClick={() =>
                  handleDownload(
                    img.segmentado_tif!,
                    `Segmentado_${img.id}.tif`
                  )
                }
              >
                Download
              </BotaoLink>
            </TextoInfo>
          )}
          {img.segmentado_png && (
            <TextoInfo>
              Segmentado (PNG):
              <BotaoLink
                onClick={() =>
                  handleDownload(
                    img.segmentado_png!,
                    `Segmentado_${img.id}.png`
                  )
                }
              >
                Download
              </BotaoLink>
            </TextoInfo>
          )}

          <BotaoExportar onClick={() => onExport(img.id)}>
            Exportar dados
          </BotaoExportar>
        </Card>
      ))}
    </>
  );
}
