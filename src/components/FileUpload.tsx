import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, Loader2, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export const FileUpload = ({ onFileSelect, isAnalyzing }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          setError("File is too large. Maximum size is 10MB.");
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setError("Invalid file type. Please upload a PDF or Word document.");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isAnalyzing,
  });

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return <FileText className="w-8 h-8 text-accent" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <section id="upload" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Upload Your Document
            </h2>
            <p className="text-muted-foreground">
              Drag and drop your PDF or Word document for instant analysis
            </p>
          </div>

          <div
            {...getRootProps()}
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-8 sm:p-12 transition-all duration-300 cursor-pointer",
              isDragActive
                ? "border-accent bg-accent/5"
                : "border-border hover:border-accent/50 hover:bg-muted/50",
              isAnalyzing && "pointer-events-none opacity-50",
              error && "border-destructive"
            )}
          >
            <input {...getInputProps()} />

            <AnimatePresence mode="wait">
              {!selectedFile ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-accent" />
                  </div>
                  <p className="text-lg font-medium text-foreground mb-2">
                    {isDragActive ? "Drop your file here" : "Drop your document here"}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[".pdf", ".doc", ".docx"].map((format) => (
                      <span
                        key={format}
                        className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Maximum file size: 10MB
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="file-selected"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    {getFileIcon(selectedFile.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  {!isAnalyzing && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                      className="flex-shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyze button */}
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Document...
                  </>
                ) : (
                  <>
                    Analyze Document
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
