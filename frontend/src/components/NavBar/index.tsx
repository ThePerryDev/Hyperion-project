import {
  exportIcon,
  mapIcon,
  opemMapIcon,
  openExportIcon,
  returnIcon,
  searchIcon,
  settings,
  openSettingsIcon,
  overlayIcon,
  openOverlayIcon,
} from "../../assets";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useBBox } from "../../context/BBoxContext";
import ThumbnailViewer from "../ThumbnailViewer/ThumbnailViewer";
import OverlayManualPanel from "../OverlayManualPanel/OverlayManualPanel";
import UserRegistrationModal from "../UserRegistrationModal/index";
import UserListModal from "../UserRegistrationModal/UserListModal";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Bottom,
  ButtonCustom,
  ButtonCustom2,
  ButtonLogout,
  CloseButton,
  FilterPanel,
  InputCustom,
  InputCustom2,
  InputUser,
  NavBar,
  NavButton,
  OptionDiv,
  Options,
  ScrollContainer,
  SelectCustom,
  Top,
} from "./styles";
import ExportData from "../ExportData/ExportData";
import { ImagemProcessada } from "../ExportData/ExportData";


export default function NavigationBar() {
  const [showFilter, setShowFilter] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [colecoes, setColecoes] = useState<string[]>([]);
  const [selectingBBox, setSelectingBBox] = useState(false);
  const [colecaoSelecionada, setColecaoSelecionada] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const { polygonPoints, bbox } = useBBox();
  const [imagensFiltradas, setImagensFiltradas] = useState<any[]>([]);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [showOverlayManual, setShowOverlayManual] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFuncionariosModal, setShowFuncionariosModal] = useState(false);
  const { user, token, signout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [processamentos, setProcessamentos] = useState<ImagemProcessada[]>([]);


  const handleLogout = () => {
    signout();
    navigate("/login");
  };

  // Buscar coleções suportadas (não precisa de token se for público)
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

  // Buscar processamentos feitos pelo usuário (protegido)
 useEffect(() => {
  if (!token) return;

  axios
    .get("http://localhost:8000/api/v1/meus-processamentos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      const data = res.data.map((item: any) => ({
        id: item.id_imagem,
        bbox: item.bbox_real,
        colecao: "CBERS 4A WFI", // Valor fixo, você pode alterar se precisar dinamicamente
        data: item.data_processamento,
        bandas: {
          BAND13: item.banda13,
          BAND14: item.banda14,
          BAND15: item.banda15,
          BAND16: item.banda16,
        },
        cmask: item.cmask || undefined,
        ndvi_tif: item.ndvi_tif,
        ndvi_png: item.ndvi_png,
        segmentado_tif: item.segmentado_tif,
        segmentado_png: item.segmentado_png,
      }));

      setProcessamentos(data);
    })
    .catch((err) => {
      console.error("Erro ao buscar processamentos:", err);
    });
}, [showExport, token]);


  const aplicarFiltros = async () => {
    if (!bbox || !colecaoSelecionada || !dataInicio || !dataFim) {
      alert("Preencha todos os campos antes de aplicar os filtros.");
      return;
    }

    const payload = {
      bbox: bbox.join(","),
      colecao: colecaoSelecionada,
      data_inicio: dataInicio,
      data_fim: dataFim,
      filtrar_nuvens: false,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/buscar-imagens",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setImagensFiltradas(response.data.dados);
      setMostrarResultados(true);
    } catch (error) {
      console.error("Erro ao buscar imagens:", error);
      alert("Erro ao buscar imagens. Veja o console para mais detalhes.");
    }
  };

  const handleExport = async (id: string) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/v1/baixar-processamento/${id}`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${id}.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Erro ao exportar dados:", error);
    alert("Erro ao exportar dados.");
  }
};

  return (
    <NavBar>
      {showOverlayManual && (
        <OverlayManualPanel
          onClose={() => {
            setShowOverlayManual(false);
          }}
        />
      )}

      {showFilter &&
        (mostrarResultados ? (
          <ThumbnailViewer
            imagens={imagensFiltradas}
            onClose={() => {
              setMostrarResultados(false);
              setShowFilter(true);
            }}
          />
        ) : (
          <FilterPanel>
            <CloseButton onClick={() => setShowFilter(false)}>
              <img src={returnIcon} alt="Voltar" />
            </CloseButton>
            <ScrollContainer>
              <h3>Localizar</h3>
              <p>Clique em quatro pontos no mapa para criar um polígono de visualização.</p>

              {!selectingBBox && polygonPoints.length < 4 && (
                <ButtonCustom
                  onClick={() => {
                    setShowFilter(false);
                    setSelectingBBox(true);
                  }}
                >
                  Selecionar Área
                </ButtonCustom>
              )}

              {bbox && (
                <>
                  <OptionDiv><InputCustom2 value={bbox[0]} readOnly /></OptionDiv>
                  <OptionDiv><InputCustom2 value={bbox[1]} readOnly /></OptionDiv>
                  <OptionDiv><InputCustom2 value={bbox[2]} readOnly /></OptionDiv>
                  <OptionDiv><InputCustom2 value={bbox[3]} readOnly /></OptionDiv>
                </>
              )}

              <OptionDiv>
                <Options>Coleção/Satelite</Options>
                <SelectCustom
                  value={colecaoSelecionada}
                  onChange={(e) => setColecaoSelecionada(e.target.value)}
                >
                  <option value="" disabled hidden>Selecione a Coleção</option>
                  {colecoes.map((colecaoId) => (
                    <option key={colecaoId} value={colecaoId}>{colecaoId}</option>
                  ))}
                </SelectCustom>
              </OptionDiv>

              <OptionDiv>
                <Options>Data Início (UTC)</Options>
                <InputCustom
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </OptionDiv>

              <OptionDiv>
                <Options>Data Fim (UTC)</Options>
                <InputCustom
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </OptionDiv>
            </ScrollContainer>
            <ButtonCustom2 onClick={aplicarFiltros}>Aplicar Filtros</ButtonCustom2>
          </FilterPanel>
        ))}

      {showExport && (
        <FilterPanel>
    <ExportData imagens={processamentos} onExport={handleExport} />
    <CloseButton onClick={() => setShowExport(false)}>
      <img src={returnIcon} alt="Fechar" />
    </CloseButton>
  </FilterPanel>
      )}

      {showSettings && (
        <FilterPanel>
          <CloseButton onClick={() => setShowSettings(false)}>
            <img src={returnIcon} alt="Fechar" />
          </CloseButton>
          <ScrollContainer>
            <OptionDiv>
              <Options>Nome do funcionário</Options>
              <InputUser value={user?.name} readOnly={user?.admin !== true} />
            </OptionDiv>
            <OptionDiv>
              <Options>Cargo</Options>
              <InputUser value={user?.admin ? "administrador" : "usuário"} readOnly />
            </OptionDiv>
            <OptionDiv>
              <Options>Email</Options>
              <InputUser value={user?.email} readOnly={user?.admin !== true} />
            </OptionDiv>
            {user?.admin === true && (
              <>
                <ButtonCustom onClick={() => setShowModal(true)}>Cadastrar Funcionários</ButtonCustom>
                {showModal && <UserRegistrationModal onClose={() => setShowModal(false)} />}
                <ButtonCustom onClick={() => setShowFuncionariosModal(true)}>Editar Funcionários</ButtonCustom>
                {showFuncionariosModal && <UserListModal onClose={() => setShowFuncionariosModal(false)} />}
              </>
            )}
            <ButtonLogout onClick={handleLogout}>Logout</ButtonLogout>
          </ScrollContainer>
        </FilterPanel>
      )}

      <Top>
        <NavButton
          title="Filtro"
          onClick={() => {
            setShowFilter((prev) => {
              if (!prev) {
                setShowExport(false);
                setShowSettings(false);
                setShowOverlayManual(false);
              }
              return !prev;
            });
          }}
        >
          <img src={showFilter ? opemMapIcon : mapIcon} alt="Filter" />
        </NavButton>

        <NavButton
          title="Exportar"
          onClick={() => {
            setShowExport((prev) => {
              if (!prev) {
                setShowFilter(false);
                setShowSettings(false);
                setShowOverlayManual(false);
              }
              return !prev;
            });
          }}
        >
          <img src={showExport ? openExportIcon : exportIcon} alt="Export" />
        </NavButton>

        <NavButton
          title="Overlay Manual"
          onClick={() => {
            setShowOverlayManual((prev) => {
              if (!prev) {
                setShowFilter(false);
                setShowExport(false);
                setShowSettings(false);
              }
              return !prev;
            });
          }}
        >
          <img src={showOverlayManual ? openOverlayIcon : overlayIcon} alt="Overlay Manual" />
        </NavButton>
      </Top>

      <Bottom>
        <NavButton
          title="Settings"
          onClick={() => {
            setShowSettings((prev) => {
              if (!prev) {
                setShowFilter(false);
                setShowExport(false);
                setShowOverlayManual(false);
              }
              return !prev;
            });
          }}
        >
          <img src={showSettings ? openSettingsIcon : settings} alt="Configurações" />
        </NavButton>
      </Bottom>
    </NavBar>
  );
}
