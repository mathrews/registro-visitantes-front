import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PageVisitantes from "../pages/auth/PageVisitantes";
import PublicLayout from "../layouts/PublicLayout";
import PageLogin from "../pages/public/PageLogin";
import PageAdmin from "../pages/auth/PageAdmin";
import Page404 from "../pages/public/Page404";

const Ways = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ProtectedRoute = ({ children }: any) => {
        const isLogged = sessionStorage.getItem("isLogged");
        return isLogged == "true" ? children : <Navigate to={"/"} />;
    };

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<PublicLayout />}>
                        <Route index element={<PageLogin />} />
                        <Route
                            path="/visitantes"
                            element={
                                <ProtectedRoute>
                                    <PageVisitantes />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <PageAdmin />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="*" element={<Page404 />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default Ways;
