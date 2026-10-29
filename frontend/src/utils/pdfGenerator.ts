import { jsPDF } from 'jspdf';
import { PredictResponse, SymptomItem } from '../types';

interface GeneratePdfOptions {
  predictionData: PredictResponse;
  selectedSymptoms: SymptomItem[];
  timestamp?: string;
  isSampleCase?: boolean;
}

export function generateAssessmentPdf({
  predictionData,
  selectedSymptoms,
  timestamp = new Date().toLocaleString(),
  isSampleCase = false,
}: GeneratePdfOptions): void {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    let y = 18;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text('DiagPulse AI — Clinical Decision Support Summary', 14, y);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Generated: ${timestamp} | Prototype Engine: Multinomial L2 Logistic Regression`, 14, y);
    y += 10;

    // Divider line
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(14, y, 196, y);
    y += 8;

    // Sample Case Notice if active
    if (isSampleCase) {
      doc.setFillColor(254, 243, 199); // amber-100
      doc.roundedRect(14, y, 182, 9, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(146, 64, 14); // amber-800
      doc.text('NOTICE: This report was generated from sample demonstration data, not a real patient assessment.', 18, y + 6);
      y += 14;
    }

    // Section 1: Reported Symptoms
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`1. Reported Symptoms (${selectedSymptoms.length} Selected)`, 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);

    const symptomNames = selectedSymptoms.map((s) => s.name).join(', ');
    const splitSymptoms = doc.splitTextToSize(symptomNames || 'No symptoms recorded', 182);
    doc.text(splitSymptoms, 14, y);
    y += splitSymptoms.length * 5 + 6;

    // Section 2: Model Assessment & Abstention Status
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('2. Differential Diagnosis Suggestions (Top Ranked Possibilities)', 14, y);
    y += 6;

    if (predictionData.insufficient_information) {
      doc.setFillColor(254, 243, 199);
      doc.roundedRect(14, y, 182, 16, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(146, 64, 14);
      doc.text('Safety Abstention: Insufficient Information', 18, y + 6);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const splitReason = doc.splitTextToSize(predictionData.abstention_reason || 'Presentation does not meet confidence threshold.', 174);
      doc.text(splitReason, 18, y + 11);
      y += 22;
    }

    // List top predictions
    predictionData.predictions.forEach((pred, index) => {
      // Check for page overflow
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      // Card box
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, y, 182, 22, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(`#${pred.rank} ${pred.display_name}`, 18, y + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(`Model Likelihood Score: ${pred.confidence_percentage}`, 18, y + 13);

      const contributing = pred.contributing_symptoms.map((c) => `${c.clean_name} (+${c.weight.toFixed(2)})`).join(', ');
      doc.text(`Key Evidence Weights: ${contributing || 'None above threshold'}`, 18, y + 18);

      y += 26;
    });

    // Section 3: Next Steps & Guidance
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('3. Recommended Next Steps', 14, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const guidanceText = [
      '• Share this summary with a qualified healthcare professional (general practitioner or specialist).',
      '• Clinical diagnosis requires comprehensive history-taking, physical exam, and confirmatory lab tests.',
      '• Seek immediate emergency medical care if you experience severe chest pain, shortness of breath, sudden numbness, or acute neurological deficits.',
    ];
    guidanceText.forEach((g) => {
      doc.text(g, 14, y);
      y += 5;
    });
    y += 6;

    // Section 4: Mandatory Medical Disclaimer
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setDrawColor(226, 232, 240);
    doc.line(14, y, 196, y);
    y += 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('IMPORTANT MEDICAL DISCLAIMER', 14, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // slate-400
    const disclaimer = doc.splitTextToSize(
      'DiagPulse AI is an educational clinical decision-support prototype and not an approved medical device. The suggestions in this document represent statistical machine learning pattern recognition across simulated training presentations. They do NOT constitute medical diagnoses, clinical determinations, or treatment recommendations. Never initiate, modify, or discontinue medication or therapy based on this report. Consult a licensed healthcare provider for all medical decisions.',
      182
    );
    doc.text(disclaimer, 14, y);

    // Save PDF
    const filename = `diagpulse-assessment-${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
  } catch (err) {
    console.error('Failed to generate assessment PDF:', err);
    throw new Error('PDF generation failed. Please try again or use the print function.');
  }
}
