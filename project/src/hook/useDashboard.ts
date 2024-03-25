import { useQuery } from "react-query";
import { API } from "../service";

export const useVisitantesGet = () => {
  return useQuery(['get-visitantes'], async () => {
    const requestQuantosPorUF = await API.get("/visitante/", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return requestQuantosPorUF.data;
  })
}

export const useVisitantesPorGenGet = () => {
  return useQuery(['get-visitantes-genero'], async () => {
    const requestVisitantesPorGen = await API.get("/genero/", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return requestVisitantesPorGen.data;
  })
}

export const useVisitasDashboardGet = () => {
  return useQuery(['get-visita'], async () => {
    const requestVisita = await API.get("/visita/", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return requestVisita.data;
  })
}
