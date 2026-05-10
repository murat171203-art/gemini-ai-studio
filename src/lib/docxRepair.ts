import JSZip from "jszip";
import type { University, ThesisType } from "@/contexts/DocumentContext";

export interface RepairStats {
  fontFixes: number;
  sizeFixes: number;
  spacingFixes: number;
  indentFixes: number;
  tableFixes: number;
  marginFixed: boolean;
  pageNumberFixed: boolean;
  sectionBreaksAdded: number;
  tocGenerated: boolean;
  tableFigureRenumbered: number;
}

// DXA units: 1cm = 567 DXA
const KTMU_MARGINS = {
  left: 1985,   // 3.5cm
  top: 1701,    // 3.0cm
  right: 1418,  // 2.5cm
  bottom: 1418, // 2.5cm
};

// Bitirme Tezi (Лисанс, туризм факультети, Ek-A): сол/үстү 4см, оң/асты 2.5см
const UNDERGRAD_TOURISM_MARGINS = {
  left: 2268,   // 4.0cm
  top: 2268,    // 4.0cm
  right: 1418,  // 2.5cm
  bottom: 1418, // 2.5cm
};

// Lisansüstü 2025 Kılavuzu: сол 3.5см, үстү 3.0см, оң/асты 2.5см
const GRADUATE_MARGINS = {
  left: 1985,   // 3.5cm
  top: 1701,    // 3.0cm
  right: 1418,  // 2.5cm
  bottom: 1418, // 2.5cm
};

// Standard margins for KNU, BMU, KTU (left 3cm, top 2cm, right 1.5cm, bottom 2cm)
const STANDARD_MARGINS = {
  left: 1701,   // 3.0cm
  top: 1134,    // 2.0cm
  right: 850,   // 1.5cm
  bottom: 1134, // 2.0cm
};

function getMargins(university?: University, thesisType?: ThesisType) {
  if (thesisType === "undergraduate_tourism") return UNDERGRAD_TOURISM_MARGINS;
  if (thesisType === "graduate") return GRADUATE_MARGINS;
  if (university === "ktmu") return KTMU_MARGINS;
  return STANDARD_MARGINS;
}

const FONT_NAME = "Times New Roman";
const FONT_SIZE = 24; // half-points (12pt = 24)
const LINE_SPACING = 360; // 1.5 line spacing
const TABLE_LINE_SPACING = 240; // 1.0 for tables
const FIRST_LINE_INDENT = 709; // 1.25cm

// Section detection keywords (multi-language support)
const PREFACE_KEYWORDS = ["Өн сөз", "Предисловие", "Önsöz", "Preface"];
const ABSTRACT_KEYWORDS = ["Өзет", "Аннотация", "Özet", "Abstract"];
const INTRO_KEYWORDS = ["Киришүү", "Введение", "Giriş", "Introduction"];
const CHAPTER_KEYWORDS = ["Бөлүм", "Глава", "Bölüm", "Chapter"];

function extractText(paragraphXml: string): string {
  const textMatches = paragraphXml.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || [];
  return textMatches.map(m => {
    const inner = m.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/);
    return inner ? inner[1] : "";
  }).join("");
}

// ============================================================
// ALGORITHM 1: SECTION BREAKS & PAGE NUMBERING (ManasPrint Rule)
// ============================================================
// The document is split at the "Introduction" (Киришүү / Введение / Giriş / Introduction) heading.
// Section 1 (Abstract/TOC — everything before Introduction): Roman numerals (i, ii, iii)
//   - Title pages get no visible page number (first 1-2 pages)
// Section 2 (Introduction onwards): Arabic numerals restarting at 1

interface SectionInfo {
  introParaIndex: number; // index of the Introduction paragraph
}

