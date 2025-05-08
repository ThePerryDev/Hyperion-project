import React, { useState } from "react";
import styled from "styled-components";

interface Props {
  onClose: () => void;
}

interface User {
<<<<<<< Updated upstream
  name: string;
=======
  id_usuario?: number;
  nome: string;
>>>>>>> Stashed changes
  email: string;
  password: string;
  role: string;
}

<<<<<<< Updated upstream
=======
const API_URL = 'http://localhost:8000/api/v1/usuarios';

>>>>>>> Stashed changes
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

const UserRegistrationModal: React.FC<Props> = ({ onClose }) => {
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!user.name || !user.email || !user.password || !user.role) {
      alert("Preencha todos os campos!");
      return;
    }

    setRegisteredUsers([...registeredUsers, user]);
    console.log("Mock enviado:", user);

<<<<<<< Updated upstream
    // Limpa campos
    setUser({ name: "", email: "", password: "", role: "" });
=======
      if (!response.ok) {
        throw new Error('Erro ao cadastrar usuário');
      }

      const newUser = await response.json();
      setRegisteredUsers([...registeredUsers, newUser]);
      alert('Usuário cadastrado com sucesso!');

      setUser({ nome: '', email: '', senha: '', admin: false });
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar usuário');
    }
>>>>>>> Stashed changes
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Cadastrar Funcionário</h2>
        <Input name="name" placeholder="Nome" value={user.name} onChange={handleChange} />
        <Input name="email" placeholder="Email" value={user.email} onChange={handleChange} />
        <Input name="password" placeholder="Senha" type="password" value={user.password} onChange={handleChange} />
        <Input name="role" placeholder="Função" value={user.role} onChange={handleChange} />
        <div>
<<<<<<< Updated upstream
          <Button onClick={handleSubmit}>Cadastrar</Button>
          <Button onClick={onClose}>Fechar</Button>
        </div>


    {/*Essa parte debaixo é só para testar se estava cadastrando (e está) */}
        {registeredUsers.length > 0 && (
          <div>
            <h3>Funcionários cadastrados:</h3>
            {registeredUsers.map((u, index) => (
              <UserCard key={index}>
                <strong>{u.name}</strong> — {u.role}<br />
                <small>{u.email}</small>
              </UserCard>
            ))}
          </div>
        )}
=======
          <h2>Cadastrar Funcionário</h2>
          <Input
            name="nome"
            placeholder="Nome"
            value={user.nome}
            onChange={handleChange}
          />
          <Input
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
          />
          <Input
            name="senha"
            placeholder="Senha"
            type="password"
            value={user.senha}
            onChange={handleChange}
          />
          <div>
            <label>Função:</label>
            <Select
              name="admin"
              value={user.admin ? 'admin' : 'usuario'}
              onChange={(e) =>
                setUser({ ...user, admin: e.target.value === 'admin' })
              }
            >
              <option value="usuario">Outros</option>
              <option value="admin">Admin</option>
            </Select>
          </div>
          <div>
            <Button onClick={handleSubmit}>Cadastrar</Button>
            <Button onClick={onClose}>Fechar</Button>
          </div>
        </div>
>>>>>>> Stashed changes
      </ModalContent>
    </ModalOverlay>
  );
};

export default UserRegistrationModal;
