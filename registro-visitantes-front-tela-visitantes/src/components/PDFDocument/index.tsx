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

const PDFDocument = () => {
    const tabela = `<html>
            <body>
                <table border={1}>
                    <tr>
                        <td>Visitantes Total</td>
                        <td>1000</td>
                        <td>Visitantes Masc</td>
                        <td>200</td>
                        <td>Visitantes fem</td>
                        <td>700</td>
                        <td>Visitantes outros</td>
                        <td>100</td>
                    </tr>
                </table>
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
                        <Text>Texto</Text>
                        <Html>{tabela}</Html>
                    </View>
                </Page>
            </Document>
        </>
    );
};

export default PDFDocument;