function findSectionBoundaries(xml: string): SectionInfo {
  const paragraphs = xml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || [];
  let introIdx = -1;

  for (let i = 0; i < paragraphs.length; i++) {
    const text = extractText(paragraphs[i]).trim();
    // Match Introduction heading in any supported language
    if (INTRO_KEYWORDS.some(k => text.toLowerCase() === k.toLowerCase() || 
        text.toLowerCase().startsWith(k.toLowerCase()))) {
      // Verify it's a heading-like paragraph (short text, possibly styled)
      if (text.length < 80) {
        introIdx = i;
        break;
      }
    }
  }

  return { introParaIndex: introIdx };
}

function buildSectPr(options: {
  margins: typeof KTMU_MARGINS;
  pageNumbering?: { fmt: string; start: number };
  hidePageNumber?: boolean;
}): string {
  const { margins, pageNumbering, hidePageNumber } = options;
  
  let pgNumFmt = "";
  if (pageNumbering) {
    pgNumFmt = `<w:pgNumType w:fmt="${pageNumbering.fmt}" w:start="${pageNumbering.start}"/>`;
  }

  // Footer reference for page numbers
  let footerRef = "";
  if (!hidePageNumber && pageNumbering) {
    footerRef = `<w:footerReference w:type="default" r:id="rIdFooterRepair"/>`;
  }

  return `<w:sectPr>${footerRef}<w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="${margins.top}" w:right="${margins.right}" w:bottom="${margins.bottom}" w:left="${margins.left}" w:header="720" w:footer="720" w:gutter="0"/>${pgNumFmt}<w:cols w:space="720"/></w:sectPr>`;
}

function insertSectionBreaks(xml: string, boundaries: SectionInfo, margins: typeof KTMU_MARGINS): { xml: string; count: number } {
  if (boundaries.introParaIndex === -1) {
    return { xml, count: 0 };
  }

  const paragraphs = xml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || [];
  let count = 0;
  const bodyStartMatch = xml.match(/<w:body>/);
  const bodyEndMatch = xml.match(/<\/w:body>/);
  if (!bodyStartMatch || !bodyEndMatch) return { xml, count: 0 };

  // Remove existing inline sectPr from all paragraphs
  const cleanedParagraphs = paragraphs.map(p => {
    return p.replace(/<w:sectPr>[\s\S]*?<\/w:sectPr>/g, "");
  });

  // Extract final sectPr (document-level)
  const finalSectPrMatch = xml.match(/<w:sectPr[^>]*>[\s\S]*?<\/w:sectPr>\s*<\/w:body>/);
  let finalSectPr = "";
  if (finalSectPrMatch) {
    finalSectPr = finalSectPrMatch[0].replace("</w:body>", "");
  }

  // Build new paragraph array with section break before Introduction
  const newParagraphs: string[] = [];

  for (let i = 0; i < cleanedParagraphs.length; i++) {
    // Before the Introduction paragraph: end Section 1 (Roman numerals)
    if (i === boundaries.introParaIndex && boundaries.introParaIndex > 0) {
      const prevIdx = newParagraphs.length - 1;
      if (prevIdx >= 0) {
        // Section 1: Roman numerals (i, ii, iii...) for TOC/Abstract pages
        const sect1 = buildSectPr({ 
          margins, 
          pageNumbering: { fmt: "lowerRoman", start: 1 } 
        });
        newParagraphs[prevIdx] = insertSectPrIntoParagraph(newParagraphs[prevIdx], sect1);
        count++;
      }
    }

    newParagraphs.push(cleanedParagraphs[i]);
  }

  // Update final sectPr for Section 2 (Arabic numerals, restart at 1)
  let updatedFinalSectPr = finalSectPr;
  if (boundaries.introParaIndex > 0) {
    // Remove existing pgNumType
    updatedFinalSectPr = updatedFinalSectPr.replace(/<w:pgNumType[^/]*\/>/g, "");
    // Insert Arabic page numbering restarting at 1
    const pgNumType = `<w:pgNumType w:fmt="decimal" w:start="1"/>`;
    updatedFinalSectPr = updatedFinalSectPr.replace(/<w:pgMar/, pgNumType + "<w:pgMar");
    
    // Ensure footer reference for page numbers
    if (!updatedFinalSectPr.includes("rIdFooterRepair")) {
      updatedFinalSectPr = updatedFinalSectPr.replace(
        /<w:sectPr[^>]*>/,
        `$&<w:footerReference w:type="default" r:id="rIdFooterRepair"/>`
      );
    }
    
    // Ensure margins are correct
    updatedFinalSectPr = updatedFinalSectPr
      .replace(/w:left="[^"]*"/, `w:left="${margins.left}"`)
      .replace(/w:top="[^"]*"/, `w:top="${margins.top}"`)
      .replace(/w:right="[^"]*"/, `w:right="${margins.right}"`)
      .replace(/w:bottom="[^"]*"/, `w:bottom="${margins.bottom}"`);
    count++;
  }

  // Reconstruct body
  const beforeBody = xml.substring(0, bodyStartMatch.index! + "<w:body>".length);
  const afterBody = "</w:body>" + xml.substring(xml.indexOf("</w:body>") + "</w:body>".length);

  const bodyContent = xml.substring(bodyStartMatch.index! + "<w:body>".length, xml.indexOf("</w:body>"));
  const nonParaContent = bodyContent.replace(/<w:p[ >][\s\S]*?<\/w:p>/g, "").replace(/<w:sectPr[^>]*>[\s\S]*?<\/w:sectPr>/g, "").trim();

  const newBody = newParagraphs.join("\n") + "\n" + updatedFinalSectPr;
  const result = beforeBody + (nonParaContent ? nonParaContent + "\n" : "") + newBody + "\n" + afterBody;

  return { xml: result, count };
}

