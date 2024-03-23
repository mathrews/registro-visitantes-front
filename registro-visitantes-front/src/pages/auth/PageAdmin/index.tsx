import styled from "styled-components";
import PdfDownloader from "../../../components/PdfDownloader";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { API } from "../../../service";

const TelaAdminContainer = styled.section`
    padding: 60px;
    & h1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        & a {
            display: inline-block;
            line-height: 46px;
            background-color: #ff00a2;
            padding: 0 26px;
            border-radius: 5px;
            color: white;
            font-size: 14px;
            text-transform: uppercase;
            text-decoration: none;
        }
    }
    & .graficos {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-top: 26px;
        border-radius: 5px;
        & div {
            width: calc(70% - 16px);
            padding: 16px;
            border-radius: 5px;
            border: 1px solid #ddd;
            &:nth-child(even) {
                width: 30%;
            }
            & .grafico {
                width: 100%;
                /* height: 250px; */
                border: 0;
            }
        }
    }
`;

type tableVisitorsYear = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        fill: boolean;
        borderColor: string;
        tension: number;
    }[];
};

type genero = {
    nome: string;
};

type visitor = {
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
};

type visita = {
    visitante_id: number;
    data: string;
};

const PageAdmin = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [chartDataPie, setChartDataPie] = useState({});
    const [chartOptionsPie, setChartOptionsPie] = useState({});
    const [chartDataLine, setChartDataLine] = useState({});
    const [chartOptionsLine, setChartOptionsLine] = useState({});
    const [chartDataPieJobs, setChartDataPieJobs] = useState({});
    const [chartOptionsPieJobs, setChartOptionsPieJobs] = useState({});

    const [visitorsYear, setVisitorsYear] = useState<number>();

    const config = {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    };

    const visitantesPorUF = async () => {
        try {
            const requestQuantosPorUF = await API.get("/visitante", config);
            const responseQuantosPorUF = await requestQuantosPorUF.data;

            const contarPorUF = () => {
                const ufs: string[] = Array.from(
                    new Set(
                        responseQuantosPorUF.map((item: visitor) => item?.uf)
                    )
                );

                const contagemUfs: { uf: string; contagem: number }[] = ufs.map(
                    (item: string) => ({
                        uf: item,
                        contagem: 0,
                    })
                );

                responseQuantosPorUF.map((itemPriority: visitor) => {
                    contagemUfs.map((item) => {
                        if (item?.uf == itemPriority?.uf) {
                            ++item.contagem;
                        }
                    });
                });

                return contagemUfs.map((item) => item.contagem);
            };

            const data = {
                labels: Array.from(
                    new Set(
                        responseQuantosPorUF.map((item: visitor) => item?.uf)
                    )
                ),
                datasets: [
                    {
                        label: "Total de visitantes",
                        data: contarPorUF(),
                        backgroundColor: [
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                        ],
                        borderColor: [
                            "rgb(255, 159, 64)",
                            "rgb(75, 192, 192)",
                            "rgb(54, 162, 235)",
                            "rgb(153, 102, 255)",
                        ],
                        borderWidth: 1,
                    },
                ],
            };

            const options = {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                responsive: true,
            };

            setChartData(data);
            setChartOptions(options);
        } catch (error) {
            console.log((error as Error).message);
        }
    };

    const visitantesPorGenero = async () => {
        try {
            const request = await API.get("/genero", config);
            const response = await request.data;

            const requestQuantosPorGenero = await API.get("/visitante", config);
            const responseQuantosPorGenero = await requestQuantosPorGenero.data;

            const genders = [0, 0, 0];
            const contarVisitantesPorGenero = () => {
                responseQuantosPorGenero.map((item: visitor) => {
                    if (item?.genero_id == 1) {
                        ++genders[1];
                    } else if (item?.genero_id == 2) {
                        ++genders[0];
                    } else if (item?.genero_id == 3) {
                        ++genders[2];
                    }
                });
                return genders;
            };

            // CONFIGURAÇÕES DO CHART PIE

            const dataPie = {
                labels: response.map((r: genero) => r.nome),
                datasets: [
                    {
                        data: contarVisitantesPorGenero(),
                        backgroundColor: [
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                        ],
                        borderColor: [
                            "rgb(255, 159, 64)",
                            "rgb(75, 192, 192)",
                            "rgb(54, 162, 235)",
                        ],
                    },
                ],
            };
            const optionsPie = {
                plugins: {
                    legend: {
                        labels: {
                            usePointStyle: true,
                        },
                    },
                },
            };

            setChartDataPie(dataPie);
            setChartOptionsPie(optionsPie);
        } catch (error) {
            console.log((error as Error).message);
        }
    };

    const visitantesPorMês = async () => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary = documentStyle.getPropertyValue(
            "--text-color-secondary"
        );
        const surfaceBorder =
            documentStyle.getPropertyValue("--surface-border");

        const requestVisitasPorMes = await API.get("/visita", config);
        const responseVisitasPorMes = await requestVisitasPorMes.data;
        console.log(responseVisitasPorMes);
        

        const meses = [
            "Janeiro",
            "Fevereiro",
            "Março",
            "Abril",
            "Maio",
            "Junho",
            "Julho",
            "Agosto",
            "Setembro",
            "Outubro",
            "Novembro",
            "Dezembro",
        ];

        const visitantesPorMes = () => {
            const contagem = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            responseVisitasPorMes.map((item: visita) => {
                if (item.data.split("-")[1] == "01") {
                    ++contagem[0];
                }
                if (item.data.split("-")[1] == "02") {
                    ++contagem[1];
                }
                if (item.data.split("-")[1] == "03") {
                    ++contagem[2];
                }
                if (item.data.split("-")[1] == "04") {
                    ++contagem[3];
                }
                if (item.data.split("-")[1] == "05") {
                    ++contagem[4];
                }
                if (item.data.split("-")[1] == "06") {
                    ++contagem[5];
                }
                if (item.data.split("-")[1] == "07") {
                    ++contagem[6];
                }
                if (item.data.split("-")[1] == "08") {
                    ++contagem[7];
                }
                if (item.data.split("-")[1] == "09") {
                    ++contagem[8];
                }
                if (item.data.split("-")[1] == "10") {
                    ++contagem[9];
                }
                if (item.data.split("-")[1] == "11") {
                    ++contagem[10];
                }
                if (item.data.split("-")[1] == "12") {
                    ++contagem[11];
                }
            });

            return contagem;
        };

        const dataLine = {
            labels: meses,
            datasets: [
                {
                    label: "Visitantes Gerais",
                    data: visitantesPorMes(),
                    fill: false,
                    borderColor: documentStyle.getPropertyValue("--blue-500"),
                    tension: 0.4,
                },
            ],
        };
        const optionsLine = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                    },
                },
            },
        };

        const allVisitorsYear = (table: tableVisitorsYear) => {
            const datasets = table.datasets;
            let sum = 0;
            datasets.map((item) => {
                item.data.map((item) => {
                    sum += item;
                });
            });
            setVisitorsYear(sum);
        };
        allVisitorsYear(dataLine);
        setChartDataLine(dataLine);
        setChartOptionsLine(optionsLine);
    };

    const visitantesTopProfissao = async () => {
        const requestProfissao = await API.get("/visitante", config);
        const responseProfissao = await requestProfissao.data;

        const contarPorProfissao = () => {
            const profissoes: string[] = Array.from(
                new Set(
                    responseProfissao.map((item: visitor) => item?.profissao)
                )
            );

            const contagemProfissoes: { profissao: string; contagem: number }[] = profissoes.map(
                (item: string) => ({
                    profissao: item,
                    contagem: 0,
                })
            );

            responseProfissao.map((itemPriority: visitor) => {
                contagemProfissoes.map((item) => {
                    if (item?.profissao == itemPriority?.profissao) {
                        ++item.contagem;
                    }
                });
            });

            return contagemProfissoes.map((item) => item.contagem);
        };

        const dataPieJobs = {
            labels: Array.from(
                new Set(
                    responseProfissao.map((item: visitor) => item?.profissao)
                )
            ),
            datasets: [
                {
                    data: contarPorProfissao(),
                    backgroundColor: [
                        "rgba(255, 159, 64, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(232, 102, 255, 0.2)",
                    ],
                    borderColor: [
                        "rgb(255, 159, 64)",
                        "rgb(75, 192, 192)",
                        "rgb(54, 162, 235)",
                        "rgb(153, 102, 255)",
                        "rgb(232, 102, 255)",
                    ],
                    hoverBackgroundColor: [
                        "rgba(255, 159, 64, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                        "rgba(232, 102, 255, 0.2)",
                    ],
                },
            ],
        };
        const optionsPieJobs = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                    },
                },
            },
        };

        setChartDataPieJobs(dataPieJobs);
        setChartOptionsPieJobs(optionsPieJobs);
    };

    useEffect(() => {
        visitantesPorGenero();
        visitantesPorUF();
        visitantesPorMês();
        visitantesTopProfissao();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <TelaAdminContainer>
                <h1 className="text-white">
                    Dashboard
                    <PdfDownloader />
                </h1>
                <div className="graficos bg-white ">
                    <div>
                        <h4>Visitantes por UF</h4>
                        <Chart
                            className="grafico"
                            type="bar"
                            data={chartData}
                            options={chartOptions}
                        />
                    </div>
                    <div>
                        <h4>Total de visitantes por genero</h4>
                        <Chart
                            className="grafico"
                            type="pie"
                            data={chartDataPie}
                            options={chartOptionsPie}
                        />
                    </div>
                    <div>
                        <h4>Total de visitas (por mês)</h4>
                        <Chart
                            className="grafico"
                            type="line"
                            data={chartDataLine}
                            options={chartOptionsLine}
                        />
                        <h4>Total de visitantes por ano {visitorsYear}</h4>
                    </div>
                    <div>
                        <h4>Top Empregos</h4>
                        <Chart
                            className="grafico"
                            type="pie"
                            data={chartDataPieJobs}
                            options={chartOptionsPieJobs}
                        />
                    </div>
                </div>
            </TelaAdminContainer>
        </>
    );
};

export default PageAdmin;
