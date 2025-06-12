import { CartaoImagemEstilizado, TextoInfo } from "./styles";

interface ImageCardProps {
  id: string;
  bbox?: number[];
  colecao?: string;
  data?: string;
  onExport: () => void;
}

export default function ImageCard({
  id,
  bbox,
  colecao,
  data,
  onExport,
}: ImageCardProps) {
  return (
    <CartaoImagemEstilizado>
      <TextoInfo>ÁREA</TextoInfo>
      <TextoInfo>BBOX: {bbox?.join(", ")}</TextoInfo>
      <TextoInfo>Coleção: {colecao}</TextoInfo>
      <TextoInfo>Data: {data}</TextoInfo>
      <TextoInfo>
        Banda Verde: <a>LINK</a>
      </TextoInfo>
      <TextoInfo>
        Banda Azul: <a>LINK</a>
      </TextoInfo>
      <TextoInfo>
        Banda Vermelho: <a>LINK</a>
      </TextoInfo>
      <TextoInfo>
        Banda NIR: <a>LINK</a>
      </TextoInfo>
      <TextoInfo>
        Imagem NDVI: <a>LINK</a>
      </TextoInfo>
      <TextoInfo>
        Imagem Processada: <a>LINK</a>
      </TextoInfo>
      <button onClick={onExport}>Exportar Todos os Dados</button>
    </CartaoImagemEstilizado>
  );
}
