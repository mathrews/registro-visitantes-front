import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFDocument from "../PDFDocument";

const PdfDownloader = () => {
    return (
        <>
            <PDFDownloadLink
                document={<PDFDocument />}
                fileName="registros.pdf"
            >
                Baixar PDF
            </PDFDownloadLink>
        </>
    );
};

export default PdfDownloader;
