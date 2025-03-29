import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";

export default async function modifyPdf(signature: string) {
  const templateUrl = "/pdf/template.pdf";
  const signImgUrl = signature;
  const existingPdfBytes = await fetch(templateUrl).then((res) =>
    res.arrayBuffer()
  );
  const signImgBytes = await fetch(signImgUrl).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  // const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const signImg = await pdfDoc.embedPng(signImgBytes);

  const imgDims = signImg.scale(0.5);

  const pages = pdfDoc.getPages();

  const page = pages[1];
  // const { width, height } = page.getSize();

  // firstPage.drawText("This text was added with JavaScript!", {
  //   x: 5,
  //   y: height / 2 + 300,
  //   size: 50,
  //   font: helveticaFont,
  //   color: rgb(0.95, 0.1, 0.1),
  //   rotate: degrees(-45),
  // });

  page.drawImage(signImg, {
    x: page.getWidth() / 2 - imgDims.width / 2 + 75,
    y: page.getHeight() / 2 - imgDims.height + 250,
    width: imgDims.width,
    height: imgDims.height,
  });

  const pdfBytes = await pdfDoc.save();

  download(pdfBytes, "pdf-lib_image_embedding_example.pdf", "application/pdf");
}
