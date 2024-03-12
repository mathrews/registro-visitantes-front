import { useQuery } from "react-query";
import { API } from "../service";

const config = {
    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
};

export const useVisitantes = () => {
    return useQuery(["get-users"], async () => {
        const response = await API.get(
            `/visitante/`,
            config
        );
        return response.data
    });
};
