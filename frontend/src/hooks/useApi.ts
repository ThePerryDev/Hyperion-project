import service from '../services/userService';
import { User } from '../types/User';
import { Search } from '../utils/SeacrchMethods';

export const useApi = ()=> ({
    validateUser: async (name: string) => {
        const user = await getUser(name);
        let response;
    
        if (user) {
          response = user.isLogged === true ? user : null;
        }
    
        return response;
      },
    
    signin: async (email: string, password: string) => {
        let user = await getUser(email);
        if (user && user.password === password) {
          const id = user.id;
          const name = user.name;
          const email = user.email;
          const password = user.password;
          const isLogged = true;
          return await service.put({ id, name, email, password, isLogged});
        }
        return null
      },

    logout: async (email: string) => {
        let user = await getUser(email);
        if (user) {
          const id = user.id;
          const email = user.email;
          const name = user.name;
          const password = user.password;
          const isLogged = false;
          await service.put({ id, name, email, password, isLogged });
        }
        
      }
});

let users: User[] = [];

async function getUsers() {
  try {
    const data = await service.get();
    users = data;
  } catch (error) {
    console.log(error);
  }
}

async function getUserPosition(email: string) {
  await getUsers();
  /* Cria lista de emails dos usuários*/
  let mailList: string[] = [];

  /* Se usuários existem, popula a lista de email dos usuários */
  if (users.length > 0) {
    users?.map((user) => mailList.push(user.email));
  }

  let s_number = new Search<number>();

  console.log(users)
  return s_number.sequential_ws(email, mailList);
}

async function getUser(email: string) {
  let position = await getUserPosition(email);

  /* Se o nome ainda não estiver no banco de dados, ele então é cadastrado */
  if (position === -1) {
    console.log("Usuário não cadastrado!");
    return null;
  }
  return users[position];
}