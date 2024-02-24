import axios from "axios";
import { QueryClient } from "react-query";

// eslint-disable-next-line react-refresh/only-export-components
export const API = axios.create({
    baseURL: "https://registro-visitantes-backend.onrender.com"
});

// eslint-disable-next-line react-refresh/only-export-components
export const queryClient = new QueryClient();