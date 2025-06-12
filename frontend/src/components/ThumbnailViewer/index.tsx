import { useBBox } from "../../context/BBoxContext";
import { CloseButton, ScrollContainer } from "..";
import LargePanel from "./LargePanel";
import ImageCard from "./ImageCard";

interface ThumbnailViewerProps {
  imagens: {
    id: string;
    thumbnail: string;
    colecao?: string;
    bbox?: number[];
    data?: string;
    bandas?: {
      BAND15?: string;
      BAND16?: string;
    };
  }[];
  onClose: () => void;
}

export default function ThumbnailViewer({
  imagens,
  onClose,
}: ThumbnailViewerProps) {
  const {
    imagemThumbnail,
    setImagemThumbnail,
    setMostrarThumbnail,
    setImagemProcessada,
    setMostrarProcessada,
  } = useBBox();

  const handleSelecionarImagem = (img: {
    id: string;
    thumbnail: string;
    bbox?: number[];
  }) => {
    if (img.bbox) {
      setImagemThumbnail({
        id: img.id,
        thumbnail: img.thumbnail,
        bbox: img.bbox,
      });
      setMostrarThumbnail(true);
    } else {
      alert("Imagem sem BBOX disponível para visualização.");
    }
  };

  return (
    <LargePanel>
      <CloseButton onClick={onClose} />
      <ScrollContainer>
        {imagens.map((img) => (
          <ImageCard
            key={img.id}
            id={img.id}
            bbox={img.bbox}
            colecao={img.colecao}
            data={img.data}
            onExport={() => console.log("Exportando dados de", img.id)}
          />
        ))}
      </ScrollContainer>
    </LargePanel>
  );
}
