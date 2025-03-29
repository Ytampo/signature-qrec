import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

export async function POST(request: NextRequest) {
  try {
    const { signature } = await request.json();

    const pdfBuffer = await generatePdfFromSignature(signature);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="signed.pdf"',
      },
    });
  } catch (error) {
    return NextResponse.error();
  }
}

async function generatePdfFromSignature(signature: string): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

  const pngImage = await pdfDoc.embedPng(signature);

  const scaled = pngImage.scale(0.5);

  page.drawImage(pngImage, {
    x: 200,
    y: 150,
    width: scaled.width,
    height: scaled.height,
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

// import { NextApiRequest, NextApiResponse } from 'next';
// import { PDFDocument } from 'pdf-lib';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     try {
//       const { signature } = req.body;

//       // 新しいPDFドキュメントを生成
//       const pdfDoc = await PDFDocument.create();
//       const page = pdfDoc.addPage([600, 400]);

//       // 署名の画像をPDFに埋め込む
//       const pngImage = await pdfDoc.embedPng(signature);
//       // 画像のサイズ調整：scale を使って縮小する例
//       const scaled = pngImage.scale(0.5);

//       // ページ上に署名画像を描画
//       page.drawImage(pngImage, {
//         x: 200,
//         y: 150,
//         width: scaled.width,
//         height: scaled.height,
//       });

//       // PDFをバイナリデータに変換
//       const pdfBytes = await pdfDoc.save();

//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', 'attachment; filename=signed.pdf');
//       res.send(Buffer.from(pdfBytes));
//     } catch (error) {
//       res.status(500).json({ error: 'PDFの生成に失敗しました。' });
//     }
//   } else {
//     res.status(405).json({ message: 'Method not allowed' });
//   }
// }
