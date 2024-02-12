import Ways from "./routes/Ways"
import { PrimeReactProvider } from 'primereact/api';
import "primeflex/primeflex.css";

function App() {

  return (
    <>
      <PrimeReactProvider>
        <Ways />
      </PrimeReactProvider>
    </>
  )
}

export default App