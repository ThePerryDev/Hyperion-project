import styled from "styled-components";

const Select = styled.select`
  appearance: none;
  background-color: #d9d9d9;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23666' stroke-width='2' fill='none' fill-rule='evenodd'/%3E%3C/svg%3E");
  background-position: right 16px center;
  background-repeat: no-repeat;
  background-size: 12px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 18px;
  height: 40px;
  padding: 8px 16px;
  width: 100%;
`;

interface SelectCustomProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export default function SelectCustom({
  children,
  ...props
}: SelectCustomProps) {
  return <Select {...props}>{children}</Select>;
}
