import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FileUpload } from "@/components/FileUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { extractText } from "@/lib/documentParser";
import { analyzeText } from "@/lib/textAnalyzer";

const analyzeDocument = async (file: File) => {
  // Extract text from the document
  const text = await extractText(file);
  
  if (!text || text.length < 50) {
    throw new Error("Could not extract enough text from the document. Please ensure the document contains readable text.");
  }
  
  // Analyze the extracted text
  const analysis = analyzeText(text);
  
  return {
    plagiarismScore: analysis.plagiarismScore,
    aiScore: analysis.aiScore,
    wordCount: analysis.wordCount,
    fileName: file.name,
    highlights: analysis.highlights,
  };
};

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const analysisResults = await analyzeDocument(file);
      setResults(analysisResults);
      toast({
        title: "Analysis Complete",
        description: "Your document has been analyzed successfully.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {!results ? (
        <>
          <HeroSection />
          <FileUpload onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
          <FeaturesSection />
          <HowItWorks />
        </>
      ) : (
        <div className="pt-16">
          <AnalysisResults results={results} onReset={handleReset} />
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
