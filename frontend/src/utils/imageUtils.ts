export const formatarData = (dataISO?: string) => {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
};

/*export const handleProcessarImagem = async (
  img: {
    id: string;
    thumbnail: string;
    bbox?: number[];
    bandas?: { [key: string]: string };
  },
  setImagemProcessada: (imagem: { id: string; thumbnail: string; bbox: number[] }) => void,
  setMostrarProcessada: (mostrar: boolean) => void
) => {
  if (!img.bbox || !img.bandas?.BAND15 || !img.bandas?.BAND16) {
    alert("Imagem selecionada não possui BBOX ou bandas necessárias.");
    return;
  }

  const payload = {
    id: img.id,
    band15_url: img.bandas.BAND15,
    band16_url: img.bandas.BAND16,
    bbox: img.bbox,
  };

  try {
    const response = await fetch("http://localhost:8000/processar-imagem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Erro no processamento da imagem.");

    const resultado = await response.json();
    const imagemProcessadaUrl = `http://localhost:8000${resultado.preview_png}`;
    const bboxFinal = resultado.bbox_real ?? resultado.bbox;

    setImagemProcessada({
      id: img.id,
      thumbnail: imagemProcessadaUrl,
      bbox: bboxFinal,
    });

    setMostrarProcessada(true);
  } catch (error) {
    console.error("Erro ao processar imagem:", error);
    alert("Erro ao processar imagem.");
  }
};
*/