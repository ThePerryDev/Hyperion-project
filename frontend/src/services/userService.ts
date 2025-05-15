import { User } from "../types/User";
import api from "./api";

class UsersService {
  async get(): Promise<User[]> {
    const { data } = await api.get("/usuarios/getall");
    return data;
  }

  async post(props: {
    name: string;
    email: string;
    password: string;
    isLogged: boolean;
    admin: boolean;
  }): Promise<any> {
    const { data } = await api.post("/usuarios/post", props);
    console.log(data)
    return data;
  }

async put(props: {
  id: string;
  name: string;
  email: string;
  password: string;
  isLogged: boolean;
  admin: boolean;
}): Promise<any> {
  const { id, ...rest } = props;
  const { data } = await api.put(`/usuarios/put/${id}`, {
    name: rest.name,
    email: rest.email,
    password: rest.password,
    admin: rest.admin,
    isLogged: rest.isLogged
  });
  return data;
}


  async listById(id: string) {
    const { data } = await api.get(`/usuarios/get/${id}`);
    return data;
  }

  async delete(id: string) {
    const { data } = await api.delete(`/usuarios/delete/${id}`);
    return data
  }
}

const service = new UsersService();
export default service;