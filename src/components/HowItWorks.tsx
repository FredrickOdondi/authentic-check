import { motion } from "framer-motion";
import { Upload, Cpu, FileCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Document",
    description: "Drag and drop your PDF or Word document into the upload area.",
  },
  {
    icon: Cpu,
    title: "AI Analysis",
    description: "Our advanced algorithms scan for plagiarism and AI-generated content.",
  },
  {
    icon: FileCheck,
    title: "Get Results",
    description: "Receive a detailed report with scores and highlighted sections.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to verify your document's integrity
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="flex flex-col md:flex-row items-center gap-4 md:gap-8"
            >
              <div className="flex flex-col items-center text-center max-w-xs">
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-card border border-border shadow-lg flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-accent" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block">
                  <ArrowRight className="w-6 h-6 text-border" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
