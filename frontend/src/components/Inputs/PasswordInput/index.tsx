import { useState } from "react";
import { EyeButton, InputUser } from "./styles";
import { InputWrapper } from "../..";
import { eyeCloseIcon, eyeOpenIcon } from "../../../assets";

type PasswordInputWithToggleProps = {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  value: string;
};

export default function PasswordInput({
  value,
  onChange,
  readOnly = false,
}: PasswordInputWithToggleProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <InputWrapper>
      <InputUser
        onChange={onChange}
        readOnly={readOnly}
        type={showPassword ? "text" : "password"}
        value={value}
      />
      <EyeButton type="button" onClick={togglePasswordVisibility}>
        <img
          alt={showPassword ? "Esconder senha" : "Mostrar senha"}
          src={showPassword ? eyeOpenIcon : eyeCloseIcon}
        />
      </EyeButton>
    </InputWrapper>
  );
}
