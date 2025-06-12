import axios from "axios";
import { useEffect, useState } from "react";
import { useBBox } from "../../../../context/BBoxContext";
import {
  ButtonCustom,
  CloseButton,
  InputCustom,
  OptionDiv,
  Panel,
  ScrollContainer,
  SearchBar,
  SelectCustom,
  ThumbnailViewer,
} from "../../..";

interface FilterPanelProps {
  onClose: () => void;
}

export default function FilterPanel({ onClose }: FilterPanelProps) {
  const [colecaoSelecionada, setColecaoSelecionada] = useState("");
  const [colecoes, setColecoes] = useState<string[]>([]);
  const [dataFim, setDataFim] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [imagensFiltradas, setImagensFiltradas] = useState<any[]>([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [selectingBBox, setSelectingBBox] = useState(false);
  const { bbox, polygonPoints } = useBBox();

  useEffect(() => {
    axios
      .get("http://localhost:8000/colecoes-suportadas")
      .then((res) => {
        const nomes = res.data.map((colecao: { id: string }) => colecao.id);
        setColecoes(nomes);
      })
      .catch((err) => {
        console.error("Erro ao buscar coleções:", err);
      });
  }, []);

  const aplicarFiltros = async () => {
    if (!bbox || !colecaoSelecionada || !dataInicio || !dataFim) {
      alert("Preencha todos os campos antes de aplicar os filtros.");
      return;
    }

    const payload = {
      bbox: bbox.join(","),
      colecao: colecaoSelecionada,
      data_fim: dataFim,
      data_inicio: dataInicio,
      filtrar_nuvens: false,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/buscar-imagens",
        payload
      );
      setImagensFiltradas(response.data.dados);
      setMostrarResultados(true);
    } catch (error) {
      console.error("Erro ao buscar imagens:", error);
      alert("Erro ao buscar imagens. Veja o console para mais detalhes.");
    }
  };

  if (mostrarResultados) {
    return (
      <ThumbnailViewer
        imagens={imagensFiltradas}
        onClose={() => {
          setMostrarResultados(false);
        }}
      />
    );
  }

  return (
    <Panel>
      <CloseButton onClick={onClose} />
      <ScrollContainer>
        <h3>Localizar</h3>
        <SearchBar />
        {bbox && (
          <>
            <OptionDiv>
              <InputCustom value={bbox[0]} />
            </OptionDiv>
            <OptionDiv>
              <InputCustom value={bbox[1]} />
            </OptionDiv>
            <OptionDiv>
              <InputCustom value={bbox[2]} />
            </OptionDiv>
            <OptionDiv>
              <InputCustom value={bbox[3]} />
            </OptionDiv>
          </>
        )}
        <ButtonCustom onClick={() => setSelectingBBox(true)}>
          Selecionar Área
        </ButtonCustom>
        <OptionDiv label="Coleção/Satélite">
          <SelectCustom
            onChange={(e) => setColecaoSelecionada(e.target.value)}
            value={colecaoSelecionada}
          >
            <option value="" disabled hidden>
              Selecione a Coleção
            </option>
            {colecoes.map((colecaoId) => (
              <option key={colecaoId} value={colecaoId}>
                {colecaoId}
              </option>
            ))}
          </SelectCustom>
        </OptionDiv>
        <OptionDiv label="Data Fim (UTC)">
          <InputCustom
            onChange={(e) => setDataFim(e.target.value)}
            type="date"
            value={dataFim}
          />
        </OptionDiv>
        <OptionDiv label="Data Início (UTC)">
          <InputCustom
            onChange={(e) => setDataInicio(e.target.value)}
            type="date"
            value={dataInicio}
          />
        </OptionDiv>
      </ScrollContainer>
      <ButtonCustom onClick={aplicarFiltros}>Aplicar Filtros</ButtonCustom>
    </Panel>
  );
}
