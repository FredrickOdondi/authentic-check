import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FileUpload } from "@/components/FileUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

// Mock analysis function - will be replaced with real AI analysis
const mockAnalyze = async (file: File) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 3000));
  
  return {
    plagiarismScore: Math.floor(Math.random() * 40) + 5,
    aiScore: Math.floor(Math.random() * 50) + 10,
    wordCount: Math.floor(Math.random() * 5000) + 1000,
    fileName: file.name,
    highlights: [
      {
        type: "plagiarism" as const,
        text: "The quick brown fox jumps over the lazy dog, demonstrating every letter of the English alphabet in a single sentence.",
        source: "https://example.com/source",
        confidence: 87,
      },
      {
        type: "ai" as const,
        text: "In conclusion, this analysis reveals significant patterns that suggest a systematic approach to the underlying methodology.",
        confidence: 92,
      },
      {
        type: "plagiarism" as const,
        text: "Furthermore, the implementation of these strategies has proven to be remarkably effective in achieving the desired outcomes.",
        source: "https://academic-journal.org/article",
        confidence: 76,
      },
    ],
  };
};

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const analysisResults = await mockAnalyze(file);
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
