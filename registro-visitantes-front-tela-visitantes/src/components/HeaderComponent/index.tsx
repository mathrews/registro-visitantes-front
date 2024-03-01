import { NavLink, useNavigate } from "react-router-dom";
import brasao from "../../assets/brasao-do-ceara.png";
import "./index.css";

const HeaderComponent = () => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("isLogged");
        return navigate("/");
    };
    return (
        <>
            <header className="bg-green-300 flex p-4 justify-content-between align-items-center">
                <div>
                    <h1 className="text-white">Museu da Arte</h1>
                    {localStorage.getItem("isLogged") == "true" ? (
                        <nav className="navigator">
                            <ul className="flex gap-3">
                                <li>
                                    <NavLink to="/visitantes">
                                        Visitantes
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin">admin</NavLink>
                                </li>
                            </ul>
                        </nav>
                    ) : (
                        ""
                    )}
                </div>
                <div className="flex gap-4">
                    {localStorage.getItem("isLogged") == "true" ? (
                        <a
                            className="text-white hover:text-600 transition-duration-200 cursor-pointer flex justify-content-center align-items-center gap-1"
                            onClick={logout}
                        >
                            Logout
                            <i
                                className="pi pi-sign-out"
                                style={{ fontSize: "1rem" }}
                            ></i>
                        </a>
                    ) : (
                        ""
                    )}
                    <img
                        className="h-7rem w-5rem"
                        src={brasao}
                        alt="Brasão estado do Ceará"
                    />
                </div>
            </header>
        </>
    );
};

export default HeaderComponent;
