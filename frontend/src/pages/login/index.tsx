import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginSld, InputSld } from "./styles";
import { hyperio_logo, user_icon, password_icon } from "../../assets";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

   const handleLogin = async (e: React.FormEvent) => {
     e.preventDefault();
    // verifica se email e senha estão preeenchidos e manda para o contexto email e senha
    if (email && password) {
      const isLogged = await auth.signin(email, password);
      if (isLogged) {
        navigate("/");
      } else {
        alert("Falha ao logar");
      }
    }
  };

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

        <button onClick={handleLogin}> ENTRAR</button>

        <Link id="navigate" to="/registro">
          Registre-se
        </Link>
      </form>
    </LoginSld>
  );
}
