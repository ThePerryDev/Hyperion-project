import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import bgImage from "../assets/img/login_background.png";
import user_icon from "../assets/img/user_login_icon.png";
import password_icon from "../assets/img/password_login_icon.png";
import hyperio_logo from "../assets/img/hyperion_login_logo.png";

const RegisterSld = styled.main`

  height: 100%;
  background-image: url(${bgImage});
  background-color: black;
  background-repeat: no-repeat;
  background-size: cover; 
  background-position: center;

  display: flex;
  justify-content: center;
  align-items: center;

  & form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px 50px;
    gap: 30px;

    border: solid 2px #ff5000;
    border-radius: 30px;
    background-color: #00000071;

    & #hyperion-logo {
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
      cursor: pointer;
    }

    & #navigate {
      color: white;
      font-family: "Jost", sans-serif;
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <RegisterSld>
      <form>
        <img id="hyperion-logo" src={hyperio_logo} alt="Hyperion login logo" />

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

        <InputSld>
          <img src={password_icon} alt="" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
          />
        </InputSld>

        <button>REGISTRE-SE</button>
        <Link id="navigate" to="/register">
          Registre-se
        </Link>
      </form>
    </RegisterSld>
  );
}
