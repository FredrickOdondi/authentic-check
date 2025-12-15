import { motion } from "framer-motion";
import { 
  FileText, 
  Bot, 
  Copy, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  Download
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface AnalysisResult {
  plagiarismScore: number;
  aiScore: number;
  wordCount: number;
  fileName: string;
  highlights: {
    type: "plagiarism" | "ai";
    text: string;
    source?: string;
    confidence: number;
  }[];
}

interface AnalysisResultsProps {
  results: AnalysisResult;
  onReset: () => void;
}

export const AnalysisResults = ({ results, onReset }: AnalysisResultsProps) => {
  const getScoreColor = (score: number) => {
    if (score < 20) return "text-success";
    if (score < 50) return "text-warning";
    return "text-danger";
  };

  const getScoreBackground = (score: number) => {
    if (score < 20) return "bg-success/10";
    if (score < 50) return "bg-warning/10";
    return "bg-danger/10";
  };

  const getScoreBorder = (score: number) => {
    if (score < 20) return "border-success/30";
    if (score < 50) return "border-warning/30";
    return "border-danger/30";
  };

  const getScoreLabel = (score: number) => {
    if (score < 20) return "Low Risk";
    if (score < 50) return "Moderate Risk";
    return "High Risk";
  };

  const getScoreIcon = (score: number) => {
    if (score < 20) return <CheckCircle className="w-5 h-5" />;
    if (score < 50) return <AlertTriangle className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
  };

  const ScoreCard = ({
    title,
    score,
    icon,
    description,
  }: {
    title: string;
    score: number;
    icon: React.ReactNode;
    description: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-6",
        getScoreBackground(score),
        getScoreBorder(score)
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", getScoreBackground(score))}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className={cn("flex items-center gap-1", getScoreColor(score))}>
          {getScoreIcon(score)}
          <span className="text-xs font-medium">{getScoreLabel(score)}</span>
        </div>
      </div>

      <div className="flex items-end gap-2">
        <span className={cn("text-5xl font-bold", getScoreColor(score))}>
          {score}
        </span>
        <span className="text-2xl font-bold text-muted-foreground mb-1">%</span>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 bg-background/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            score < 20 && "bg-success",
            score >= 20 && score < 50 && "bg-warning",
            score >= 50 && "bg-danger"
          )}
        />
      </div>
    </motion.div>
  );

  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Analysis Complete
                </h2>
                <p className="text-sm text-muted-foreground">
                  {results.fileName} • {results.wordCount.toLocaleString()} words
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="glass" size="sm">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
              <Button variant="secondary" size="sm" onClick={onReset}>
                Analyze Another
              </Button>
            </div>
          </div>

          {/* Score Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <ScoreCard
              title="Plagiarism Score"
              score={results.plagiarismScore}
              icon={<Copy className="w-5 h-5 text-accent" />}
              description="Content similarity with existing sources"
            />
            <ScoreCard
              title="AI Detection Score"
              score={results.aiScore}
              icon={<Bot className="w-5 h-5 text-accent" />}
              description="Probability of AI-generated content"
            />
          </div>

          {/* Highlighted Sections */}
          {results.highlights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">
                  Flagged Content
                </h3>
                <p className="text-sm text-muted-foreground">
                  {results.highlights.length} section{results.highlights.length !== 1 ? "s" : ""} detected
                </p>
              </div>

              <div className="divide-y divide-border">
                {results.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-6 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          highlight.type === "plagiarism"
                            ? "bg-warning/10"
                            : "bg-accent/10"
                        )}
                      >
                        {highlight.type === "plagiarism" ? (
                          <Copy className="w-4 h-4 text-warning" />
                        ) : (
                          <Bot className="w-4 h-4 text-accent" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium",
                              highlight.type === "plagiarism"
                                ? "bg-warning/10 text-warning"
                                : "bg-accent/10 text-accent"
                            )}
                          >
                            {highlight.type === "plagiarism"
                              ? "Potential Plagiarism"
                              : "AI-Generated"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {highlight.confidence}% confidence
                          </span>
                        </div>
                        <p className="text-sm text-foreground mb-2 italic">
                          "{highlight.text}"
                        </p>
                        {highlight.source && (
                          <a
                            href={highlight.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                          >
                            View Source
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 p-6 bg-card rounded-2xl border border-border"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Summary
            </h3>
            <p className="text-muted-foreground">
              {results.plagiarismScore < 20 && results.aiScore < 20 ? (
                "Your document appears to be original and human-written. It shows minimal similarity to existing sources and exhibits natural writing patterns consistent with human authorship."
              ) : results.plagiarismScore >= 50 || results.aiScore >= 50 ? (
                "This document shows significant indicators that require attention. We recommend reviewing the flagged sections and making necessary revisions to ensure academic integrity."
              ) : (
                "Your document shows some areas of concern. While not critical, we recommend reviewing the highlighted sections to ensure proper attribution and original content."
              )}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
