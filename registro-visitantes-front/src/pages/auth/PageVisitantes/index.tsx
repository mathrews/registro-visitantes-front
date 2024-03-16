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
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import RequiredLabel from "../../../components/RequiredLabel";
import {
    useVisitaCreate,
    useVisitanteCreate,
    useVisitantePut,
} from "../../../hook/useVisitantes";
import { logout } from "../../../utils/logout";
import axios, { AxiosError } from "axios";

const schema = yup
    .object({
        nome: yup.string().required().uppercase(),
        profissao: yup.string(),
        cpf: yup.string(),
        cep: yup.string().required(),
        genero_id: yup.number().required(),
        dataNascimento: yup.string(),
        cidade: yup.string().required(),
        bairro: yup.string(),
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
    const config = {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    };

    const dataAtual = new Date();
    const navigate = useNavigate();

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

    const [isLoadingSubmit, setIsLoadingSubmit] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [visitorData, setVisitorData] = useState<visitor | null>();

    const [cpfValue, setCpfValue] = useState<string>("");
    const {
        register: createData,
        handleSubmit: createSubmit,
        setValue: createValue,
        reset: createReset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            cpf: cpfValue,
            genero_id: selectedGender,
        },
    });

    const [errorMessageCpf, setErrorMessageCpf] = useState<string>();
    const [showForm, setShowForm] = useState<boolean>(false);
    const [cpfExists, setCpfExists] = useState<boolean>(false);
    const searchCPF = async () => {
        if (validarCPF(cpfValue)) {
            setIsLoading(true);
            const response = (
                await API.get(
                    `/visitante/cpf/${cpfValue
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

    const [errorCreate, setErrorCreate] = useState<boolean>(false);

    const createVisita = useVisitaCreate();
    const createVisitante = useVisitanteCreate();
    const createDataPost = async (data: object) => {
        setIsLoadingSubmit(true);
        if (cpfExists) {
            try {
                if (visitorData) {
                    const formattedDate = `${dataAtual
                        .getDate()
                        .toString()
                        .padStart(2, "0")}/${(dataAtual.getMonth() + 1)
                        .toString()
                        .padStart(2, "0")}/${dataAtual.getFullYear()}`;

                    createVisita.mutateAsync(
                        {
                            visitante_id: visitorData?.id,
                            data: formattedDate,
                        },
                        {
                            onSuccess: (response) => {
                                setIsLoadingSubmit(false);
                                createReset();
                                setSelectedGender(0);
                                setVisitorData(null);
                                setShowForm(false);
                                setCpfExists(false);
                                setUpdateData(false);
                                return response;
                            },
                            onError: (
                                error: Error | AxiosError
                            ): void | Promise<unknown> => {
                                if (axios.isAxiosError(error)) {
                                    if (error.response) {
                                        if (error.response.status == 401) {
                                            logout();
                                            location.replace("/");
                                        }
                                    }
                                }
                                throw new Error("Erro na API.");
                            },
                        }
                    );
                }
            } catch (error) {
                setIsLoadingSubmit(false);
                console.log((error as Error).message);
            }
        } else {
            try {
                const formData = { ...data, cpf: cpfValue };
                createVisitante.mutateAsync(formData, {
                    onSuccess: async (response) => {
                        const request = await API.get(
                            `/visitante/cpf/${cpfValue}`,
                            config
                        );

                        const dataAtual = new Date();
                        const formattedDate = `${dataAtual
                            .getDate()
                            .toString()
                            .padStart(2, "0")}/${(dataAtual.getMonth() + 1)
                            .toString()
                            .padStart(2, "0")}/${dataAtual.getFullYear()}`;

                        createVisita.mutateAsync({
                            visitante_id: request.data[0]?.id,
                            data: formattedDate,
                        });

                        createReset();
                        setShowForm(false);
                        setSelectedGender(0);
                        setIsLoadingSubmit(false);
                        setUpdateData(false);
                        setCpfExists(false);
                        setErrorCreate(false);
                        return response;
                    },
                    onError: (
                        error: Error | AxiosError
                    ): void | Promise<unknown> => {
                        setIsLoadingSubmit(false);
                        setErrorCreate(true);
                        if (axios.isAxiosError(error)) {
                            if (error.response) {
                                if (error.response.status == 401) {
                                    logout();
                                    location.replace("/");
                                }
                            }
                        }
                        throw new Error("Erro na API.");
                    },
                });
            } catch (error) {
                console.log((error as Error).message);
                setIsLoadingSubmit(false);
            }
        }
    };

    const [errorPut, setErrorPut] = useState<boolean>(false);
    const updateVisitanteData = useVisitantePut();
    const updateDataPut = async (data: object) => {
        //refatorar
        setIsLoadingSubmit(true);
        try {
            const formData = { ...data, cpf: cpfValue, id: visitorData?.id };
            updateVisitanteData.mutateAsync(formData, {
                onSuccess: async (response) => {
                    const request = await API.get(
                        `/visitante/cpf/${cpfValue}`,
                        config
                    );

                    const formattedDate = `${dataAtual
                        .getDate()
                        .toString()
                        .padStart(2, "0")}/${(dataAtual.getMonth() + 1)
                        .toString()
                        .padStart(2, "0")}/${dataAtual.getFullYear()}`;

                    createVisita.mutateAsync({
                        visitante_id: request.data[0]?.id,
                        data: formattedDate,
                    });

                    setIsLoadingSubmit(false);
                    createReset();
                    setSelectedGender(0);
                    setVisitorData(null);
                    setCpfExists(false);
                    setUpdateData(false);
                    setShowForm(false);
                    setErrorPut(false);
                    return response;
                },
                onError: (
                    error: Error | AxiosError
                ): void | Promise<unknown> => {
                    setIsLoadingSubmit(false);
                    setErrorPut(true);
                    if (axios.isAxiosError(error)) {
                        if (error.response) {
                            if (error.response.status == 401) {
                                logout();
                                location.replace("/");
                            }
                        }
                    }
                    throw new Error("Erro na API.");
                },
            });
        } catch (error) {
            setIsLoadingSubmit(false);
            console.log((error as Error).message);
        }
    };

    const [updateData, setUpdateData] = useState<boolean>(false);

    useEffect(() => {
        if (visitorData) {
            createValue("nome", visitorData.nome);
            createValue("profissao", visitorData.profissao);
            createValue("cep", visitorData.cep);
            createValue("genero_id", visitorData.genero_id);
            createValue("dataNascimento", visitorData.dataNascimento);
            createValue("cidade", visitorData.cidade);
            createValue("bairro", visitorData.bairro);
            createValue("complemento", visitorData.complemento);
            createValue("endereco", visitorData.endereco);
            createValue("uf", visitorData.uf);
            createValue("numero", visitorData.numero);
        }
    }, [visitorData, createValue]);

    const [modal, setModal] = useState<boolean>(false);

    const errorModal = () => {
        if (errorCreate || errorPut) {
            return "Houve erro no processo, verifique se os dados estão sendo enviados corretamente";
        } else {
            return "Visita processada.";
        }
    };

    return (
        <>
            <main className="surface-500 w-full p-6 flex justify-content-center align-items-center">
                <form
                    className="p-5 bg-white border-round-md"
                    onSubmit={createSubmit(
                        updateData ? updateDataPut : createDataPost
                    )}
                >
                    <h1 className="flex justify-content-center align-items-center text-3xl mb-3 gap-3">
                        Seja bem vindo(a) visitante!
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
                                        <label htmlFor="cpf">
                                            CPF <RequiredLabel />
                                        </label>
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
                                        <label htmlFor="nome">
                                            Nome do(a) visitante{" "}
                                            <RequiredLabel />
                                        </label>
                                        <InputText
                                            className="border-2 border-500 border-round-md p-2 text-900"
                                            placeholder="Nome"
                                            {...createData("nome")}
                                        />
                                    </section>

                                    <section className="flex flex-column mt-1">
                                        <label htmlFor="profissao">
                                            Profissão <RequiredLabel />
                                        </label>
                                        <InputText
                                            className="border-2 border-500 border-round-md p-2 text-900"
                                            placeholder="Sua Profissão, caso esteja empregado"
                                            {...createData("profissao")}
                                        />
                                    </section>

                                    <section className="flex flex-column mt-1">
                                        <label htmlFor="cep">
                                            CEP <RequiredLabel />
                                        </label>
                                        <InputText
                                            className="border-2 border-500 border-round-md p-2 text-900"
                                            placeholder="00000000"
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
                                                <label htmlFor="genero_id">
                                                    Gênero <RequiredLabel />
                                                </label>
                                                <Dropdown
                                                    value={selectedGender}
                                                    onChange={(e) => {
                                                        setSelectedGender(
                                                            e.target.value
                                                        );
                                                        createValue(
                                                            "genero_id",
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
                                                <label htmlFor="uf">
                                                    UF <RequiredLabel />
                                                </label>
                                                <InputText
                                                    {...createData("uf")}
                                                    placeholder="Digite sua unidade federal"
                                                    className="w-full md:w-14rem border-2 h-3rem border-500 border-round-md p-2 flex justify-content-center align-items-center mb-2 text-900"
                                                />
                                            </section>
                                        </div>

                                        <div>
                                            <section className="flex flex-column">
                                                <label htmlFor="dataNascimento">
                                                    Data de Nascimento{" "}
                                                    <RequiredLabel />
                                                </label>
                                                <InputText
                                                    className="focus:border-transparent h-3rem border-2 border-500 border-round-md p-2 mb-2 text-900"
                                                    placeholder="ano-mês-dia"
                                                    {...createData(
                                                        "dataNascimento"
                                                    )}
                                                />
                                            </section>
                                            <section className="flex flex-column">
                                                <label htmlFor="cidade">
                                                    Cidade <RequiredLabel />
                                                </label>
                                                <InputText
                                                    {...createData("cidade")}
                                                    placeholder="Digite sua Cidade"
                                                    className="w-full md:w-14rem border-2 h-3rem border-500 border-round-md p-2 flex justify-content-center align-items-center mb-2 text-900"
                                                />
                                            </section>
                                            <section className="flex flex-column">
                                                <label htmlFor="bairro">
                                                    Bairro
                                                </label>
                                                <InputText
                                                    {...createData("bairro")}
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
                                        <label htmlFor="nome">
                                            Nome do(a) visitante
                                        </label>
                                        <InputText
                                            className="border-2 border-500 border-round-md p-2 text-900"
                                            placeholder="Nome"
                                            disabled
                                            {...createData("nome")}
                                        />
                                    </section>

                                    <section className="flex flex-column mt-1">
                                        <label htmlFor="profissao">
                                            Profissão
                                        </label>
                                        <InputText
                                            className="border-2 border-500 border-round-md p-2 text-900"
                                            placeholder="Sua Profissão, caso esteja empregado"
                                            {...createData("profissao")}
                                            disabled
                                        />
                                    </section>

                                    <section className="flex flex-column mt-1">
                                        <label htmlFor="cep">CEP</label>
                                        <InputText
                                            className="border-2 border-500 border-round-md p-2 text-900"
                                            placeholder="00000000"
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
                                                <label htmlFor="genero_id">
                                                    Gênero
                                                </label>
                                                <Dropdown
                                                    value={selectedGender}
                                                    onChange={(e) => {
                                                        setSelectedGender(
                                                            e.target.value
                                                        );
                                                        createValue(
                                                            "genero_id",
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
                                                <label htmlFor="dataNascimento">
                                                    Data de Nascimento
                                                </label>
                                                <InputText
                                                    className="focus:border-transparent h-3rem border-2 border-500 border-round-md p-2 mb-2 text-900"
                                                    {...createData(
                                                        "dataNascimento"
                                                    )}
                                                    min={1}
                                                    disabled
                                                />
                                            </section>
                                            <section className="flex flex-column">
                                                <label htmlFor="cidade">
                                                    Cidade
                                                </label>
                                                <InputText
                                                    {...createData("cidade")}
                                                    placeholder="Digite sua Cidade"
                                                    className="w-full md:w-14rem border-2 h-3rem border-500 border-round-md p-2 flex justify-content-center align-items-center mb-2 text-900"
                                                    disabled
                                                />
                                            </section>
                                            <section className="flex flex-column">
                                                <label htmlFor="bairro">
                                                    Bairro
                                                </label>
                                                <InputText
                                                    {...createData("bairro")}
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
                        <>
                            {isLoadingSubmit == false ? (
                                <Button
                                    type="submit"
                                    className="w-full mt-3 border-round-md h-2rem bg-green-500 font-bold transition-duration-200 hover:bg-green-700 flex justify-content-center align-items-center"
                                    onClick={() => setModal(true)}
                                >
                                    Enviar
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="w-full mt-3 border-round-md h-2rem bg-green-500 font-bold transition-duration-200 hover:bg-green-700 flex justify-content-center align-items-center"
                                    onClick={() => setModal(true)}
                                    disabled
                                >
                                    <i
                                        className="pi pi-spin pi-spinner"
                                        style={{ fontSize: "1rem" }}
                                    ></i>
                                </Button>
                            )}
                        </>
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
                                onClick: () => {
                                    navigate("/visitantes");
                                },
                            },
                        }}
                    >
                        {isLoadingSubmit ? (
                            <i
                                className="pi pi-spin pi-spinner"
                                style={{ fontSize: "2rem" }}
                            ></i>
                        ) : (
                            <h1>{errorModal()}</h1>
                        )}
                    </Dialog>
                )}
            </main>
            <footer></footer>
        </>
    );
};

export default PageVisitantes;
