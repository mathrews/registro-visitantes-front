import { Link } from "react-router-dom"

const Page404 = () => {
  return (
    <>
        <div className="p-4">
            <h1>Página não encontrada</h1>
            <Link to={"/"}>Retornar para a página principal</Link>
        </div>
    </>
  )
}

export default Page404