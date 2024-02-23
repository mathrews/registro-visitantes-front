import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useState } from "react";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
    name: yup.string().required().uppercase(),
    job: yup.string(),
    cpf: yup.string().required(),
    gender: yup.object().required(),
    age: yup.number().required(),
    city: yup.string().required(),
    block: yup.string().required()
  }).required()  

const PageVisitantes = () => {
    const [selectedGender, setSelectedGender] = useState("masculino");
    const genders = [
        {
            gender: "masculino",
            code: "M",
        },
        {
            gender: "feminino",
            code: "F",
        },
        {
            gender: "outros",
            code: "O",
        },
    ];
    const {
        register: createData,
        handleSubmit,
        setValue: createValue,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            job: "",
            cpf: "",
            gender: selectedGender,
            age: 10,
            city: "",
            block: "",
        },
    });
    const onSubmit = (data: object) => {
        console.log(errors.name?.message);
        console.log(errors.job?.message);
        console.log(errors.cpf?.message);
        console.log(errors.gender?.message);
        console.log(errors.age?.message);
        console.log(errors.city?.message);
        console.log(errors.block?.message);
        console.log(data)
    };

    return (
        <>
            <main className="surface-500 w-full h-screen flex justify-content-center align-items-center">
                <form
                    className="p-5 bg-white border-round-md"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h1 className="block text-center text-3xl mb-3">
                        Seja bem-vindo(a) visitante
                    </h1>

                    <section className="flex flex-column">
                        <label htmlFor="name">Nome do(a) visitante</label>
                        <InputText
                            className="border-2 border-500 border-round-md p-2 text-900"
                            placeholder="Nome"
                            {...createData("name")}
                        />
                    </section>

                    <section className="flex flex-column">
                        <label htmlFor="cpf">CPF</label>
                        <InputMask
                            className="border-2 border-500 border-round-md p-2 text-900"
                            id="cpf"
                            placeholder="000.000.000-00"
                            mask="999.999.999-99"
                            {...createData("cpf")}
                        />
                    </section>

                    <section className="flex flex-column">
                        <label htmlFor="job">Profissão</label>
                        <InputText
                            className="border-2 border-500 border-round-md p-2 text-900"
                            placeholder="Sua Profissão, caso esteja empregado"
                            {...createData("job")}
                        />
                    </section>

                    <section className="flex justify-content-center gap-4">
                        <div>
                            <section className="flex flex-column">
                                <label htmlFor="gender">Gênero</label>
                                <Dropdown
                                    value={selectedGender}
                                    onChange={(e) => {
                                        setSelectedGender(e.target.value);
                                        createValue("gender", e.target.value);
                                    }}
                                    options={genders}
                                    optionLabel="gender"
                                    placeholder="Selecione um Gênero"
                                    className="w-full md:w-14rem border-2 h-3rem border-500 border-round-md p-2 flex justify-content-center align-items-center mb-3 text-900"
                                />
                            </section>
                            <section className="flex flex-column">
                                <label htmlFor="age">Idade</label>
                                <InputText
                                    className="focus:border-transparent h-3rem border-2 border-500 border-round-md p-2 mb-2 text-900"
                                    {...createData("age")}
                                    min={1}
                                />
                            </section>
                        </div>

                        <div>
                            <section className="flex flex-column">
                                <label htmlFor="city">Cidade</label>
                                <Dropdown
                                    onChange={(e) =>
                                        createValue("city", e.target.value)
                                    }
                                    optionLabel="city"
                                    placeholder="Selecione uma Cidade"
                                    className="w-full md:w-14rem border-2 h-3rem border-500 border-round-md p-2 flex justify-content-center align-items-center mb-3 text-900"
                                    pt={{
                                        root: {
                                            className: "w-full md:w-14rem",
                                        },
                                        item: {
                                            className:
                                                "bg-white p-2 text-sm text-600 transition-duration-200 hover:text-900",
                                        },
                                        list: {
                                            className:
                                                "border-200 border-3 border-round-lg bg-white",
                                        },
                                    }}
                                />
                            </section>
                            <section className="flex flex-column">
                                <label htmlFor="block">Bairro</label>
                                <Dropdown
                                    onChange={(e) =>
                                        createValue("block", e.target.value)
                                    }
                                    optionLabel="bairro"
                                    placeholder="Selecione um Bairro"
                                    className="w-full md:w-14rem border-2 h-3rem border-500 border-round-md p-2 flex justify-content-center align-items-center mb-3 text-900"
                                    pt={{
                                        root: {
                                            className: "w-full md:w-14rem",
                                        },
                                        item: {
                                            className:
                                                "bg-white p-2 text-sm text-600 transition-duration-200 hover:text-900",
                                        },
                                        list: {
                                            className:
                                                "border-200 border-3 border-round-lg bg-white",
                                        },
                                    }}
                                />
                            </section>
                        </div>
                    </section>
                    <Button
                        label="Enviar"
                        type="submit"
                        className="w-full mt-3 border-round-md h-2rem bg-green-500 font-bold transition-duration-200 hover:bg-green-700"
                    ></Button>
                </form>
            </main>
            <footer></footer>
        </>
    );
};

export default PageVisitantes;