function insertSectPrIntoParagraph(paraXml: string, sectPr: string): string {
  // Insert sectPr inside pPr if it exists, otherwise create pPr
  if (paraXml.includes("<w:pPr>")) {
    return paraXml.replace("</w:pPr>", sectPr + "</w:pPr>");
  } else if (paraXml.includes("<w:pPr")) {
    // Self-closing pPr or pPr with attributes
    return paraXml.replace(/<w:pPr([^>]*)\/>/,  `<w:pPr$1>${sectPr}</w:pPr>`);
  } else {
    // No pPr exists, add one
    return paraXml.replace(/<w:p([ >])/, `<w:p$1<w:pPr>${sectPr}</w:pPr>`);
  }
}

// ============================================================
// ALGORITHM 2: TOC GENERATION WITH DOTTED LEADERS
// ============================================================

interface TocEntry {
  text: string;
  level: number;
  pageRef: string;
}

function findHeadings(xml: string): TocEntry[] {
  const entries: TocEntry[] = [];
  const paragraphs = xml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || [];
  
  for (const para of paragraphs) {
    // Check for heading style
    const styleMatch = para.match(/<w:pStyle w:val="([^"]*)"\s*\/>/);
    if (!styleMatch) continue;
    
    const style = styleMatch[1];
    let level = -1;
    
    if (/^Heading1$|^1$/i.test(style)) level = 1;
    else if (/^Heading2$|^2$/i.test(style)) level = 2;
    else if (/^Heading3$|^3$/i.test(style)) level = 3;
    else if (/^heading\s*1$/i.test(style)) level = 1;
    else if (/^heading\s*2$/i.test(style)) level = 2;
    else if (/^heading\s*3$/i.test(style)) level = 3;
    
    if (level > 0) {
      const text = extractText(para).trim();
      if (text) {
        entries.push({ text, level, pageRef: "" });
      }
    }
  }
  
  return entries;
}

