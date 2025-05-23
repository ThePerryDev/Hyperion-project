import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface Props {
  onClose: () => void;
}

interface User {
  id?: number; // Adicionado para refletir o backend
  name: string;
  email: string;
  password: string;
  admin: boolean;
  isLogged: false;
}

const API_URL = "http://localhost:8000/api/v1/usuarios"; // URL base do backend

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
  max-width: 450px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 48%;
  margin: 0.5rem 1%;
  padding: 10px;
  border: none;
  border-radius: 25px;
  height: 40px;
  font-size: 16px;
  background-color: #fe5000;
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease;

  &:hover {
    background-color: #e24600;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const UserCard = styled.div`
  text-align: left;
  background: #f3f3f3;
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #fff;
  appearance: none;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #fe5000;
    box-shadow: 0 0 0 2px rgba(254, 80, 0, 0.2);
  }
`;

const UserRegistrationModal: React.FC<Props> = ({ onClose }) => {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    password: "",
    admin: false,
    isLogged: false,
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: name === "admin" ? value === "admin" : value,
    }));
  };

  const handleSubmit = async () => {
    if (!user.name || !user.email || !user.password) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário");
      }

      const newUser = await response.json();
      setRegisteredUsers([...registeredUsers, newUser]);
      alert("Usuário cadastrado com sucesso!");
      // Limpa os campos
      setUser({ name: "", email: "", password: "", admin: false, isLogged: false });
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar usuário");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/getall`);
      if (!response.ok) {
        throw new Error("Erro ao buscar usuários");
      }

      const users = await response.json();
      setRegisteredUsers(users);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar usuários");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao deletar usuário");
      }

      setRegisteredUsers(
        registeredUsers.filter((u) => u.id !== id)
      );
      alert("Usuário deletado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar usuário");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <ModalOverlay>
      <ModalContent>
        <div>
          <h2>Cadastrar Funcionário</h2>
          <Input
            name="name"
            placeholder="Nome"
            value={user.name}
            onChange={handleChange}
          />
          <Input
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
          />
          <Input
            name="password"
            placeholder="Senha"
            type="password"
            value={user.password}
            onChange={handleChange}
          />
          <div>
            <label>Função:</label>
            <Select
              name="admin"
              value={user.admin ? "admin" : "usuario"}
              onChange={handleChange}
            >
              <option value="usuario">Usuário</option>
              <option value="admin">Admin</option>
            </Select>
          </div>
          <div>
            <Button onClick={handleSubmit}>Cadastrar</Button>
            <Button onClick={onClose}>Fechar</Button>
          </div>
        </div>

        {registeredUsers.length > 0 && (
          <div>
            <h3>Funcionários cadastrados:</h3>
            {registeredUsers.map((u) => (
              <UserCard key={u.id}>
                <strong>{u.name}</strong> — {u.admin ? "Admin" : "Usuário"}
                <br />
                <small>{u.email}</small>
                <Button onClick={() => handleDelete(u.id!)}>
                  Deletar
                </Button>
              </UserCard>
            ))}
          </div>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default UserRegistrationModal;
