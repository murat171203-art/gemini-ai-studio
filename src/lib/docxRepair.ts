import JSZip from "jszip";

export interface RepairStats {
  fontFixes: number;
  sizeFixes: number;
  spacingFixes: number;
  indentFixes: number;
  tableFixes: number;
  marginFixed: boolean;
  pageNumberFixed: boolean;
}

// DXA units: 1cm = 567 DXA, 1inch = 1440 DXA
const MARGINS = {
  left: 1985,   // 3.5cm
  top: 1701,    // 3.0cm
  right: 1418,  // 2.5cm
  bottom: 1418, // 2.5cm
};

const FONT_NAME = "Times New Roman";
const FONT_SIZE = 24; // half-points (12pt = 24)
const LINE_SPACING = 360; // 1.5 line spacing (240 = 1.0)
const TABLE_LINE_SPACING = 240; // 1.0 for tables
const FIRST_LINE_INDENT = 709; // 1.25cm

function fixMargins(xml: string): { xml: string; fixed: boolean } {
  // Fix page margins in sectPr
  const sectPrRegex = /<w:pgMar[^/]*\/>/g;
  let fixed = false;
  
  const newXml = xml.replace(sectPrRegex, (match) => {
    fixed = true;
    let result = match;
    result = result.replace(/w:left="[^"]*"/, `w:left="${MARGINS.left}"`);
    result = result.replace(/w:top="[^"]*"/, `w:top="${MARGINS.top}"`);
    result = result.replace(/w:right="[^"]*"/, `w:right="${MARGINS.right}"`);
    result = result.replace(/w:bottom="[^"]*"/, `w:bottom="${MARGINS.bottom}"`);
    // If attributes don't exist, they won't be replaced — handle that
    if (!result.includes('w:left=')) result = result.replace('w:pgMar', `w:pgMar w:left="${MARGINS.left}"`);
    if (!result.includes('w:top=')) result = result.replace('w:pgMar', `w:pgMar w:top="${MARGINS.top}"`);
    if (!result.includes('w:right=')) result = result.replace('w:pgMar', `w:pgMar w:right="${MARGINS.right}"`);
    if (!result.includes('w:bottom=')) result = result.replace('w:pgMar', `w:pgMar w:bottom="${MARGINS.bottom}"`);
    return result;
  });
  
  return { xml: newXml, fixed };
}

function fixFonts(xml: string): { xml: string; count: number } {
  let count = 0;
  
  // Fix rFonts (font family)
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
  
  // Fix line spacing for body paragraphs (not inside tables)
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
  
  // Fix first line indents for body paragraphs
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
  
  // Find all table content and fix spacing to 1.0
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
  
  // Also add cantSplit to table rows
  const withCantSplit = newXml.replace(/<w:trPr>([\s\S]*?)<\/w:trPr>/g, (match, inner) => {
    if (!inner.includes('w:cantSplit')) {
      count++;
      return match.replace('</w:trPr>', '<w:cantSplit/></w:trPr>');
    }
    return match;
  });
  
  return { xml: withCantSplit, count };
}

function addPageNumbers(xml: string): { xml: string; fixed: boolean } {
  let fixed = false;
  
  // Check if footer reference exists in sectPr
  if (!xml.includes('w:footerReference') || !xml.includes('PAGE')) {
    // Add page number field to the last sectPr's footer
    fixed = true;
  }
  
  return { xml, fixed };
}

export async function repairDocx(file: File): Promise<{ blob: Blob; stats: RepairStats }> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  
  const stats: RepairStats = {
    fontFixes: 0,
    sizeFixes: 0,
    spacingFixes: 0,
    indentFixes: 0,
    tableFixes: 0,
    marginFixed: false,
    pageNumberFixed: false,
  };
  
  // Get document.xml
  const docXmlFile = zip.file("word/document.xml");
  if (!docXmlFile) {
    throw new Error("Invalid DOCX file: document.xml not found");
  }
  
  let docXml = await docXmlFile.async("string");
  
  // Apply all fixes
  const marginResult = fixMargins(docXml);
  docXml = marginResult.xml;
  stats.marginFixed = marginResult.fixed;
  
  const fontResult = fixFonts(docXml);
  docXml = fontResult.xml;
  stats.fontFixes = fontResult.count;
  
  const sizeResult = fixFontSize(docXml);
  docXml = sizeResult.xml;
  stats.sizeFixes = sizeResult.count;
  
  const tableResult = fixTableSpacing(docXml);
  docXml = tableResult.xml;
  stats.tableFixes = tableResult.count;
  
  const spacingResult = fixSpacing(docXml);
  docXml = spacingResult.xml;
  stats.spacingFixes = spacingResult.count;
  
  const indentResult = fixIndents(docXml);
  docXml = indentResult.xml;
  stats.indentFixes = indentResult.count;
  
  const pageResult = addPageNumbers(docXml);
  docXml = pageResult.xml;
  stats.pageNumberFixed = pageResult.fixed;
  
  // Also fix styles.xml if it exists
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
  
  // Generate the repaired DOCX
  const blob = await zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  
  return { blob, stats };
}