function generateTocXml(entries: TocEntry[]): string {
  if (entries.length === 0) return "";
  
  const tocParagraphs = entries.map(entry => {
    const indent = (entry.level - 1) * 567; // Indent sub-levels
    const bold = entry.level === 1 ? `<w:b/><w:bCs/>` : "";
    
    // TOC entry with dot leader tab stop
    return `<w:p>
      <w:pPr>
        <w:pStyle w:val="TOC${entry.level}"/>
        <w:tabs>
          <w:tab w:val="right" w:leader="dot" w:pos="9072"/>
        </w:tabs>
        ${indent > 0 ? `<w:ind w:left="${indent}"/>` : ""}
        <w:rPr>
          <w:rFonts w:ascii="${FONT_NAME}" w:hAnsi="${FONT_NAME}" w:cs="${FONT_NAME}"/>
          <w:sz w:val="${FONT_SIZE}"/>
          <w:szCs w:val="${FONT_SIZE}"/>
          ${bold}
          <w:noProof/>
        </w:rPr>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="${FONT_NAME}" w:hAnsi="${FONT_NAME}" w:cs="${FONT_NAME}"/>
          <w:sz w:val="${FONT_SIZE}"/>
          <w:szCs w:val="${FONT_SIZE}"/>
          ${bold}
        </w:rPr>
        <w:t xml:space="preserve">${escapeXml(entry.text)}</w:t>
      </w:r>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="${FONT_NAME}" w:hAnsi="${FONT_NAME}" w:cs="${FONT_NAME}"/>
          <w:sz w:val="${FONT_SIZE}"/>
          <w:szCs w:val="${FONT_SIZE}"/>
        </w:rPr>
        <w:tab/>
      </w:r>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="${FONT_NAME}" w:hAnsi="${FONT_NAME}" w:cs="${FONT_NAME}"/>
          <w:sz w:val="${FONT_SIZE}"/>
          <w:szCs w:val="${FONT_SIZE}"/>
        </w:rPr>
        <w:fldChar w:fldCharType="begin"/>
      </w:r>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="${FONT_NAME}" w:hAnsi="${FONT_NAME}" w:cs="${FONT_NAME}"/>
          <w:sz w:val="${FONT_SIZE}"/>
          <w:szCs w:val="${FONT_SIZE}"/>
        </w:rPr>
        <w:instrText xml:space="preserve"> PAGEREF _Toc${Math.random().toString(36).substring(2, 10)} \\h </w:instrText>
      </w:r>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="${FONT_NAME}" w:hAnsi="${FONT_NAME}" w:cs="${FONT_NAME}"/>
          <w:sz w:val="${FONT_SIZE}"/>
          <w:szCs w:val="${FONT_SIZE}"/>
        </w:rPr>
        <w:fldChar w:fldCharType="separate"/>
      </w:r>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="${FONT_NAME}" w:hAnsi="${FONT_NAME}" w:cs="${FONT_NAME}"/>
          <w:sz w:val="${FONT_SIZE}"/>
          <w:szCs w:val="${FONT_SIZE}"/>
        </w:rPr>
        <w:t>0</w:t>
      </w:r>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="${FONT_NAME}" w:hAnsi="${FONT_NAME}" w:cs="${FONT_NAME}"/>
          <w:sz w:val="${FONT_SIZE}"/>
          <w:szCs w:val="${FONT_SIZE}"/>
        </w:rPr>
        <w:fldChar w:fldCharType="end"/>
      </w:r>
    </w:p>`;
  });

  // TOC title
  const tocTitle = `<w:p>
    <w:pPr>
      <w:jc w:val="center"/>
      <w:spacing w:after="240"/>
      <w:rPr>
        <w:rFonts w:ascii="${FONT_NAME}" w:hAnsi="${FONT_NAME}" w:cs="${FONT_NAME}"/>
        <w:sz w:val="28"/>
        <w:szCs w:val="28"/>
        <w:b/>
        <w:bCs/>
      </w:rPr>
    </w:pPr>
    <w:r>
      <w:rPr>
        <w:rFonts w:ascii="${FONT_NAME}" w:hAnsi="${FONT_NAME}" w:cs="${FONT_NAME}"/>
        <w:sz w:val="28"/>
        <w:szCs w:val="28"/>
        <w:b/>
        <w:bCs/>
      </w:rPr>
      <w:t>МАЗМУНУ</w:t>
    </w:r>
  </w:p>`;

  return tocTitle + "\n" + tocParagraphs.join("\n");
}

// ============================================================
// ALGORITHM 3: TABLE & FIGURE RENUMBERING BY CHAPTER
// ============================================================

