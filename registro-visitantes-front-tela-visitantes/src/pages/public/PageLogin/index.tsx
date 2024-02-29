import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { API } from "../../../service";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const schema = yup
    .object({
        login: yup.string().required(),
        senha: yup.string().required(),
    })
    .required();

const PageLogin = () => {
    const { register: loginData, handleSubmit } = useForm({
        defaultValues: {
            login: "",
            senha: "",
        },
        resolver: yupResolver(schema),
    });

    // const config = {
    //     headers: { Authorization: `Bearer ${token}` },
    // };
    
    const navigate = useNavigate();
    const { setIsLogged, setToken, isLogged, token } = useContext(AuthContext);
    const [erroLogin, setErroLogin]  = useState<boolean>(false);
    const onSubmit = async (data: object) => {
        console.log(data);
        const response = (
            await API({
                method: "post",
                url: "/usuario/login",
                data: data,
            })
        ).data;
        console.log(response);
        if (response.type == "warning") {
            setErroLogin(true);
            return response.message;
        } else if (response.type == "sucesso") {
            setErroLogin(false);
            setIsLogged(true);
            setToken(response.token);
            console.log(token);
            return navigate("/visitantes")
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
                        label="Enviar"
                        type="submit"
                        className="w-full mt-3 border-round-md h-2rem bg-green-500 font-bold"
                    ></Button>
                </form>
            </main>
        </>
    );
};

export default PageLogin;
