import { patchDocument, PatchType, TextRun, ImageRun } from "docx";
import { saveAs } from "file-saver";

/**
 * 非同期で指定されたURLからファイルを取得し、ArrayBufferを返す関数
 * @param url - 取得するファイルのURL
 */
async function fetchFile(url: string): Promise<ArrayBuffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file at ${url}: ${response.statusText}`);
  }
  return await response.arrayBuffer();
}

/**
 * docx形式のテンプレファイルを編集し、docxで出力する
 * @param inputFileName ファイル名
 * @param signDataURL 署名データ
 */
export default async function modifyDocs(
  inputFileName: string,
  signDataURL: string
) {
  const templatePath = "/docs/template.docx";

  // Data URLからbase64部分を抽出し、Uint8Arrayに変換する
  const base64Part = signDataURL.split(",")[1];
  if (!base64Part) {
    throw new Error("Invalid signature data URL.");
  }
  const binaryString = atob(base64Part);
  const len = binaryString.length;
  const signatureData = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    signatureData[i] = binaryString.charCodeAt(i);
  }

  // 現在の日付を "YYYY年M月D日" の形式で作成
  const today = new Date();
  const y = String(today.getFullYear());
  const m = String(today.getMonth() + 1);
  const d = String(today.getDate());
  const date = `${y}年${m}月${d}日`;

  // 出力ファイル名（拡張子を追加）
  const fileName = inputFileName + ".docx";
  const faculty = "GLEAP";

  try {
    // テンプレートドキュメントの取得
    const fileBuffer = await fetchFile(templatePath);

    // patchDocumentによりテンプレートにパッチを適用
    const modifiedDoc = await patchDocument({
      outputType: "nodebuffer",
      data: new Uint8Array(fileBuffer),
      patches: {
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
              transformation: { width: 400, height: 100 },
            }),
          ],
        },
      },
    });

    const blob = new Blob([modifiedDoc], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    saveAs(blob, fileName);
  } catch (error) {
    console.error("modifyDocsでエラーが発生しました:", error);
  }
}
