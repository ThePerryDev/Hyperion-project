import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import bgImage from "../assets/img/login_background.png";
import user_icon from "../assets/img/user_login_icon.png";
import password_icon from "../assets/img/password_login_icon.png";
import hyperio_logo from "../assets/img/hyperion_login_logo.png";
import { breakpoints } from "../styles/brekpoints";

const LoginSld = styled.main`
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
      width: 500px;
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
      padding: 6px 16px;
      cursor: pointer;
    }

    & #navigate {
      color: white;
      font-family: "Jost", sans-serif;
    }

    /* Tablet */
    @media (max-width: ${breakpoints.tablet}) {
      padding: 20px 30px;
      gap: 20px;

      & #hyperion-logo {
        width: 385px;
      }

      & h1 {
        font-size: larger;
      }
    }

    /* Celular */
    @media (max-width: ${breakpoints.mobile}) {
      padding: 20px 15px;
      gap: 15px;

      & #hyperion-logo {
        width: 300px;
      }

      & h1 {
        font-size: medium;
      }

      & button {
        padding: 4px 12px;
      }
    }

    /* Mini celulares  */
    @media (max-width: ${breakpoints.mini}) {
      padding: 15px 10px;
      gap: 12px;

      & #hyperion-logo {
        width: 250px;
      }

      & h1 {
        font-size: small;
      }

      & button {
        padding: 3px 10px;
        font-size: 14px;
      }

      & #navigate {
        font-size: 14px;
      }
    }
  }
`;

const InputSld = styled.div`
  display: flex;
  background-color: white;
  border: none;
  border-radius: 70px;
  gap: 12px;
  padding: 6px 12px;
  width: 100%;
  max-width: 300px;

  & img {
    width: 20px;
    height: 20px;
  }

  & input {
    border: none;
    outline: none;
    font-size: 16px;
    width: 100%;
  }

  /* Tablet */
  @media (max-width: ${breakpoints.tablet}) {
    padding: 5px 10px;
    max-width: 260px;

    & img {
      width: 18px;
      height: 18px;
    }

    & input {
      font-size: 15px;
    }
  }

  /* Celular */
  @media (max-width: ${breakpoints.mobile}) {
    padding: 4px 8px;
    max-width: 220px;

    & img {
      width: 16px;
      height: 16px;
    }

    & input {
      font-size: 14px;
    }
  }

  /* Mini celulares */
  @media (max-width: ${breakpoints.mini}) {
    padding: 3px 6px;
    max-width: 190px;

    & img {
      width: 14px;
      height: 14px;
    }

    & input {
      font-size: 13px;
    }
  }
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <LoginSld>
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

        <button> ENTRAR</button>
        <Link id="navigate" to="/register">
          Registre-se
        </Link>
      </form>
    </LoginSld>
  );
}
