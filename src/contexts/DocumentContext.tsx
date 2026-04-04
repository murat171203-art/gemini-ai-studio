import React, { createContext, useContext, useState, useCallback } from "react";
import type { RepairStats } from "@/lib/docxRepair";

export type University = "ktmu" | "bmu" | "knu" | "ktu";

interface DocumentState {
  originalFile: File | null;
  repairedBlob: Blob | null;
  repairStats: RepairStats | null;
  isProcessing: boolean;
  fileName: string;
  university: University | null;
  isPaid: boolean;
}

interface DocumentContextType extends DocumentState {
  setOriginalFile: (file: File) => void;
  setRepairedResult: (blob: Blob, stats: RepairStats) => void;
  setProcessing: (v: boolean) => void;
  setUniversity: (u: University) => void;
  reset: () => void;
}

const initialState: DocumentState = {
  originalFile: null,
  repairedBlob: null,
  repairStats: null,
  isProcessing: false,
  fileName: "",
  university: null,
};

const DocumentContext = createContext<DocumentContextType | null>(null);

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DocumentState>(initialState);

  const setOriginalFile = useCallback((file: File) => {
    setState(prev => ({ ...prev, originalFile: file, fileName: file.name, repairedBlob: null, repairStats: null }));
  }, []);

  const setRepairedResult = useCallback((blob: Blob, stats: RepairStats) => {
    setState(prev => ({ ...prev, repairedBlob: blob, repairStats: stats, isProcessing: false }));
  }, []);

  const setProcessing = useCallback((v: boolean) => {
    setState(prev => ({ ...prev, isProcessing: v }));
  }, []);

  const setUniversity = useCallback((u: University) => {
    setState(prev => ({ ...prev, university: u }));
  }, []);

  const reset = useCallback(() => setState(initialState), []);

  return (
    <DocumentContext.Provider value={{ ...state, setOriginalFile, setRepairedResult, setProcessing, setUniversity, reset }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocument = () => {
  const ctx = useContext(DocumentContext);
  if (!ctx) throw new Error("useDocument must be used within DocumentProvider");
  return ctx;
};
