import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { API } from "../../../service";
import { validarCPF } from "../../../utils/validateCPF";

const schema = yup
    .object({
        name: yup.string().required().uppercase(),
        job: yup.string(),
        cpf: yup.string(),
        cep: yup.string().required(),
        gender: yup.number(),
        dataDeNascimento: yup.string(),
        city: yup.string().required(),
        block: yup.string(),
        endereco: yup.string(),
        numero: yup.string(),
        uf: yup.string(),
        complemento: yup.string(),
    })
    .required();

interface visitor {
    id: number;
    nome: string;
    cpf: string;
    dataNascimento: string;
    profissao: string;
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
    genero_id: number;
}

const PageVisitantes = () => {

    const [cpfValue, setCpfValue] = useState<string>("");

    const [modal, setModal] = useState<boolean>(false);

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

    const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };

    const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [visitorData, setVisitorData] = useState<visitor>();

    const {
        register: createData,
        handleSubmit,
        setValue: createValue,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            cpf: cpfValue,
            gender: selectedGender,
        },
    });

    const createDataPost = (data: object) => {
        setIsLoadingSubmit(true)
        const formData = { ...data, cpf: cpfValue };
        console.log(formData);
        setIsLoadingSubmit(false)
    };

    const [errorMessageCpf, setErrorMessageCpf] = useState<string>();
    const [showForm, setShowForm] = useState<boolean>(false);
    const [cpfExists, setCpfExists] = useState<boolean>(false);
    const searchCPF = async () => {
        if (validarCPF(cpfValue)) {
            setIsLoading(true);
            const response = (
                await API.get(
                    `visitante/cpf/${cpfValue
                        .replaceAll("-", "")
                        .replaceAll(".", "")}`,
                    config
                )
            ).data;
            if (!response[0]) {
                setShowForm(true);
                setIsLoading(false);
            } else {
                setShowForm(true);
                setCpfExists(true);
                if (response[0]) {
                    setSelectedGender(response[0].genero_id);
                    setVisitorData(response[0]);
                    setIsLoading(false);
                }
                setIsLoading(false);
            }
        } else {
            setErrorMessageCpf("Este CPF é invalido, tente novamente!");
            setIsLoading(false);
        }
    };
    
    const [updateData, setUpdateData] = useState<boolean>(false);

    useEffect(() => {
        if (visitorData) {
            createValue("name", visitorData.nome);
            createValue("job", visitorData.profissao);
            createValue("cep", visitorData.cep);
            createValue("gender", visitorData.genero_id);
            createValue("dataDeNascimento", visitorData.dataNascimento);
            createValue("city", visitorData.cidade);
            createValue("block", visitorData.bairro);
            createValue("complemento", visitorData.complemento);
            createValue("endereco", visitorData.endereco);
            createValue("uf", visitorData.uf);
            createValue("numero", visitorData.numero);
        }
    }, [visitorData, createValue]);

    return (
        <>
            <main className="surface-500 w-full p-6 flex justify-content-center align-items-center">
                <form
                    className="p-5 bg-white border-round-md"
                    onSubmit={handleSubmit(createDataPost)}
                >
                    <h1 className="block text-center text-3xl mb-3">
                        Seja bem-vindo(a) visitante!
                    </h1>
                    {!showForm ? (
                        <section className="flex flex-column">
                            <label htmlFor="cpf">CPF</label>
                            <InputMask
                                className="border-2 border-500 border-round-md p-2 text-900"
                                id="cpf"
                                placeholder="000.000.000-00"
                                mask="999.999.999-99"
                                onBlur={(e) => setCpfValue(e.target.value)}
                            />
                            <Button
                                type="button"
                                className="w-full mt-3 border-round-md h-2rem bg-green-500 font-bold transition-duration-200 hover:bg-green-700 flex justify-content-center align-items-center"
                                onClick={searchCPF}
                            >
                                {isLoading == false ? (
                                    "Pesquisar"
                                ) : (
                                    <i
                                        className="pi pi-spin pi-spinner"
                                        style={{ fontSize: "1rem" }}
                                    ></i>
                                )}
                            </Button>
                            <p className="block text-center mb-1">
                                Se você já estiver visitado o museu, o
                                formulário aprentará seus dados já previos,
                                porém se for a primeira vez, o formulário será
                                apresentado vazio
                            </p>
                            <h4 className="block text-center mb-1 text-red-400">
                                {errorMessageCpf ? errorMessageCpf : ""}
                            </h4>
                        </section>
                    ) : (
                        <>
                            {updateData == true || cpfExists == false ? (
                                <>
                                    <section className="flex flex-column">
                                        <label htmlFor="cpf">CPF</label>
                                        <InputText
                                            value={cpfValue}
                                            className="border-2 border-500 border-round-md p-2 text-900"
                                            id="cpf"
                                            placeholder="000.000.000-00"
                                            {...createData("cpf")}
                                            disabled
                                        />
                                    </section>

                                    <section className="flex flex-column mt-1">
                                        <label htmlFor="name">
                                            Nome do(a) visitante
                                        </label>
                                        <InputText
                                            className="border-2 border-500 border-round-md p-2 text-900"
                                            placeholder="Nome"
                                            {...createData("name")}
                                        />
                                    </section>

                                    <section className="flex flex-column mt-1">
                                        <label htmlFor="job">Profissão</label>
                                        <InputText
                                            className="border-2 border-500 border-round-md p-2 text-900"
                                            placeholder="Sua Profissão, caso esteja empregado"
                                            {...createData("job")}
                                        />
                                    </section>

                                    <section className="flex flex-column mt-1">
                                        <label htmlFor="cep">CEP</label>
                                        <InputText
                                            className="border-2 border-500 border-round-md p-2 text-900"
                                            placeholder="00000-000"
                                            {...createData("cep")}
                                        />
                                    </section>

                                    <section className="flex flex-column mt-1">
                                        <label htmlFor="endereco">
                                            Endereço
                                        </label>
                                        <InputText
                                            className="border-2 border-500 border-round-md p-2 text-900"
                                            placeholder="Digite seu endereço"
                                            {...createData("endereco")}
                                        />
                                    </section>

                                    <section className="flex justify-content-center gap-4 mt-1">
                                        <div>
                                            <section className="flex flex-column">
                                                <label htmlFor="gender">
                                                    Gênero
                                                </label>
                                                <Dropdown
                                                    value={selectedGender}
                                                    onChange={(e) => {
                                                        setSelectedGender(
                                                            e.target.value
                                                        );
                                                        createValue(
                                                            "gender",
                                                            e.target.value
                                                        );
                                                    }}
                                                    options={genders}
                                                    optionLabel="gender"
                                                    optionValue="value"
                                                    placeholder="Selecione um Gênero"
                                                    className="w-full md:w-14rem border-2 h-3rem border-500 border-round-md p-2 flex justify-content-center align-items-center mb-2 text-900"
                                                    pt={{
                                                        root: {
                                                            className:
                                                                "w-full md:w-14rem",
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
                                                <label htmlFor="numero">
                                                    Numero
                                                </label>
                                                <InputText
                                                    {...createData("numero")}
                                                    placeholder="Digite seu numero"
                                                    className="w-full md:w-14rem border-2 h-3rem border-500 border-round-md p-2 flex justify-content-center align-items-center mb-2 text-900"
                                                />
                                            </section>
                                            <section className="flex flex-column">
                                                <label htmlFor="uf">UF</label>
                                                <InputText
                                                    {...createData("uf")}
                                                    placeholder="Digite sua unidade federal"
                                                    className="w-full md:w-14rem border-2 h-3rem border-500 border-round-md p-2 flex justify-content-center align-items-center mb-2 text-900"
                                                />
                                            </section>
                                        </div>

                                        <div>
                                            <section className="flex flex-column">
                                                <label htmlFor="age">
                                                    Data de Nascimento
                                                </label>
                                                <InputText
                                                    className="focus:border-transparent h-3rem border-2 border-500 border-round-md p-2 mb-2 text-900"
                                                    placeholder="00-00-0000"
                                                    {...createData(
                                                        "dataDeNascimento"
                                                    )}
                                                />
                                            </section>
                                            <section className="flex flex-column">
                                                <label htmlFor="city">
                                                    Cidade
                                                </label>
                                                <InputText
                                                    {...createData("city")}
                                                    placeholder="Digite sua Cidade"
                                                    className="w-full md:w-14rem border-2 h-3rem border-500 border-round-md p-2 flex justify-content-center align-items-center mb-2 text-900"
                                                />
                                            </section>
                                            <section className="flex flex-column">
                                                <label htmlFor="block">
                                                    Bairro
                                                </label>
                                                <InputText
                                                    {...createData("block")}
                                                    placeholder="Digite seu bairro"
                                                    className="w-full md:w-14rem border-2 h-3rem border-500 border-round-md p-2 flex justify-content-center align-items-center mb-2 text-900"
                                                />
                                            </section>
                                        </div>
                                    </section>

                                    <section className="flex flex-column mb-2">
                                        <label htmlFor="complemento">
                                            complemento
                                        </label>
                                        <InputText
                                            className="border-2 border-500 border-round-md p-2 text-900"
                                            placeholder="Digite o complemento"
                                            {...createData("complemento")}
                                        />
                                    </section>
                                </>
                            ) : (
                                <>
                                    <section className="flex flex-column">
                                        <label htmlFor="cpf">CPF</label>
                                        <InputText
                                            value={cpfValue}
                                            className="border-2 border-500 border-round-md p-2 text-900"
                                            id="cpf"
                                            placeholder="000.000.000-00"
                                            {...createData("cpf")}
                                            disabled
                                        />
                                    </section>
                                    <section className="flex flex-column mt-1">
                                        <label htmlFor="name">
                                            Nome do(a) visitante
                                        </label>
                                        <InputText
                                            className="border-2 border-500 border-round-md p-2 text-900"
                                            placeholder="Nome"
                                            disabled
                                            {...createData("name")}
                                        />
                                    </section>

                                    <section className="flex flex-column mt-1">
                                        <label htmlFor="job">Profissão</label>
                                        <InputText
                                            className="border-2 border-500 border-round-md p-2 text-900"
                                            placeholder="Sua Profissão, caso esteja empregado"
                                            {...createData("job")}
                                            disabled
                                        />
                                    </section>

                                    <section className="flex flex-column mt-1">
                                        <label htmlFor="cep">CEP</label>
                                        <InputText
                                            className="border-2 border-500 border-round-md p-2 text-900"
                                            placeholder="00000-000"
                                            {...createData("cep")}
                                            disabled
                                        />
                                    </section>

                                    <section className="flex flex-column mt-1">
                                        <label htmlFor="endereco">
                                            Endereço
                                        </label>
                                        <InputText
                                            className="border-2 border-500 border-round-md p-2 text-900"
                                            placeholder="Digite seu endereço"
                                            {...createData("endereco")}
                                            disabled
                                        />
                                    </section>

                                    <section className="flex justify-content-center gap-4 mt-1">
                                        <div>
                                            <section className="flex flex-column">
                                                <label htmlFor="gender">
                                                    Gênero
                                                </label>
                                                <Dropdown
                                                    value={selectedGender}
                                                    onChange={(e) => {
                                                        setSelectedGender(
                                                            e.target.value
                                                        );
                                                        createValue(
                                                            "gender",
                                                            e.target.value
                                                        );
                                                    }}
                                                    options={genders}
                                                    optionLabel="gender"
                                                    optionValue="value"
                                                    placeholder="Selecione um Gênero"
                                                    className="w-full md:w-14rem border-2 h-3rem border-500 border-round-md p-2 flex justify-content-center align-items-center mb-2 text-900"
                                                    disabled
                                                    pt={{
                                                        root: {
                                                            className:
                                                                "w-full md:w-14rem",
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
                                                <label htmlFor="numero">
                                                    Numero
                                                </label>
                                                <InputText
                                                    {...createData("numero")}
                                                    placeholder="Digite seu numero"
                                                    className="w-full md:w-14rem border-2 h-3rem border-500 border-round-md p-2 flex justify-content-center align-items-center mb-2 text-900"
                                                    disabled
                                                />
                                            </section>
                                            <section className="flex flex-column">
                                                <label htmlFor="uf">UF</label>
                                                <InputText
                                                    {...createData("uf")}
                                                    placeholder="Digite sua unidade federal"
                                                    className="w-full md:w-14rem border-2 h-3rem border-500 border-round-md p-2 flex justify-content-center align-items-center mb-2 text-900"
                                                    disabled
                                                />
                                            </section>
                                        </div>

                                        <div>
                                            <section className="flex flex-column">
                                                <label htmlFor="age">
                                                    Data de Nascimento
                                                </label>
                                                <InputText
                                                    className="focus:border-transparent h-3rem border-2 border-500 border-round-md p-2 mb-2 text-900"
                                                    {...createData(
                                                        "dataDeNascimento"
                                                    )}
                                                    min={1}
                                                    disabled
                                                />
                                            </section>
                                            <section className="flex flex-column">
                                                <label htmlFor="city">
                                                    Cidade
                                                </label>
                                                <InputText
                                                    {...createData("city")}
                                                    placeholder="Digite sua Cidade"
                                                    className="w-full md:w-14rem border-2 h-3rem border-500 border-round-md p-2 flex justify-content-center align-items-center mb-2 text-900"
                                                    disabled
                                                />
                                            </section>
                                            <section className="flex flex-column">
                                                <label htmlFor="block">
                                                    Bairro
                                                </label>
                                                <InputText
                                                    {...createData("block")}
                                                    placeholder="Digite seu bairro"
                                                    className="w-full md:w-14rem border-2 h-3rem border-500 border-round-md p-2 flex justify-content-center align-items-center mb-2 text-900"
                                                    disabled
                                                />
                                            </section>
                                        </div>
                                    </section>
                                    
                                    <section className="flex flex-column mb-2">
                                        <label htmlFor="complemento">
                                            complemento
                                        </label>
                                        <InputText
                                            className="border-2 border-500 border-round-md p-2 text-900"
                                            placeholder="Digite o complemento"
                                            {...createData("complemento")}
                                            disabled
                                        />
                                    </section>
                                    <a
                                        className="text-blue-400 hover:text-blue-600 transition-duration-200 cursor-pointer"
                                        onClick={() => setUpdateData(true)}
                                    >
                                        Atualizar dados?
                                    </a>
                                </>
                            )}
                        </>
                    )}
                    {showForm && (
                        <Button
                            type="submit"
                            className="w-full mt-3 border-round-md h-2rem bg-green-500 font-bold transition-duration-200 hover:bg-green-700 flex justify-content-center align-items-center"
                            onClick={() => setModal(true)}
                        >
                            {isLoadingSubmit == false ? (
                                "Enviar"
                            ) : (
                                <i
                                    className="pi pi-spin pi-spinner"
                                    style={{ fontSize: "1rem" }}
                                ></i>
                            )}
                        </Button>
                    )}
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
