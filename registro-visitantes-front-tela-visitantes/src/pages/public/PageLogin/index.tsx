import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { API } from "../../../service";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { hashMD5 } from "../../../utils/hashMD5";

const schema = yup
    .object({
        login: yup.string().required(),
        senha: yup.string().required(),
    })
    .required();

type user = {
    login: string;
    senha: string;
};

const PageLogin = () => {
    const { register: loginData, handleSubmit } = useForm({
        defaultValues: {
            login: "",
            senha: "",
        },
        resolver: yupResolver(schema),
    });

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setIsLogged, setToken } = useContext(AuthContext);
    const [erroLogin, setErroLogin] = useState<boolean>(false);
    const onSubmit = async (data: user) => {
        setIsLoading(true);
        try {
            const response = await API({
                method: "post",
                url: "/usuario/login",
                data: { ...data, senha: hashMD5(data.senha) },
            });

            const { token, type, message } = response.data;

            if (type === "warning") {
                setErroLogin(true);
                sessionStorage.removeItem("token");
                setIsLoading(false);
                return message;
            } else if (type === "sucesso") {
                setErroLogin(false);
                setToken(token);
                setIsLogged(true);

                sessionStorage.setItem("token", token);
                sessionStorage.setItem("isLogged", "true");
                setIsLoading(false);

                navigate("/visitantes");
            }
        } catch (error) {
            console.error("Erro ao realizar login:", error);
            // Trate o erro de acordo com suas necessidades
            return "Ocorreu um erro ao tentar fazer login.";
        }
    };

    return (
        <>
            <main className="surface-500 w-full h-screen flex justify-content-center align-items-center">
                <form
                    className="w-4 p-5 bg-white border-round-md"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h1 className="block text-center text-3xl mb-3">Login</h1>
                    <section className="flex flex-column mb-3">
                        <label htmlFor="login">Usuário</label>
                        <InputText
                            className="border-2 border-500 border-round-md p-2 text-900"
                            placeholder="Digite seu nome de usuário"
                            {...loginData("login")}
                        />
                    </section>

                    <section className="flex flex-column mb-3">
                        <label htmlFor="senha">Senha</label>
                        <InputText
                            className="border-2 border-500 border-round-md p-2 text-900"
                            placeholder="Digite sua senha. Ela deve conter entre 8 a 12 caracteres"
                            {...loginData("senha")}
                        />
                        <p className="text-900"></p>
                        <h4 className="block text-center mb-1 text-red-400">
                            {erroLogin ? "Login ou senha inválidos!" : ""}
                        </h4>
                    </section>

                    <Button
                        type="submit"
                        className="w-full mt-3 border-round-md h-2rem bg-green-500 font-bold flex justify-content-center align-items-center"
                    >
                        {isLoading == false ? (
                            "Enviar"
                        ) : (
                            <i
                                className="pi pi-spin pi-spinner"
                                style={{ fontSize: "1rem" }}
                            ></i>
                        )}
                    </Button>
                </form>
            </main>
        </>
    );
};

export default PageLogin;