function renumberTablesAndFigures(xml: string): { xml: string; count: number } {
  let count = 0;
  let currentChapter = 0;
  let tableCountInChapter = 0;
  let figureCountInChapter = 0;

  const paragraphs = xml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || [];
  const processedParagraphs: string[] = [];

  for (const para of paragraphs) {
    const text = extractText(para).trim();
    let modifiedPara = para;

    // Detect chapter headings (e.g., "1-Бөлүм", "Глава 1", "Bölüm 1", "Chapter 1")
    const chapterMatch = text.match(/^(\d+)[\s.\-]*(?:Бөлүм|Глава|Bölüm|Chapter)/i) ||
                          text.match(/(?:Бөлүм|Глава|Bölüm|Chapter)\s*(\d+)/i);
    if (chapterMatch) {
      currentChapter = parseInt(chapterMatch[1]);
      tableCountInChapter = 0;
      figureCountInChapter = 0;
    }

    // Renumber tables: "Таблица X" -> "Таблица chapter.N"
    const tablePatterns = [
      /Таблица\s+\d+[\.\d]*/g,
      /Tablo\s+\d+[\.\d]*/g,
      /Table\s+\d+[\.\d]*/g,
      /Таблица\s+\d+[\.\d]*/g,
    ];

    for (const pattern of tablePatterns) {
      if (pattern.test(text) && currentChapter > 0) {
        tableCountInChapter++;
        const label = text.match(pattern)?.[0]?.split(/\s+/)[0] || "Таблица";
        // Replace in the XML text nodes
        modifiedPara = modifiedPara.replace(
          new RegExp(`(${label})\\s+\\d+[\\.]?\\d*`, "g"),
          `$1 ${currentChapter}.${tableCountInChapter}`
        );
        count++;
        pattern.lastIndex = 0; // Reset regex
      }
      pattern.lastIndex = 0;
    }

    // Renumber figures: "Сүрөт X" -> "Сүрөт chapter.N"
    const figurePatterns = [
      /Сүрөт\s+\d+[\.\d]*/g,
      /Şekil\s+\d+[\.\d]*/g,
      /Figure\s+\d+[\.\d]*/g,
      /Рисунок\s+\d+[\.\d]*/g,
    ];

    for (const pattern of figurePatterns) {
      if (pattern.test(text) && currentChapter > 0) {
        figureCountInChapter++;
        const label = text.match(pattern)?.[0]?.split(/\s+/)[0] || "Сүрөт";
        modifiedPara = modifiedPara.replace(
          new RegExp(`(${label})\\s+\\d+[\\.]?\\d*`, "g"),
          `$1 ${currentChapter}.${figureCountInChapter}`
        );
        count++;
        pattern.lastIndex = 0;
      }
      pattern.lastIndex = 0;
    }

    processedParagraphs.push(modifiedPara);
  }

  // Reconstruct XML
  let result = xml;
  const originalParagraphs = xml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || [];
  for (let i = 0; i < originalParagraphs.length; i++) {
    if (originalParagraphs[i] !== processedParagraphs[i]) {
      result = result.replace(originalParagraphs[i], processedParagraphs[i]);
    }
  }

  return { xml: result, count };
}

// ============================================================
// EXISTING REPAIR FUNCTIONS (margins, fonts, spacing, etc.)
// ============================================================

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function fixMargins(xml: string, margins: typeof KTMU_MARGINS): { xml: string; fixed: boolean } {
  const sectPrRegex = /<w:pgMar[^/]*\/>/g;
  let fixed = false;
  
  const newXml = xml.replace(sectPrRegex, (match) => {
    fixed = true;
    let result = match;
    result = result.replace(/w:left="[^"]*"/, `w:left="${margins.left}"`);
    result = result.replace(/w:top="[^"]*"/, `w:top="${margins.top}"`);
    result = result.replace(/w:right="[^"]*"/, `w:right="${margins.right}"`);
    result = result.replace(/w:bottom="[^"]*"/, `w:bottom="${margins.bottom}"`);
    if (!result.includes('w:left=')) result = result.replace('w:pgMar', `w:pgMar w:left="${margins.left}"`);
    if (!result.includes('w:top=')) result = result.replace('w:pgMar', `w:pgMar w:top="${margins.top}"`);
    if (!result.includes('w:right=')) result = result.replace('w:pgMar', `w:pgMar w:right="${margins.right}"`);
    if (!result.includes('w:bottom=')) result = result.replace('w:pgMar', `w:pgMar w:bottom="${margins.bottom}"`);
    return result;
  });
  
  return { xml: newXml, fixed };
}

