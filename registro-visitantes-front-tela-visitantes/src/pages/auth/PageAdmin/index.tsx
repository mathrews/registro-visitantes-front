import styled from "styled-components";
import PdfDownloader from "../../../components/PdfDownloader";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";

const TelaAdminContainer = styled.section`
    padding: 4em;
    & h1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    & a {
        display: inline-block;
        line-height: 3em;
        background-color: #ff00a2;
        padding: 0 1.5em;
        border-radius: 6px;
        color: white;
        font-size: 14px;
        text-transform: uppercase;
        text-decoration: none;
    }
    & .graficos {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        margin-top: 1.5em;
        & div {
            width: calc(70% - 16px);
            padding: 16px;
            border-radius: 6px;
            border: 1px solid #ddd;
            &:nth-child(even) {
                width: 30%;
            }
            & .grafico {
                width: 100%;
                border: none;
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
    useEffect(() => {
        //CONFIGURAÇÕES DO CHART BAR

        const data = {
            labels: ["Feminino", "Outros", "Masculino"],
            datasets: [
                {
                    label: "Total de visitantes",
                    data: [702, 325, 540],
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

        //CONFIGURAÇÕES DO CHART PIE

        const dataPie = {
            labels: ["Feminino", "Outros", "Masculino"],
            datasets: [
                {
                    data: [540, 325, 702],
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
                    hoverBackgroundColor: [
                        "rgba(255, 159, 64, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
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

        //CONFIG CHART LINE

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary = documentStyle.getPropertyValue(
            "--text-color-secondary"
        );
        const surfaceBorder =
            documentStyle.getPropertyValue("--surface-border");
        const dataLine = {
            labels: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
            ],
            datasets: [
                {
                    label: "Masculino",
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue("--blue-500"),
                    tension: 0.4,
                },
                {
                    label: "Feminino",
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue("--pink-500"),
                    tension: 0.4,
                },
                {
                    label: "Outros",
                    data: [54, 60, 30, 15, 13, 90, 95],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue("--orange-500"),
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

        //CONFIG CHART PIE EMPREGOS

        const dataPieJobs = {
            labels: ["Devs", "Artistas visuais", "Escultores"],
            datasets: [
                {
                    data: [540, 325, 702],
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
                    hoverBackgroundColor: [
                        "rgba(255, 159, 64, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
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
    }, []);

    return (
        <>
            <TelaAdminContainer>
                <h1>
                    Dashboard
                    <PdfDownloader />
                </h1>
                <div className="graficos">
                    <div>
                        <h4>Visitantes</h4>
                        <Chart
                            className="grafico"
                            type="bar"
                            data={chartData}
                            options={chartOptions}
                        />
                    </div>
                    <div>
                        <h4>Total visitantes</h4>
                        <Chart
                            className="grafico"
                            type="pie"
                            data={chartDataPie}
                            options={chartOptionsPie}
                        />
                    </div>
                    <div>
                        <h4>Total visitantes (por mês)</h4>
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
