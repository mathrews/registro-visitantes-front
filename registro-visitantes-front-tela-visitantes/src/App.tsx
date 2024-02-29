import Ways from "./routes/Ways";
import { PrimeReactProvider } from "primereact/api";
import "primeflex/primeflex.css";
import { AuthContext } from "./contexts/AuthContext";
import { useState } from "react";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./service";

function App() {
    const [isLogged, setIsLogged] = useState<boolean>(true);
    const [token, setToken] = useState<string>();
    

    return (
        <>
            <QueryClientProvider client={queryClient}>
                <PrimeReactProvider>
                    <AuthContext.Provider value={{ isLogged, setIsLogged, token, setToken }}>
                        <Ways />
                    </AuthContext.Provider>
                </PrimeReactProvider>
            </QueryClientProvider>
        </>
    );
}

export default App;