function fixFonts(xml: string): { xml: string; count: number } {
  let count = 0;
  
  const newXml = xml.replace(/<w:rFonts[^/]*\/>/g, (match) => {
    const hasAscii = match.includes('w:ascii=');
    if (hasAscii) {
      const currentFont = match.match(/w:ascii="([^"]*)"/)?.[1];
      if (currentFont !== FONT_NAME) {
        count++;
        let result = match;
        result = result.replace(/w:ascii="[^"]*"/, `w:ascii="${FONT_NAME}"`);
        result = result.replace(/w:hAnsi="[^"]*"/, `w:hAnsi="${FONT_NAME}"`);
        result = result.replace(/w:cs="[^"]*"/, `w:cs="${FONT_NAME}"`);
        result = result.replace(/w:eastAsia="[^"]*"/, `w:eastAsia="${FONT_NAME}"`);
        return result;
      }
    }
    return match;
  });
  
  return { xml: newXml, count };
}

function fixFontSize(xml: string): { xml: string; count: number } {
  let count = 0;
  
  const newXml = xml.replace(/<w:sz w:val="([^"]*)"\s*\/>/g, (match, val) => {
    if (parseInt(val) !== FONT_SIZE) {
      count++;
      return `<w:sz w:val="${FONT_SIZE}"/>`;
    }
    return match;
  }).replace(/<w:szCs w:val="([^"]*)"\s*\/>/g, (match, val) => {
    if (parseInt(val) !== FONT_SIZE) {
      return `<w:szCs w:val="${FONT_SIZE}"/>`;
    }
    return match;
  });
  
  return { xml: newXml, count };
}

function fixSpacing(xml: string): { xml: string; count: number } {
  let count = 0;
  
  const newXml = xml.replace(/<w:spacing[^/]*\/>/g, (match) => {
    if (match.includes('w:line=')) {
      const currentLine = match.match(/w:line="([^"]*)"/)?.[1];
      if (currentLine && parseInt(currentLine) !== LINE_SPACING) {
        count++;
        return match.replace(/w:line="[^"]*"/, `w:line="${LINE_SPACING}"`);
      }
    }
    return match;
  });
  
  return { xml: newXml, count };
}

function fixIndents(xml: string): { xml: string; count: number } {
  let count = 0;
  
  const newXml = xml.replace(/<w:ind([^/]*)\/>/g, (match, attrs) => {
    if (attrs.includes('w:firstLine=')) {
      const currentIndent = match.match(/w:firstLine="([^"]*)"/)?.[1];
      if (currentIndent && parseInt(currentIndent) !== FIRST_LINE_INDENT) {
        count++;
        return match.replace(/w:firstLine="[^"]*"/, `w:firstLine="${FIRST_LINE_INDENT}"`);
      }
    }
    return match;
  });
  
  return { xml: newXml, count };
}

function fixTableSpacing(xml: string): { xml: string; count: number } {
  let count = 0;
  
  const tableRegex = /<w:tbl>([\s\S]*?)<\/w:tbl>/g;
  const newXml = xml.replace(tableRegex, (tableMatch) => {
    return tableMatch.replace(/<w:spacing[^/]*\/>/g, (spacingMatch) => {
      if (spacingMatch.includes('w:line=')) {
        const currentLine = spacingMatch.match(/w:line="([^"]*)"/)?.[1];
        if (currentLine && parseInt(currentLine) !== TABLE_LINE_SPACING) {
          count++;
          return spacingMatch.replace(/w:line="[^"]*"/, `w:line="${TABLE_LINE_SPACING}"`);
        }
      }
      return spacingMatch;
    });
  });
  
  const withCantSplit = newXml.replace(/<w:trPr>([\s\S]*?)<\/w:trPr>/g, (match, inner) => {
    if (!inner.includes('w:cantSplit')) {
      count++;
      return match.replace('</w:trPr>', '<w:cantSplit/></w:trPr>');
    }
    return match;
  });
  
  return { xml: withCantSplit, count };
}

