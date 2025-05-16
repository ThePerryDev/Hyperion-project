import React, { useState } from "react";
import styled from "styled-components";

interface Props {
  user: User;
  onCancel: () => void;
  onSaveSuccess?: () => void;
}

interface User {
  id?: number;
  name: string;
  email: string;
  admin: boolean;
}

const API_URL = "http://localhost:8000/api/v1/usuarios";

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 600px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Button = styled.button<{ color?: string }>`
  margin-right: 0.5rem;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background-color: ${({ color }) => color || "#fe5000"};
  color: white;
  cursor: pointer;

  &:hover {
    background-color: ${({ color }) =>
      color === "#888" ? "#666" : color === "red" ? "#cc0000" : "#e24600"};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 6px 0 12px 0;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const UserEditModal: React.FC<Props> = ({ user, onCancel, onSaveSuccess }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [admin, setAdmin] = useState(user.admin);
  const [password, setPassword] = useState("");

  const handleEditSubmit = async () => {
    if (!user.id) {
      alert("ID do usuário não encontrado.");
      return;
    }

    const payload = {
      name,
      email,
      admin,
      password,
    };

    try {
      const response = await fetch(`${API_URL}/put/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const raw = await response.text();
        console.error("Erro bruto da API:", raw);
        throw new Error("Erro ao atualizar usuário");
      }

      alert("Usuário atualizado com sucesso!");
      if (onSaveSuccess) onSaveSuccess();
      onCancel();
    } catch (error: any) {
      alert(error.message || "Erro ao atualizar usuário");
      console.error(error);
    }
  };

  return (
    <ModalContent>
      <Title>Editar Usuário</Title>
      <label>Nome:</label>
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Email:</label>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>Senha (opcional):</label>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={admin}
          onChange={(e) => setAdmin(e.target.checked)}
        />
        Admin
      </label>
      <div style={{ marginTop: "1rem" }}>
        <Button onClick={handleEditSubmit}>Salvar</Button>
        <Button color="#888" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </ModalContent>
  );
};

export default UserEditModal;
