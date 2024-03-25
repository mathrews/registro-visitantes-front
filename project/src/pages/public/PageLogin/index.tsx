import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import RequiredLabel from "../../../components/RequiredLabel";
import { useLoginCreate } from "../../../hook/useLogin";

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

    const userLogin = useLoginCreate();

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setIsLogged, setToken } = useContext(AuthContext);
    const [erroLogin, setErroLogin] = useState<boolean>(false);
    const onSubmit = (data: user) => {
        setIsLoading(true);
        userLogin.mutateAsync(data, {
            onSuccess: (response) => {
                if (response.type == "sucesso") {
                    const { token } = response;
                    setErroLogin(false);
                    setToken(token);
                    setIsLogged(true);

                    sessionStorage.setItem("token", token);
                    sessionStorage.setItem("isLogged", "true");
                    setIsLoading(false);

                    navigate("/visitantes");
                } else {
                    setErroLogin(true);
                    sessionStorage.removeItem("token");
                    setIsLoading(false);
                    return response.message
                }
            },
            onError: (response) => {
                console.log(response);
            },
        });
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
                        <label htmlFor="login">
                            Usuário <RequiredLabel />
                        </label>
                        <InputText
                            className="border-2 border-500 border-round-md p-2 text-900"
                            placeholder="Digite seu nome de usuário"
                            {...loginData("login")}
                        />
                    </section>

                    <section className="flex flex-column mb-3">
                        <label htmlFor="senha">
                            Senha <RequiredLabel />
                        </label>
                        <InputText
                            className="border-2 border-500 border-round-md p-2 text-900"
                            placeholder="Digite sua senha. Ela deve conter entre 8 a 12 caracteres"
                            type="password"
                            {...loginData("senha")}
                        />
                        <p className="text-900"></p>
                        <h4 className="block text-center mb-1 text-red-400">
                            {erroLogin ? "Login ou senha inválidos!" : ""}
                        </h4>
                    </section>
                    {isLoading == false ? (
                        <Button
                            type="submit"
                            className="w-full mt-3 border-round-md h-2rem bg-green-500 font-bold flex justify-content-center align-items-center"
                        >
                            Enviar
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            className="w-full mt-3 border-round-md h-2rem bg-green-500 font-bold flex justify-content-center align-items-center"
                            disabled
                        >
                            <i
                                className="pi pi-spin pi-spinner"
                                style={{ fontSize: "1rem" }}
                            ></i>
                        </Button>
                    )}
                </form>
            </main>
        </>
    );
};

export default PageLogin;
