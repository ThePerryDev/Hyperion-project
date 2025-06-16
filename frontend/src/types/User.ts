export type User = {
    user: string | undefined;
    id: string;
    name: string;
    email: string;
    password: string;
    isLogged: boolean;
    admin: boolean;
    token: string;
}