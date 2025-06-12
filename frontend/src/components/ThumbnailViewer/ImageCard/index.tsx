import { CartaoImagemEstilizado, TextoInfo, ThumbnailImage, SelectButton } from "./styles";

interface ImageCardProps {
  id: string;
  thumbnail: string;
  bbox?: number[];
  colecao?: string;
  data?: string;
  bandas?: {
    BAND15?: string;
    BAND16?: string;
  };
  isSelected: boolean;
  onSelect: () => void;
  onProcess: () => void;
}

export default function ImageCard({
  id,
  thumbnail,
  bbox,
  colecao,
  data,
  bandas,
  isSelected,
  onSelect,
  onProcess,
}: ImageCardProps) {
  return (
    <CartaoImagemEstilizado selected={isSelected}>
      <ThumbnailImage src={thumbnail} alt={id} />
      <TextoInfo><strong>ID:</strong> {id}</TextoInfo>
      <TextoInfo><strong>BBOX:</strong> {bbox?.join(", ")}</TextoInfo>
      <TextoInfo><strong>Coleção:</strong> {colecao}</TextoInfo>
      <TextoInfo><strong>Data:</strong> {data}</TextoInfo>

      <SelectButton onClick={onSelect}>Selecionar</SelectButton>
      {isSelected && <SelectButton onClick={onProcess}>Processar Imagem</SelectButton>}
    </CartaoImagemEstilizado>
  );
}