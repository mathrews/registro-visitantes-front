import {
    Text,
    View,
    Document,
    Page,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import brasao from "../../assets/brasao-do-ceara.png";
import { Html } from "react-pdf-html";
import { API } from "../../service";
import { useState } from "react";

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

const PDFDocument = () => {
    const config = {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
    };

    const [visitasTotais, setVisitasTotais] = useState<number>(0);
    const [visitasTotaisMasc, setVisitasTotaisMasc] = useState<number>(0);
    const [visitasTotaisFem, setVisitasTotaisFem] = useState<number>(0);
    const [visitasTotaisOutros, setVisitasTotaisOutros] = useState<number>(0);

    const visitasTotaisRequest = async () => {
        try {
            const request = await API.get("/visita", config);
            const response = await request.data;

            setVisitasTotais(response.length);
        } catch (error) {
            console.log((error as Error).message);
        }
    };
    visitasTotaisRequest();

    const visitasPorGeneroRequest = async () => {
        try {
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
            contarVisitantesPorGenero();

            setVisitasTotaisMasc(genders[0]);
            setVisitasTotaisFem(genders[1]);
            setVisitasTotaisOutros(genders[2]);
        } catch (error) {
            console.log((error as Error).message);
        }
    };
    visitasPorGeneroRequest();

    const lista = `<html>
            <body>
                <div border={2}>
                    <ul>
                        <li>Visitantes Total: ${visitasTotais}</li>
                        <li>Visitantes Masc: ${visitasTotaisMasc}</li>
                        <li>Visitantes fem: ${visitasTotaisFem}</li>
                        <li>Visitantes outros: ${visitasTotaisOutros}</li>
                    </ul>
                </div>
            </body>
        </html>`;

    const styles = StyleSheet.create({
        container: {
            position: "relative",
        },
        bg_imagem: {
            width: "50%",
            position: "absolute",
            left: "25%",
            top: "25%",
            opacity: 0.1,
            zIndex: 1,
        },
        main: {
            width: "100%",
            height: "100%",
            padding: "60px",
            position: "absolute",
            zIndex: 2,
            top: 0,
            left: 0,
            fontSize: 12,
        },
    });

    return (
        <>
            <Document style={styles.container}>
                <Page size={"A4"}>
                    <Image src={brasao} style={styles.bg_imagem} />
                    <View style={styles.main}>
                        <Text>Relatório</Text>
                        <Html>{lista}</Html>
                    </View>
                </Page>
            </Document>
        </>
    );
};

export default PDFDocument;
