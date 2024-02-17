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

const PageAdmin = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [chartDataPie, setChartDataPie] = useState({});
    const [chartOptionsPie, setChartOptionsPie] = useState({});

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
                    <div>Linha</div>
                    <div>Pizza</div>
                </div>
            </TelaAdminContainer>
        </>
    );
};

export default PageAdmin;
