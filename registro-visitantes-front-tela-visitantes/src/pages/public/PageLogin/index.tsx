import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup
    .object({
        user: yup.string().required(),
        password: yup.string().required(),
    })
    .required();

const PageLogin = () => {
    const { register: loginData, handleSubmit } = useForm({
        defaultValues: {
            user: "",
            password: "",
        },
        resolver: yupResolver(schema),
    });
    const onSubmit = (data: object) => console.log(data);

    return (
        <>
            <main className="surface-500 w-full h-screen flex justify-content-center align-items-center">
                <form
                    className="w-4 p-5 bg-white border-round-md"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h1 className="block text-center text-3xl mb-3">Login</h1>
                    <section className="flex flex-column mb-3">
                        <label htmlFor="user">Usuário</label>
                        <InputText
                            className="border-2 border-500 border-round-md p-2 text-900"
                            placeholder="Digite seu nome de usuário"
                            {...loginData("user")}
                        />
                    </section>

                    <section className="flex flex-column mb-3">
                        <label htmlFor="password">Senha</label>
                        <InputText
                            className="border-2 border-500 border-round-md p-2 text-900"
                            placeholder="Digite sua senha. Ela deve conter entre 8 a 12 caracteres"
                            {...loginData("password")}
                        />
                        <p className="text-900"></p>
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
