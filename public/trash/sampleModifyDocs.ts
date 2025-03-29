import fs from "fs";
import { patchDocument, PatchType, TextRun, ImageRun } from "docx";

export default function modifyDocs(inputFileName: string, signData: string) {
  const docPath = "public/docs/template.docx";
  const signatureData = signData;

  const today = new Date();
  const y = String(today.getFullYear());
  const m = String(today.getMonth() + 1);
  const d = String(today.getDate());
  const date = y + "年" + m + "月" + d + "日";

  const fileName = "public/docs/" + inputFileName + ".docx";
  const faculty = "工学部";

  patchDocument({
    outputType: "nodebuffer",
    data: fs.readFileSync(docPath),
    patches: {
      // yyyy: {
      //   type: PatchType.PARAGRAPH,
      //   children: [new TextRun(y)],
      // },
      // mm: {
      //   type: PatchType.PARAGRAPH,
      //   children: [new TextRun(m)],
      // },
      // dd: {
      //   type: PatchType.PARAGRAPH,
      //   children: [new TextRun(d)],
      // },
      date: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(date)],
      },
      faculty: {
        type: PatchType.PARAGRAPH,
        children: [new TextRun(faculty)],
      },
      signature: {
        type: PatchType.PARAGRAPH,
        children: [
          new ImageRun({
            type: "png",
            data: signatureData,
            transformation: { width: 100, height: 100 },
          }),
        ],
      },
    },
  }).then((doc) => {
    fs.writeFileSync(fileName, doc);
  });
}
