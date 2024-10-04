// components/PdfViewer.tsx
"use client"; // Ensures this component is rendered on the client side

import { useEffect, useRef } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

interface PdfViewerProps {
  url: string; // URL of the PDF file
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      // Set the workerSrc for pdf.js
      GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.min.js`;

      try {
        // Load the PDF document
        const loadingTask = getDocument(url);
        const pdf = await loadingTask.promise;

        // Get the first page
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 0.5 }); // Adjust scale for thumbnail size

        // Set canvas dimensions
        if (canvasRef.current) {
          canvasRef.current.width = viewport.width;
          canvasRef.current.height = viewport.height;

          // Render the PDF page into the canvas context
          const context = canvasRef.current.getContext("2d");
          if (context) {
            await page.render({ canvasContext: context, viewport }).promise;
          }
        }
      } catch (error) {
        console.error("Error loading PDF: ", error);
      }
    };

    loadPdf();
  }, [url]);

  return <canvas ref={canvasRef} />;
};

export default PdfViewer;
