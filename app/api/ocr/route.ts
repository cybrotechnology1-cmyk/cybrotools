import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

export async function POST(req: NextRequest) {
  try {
    const { image, mode } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (image.length > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "Image too large. Maximum size is 10MB." }, { status: 400 });
    }

    const matches = image.match(/^data:(image\/[a-z\-+.]+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/tiff"];
    if (!allowedMimeTypes.includes(mimeType)) {
      return NextResponse.json({ error: "Unsupported image type. Use JPEG, PNG, WebP, GIF, BMP, or TIFF." }, { status: 400 });
    }

    let prompt = "Extract all text from this image precisely. Keep paragraphs, headers, and spacing intact. Do not explain, summarize, or describe the image—only return the transcribed text.";
    if (mode === "table") {
      prompt = "Extract all text and tables from this image. Format tables as elegant Markdown tables, and structured text neatly. Return only the extracted text and tables.";
    } else if (mode === "handwriting") {
      prompt = "Transcribe the handwriting in this image with high precision. Maintain lines, breaks, and indentations where appropriate. Return only the exact transcription.";
    } else if (mode === "structured") {
      prompt = "Perform deep OCR on this document image. Identify structure, headers, lists, and key-value sections. Format output nicely in clean Markdown. Return only the transcribed content.";
    }

    const imagePart = {
      inlineData: {
        mimeType,
        data: base64Data,
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [imagePart, prompt],
    });

    const text = response.text || "No text could be extracted.";
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("OCR API Error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during text extraction." },
      { status: 500 }
    );
  }
}
