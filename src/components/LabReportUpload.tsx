import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FaCloudUploadAlt } from 'react-icons/fa';
import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface LabReportUploadProps {
  patientId: string;
  onUploadSuccess: (extractedData: Partial<HealthMetric>) => void;
}

const LabReportUpload: React.FC<LabReportUploadProps> = ({ patientId, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  const processFile = async (selectedFile: File) => {
    setIsProcessing(true);
    try {
      let extractedText = '';

      // Handle PDF files
      if (selectedFile.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(selectedFile);
      }
      // Handle image files (JPG, PNG)
      else if (selectedFile.type.startsWith('image/')) {
        extractedText = await extractTextFromImage(selectedFile);
      }

      // Extract medical metrics from text
      const extractedData = parseLabReport(extractedText);

      if (Object.keys(extractedData).length > 0) {
        onUploadSuccess(extractedData);
        alert('Lab report processed successfully!');
      } else {
        alert('Could not extract medical data from the report.');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process lab report');
    } finally {
      setIsProcessing(false);
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let extractedText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      extractedText += textContent.items.map(item => item.str).join(' ');
    }

    return extractedText;
  };

  const extractTextFromImage = async (file: File): Promise<string> => {
    const { data: { text } } = await Tesseract.recognize(
      file,
      'eng',
      { logger: m => console.log(m) }
    );
    return text;
  };

  const parseLabReport = (text: string): Partial<HealthMetric> => {
    const extractedData: Partial<HealthMetric> = {};

    // Regex patterns for extracting medical metrics
    const patterns = {
      hbA1c: /HbA1c[:\s]*(\d+\.?\d*)/i,
      fastingGlucose: /Fasting Glucose[:\s]*(\d+\.?\d*)/i,
      totalCholesterol: /Total Cholesterol[:\s]*(\d+\.?\d*)/i,
      hdlC: /HDL[:\s]*(\d+\.?\d*)/i,
      ldlC: /LDL[:\s]*(\d+\.?\d*)/i,
      triglycerides: /Triglycerides[:\s]*(\d+\.?\d*)/i,
      eGFR: /eGFR[:\s]*(\d+\.?\d*)/i,
      uAlbCreatinineRatio: /Urine Albumin[:\s]*(\d+\.?\d*)/i
    };

    // Extract values using regex
    Object.entries(patterns).forEach(([key, regex]) => {
      const match = text.match(regex);
      if (match) {
        extractedData[key] = parseFloat(match[1]);
      }
    });

    return extractedData;
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type.startsWith('image/'))) {
      setFile(droppedFile);
      processFile(droppedFile);
    }
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 p-6 text-center rounded-lg"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center justify-center mx-auto mb-4 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        disabled={isProcessing}
      >
        <FaCloudUploadAlt className="mr-2" />
        {isProcessing ? 'Processing...' : 'Upload Lab Report'}
      </button>
      {file && (
        <p className="text-sm text-gray-600">
          Selected file: {file.name}
        </p>
      )}
      <p className="text-xs text-gray-500">
        Drag and drop PDF or image files, or click to select
      </p>
    </div>
  );
};

export default LabReportUpload;