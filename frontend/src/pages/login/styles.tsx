import styled from "styled-components";
import bgImage from "../../assets/img/login_background.png"
import { breakpoints } from "../../styles/brekpoints";

export const LoginSld = styled.main`
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

export const InputSld = styled.div`
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
