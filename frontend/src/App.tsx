import "./index.css";
import styled, { createGlobalStyle } from "styled-components";
import CustomHeader from "./components/CustomHeader";
import RoutesApp from "./routes";
import NavigationBar from "./components/NavBar";
import { BBoxProvider } from "./context/BBoxContext";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Login } from "./pages";

const Content = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    @import url("https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;700&display=swap");
    font-family: "Jost", sans-serif;
  }

  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
`;

function App() {
  const auth = useContext(AuthContext);

  return (
    <main>
      {!auth.user ? (
        <Login />
      ) : (
        <BBoxProvider>
          <div>
            <GlobalStyle />
            <CustomHeader />
            <Content>
              <RoutesApp />
              <NavigationBar />
            </Content>
          </div>
        </BBoxProvider>
      )}
    </main>
  );
}

export default App;