import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import download from "downloadjs";

export default async function modifyPdf(fileName: string, signImgUrl: string) {
  const templateUrl = "/pdf/template.pdf";
  const fontUrl = "/fonts/NotoSansJP-SemiBold.ttf";
  const existingPdfBytes = await fetch(templateUrl).then((res) =>
    res.arrayBuffer()
  );
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);

  const signImgBytes = await fetch(signImgUrl).then((res) => res.arrayBuffer());
  const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());

  const font = await pdfDoc.embedFont(fontBytes);
  const signImg = await pdfDoc.embedPng(signImgBytes);

  let imgDims = signImg.scale(0.4);
  let imgY = 470;

  if (imgDims.height > 100) {
    imgDims = signImg.scale(0.2);
    imgY = 375;
  }

  const today = new Date();

  const year = String(today.getFullYear());
  const month = String(today.getMonth() + 1);
  const date = String(today.getDate());

  const pages = pdfDoc.getPages();
  const page = pages[1];

  page.drawText(year, {
    x: 130,
    y: 611,
    size: 12,
    font: font,
  });

  page.drawText(month, {
    x: 175,
    y: 611,
    size: 12,
    font: font,
  });

  page.drawText(date, {
    x: 205,
    y: 611,
    size: 12,
    font: font,
  });

  page.drawText("GLEAP", {
    x: 170,
    y: 575,
    size: 12,
    font: font,
  });

  page.drawImage(signImg, {
    x: 170,
    y: imgY,
    width: imgDims.width,
    height: imgDims.height,
  });

  const pdfBytes = await pdfDoc.save();

  // Uint8Array を Blob に変換
  const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

  download(pdfBlob, fileName + ".pdf", "application/pdf");
}
