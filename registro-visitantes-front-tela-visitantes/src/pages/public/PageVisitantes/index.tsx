import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { API } from "../../../service";

const schema = yup
    .object({
        name: yup.string().required().uppercase(),
        job: yup.string(),
        cpf: yup.string().required(),
        cep: yup.string().required(),
        gender: yup.object().required(),
        age: yup.number().required(),
        city: yup.string().required(),
        block: yup.string(),
    })
    .required();

interface visitor {
    id: number;
    nome: string;
    cpf: string;
    dataNascimento: string;
    profissao: string;
    endereco: string;
    numero: number;
    complemento: number;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
    genero_id: number;
}

const PageVisitantes = () => {
    const [selectedGender, setSelectedGender] = useState<number>(0);
    const genders = [
        {
            gender: "masculino",
            value: 1,
        },
        {
            gender: "feminino",
            value: 2,
        },
        {
            gender: "outros",
            value: 3,
        },
    ];
    const {
        register: createData,
        handleSubmit,
        setValue: createValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            job: "",
            cep: "",
            cpf: "",
            gender: selectedGender,
            age: 0,
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
        console.log(data);
    };

    const [modal, setModal] = useState<boolean>(false);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [cpfValue, setCpfValue] = useState<string>("");
    const [visitorData, setVisitorData] = useState<visitor>();
    const searchCPF = async () => {
        const response = (
            await API.get(
                `visitante/cpf/${cpfValue
                    .replaceAll("-", "")
                    .replaceAll(".", "")}`
            )
        ).data;
        console.log(response);
        if (response[0]) {
            setSelectedGender(response[0].genero_id);
            setVisitorData(response[0]);
        }
        console.log(selectedGender);
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
                        <label htmlFor="cpf">CPF</label>
                        <InputMask
                            className="border-2 border-500 border-round-md p-2 text-900"
                            id="cpf"
                            placeholder="000.000.000-00"
                            mask="999.999.999-99"
                            {...createData("cpf")}
                            onBlur={(e) => setCpfValue(e.target.value)}
                        />
                        <Button
                            label="Pesquisar"
                            type="button"
                            className="w-full mt-1 mb-1 border-round-md h-2rem bg-green-500 font-bold transition-duration-200 hover:bg-green-700"
                            onClick={searchCPF}
                        ></Button>
                    </section>

                    <section className="flex flex-column mt-1">
                        <label htmlFor="name">Nome do(a) visitante</label>
                        <InputText
                            value={visitorData?.nome}
                            className="border-2 border-500 border-round-md p-2 text-900"
                            placeholder="Nome"
                            {...createData("name")}
                        />
                    </section>

                    <section className="flex flex-column mt-1">
                        <label htmlFor="job">Profissão</label>
                        <InputText
                            value={visitorData?.profissao}
                            className="border-2 border-500 border-round-md p-2 text-900"
                            placeholder="Sua Profissão, caso esteja empregado"
                            {...createData("job")}
                        />
                    </section>

                    <section className="flex flex-column mt-1">
                        <label htmlFor="cep">CEP</label>
                        <InputMask
                            value={visitorData?.cep}
                            className="border-2 border-500 border-round-md p-2 text-900"
                            placeholder="Digite seu CEP"
                            mask="99999-999"
                            {...createData("cep")}
                        />
                    </section>

                    <section className="flex justify-content-center gap-4 mt-1">
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
                                    optionValue="value"
                                    placeholder="Selecione um Gênero"
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
                                                "border-200 border-3 border-round-lg",
                                        },
                                    }}
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
                                <InputText
                                    value={visitorData?.cidade}
                                    {...createData("city")}
                                    placeholder="Digite sua Cidade"
                                    className="w-full md:w-14rem border-2 h-3rem border-500 border-round-md p-2 flex justify-content-center align-items-center mb-3 text-900"
                                />
                            </section>
                            <section className="flex flex-column">
                                <label htmlFor="block">Bairro</label>
                                <InputText
                                    value={visitorData?.bairro}
                                    {...createData("block")}
                                    placeholder="Digite seu bairro"
                                    className="w-full md:w-14rem border-2 h-3rem border-500 border-round-md p-2 flex justify-content-center align-items-center mb-3 text-900"
                                />
                            </section>
                        </div>
                    </section>
                    <Button
                        label="Enviar"
                        type="submit"
                        className="w-full mt-3 border-round-md h-2rem bg-green-500 font-bold transition-duration-200 hover:bg-green-700"
                        onClick={() => setModal(true)}
                    ></Button>
                </form>
                {modal && (
                    <Dialog
                        visible={modal}
                        style={{ width: "50vw" }}
                        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
                        onHide={() => setModal(false)}
                        pt={{
                            root: {
                                className: "bg-white p-6 border-round-lg",
                            },
                            mask: {
                                className: "bg-black-alpha-50",
                            },
                            closeButton: {
                                className: "w-1rem h-1rem",
                            },
                            closeButtonIcon: {
                                className: "w-1rem h-1rem",
                            },
                        }}
                    >
                        <h1 className="m-0">Cadastro concluído com sucesso!</h1>
                    </Dialog>
                )}
            </main>
            <footer></footer>
        </>
    );
};

export default PageVisitantes;
