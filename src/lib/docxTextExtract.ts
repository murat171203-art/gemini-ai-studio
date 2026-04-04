import JSZip from "jszip";

export interface DocxParagraph {
  text: string;
  isHeading: boolean;
  isBold: boolean;
  isCenter: boolean;
}

export async function extractDocxParagraphs(file: File): Promise<DocxParagraph[]> {
  const zip = await JSZip.loadAsync(file);
  const docXml = await zip.file("word/document.xml")?.async("string");
  if (!docXml) return [];

  const paragraphs: DocxParagraph[] = [];
  const paraMatches = docXml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || [];

  for (const para of paraMatches) {
    // Extract all text runs
    const textMatches = para.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || [];
    const text = textMatches
      .map((m) => {
        const inner = m.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/);
        return inner ? inner[1] : "";
      })
      .join("");

    if (!text.trim()) continue;

    const isHeading = /<w:pStyle w:val="Heading/i.test(para);
    const isBold = /<w:b\s*\/>/.test(para) || /<w:b w:val="true"/.test(para) || /<w:b\/>/.test(para);
    const isCenter = /w:jc w:val="center"/.test(para);

    paragraphs.push({ text: text.trim(), isHeading, isBold, isCenter });
  }

  return paragraphs;
}
