import { hyperionLogoBanner } from "../../assets";
import { Header } from "./styles";

export default function Home() {
  return (
    <Header>
      <img alt="HyperionLogo" src={hyperionLogoBanner} />
    </Header>
  );
}
