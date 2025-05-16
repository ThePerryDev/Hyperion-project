import React, { useEffect, useState } from "react";
import styled from "styled-components";
import UserEditModal from "./UserEditModal";
import { eyeOpenIcon, eyeCloseIcon } from "../../assets";

interface Props {
  onClose: () => void;
}

interface User {
    id?: number;
    name: string;
    email: string;
    admin: boolean;
    senha: string;
  }
  

const API_URL = "http://localhost:8000/api/v1/usuarios";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 900px;
  position: relative;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const UserListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  max-height: 500px;
  overflow-y: auto;
`;

const UserCard = styled.div`
  background: #f3f3f3;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Button = styled.button<{ color?: string }>`
  margin-right: 0.5rem;
  padding: 6px 12px;
  border: none;
  border-radius: 25px;
  background-color: ${({ color }) => color || "#fe5000"};
  color: white;
  cursor: pointer;

  &:hover {
    background-color: ${({ color }) =>
      color === "#888" ? "#666" : color === "red" ? "#cc0000" : "#e24600"};
  }
`;

const ButtonClose = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  color: #888;
  cursor: pointer;

  &:hover {
    color: #fe5000;
  }
`;

const OptionDiv = styled.div`
  margin-top: 0.5rem;
`;

const Options = styled.label`
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  display: block;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const InputUser = styled.input`
  padding: 6px 30px 6px 10px;
  flex: 1;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const EyeButton = styled.button`
  position: absolute;
  right: 5px;
  background: none;
  border: none;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
  }
`;

const UserListModal: React.FC<Props> = ({ onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPasswordId, setShowPasswordId] = useState<number | null>(null);

  const togglePasswordVisibility = (id: number) => {
    setShowPasswordId((prev) => (prev === id ? null : id));
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/getall`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar usuários");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/delete/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setUsers(users.filter((u) => u.id !== id));
      alert("Usuário excluído com sucesso!");
    } catch {
      alert("Erro ao excluir usuário");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <ModalOverlay>
      <ModalContent>
        <ButtonClose onClick={onClose}>×</ButtonClose>{" "}
        <Title>Lista de Funcionários</Title>
        {editingUser ? (
          <UserEditModal
            user={editingUser}
            onCancel={() => setEditingUser(null)}
            onSaveSuccess={() => {
              setEditingUser(null);
              fetchUsers();
            }}
          />
        ) : (
          <>
            <UserListContainer>
              {users.map((user) => (
                <UserCard key={user.id}>
                  <p>
                    <strong>Nome: {user.name}</strong> —{" "}
                    {user.admin ? "Admin" : "Usuário"}
                  </p>
                  <p>
                    <small>Email: {user.email}</small>
                  </p>

                  <OptionDiv>
                    <Options>Senha</Options>
                    <InputWrapper>
                      <EyeButton
                        onClick={() =>
                          togglePasswordVisibility(user.id!)
                        }
                      >
                        <img
                          src={
                            showPasswordId === user.id
                              ? eyeOpenIcon
                              : eyeCloseIcon
                          }
                          alt="Mostrar senha"
                        />
                      </EyeButton>

                      <InputUser
                        type={
                          showPasswordId === user.id
                            ? "text"
                            : "password"
                        }
                        value={user.senha}
                        readOnly
                      />
                    </InputWrapper>
                  </OptionDiv>

                  <div style={{ marginTop: "0.5rem" }}>
                    <Button onClick={() => setEditingUser(user)}>Editar</Button>
                    <Button
                      color="red"
                      onClick={() => handleDelete(user.id!)}
                    >
                      Excluir
                    </Button>
                  </div>
                </UserCard>
              ))}
            </UserListContainer>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default UserListModal;
