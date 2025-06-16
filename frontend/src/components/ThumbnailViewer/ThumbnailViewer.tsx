import { useBBox } from "../../context/BBoxContext";
import { useState, useRef, useEffect, useContext } from "react";
import {
  Panel,
  Title,
  ImageCountText,
  ScrollContainer,
  ThumbnailCard,
  ThumbnailImage,
  InfoText,
  SelectButton,
  ButtonVoltar,
} from "./styles";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

interface ThumbnailViewerProps {
  imagens: {
    id: string;
    thumbnail: string;
    colecao?: string;
    bbox?: number[];
    data?: string;
    bandas?: {
      BAND13?: string;
      BAND14?: string;
      BAND15?: string;
      BAND16?: string;
    };
  }[];
  onClose: () => void;
}

function formatarTempo(segundos: number): string {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  const s = Math.floor(segundos % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ThumbnailViewer({ imagens, onClose }: ThumbnailViewerProps) {
  const {
    imagemThumbnail,
    setImagemThumbnail,
    setMostrarThumbnail,
    setImagemProcessada,
    setMostrarProcessada,
  } = useBBox();

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [tempoEstimado, setTempoEstimado] = useState<number | null>(null);
  const [tempoEstimadoTotal, setTempoEstimadoTotal] = useState<number | null>(null);
  const [cancelando, setCancelando] = useState(false);

  const intervaloTempoRef = useRef<NodeJS.Timeout | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    return () => {
      clearInterval(intervaloTempoRef.current!);
      clearInterval(pollingRef.current!);
      socketRef.current?.close();
    };
  }, []);

  const formatarData = (dataISO?: string) => {
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  const handleSelecionarImagem = (img: any) => {
    if (img.bbox) {
      setImagemThumbnail({ id: img.id, thumbnail: img.thumbnail, bbox: img.bbox });
      setMostrarThumbnail(true);
    } else {
      alert("Imagem sem BBOX disponível para visualização.");
    }
  };
  
  const cancelarAmbos = async (id: string, cancelarBackend: boolean = true) => {
    setCancelando(true);
  
    try {
      if (cancelarBackend) {
        await api.post(`/cancelar-processamento?id=${id}`);
        console.log("✅ Cancelamento backend confirmado");
      }
  
      abortRef.current?.abort();
      socketRef.current?.close();
      socketRef.current = null;
      clearInterval(intervaloTempoRef.current!);
      clearInterval(pollingRef.current!);
      
      setProcessingId(null);
      setTempoEstimado(null);
      setTempoEstimadoTotal(null);
    } catch (e) {
      console.error("❌ Erro ao cancelar:", e);
      alert("Erro ao cancelar o processamento. Tente novamente.");
    } finally {
      setCancelando(false);
    }
  };

  const handleProcessarImagem = async (img: any) => {
    if (processingId) return;

    if (!img.bbox || !img.bandas?.BAND15 || !img.bandas?.BAND16) {
      alert("Imagem selecionada não possui BBOX ou bandas necessárias.");
      return;
    }

    const payload = {
      id: img.id,
      band13_url: img.bandas.BAND13 || "",
      band14_url: img.bandas.BAND14 || "",
      band15_url: img.bandas.BAND15,
      band16_url: img.bandas.BAND16,
      cmask: "",
      thumbnail: img.thumbnail || "",
      bbox: img.bbox,
      usuario_id: 1,
    };

    console.log("🔍 Enviando payload:", payload);

    setProcessingId(img.id);
    setCancelando(false);
    const start = Date.now();

    intervaloTempoRef.current = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      setTempoEstimado(elapsed);
    }, 1000);

    abortRef.current = new AbortController();

    socketRef.current = new WebSocket(`ws://localhost:8000/ws/${img.id}`);

    socketRef.current.onopen = async () => {
      console.log("🔗 WebSocket conectado para", img.id);
      try {
        await api.post("/processar-imagem", payload, {
          signal: abortRef.current?.signal,
          headers: { Authorization: `Bearer ${token}` },
        });

        pollingRef.current = setInterval(async () => {
          try {
            const res = await api.get("/processed-list/", {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = res.data;
            const encontrada = data.find((item: any) => item.id.includes(img.id));
            if (encontrada) {
              const imagemProcessadaUrl = `http://localhost:8000${encontrada.preview_png}`;
              setImagemProcessada({ id: img.id, thumbnail: imagemProcessadaUrl, bbox: img.bbox });
              setMostrarProcessada(true);
              cancelarAmbos(img.id, false);
            }
          } catch (err) {
            console.error("Erro no polling:", err);
          }
        }, 15000);

      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("⛔ Cancelado localmente pelo usuário.");
        } else {
          console.error("❌ Erro ao iniciar processamento:", err);
        }
        cancelarAmbos(img.id);
      }
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const progresso = Number(data.progresso);
        const elapsed = (Date.now() - start) / 1000;

        if (!isNaN(progresso) && progresso > 0.01 && progresso <= 1) {
          const estimadoTotal = elapsed / progresso;
          if (isFinite(estimadoTotal)) {
            setTempoEstimadoTotal(Number(estimadoTotal.toFixed(1)));
          }
        }

        setTempoEstimado(elapsed);
      } catch (err) {
        console.error("Erro ao processar mensagem do WebSocket:", err);
      }
    };

    socketRef.current.onerror = (e) => console.error("WebSocket erro:", e);
    socketRef.current.onclose = () => console.log("WebSocket fechado.");
  };

  return (
    <Panel>
      <ScrollContainer>
        <Title>Resultados da Busca</Title>
        <ImageCountText>{imagens.length} imagens foram encontradas</ImageCountText>
        {imagens.map((img) => {
          const isSelected = imagemThumbnail?.id === img.id;
          const estaProcessando = processingId === img.id;

          return (
            <ThumbnailCard key={img.id} selected={isSelected}>
              <ThumbnailImage src={img.thumbnail} alt={img.id} />
              <InfoText><strong>Id:</strong> {img.id}</InfoText>
              <InfoText><strong>BBox:</strong> {img.bbox?.join(", ")}</InfoText>
              <InfoText><strong>Data:</strong> {formatarData(img.data)}</InfoText>
              <SelectButton onClick={() => handleSelecionarImagem(img)}>Selecionar</SelectButton>
              {isSelected && !estaProcessando && (
                <SelectButton onClick={() => handleProcessarImagem(img)} disabled={!!processingId}>
                  Processar Imagem
                </SelectButton>
              )}
              {estaProcessando && (
                <>
                  <SelectButton onClick={() => cancelarAmbos(img.id)} disabled={!processingId || cancelando}>
                    {cancelando ? "Cancelando..." : "Cancelar Processamento"}
                  </SelectButton>
                  {tempoEstimado !== null && (
                    <InfoText>Tempo decorrido: {formatarTempo(tempoEstimado)}</InfoText>
                  )}
                  {tempoEstimadoTotal !== null && (
                    <>
                      <InfoText>Estimativa total: {formatarTempo(tempoEstimadoTotal)}</InfoText>
                      <InfoText>Tempo restante: {formatarTempo(tempoEstimadoTotal - tempoEstimado!)}</InfoText>
                      <InfoText>Progresso: {((tempoEstimado! / tempoEstimadoTotal) * 100).toFixed(1)}%</InfoText>
                    </>
                  )}
                </>
              )}
            </ThumbnailCard>
          );
        })}
        <ButtonVoltar onClick={onClose}>Voltar para Filtros</ButtonVoltar>
      </ScrollContainer>
    </Panel>
  );
}
