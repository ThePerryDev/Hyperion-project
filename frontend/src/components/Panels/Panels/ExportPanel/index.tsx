import axios from "axios";
import { useEffect, useState } from "react";
import {
  ButtonCustom,
  CloseButton,
  InputCustom,
  OptionDiv,
  Panel,
  ScrollContainer,
  SelectCustom,
} from "../../..";

interface ExportPanelProps {
  onClose: () => void;
}

export default function ExportPanel({ onClose }: ExportPanelProps) {
  const [colecaoSelecionada, setColecaoSelecionada] = useState("");
  const [colecoes, setColecoes] = useState<string[]>([]);
  const [dataFim, setDataFim] = useState("");
  const [dataInicio, setDataInicio] = useState("");

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

  return (
    <Panel>
      <CloseButton onClick={onClose} />
      <ScrollContainer>
        <h3>Exportar</h3>
        <OptionDiv>
          <InputCustom placeholder="Limite Esquerdo Inferior" />
        </OptionDiv>
        <OptionDiv>
          <InputCustom placeholder="Limite Esquerdo Superior" />
        </OptionDiv>
        <OptionDiv>
          <InputCustom placeholder="Limite Direito Inferior" />
        </OptionDiv>
        <OptionDiv>
          <InputCustom placeholder="Limite Direito Superior" />
        </OptionDiv>
        <OptionDiv label="Coleção/Satelite">
          <SelectCustom
            defaultValue=""
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
        <ButtonCustom>Exportar Dados</ButtonCustom>
      </ScrollContainer>
    </Panel>
  );
}