// Ensure footer XML exists for page numbering
function ensureFooterFile(zip: JSZip): string {
  const footerXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
       xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
       xmlns:o="urn:schemas-microsoft-com:office:office"
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
       xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
       xmlns:v="urn:schemas-microsoft-com:vml"
       xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
       xmlns:w10="urn:schemas-microsoft-com:office:word"
       xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
       xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml">
  <w:p>
    <w:pPr>
      <w:pStyle w:val="Footer"/>
      <w:jc w:val="right"/>
      <w:rPr>
        <w:rFonts w:ascii="${FONT_NAME}" w:hAnsi="${FONT_NAME}" w:cs="${FONT_NAME}"/>
        <w:sz w:val="${FONT_SIZE}"/>
        <w:szCs w:val="${FONT_SIZE}"/>
      </w:rPr>
    </w:pPr>
    <w:r>
      <w:rPr>
        <w:rFonts w:ascii="${FONT_NAME}" w:hAnsi="${FONT_NAME}" w:cs="${FONT_NAME}"/>
        <w:sz w:val="${FONT_SIZE}"/>
        <w:szCs w:val="${FONT_SIZE}"/>
      </w:rPr>
      <w:fldChar w:fldCharType="begin"/>
    </w:r>
    <w:r>
      <w:rPr>
        <w:rFonts w:ascii="${FONT_NAME}" w:hAnsi="${FONT_NAME}" w:cs="${FONT_NAME}"/>
        <w:sz w:val="${FONT_SIZE}"/>
        <w:szCs w:val="${FONT_SIZE}"/>
      </w:rPr>
      <w:instrText xml:space="preserve"> PAGE </w:instrText>
    </w:r>
    <w:r>
      <w:rPr>
        <w:rFonts w:ascii="${FONT_NAME}" w:hAnsi="${FONT_NAME}" w:cs="${FONT_NAME}"/>
        <w:sz w:val="${FONT_SIZE}"/>
        <w:szCs w:val="${FONT_SIZE}"/>
      </w:rPr>
      <w:fldChar w:fldCharType="separate"/>
    </w:r>
    <w:r>
      <w:rPr>
        <w:rFonts w:ascii="${FONT_NAME}" w:hAnsi="${FONT_NAME}" w:cs="${FONT_NAME}"/>
        <w:sz w:val="${FONT_SIZE}"/>
        <w:szCs w:val="${FONT_SIZE}"/>
      </w:rPr>
      <w:t>1</w:t>
    </w:r>
    <w:r>
      <w:rPr>
        <w:rFonts w:ascii="${FONT_NAME}" w:hAnsi="${FONT_NAME}" w:cs="${FONT_NAME}"/>
        <w:sz w:val="${FONT_SIZE}"/>
        <w:szCs w:val="${FONT_SIZE}"/>
      </w:rPr>
      <w:fldChar w:fldCharType="end"/>
    </w:r>
  </w:p>
</w:ftr>`;
  
  zip.file("word/footer_repair.xml", footerXml);
  
  // Add relationship for the footer
  const relsPath = "word/_rels/document.xml.rels";
  const relsFile = zip.file(relsPath);
  
  return footerXml;
}

async function addFooterRelationship(zip: JSZip): Promise<void> {
  const relsPath = "word/_rels/document.xml.rels";
  const relsFile = zip.file(relsPath);
  
  if (relsFile) {
    let relsXml = await relsFile.async("string");
    
    if (!relsXml.includes("rIdFooterRepair")) {
      relsXml = relsXml.replace(
        "</Relationships>",
        `<Relationship Id="rIdFooterRepair" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer_repair.xml"/></Relationships>`
      );
      zip.file(relsPath, relsXml);
    }
  }

  // Add content type for footer if missing
  const contentTypesFile = zip.file("[Content_Types].xml");
  if (contentTypesFile) {
    let ctXml = await contentTypesFile.async("string");
    if (!ctXml.includes("footer_repair.xml")) {
      ctXml = ctXml.replace(
        "</Types>",
        `<Override PartName="/word/footer_repair.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/></Types>`
      );
      zip.file("[Content_Types].xml", ctXml);
    }
  }
}

