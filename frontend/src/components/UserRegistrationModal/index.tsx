import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface Props {
  onClose: () => void;
}

interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  admin: boolean;
}

const API_URL = `${process.env.REACT_APP_API_URL}/usuarios`;

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

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
`;

const UserRegistrationModal: React.FC<Props> = ({ onClose }) => {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    password: "",
    admin: false,
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: name === "admin" ? value === "true" : value,
    }));
  };

  const handleSubmit = async () => {
    if (!user.name || !user.email || !user.password) {
      alert("Preencha todos os campos!");
      return;
    }

    const token = localStorage.getItem("authToken");
    const { name, email, password, admin } = user;

    try {
      const response = await fetch(`${API_URL}/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password, admin }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário");
      }

      const newUser = await response.json();
      setRegisteredUsers([...registeredUsers, newUser]);
      alert("Usuário cadastrado com sucesso!");
      setUser({ name: "", email: "", password: "", admin: false });
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar usuário");
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${API_URL}/getall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <ModalOverlay>
      <ModalContent>
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
            value={user.admin.toString()}
            onChange={handleChange}
          >
            <option value="false">Usuário</option>
            <option value="true">Admin</option>
          </Select>
        </div>
        <div>
          <Button onClick={handleSubmit}>Cadastrar</Button>
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

export default UserRegistrationModal;
