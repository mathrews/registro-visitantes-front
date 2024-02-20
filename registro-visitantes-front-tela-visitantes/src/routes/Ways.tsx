import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PageVisitantes from "../pages/public/PageVisitantes";
import PublicLayout from "../layouts/PublicLayout";
import PageLogin from "../pages/public/PageLogin";
import PageAdmin from "../pages/auth/PageAdmin";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Page404 from "../pages/public/Page404";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProtectedRoute = ({ children }: any) => {
    const { isLogged } = useContext(AuthContext);
    return isLogged ? children : <Navigate to={"/login"} />;
};

const Ways = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<PublicLayout />}>
                        <Route index element={<PageVisitantes />} />
                        <Route path="/login" element={<PageLogin />} />
                        <Route path="/admin" element={<ProtectedRoute>
                          <PageAdmin/>
                        </ProtectedRoute>} />
                        <Route path="*" element={<Page404/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default Ways;
