import JSZip from "jszip";
import jsPDF from "jspdf";

interface PdfConvertOptions {
  blob: Blob;
  fileName: string;
}

/**
 * Extracts text content from DOCX and generates a formatted PDF
 */
export async function convertDocxBlobToPdf({ blob, fileName }: PdfConvertOptions): Promise<Blob> {
  const zip = await JSZip.loadAsync(blob);
  const docXml = await zip.file("word/document.xml")?.async("string");
  
  if (!docXml) {
    throw new Error("Invalid DOCX: document.xml not found");
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(docXml, "application/xml");
  const nsResolver = (prefix: string | null) => {
    const ns: Record<string, string> = {
      w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    };
    return ns[prefix || ""] || null;
  };

  // Extract paragraphs with their properties
  const paragraphs: Array<{
    text: string;
    isBold: boolean;
    fontSize: number;
    alignment: string;
    isHeading: boolean;
    headingLevel: number;
  }> = [];

  const pNodes = xmlDoc.getElementsByTagNameNS(
    "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "p"
  );

  for (let i = 0; i < pNodes.length; i++) {
    const p = pNodes[i];
    const runs = p.getElementsByTagNameNS(
      "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
      "r"
    );

    let text = "";
    let isBold = false;
    let fontSize = 12;

    for (let j = 0; j < runs.length; j++) {
      const run = runs[j];
      const tNodes = run.getElementsByTagNameNS(
        "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
        "t"
      );
      for (let k = 0; k < tNodes.length; k++) {
        text += tNodes[k].textContent || "";
      }

      // Check bold
      const rPr = run.getElementsByTagNameNS(
        "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
        "rPr"
      )[0];
      if (rPr) {
        const bNode = rPr.getElementsByTagNameNS(
          "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
          "b"
        )[0];
        if (bNode) isBold = true;

        const szNode = rPr.getElementsByTagNameNS(
          "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
          "sz"
        )[0];
        if (szNode) {
          const val = szNode.getAttribute("w:val");
          if (val) fontSize = parseInt(val) / 2; // half-points to points
        }
      }
    }

    // Check paragraph properties
    const pPr = p.getElementsByTagNameNS(
      "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
      "pPr"
    )[0];
    
    let alignment = "left";
    let isHeading = false;
    let headingLevel = 0;

    if (pPr) {
      const jcNode = pPr.getElementsByTagNameNS(
        "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
        "jc"
      )[0];
      if (jcNode) {
        alignment = jcNode.getAttribute("w:val") || "left";
      }

      const pStyle = pPr.getElementsByTagNameNS(
        "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
        "pStyle"
      )[0];
      if (pStyle) {
        const styleVal = pStyle.getAttribute("w:val") || "";
        if (styleVal.match(/Heading(\d)/i)) {
          isHeading = true;
          headingLevel = parseInt(RegExp.$1);
          isBold = true;
          if (headingLevel === 1) fontSize = 16;
          else if (headingLevel === 2) fontSize = 14;
          else fontSize = 13;
        }
      }
    }

    paragraphs.push({ text, isBold, fontSize, alignment, isHeading, headingLevel });
  }

  // Generate PDF - A4 size with proper margins
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginLeft = 35;
  const marginRight = 25;
  const marginTop = 30;
  const marginBottom = 25;
  const contentWidth = pageWidth - marginLeft - marginRight;

  let y = marginTop;

  for (const para of paragraphs) {
    if (!para.text.trim()) {
      y += 4;
      if (y > pageHeight - marginBottom) {
        pdf.addPage();
        y = marginTop;
      }
      continue;
    }

    const fontStyle = para.isBold ? "bold" : "normal";
    pdf.setFont("helvetica", fontStyle);
    pdf.setFontSize(para.fontSize);

    const lines = pdf.splitTextToSize(para.text, contentWidth);
    const lineHeight = para.fontSize * 0.5;

    // Check if we need a new page
    if (y + lines.length * lineHeight > pageHeight - marginBottom) {
      pdf.addPage();
      y = marginTop;
    }

    // Add spacing before headings
    if (para.isHeading) {
      y += 4;
    }

    let xPos = marginLeft;
    let textAlign: "left" | "center" | "right" | "justify" = "left";
    
    if (para.alignment === "center") {
      textAlign = "center";
      xPos = pageWidth / 2;
    } else if (para.alignment === "right") {
      textAlign = "right";
      xPos = pageWidth - marginRight;
    } else if (para.alignment === "both") {
      textAlign = "justify";
    }

    for (const line of lines) {
      if (y > pageHeight - marginBottom) {
        pdf.addPage();
        y = marginTop;
      }
      pdf.text(line, xPos, y, { align: textAlign, maxWidth: contentWidth });
      y += lineHeight;
    }

    // Add spacing after headings
    if (para.isHeading) {
      y += 2;
    }

    y += 2; // paragraph spacing
  }

  return pdf.output("blob");
}
