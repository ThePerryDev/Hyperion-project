import { useContext, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import {
  ButtonCustom,
  CloseButton,
  InputCustom,
  OptionDiv,
  Panel,
  ScrollContainer,
  UserListModal,
  UserRegistrationModal,
} from "../../..";

interface PanelUsersProps {
  onClose: () => void;
}

export default function UsersPanel({ onClose }: PanelUsersProps) {
  const { user } = useContext(AuthContext);
  const [showFuncionariosModal, setShowFuncionariosModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <Panel>
      <CloseButton onClick={onClose} />
      <ScrollContainer>
        <OptionDiv label="Cargo">
          <InputCustom
            readOnly
            value={user?.admin ? "administrador" : "usuário"}
          />
        </OptionDiv>

        <OptionDiv label="E-mail">
          <InputCustom value={user?.email} readOnly={user?.admin !== true} />
        </OptionDiv>

        <OptionDiv label="Nome do funcionário">
          <InputCustom value={user?.name} readOnly={user?.admin !== true} />
        </OptionDiv>

        {user?.admin === true && (
          <>
            <ButtonCustom onClick={() => setShowModal(true)}>
              Cadastrar Funcionários
            </ButtonCustom>
            {showModal && (
              <UserRegistrationModal onClose={() => setShowModal(false)} />
            )}
            <ButtonCustom onClick={() => setShowFuncionariosModal(true)}>
              Editar Funcionários
            </ButtonCustom>
            {showFuncionariosModal && (
              <UserListModal onClose={() => setShowFuncionariosModal(false)} />
            )}
          </>
        )}
      </ScrollContainer>
    </Panel>
  );
}
