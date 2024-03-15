import { useMutation } from "react-query";
import { API } from "../service";
import { logout } from "../utils/logout";

const config = {
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
};

type visita = {
    visitante_id: number;
    data: string;
};

type formData = {
    cpf?: string;
    nome?: string;
    dataNascimento?: string;
    profissao?: string;
    endereco?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    cep?: string;
    genero_id?: number;
};

export const useVisitaCreate = () => {
    return useMutation(async (data: visita) => {
        const visitaResponse = await API.post("/visita", data, config);
        if (visitaResponse.data == "Token expirado!") {
            logout();
            window.location.reload();
        } else {
            return visitaResponse.data;
        }
    });
};

export const useVisitanteCreate = () => {
    return useMutation(async (data: formData) => {
        const response = await API.post("/visitante", data, config);
        if (response.data == "Token expirado!") {
            logout();
            window.location.reload();
        } else {
            return response.data;
        }
    });
};

export const useVisitantePut = () => {
}
