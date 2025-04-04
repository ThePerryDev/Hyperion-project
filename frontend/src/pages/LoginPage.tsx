import { useState } from "react";
// import { useContext } from "react";
// import { AuthContext } from "../../contexts/Auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import loginBackground from "../assets/img/hyperion_login_logo.png";
import user_icon from "../assets/img/user_login_icon.png";
import password_icon from "../assets/img/password_login_icon.png";
import hyperio_logo from "../assets/img/hyperion_login_logo.png";

const LoginSld = styled.main`
  @import url("https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;700&display=swap");

  background-image: url(../assets/img/hyperion_login_logo.png);
  & div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 8px 15px;

    border: solid 2px #ff5000;
    border-radius: 30px;
    background-color: #00000055 & img {
      width: 300px;
      height: auto;
    }

    & h1 {
      color: white;
      font-size: x-large;
      font-family: "Jost", sans-serif;
    }

    & button {
      border: solid 2px #ff5000;
      border-radius: 30px;
      background-color: #222223;
      color: white;
      font-family: "Jost", sans-serif;
      padding: 3px 12px;
    }
  }
`;

const InputSld = styled.div`
  display: flex;
  background-color: white;
  border: none;
  border-radius: 70px;
  gap: 12px;
  padding: 4px 8px; 
  & img {
    width: 15px;
    height: 15px;
  }
  & input {
    border: none;
  }
`;

export default function Login() {
  //   const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //   const handleLogin = async () => {
  //     // verifica se email e senha estão preeenchidos e manda para o contexto email e senha
  //     if (email && password) {
  //       const isLogged = await auth.signin(email, password);
  //       if (isLogged) {
  //         navigate("/");
  //       } else {
  //         alert("Falha ao logar");
  //       }
  //     }
  //   };

  return (
    <LoginSld>
      <div>
        <img src={hyperio_logo} alt="Hyperion login logo" />
        <h1>LOGIN</h1>
        <InputSld>
          <img src={user_icon} alt="" />
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </InputSld>
        <img src={password_icon} alt="" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
        />
        <InputSld></InputSld>

        {/* <button onClick={handleLogin}>ENTRAR</button> */}
        <Link to="/register">REGISTRE-SE</Link>
      </div>
    </LoginSld>
  );
}
