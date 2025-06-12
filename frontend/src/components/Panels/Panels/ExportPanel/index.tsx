import { CloseButton, ScrollContainer } from "../../..";
import ExportImageCard from "../../../ExportData/ExportImageCard";
import LargePanel from "../../../ExportData/LargePanel";

interface ExportDataProps {
  imagens: {
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
  }[];
  onClose: () => void;
}

export default function ExportPanel({ imagens, onClose }: ExportDataProps) {
  const handleExportarTudo = (id: string) => {
    console.log("Exportando dados da imagem:", id);
    // Aqui futuramente pode ser feito download zipado
  };

  return (
    <LargePanel>
      <CloseButton onClick={onClose} />
      <ScrollContainer>
        {imagens.map((img) => (
          <ExportImageCard
            key={img.id}
            id={img.id}
            bbox={img.bbox}
            colecao={img.colecao}
            data={img.data}
            bandas={img.bandas}
            ndviUrl={img.ndviUrl}
            processadaUrl={img.processadaUrl}
            onExport={() => handleExportarTudo(img.id)}
          />
        ))}
      </ScrollContainer>
    </LargePanel>
  );
}
