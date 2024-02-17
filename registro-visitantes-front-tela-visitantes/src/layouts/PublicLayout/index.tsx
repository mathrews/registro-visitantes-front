import { Outlet } from "react-router-dom";
import brasao from "../../assets/brasao-do-ceara.png";


const PublicLayout = () => {
    return (
        <>
            <header className="bg-green-300 flex p-4 justify-content-between align-items-center">
                <h1 className="text-white">Museu da Arte</h1>
                <div className="w-4rem">
                    <img
                        className="w-full"
                        src={brasao}
                        alt="Brasão estado do Ceará"
                    />
                </div>
            </header>
            <Outlet />
        </>
    );
};

export default PublicLayout;
