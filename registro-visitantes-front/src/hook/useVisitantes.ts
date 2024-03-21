import { useMutation } from "react-query";
import { API } from "../service";

const config = {
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
};

type visita = {
    visitante_id: number;
    data: string;
};

type formData = {
    id?: number;
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
        const response = await API.post("/visita", data, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        console.log(response.data);
        return response.data;
    });
};

export const useVisitanteCreate = () => {
    return useMutation(async (data: formData) => {
        const response = await API.post("/visitante", data, config);
        console.log(response.data);
        return response.data;
    });
};

export const useVisitantePut = () => {
    return useMutation(async (formData: formData) => {
        const response = await API.put(`/visitante/${formData?.id}`, formData, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        console.log(response.data);
        return response.data;
    });
};
