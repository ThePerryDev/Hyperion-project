import { CartaoImagemEstilizado, TextoInfo, BotaoExportar } from "./styles";

interface ExportImageCardProps {
  id: string;
  bbox?: number[];
  colecao?: string;
  data?: string;
  bandas?: {
    Verde?: string;
    Azul?: string;
    Vermelho?: string;
    NIR?: string;
  };
  ndviUrl?: string;
  processadaUrl?: string;
  onExport: () => void;
}

export default function ExportImageCard({
  id,
  bbox,
  colecao,
  data,
  bandas,
  ndviUrl,
  processadaUrl,
  onExport,
}: ExportImageCardProps) {
  return (
    <CartaoImagemEstilizado>
      <TextoInfo><strong>ID:</strong> {id}</TextoInfo>
      <TextoInfo><strong>BBOX:</strong> {bbox?.join(", ")}</TextoInfo>
      <TextoInfo><strong>Coleção:</strong> {colecao}</TextoInfo>
      <TextoInfo><strong>Data:</strong> {data}</TextoInfo>

      {bandas?.Verde && <TextoInfo>Banda Verde: <a href={bandas.Verde} download>Download</a></TextoInfo>}
      {bandas?.Azul && <TextoInfo>Banda Azul: <a href={bandas.Azul} download>Download</a></TextoInfo>}
      {bandas?.Vermelho && <TextoInfo>Banda Vermelha: <a href={bandas.Vermelho} download>Download</a></TextoInfo>}
      {bandas?.NIR && <TextoInfo>Banda NIR: <a href={bandas.NIR} download>Download</a></TextoInfo>}

      {ndviUrl && <TextoInfo>Imagem NDVI: <a href={ndviUrl} download>Download</a></TextoInfo>}
      {processadaUrl && <TextoInfo>Imagem Segmentada: <a href={processadaUrl} download>Download</a></TextoInfo>}

      <BotaoExportar onClick={onExport}>Exportar Todos os Dados</BotaoExportar>
    </CartaoImagemEstilizado>
  );
}
