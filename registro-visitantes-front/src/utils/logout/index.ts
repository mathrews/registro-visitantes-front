export const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("isLogged");
};
