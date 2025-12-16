import jsPDF from 'jspdf';
import type { Tutorial } from '../functions/TutorialFunctions/tutorialFunctions';

/**
 * Export tutorial as PDF
 */
export const exportTutorialToPDF = (tutorial: Tutorial) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number, fontStyle: 'normal' | 'bold' = 'normal', color: [number, number, number] = [0, 0, 0]) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);
    pdf.setTextColor(color[0], color[1], color[2]);
    
    const lines = pdf.splitTextToSize(text, maxWidth);
    
    for (const line of lines) {
      if (yPosition + fontSize / 2 > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += fontSize / 2 + 2;
    }
  };

  // Helper function to add spacing
  const addSpacing = (space: number) => {
    yPosition += space;
    if (yPosition > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  };

  // Header with gradient-like effect
  pdf.setFillColor(139, 92, 246); // Purple
  pdf.rect(0, 0, pageWidth, 30, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CodeHub Tutorial', pageWidth / 2, 20, { align: 'center' });
  
  yPosition = 45;

  // Title
  addText(tutorial.title, 20, 'bold', [67, 56, 202]); // Indigo
  addSpacing(8);

  // Metadata
  pdf.setFillColor(243, 244, 246); // Gray background
  pdf.rect(margin, yPosition, maxWidth, 25, 'F');
  
  yPosition += 8;
  addText(`Language: ${tutorial.language.toUpperCase()}`, 11, 'bold', [79, 70, 229]);
  addText(`Difficulty: ${tutorial.difficulty}`, 11, 'bold', [79, 70, 229]);
  addText(`Concept: ${tutorial.concept || 'N/A'}`, 11, 'normal', [55, 65, 81]);
  addSpacing(10);

  // Content Section
  if (tutorial.content && tutorial.content.length > 0) {
    pdf.setDrawColor(139, 92, 246);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    addSpacing(8);
    
    addText('📖 Content', 16, 'bold', [139, 92, 246]);
    addSpacing(5);

    const contentLines = tutorial.content.split('\n');
    
    for (const line of contentLines) {
      if (!line.trim()) {
        addSpacing(4);
        continue;
      }

      // Handle headers
      if (line.startsWith('## ')) {
        addSpacing(6);
        addText(line.replace('## ', ''), 14, 'bold', [79, 70, 229]);
        addSpacing(3);
      } else if (line.startsWith('### ')) {
        addSpacing(4);
        addText(line.replace('### ', ''), 12, 'bold', [99, 102, 241]);
        addSpacing(2);
      } else if (line.startsWith('#### ')) {
        addSpacing(3);
        addText(line.replace('#### ', ''), 11, 'bold', [124, 58, 237]);
        addSpacing(2);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        addText(`  • ${line.substring(2)}`, 10, 'normal', [55, 65, 81]);
      } else if (line.match(/^\d+\./)) {
        addText(`  ${line}`, 10, 'normal', [55, 65, 81]);
      } else {
        addText(line, 10, 'normal', [31, 41, 55]);
      }
    }
  }

  // Code Examples Section
  if (tutorial.codeExamples && tutorial.codeExamples.length > 0) {
    addSpacing(10);
    pdf.setDrawColor(139, 92, 246);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    addSpacing(8);
    
    addText('💻 Code Examples', 16, 'bold', [139, 92, 246]);
    addSpacing(5);

    tutorial.codeExamples.forEach((example, index) => {
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      }

      // Example title
      addText(`Example ${index + 1}: ${example.title || 'Code Snippet'}`, 12, 'bold', [67, 56, 202]);
      addSpacing(3);

      // Description if available
      if (example.description) {
        addText(example.description, 9, 'normal', [75, 85, 99]);
        addSpacing(3);
      }

      // Code block with background
      const codeLines = example.code.split('\n');
      const codeHeight = (codeLines.length * 5) + 10;
      
      if (yPosition + codeHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFillColor(249, 250, 251); // Light gray
      pdf.rect(margin, yPosition - 3, maxWidth, codeHeight, 'F');
      pdf.setDrawColor(209, 213, 219);
      pdf.rect(margin, yPosition - 3, maxWidth, codeHeight);
      
      pdf.setFont('courier', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(17, 24, 39);
      
      codeLines.forEach((line, lineIndex) => {
        const codeLine = line.substring(0, 100); // Limit line length
        pdf.text(codeLine, margin + 5, yPosition + (lineIndex * 5) + 3);
      });
      
      yPosition += codeHeight + 8;
      pdf.setFont('helvetica', 'normal');
    });
  }

  // Tags Section
  if (tutorial.tags && tutorial.tags.length > 0) {
    addSpacing(10);
    pdf.setDrawColor(139, 92, 246);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    addSpacing(8);
    
    addText('🏷️ Tags', 14, 'bold', [139, 92, 246]);
    addSpacing(3);
    addText(tutorial.tags.join(', '), 10, 'normal', [107, 114, 128]);
  }

  // Footer
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFillColor(249, 250, 251);
    pdf.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    pdf.setFontSize(8);
    pdf.setTextColor(107, 114, 128);
    pdf.text(`Generated from CodeHub | Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
  }

  // Save the PDF
  const fileName = `${tutorial.concept || tutorial.title}_${tutorial.language}.pdf`.replace(/[^a-z0-9_\-\.]/gi, '_');
  pdf.save(fileName);
};
