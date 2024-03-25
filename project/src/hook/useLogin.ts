import { useMutation } from "react-query"
import { API } from "../service";

type user = {
    login: string;
    senha: string;
};

export const useLoginCreate = () => {
    return useMutation(async (data: user) => {
        const response = await API({
            method: "post",
            url: "/usuario/login",
            data: data,
        });
        return response.data;
    })
}