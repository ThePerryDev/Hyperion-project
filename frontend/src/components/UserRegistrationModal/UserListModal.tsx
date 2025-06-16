import React, { useEffect, useState } from "react";
import styled from "styled-components";
import UserEditModal from "./UserEditModal";

interface Props {
  onClose: () => void;
}

interface User {
  id?: number;
  name: string;
  email: string;
  admin: boolean;
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
  display: row;
  gap: 1rem;
  max-height: 500px;
  overflow-y: auto;

  @media (min-width: 300px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const UserCard = styled.div`
  background: #f3f3f3;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 10px;
  gap: 1rem;

  @media (max-width: 370px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const InfoText = styled.p`
  margin: 0;
  word-break: break-word;
  white-space: normal;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  word-break: break-word;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-self: center;

  @media (min-width: 500px) {
    flex-direction: column;
    align-items: center;
  }
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

const UserListModal: React.FC<Props> = ({ onClose }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    const token = localStorage.getItem("authToken");
  
    try {
      const res = await fetch(`${API_URL}/getall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) throw new Error("Erro ao buscar usuários");
  
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Erro ao buscar usuários", err);
      alert("Erro ao carregar usuários");
    }
  };
  
  const handleDelete = async (id: number) => {
    const confirm = window.confirm("Tem certeza que deseja excluir este usuário?");
    if (!confirm) return;
  
    const token = localStorage.getItem("authToken");
  
    try {
      const res = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
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
        <ButtonClose onClick={onClose}>×</ButtonClose>
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
          <UserListContainer>
            {users.map((user) => (
              <UserCard key={user.id}>
                <InfoGroup>
                  <InfoText>
                    <strong>Nome: {user.name}</strong> — Cargo:{" "}
                    {user.admin ? "Admin" : "Usuário"}
                  </InfoText>
                  <InfoText>
                    <small>Email: {user.email}</small>
                  </InfoText>
                </InfoGroup>

                <ButtonGroup>
                  <Button onClick={() => setEditingUser(user)}>Editar</Button>
                  <Button color="red" onClick={() => handleDelete(user.id!)}>
                    Excluir
                  </Button>
                </ButtonGroup>
              </UserCard>
            ))}
          </UserListContainer>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default UserListModal;