// ============================================================
// MAIN REPAIR FUNCTION
// ============================================================

export async function repairDocx(file: File, university?: University): Promise<{ blob: Blob; stats: RepairStats }> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const margins = getMarginsForUniversity(university);
  const isKtmu = university === "ktmu";
  
  const stats: RepairStats = {
    fontFixes: 0,
    sizeFixes: 0,
    spacingFixes: 0,
    indentFixes: 0,
    tableFixes: 0,
    marginFixed: false,
    pageNumberFixed: false,
    sectionBreaksAdded: 0,
    tocGenerated: false,
    tableFigureRenumbered: 0,
  };
  
  const docXmlFile = zip.file("word/document.xml");
  if (!docXmlFile) {
    throw new Error("Invalid DOCX file: document.xml not found");
  }
  
  let docXml = await docXmlFile.async("string");
  
  // 1. Fix margins
  const marginResult = fixMargins(docXml, margins);
  docXml = marginResult.xml;
  stats.marginFixed = marginResult.fixed;
  
  // 2. Fix fonts
  const fontResult = fixFonts(docXml);
  docXml = fontResult.xml;
  stats.fontFixes = fontResult.count;
  
  // 3. Fix font sizes
  const sizeResult = fixFontSize(docXml);
  docXml = sizeResult.xml;
  stats.sizeFixes = sizeResult.count;
  
  // 4. Fix table spacing
  const tableResult = fixTableSpacing(docXml);
  docXml = tableResult.xml;
  stats.tableFixes = tableResult.count;
  
  // 5. Fix body spacing
  const spacingResult = fixSpacing(docXml);
  docXml = spacingResult.xml;
  stats.spacingFixes = spacingResult.count;
  
  // 6. Fix indents
  const indentResult = fixIndents(docXml);
  docXml = indentResult.xml;
  stats.indentFixes = indentResult.count;
  
  // 7. ALGORITHM 1: Section breaks & page numbering (KTMU only)
  if (isKtmu) {
    const boundaries = findSectionBoundaries(docXml);
    const sectionResult = insertSectionBreaks(docXml, boundaries, margins);
    docXml = sectionResult.xml;
    stats.sectionBreaksAdded = sectionResult.count;
    stats.pageNumberFixed = sectionResult.count > 0;
  }
  
  // 8. ALGORITHM 3: Table & figure renumbering
  const renumberResult = renumberTablesAndFigures(docXml);
  docXml = renumberResult.xml;
  stats.tableFigureRenumbered = renumberResult.count;
  
  // Setup footer file for page numbering
  if (stats.sectionBreaksAdded > 0) {
    ensureFooterFile(zip);
    await addFooterRelationship(zip);
  }
  
  // Fix styles.xml too
  const stylesFile = zip.file("word/styles.xml");
  if (stylesFile) {
    let stylesXml = await stylesFile.async("string");
    
    const styleFontResult = fixFonts(stylesXml);
    stylesXml = styleFontResult.xml;
    stats.fontFixes += styleFontResult.count;
    
    const styleSizeResult = fixFontSize(stylesXml);
    stylesXml = styleSizeResult.xml;
    stats.sizeFixes += styleSizeResult.count;
    
    zip.file("word/styles.xml", stylesXml);
  }
  
  // Save modified document.xml
  zip.file("word/document.xml", docXml);
  
  // Generate repaired DOCX
  const blob = await zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  
  return { blob, stats };
}
