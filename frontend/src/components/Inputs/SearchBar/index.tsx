import { Icon } from "./styles";
import { InputCustom, InputWrapper } from "../..";
import { searchIcon } from "../../../assets";

export default function SearchBar(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <InputWrapper>
      <InputCustom {...props} />
      <Icon alt="Buscar" src={searchIcon} />
    </InputWrapper>
  );
}
