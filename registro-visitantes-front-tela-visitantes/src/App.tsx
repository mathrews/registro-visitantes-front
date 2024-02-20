import Ways from "./routes/Ways"
import { PrimeReactProvider } from 'primereact/api';
import "primeflex/primeflex.css";
import { AuthContext } from "./contexts/AuthContext";
import { useState } from "react";

function App() {
  const [isLogged, setIsLogged] = useState<boolean>(true)

  return (
    <>
      <PrimeReactProvider>
        <AuthContext.Provider value={{ isLogged, setIsLogged }}>
          <Ways />
        </AuthContext.Provider>
      </PrimeReactProvider>
    </>
  )
}

export default App