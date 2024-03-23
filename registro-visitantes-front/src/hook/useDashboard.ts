import { useQuery } from "react-query";
import { API } from "../service";

const config = {
  headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
};

export const useVisitantesGet = () => {
  return useQuery(['get-visitantes', async () => {
    const requestQuantosPorUF = await API.get("/visitante", config);
    return requestQuantosPorUF.data;
  }])
} 
