import { Outlet } from "react-router-dom";
import HeaderComponent from "../../components/HeaderComponent";

const PublicLayout = () => {
    return (
        <>
            <HeaderComponent/>
            <Outlet />
        </>
    );
};

export default PublicLayout;
