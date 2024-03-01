import { createContext } from "react";

// type UserType = {
//     name: string;
//     password: string;
// };

//Tipando as Props do contexto
type PropsUserContext = {
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
    isLogged: boolean;
    setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
};

//Valor default do contexto
const DEFAULT_VALUE = {
    token: "",
    setToken: () => {},
    isLogged: false,
    setIsLogged: () => {},
};

export const AuthContext = createContext<PropsUserContext>(DEFAULT_VALUE);
