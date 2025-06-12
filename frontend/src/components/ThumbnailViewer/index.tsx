import { Title, ImageCountText} from "./styles";
import LargePanel from "./LargePanel";
import ImageCard from "./ImageCard";
import { CloseButton, ScrollContainer } from "..";
import { formatarData } from "../../utils/imageUtils";
import { useImageHandlers } from "../../hooks/useImageHandlers";

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

export default function ThumbnailViewer({ imagens, onClose }: ThumbnailViewerProps) {
  const { imagemThumbnail, handleSelecionarImagem, handleProcessarImagem } = useImageHandlers();

  return (
    <LargePanel>
      <CloseButton onClick={onClose} />
      <ScrollContainer>
        <Title>Resultados da Busca</Title>
        <ImageCountText>{imagens.length} imagens encontradas</ImageCountText>

        {imagens.map((img) => (
          <ImageCard
            key={img.id}
            id={img.id}
            thumbnail={img.thumbnail}
            bbox={img.bbox}
            colecao={img.colecao}
            data={formatarData(img.data)}
            bandas={img.bandas}
            isSelected={imagemThumbnail?.id === img.id}
            onSelect={() => handleSelecionarImagem(img)}
            onProcess={() => handleProcessarImagem(img)}
          />
        ))}
      </ScrollContainer>
    </LargePanel>
  );
}
