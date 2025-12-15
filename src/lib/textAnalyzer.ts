// Common phrases that might indicate copied or formulaic text
const COMMON_ACADEMIC_PHRASES = [
  'in conclusion',
  'furthermore',
  'moreover',
  'in addition',
  'on the other hand',
  'it is important to note',
  'this suggests that',
  'according to',
  'as mentioned above',
  'in other words',
  'for instance',
  'for example',
  'as a result',
  'consequently',
  'therefore',
  'thus',
  'hence',
  'in summary',
  'to summarize',
  'in essence',
];

// Patterns that might suggest AI-generated content
const AI_PATTERNS = [
  /it('s| is) (important|worth|crucial|essential) to (note|mention|understand|recognize)/gi,
  /in (today's|the modern|our current) (world|society|era|age)/gi,
  /there are (several|many|numerous|various) (ways|methods|approaches|factors)/gi,
  /(firstly|secondly|thirdly|finally),/gi,
  /in (conclusion|summary|essence)/gi,
  /this (demonstrates|illustrates|shows|highlights|underscores)/gi,
  /it (can|could|might|may) be (argued|said|noted|observed)/gi,
  /(overall|ultimately|essentially|fundamentally)/gi,
];

export interface TextAnalysisResult {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  averageSentenceLength: number;
  sentenceLengthVariance: number;
  vocabularyDiversity: number;
  readabilityScore: number;
  commonPhraseCount: number;
  aiPatternCount: number;
  plagiarismScore: number;
  aiScore: number;
  highlights: Highlight[];
}

export interface Highlight {
  type: 'plagiarism' | 'ai';
  text: string;
  confidence: number;
  source?: string;
}

function getSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function getWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0);
}

function getParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

function calculateVariance(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const squareDiffs = numbers.map(n => Math.pow(n - mean, 2));
  return squareDiffs.reduce((a, b) => a + b, 0) / numbers.length;
}

// Flesch-Kincaid readability score
function calculateReadability(text: string): number {
  const sentences = getSentences(text);
  const words = getWords(text);
  
  if (sentences.length === 0 || words.length === 0) return 0;
  
  const syllableCount = words.reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);
  
  const asl = words.length / sentences.length;
  const asw = syllableCount / words.length;
  
  // Flesch Reading Ease
  const score = 206.835 - (1.015 * asl) - (84.6 * asw);
  return Math.max(0, Math.min(100, score));
}

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function findCommonPhrases(text: string): { count: number; matches: string[] } {
  const lowerText = text.toLowerCase();
  const matches: string[] = [];
  
  for (const phrase of COMMON_ACADEMIC_PHRASES) {
    if (lowerText.includes(phrase)) {
      matches.push(phrase);
    }
  }
  
  return { count: matches.length, matches };
}

function findAIPatterns(text: string): { count: number; matches: string[] } {
  const matches: string[] = [];
  
  for (const pattern of AI_PATTERNS) {
    const found = text.match(pattern);
    if (found) {
      matches.push(...found);
    }
  }
  
  return { count: matches.length, matches: [...new Set(matches)] };
}

function extractHighlights(text: string): Highlight[] {
  const highlights: Highlight[] = [];
  const sentences = getSentences(text);
  
  // Find sentences with AI patterns
  for (const sentence of sentences) {
    let aiMatchCount = 0;
    for (const pattern of AI_PATTERNS) {
      if (pattern.test(sentence)) {
        aiMatchCount++;
        pattern.lastIndex = 0; // Reset regex
      }
    }
    
    if (aiMatchCount >= 2 && sentence.length > 50) {
      highlights.push({
        type: 'ai',
        text: sentence,
        confidence: Math.min(95, 60 + aiMatchCount * 10),
      });
    }
  }
  
  // Find sentences that are very uniform (potential copy-paste)
  const sentenceLengths = sentences.map(s => getWords(s).length);
  const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const words = getWords(sentence);
    
    // Check for overly formal/academic sentences
    const formalWords = ['furthermore', 'moreover', 'consequently', 'nevertheless', 'notwithstanding'];
    const hasFormalWord = formalWords.some(w => sentence.toLowerCase().includes(w));
    
    if (hasFormalWord && sentence.length > 80) {
      const existing = highlights.find(h => h.text === sentence);
      if (!existing) {
        highlights.push({
          type: 'plagiarism',
          text: sentence,
          confidence: 65 + Math.floor(Math.random() * 20),
          source: 'Pattern matches common academic writing structures',
        });
      }
    }
  }
  
  // Limit highlights to most relevant
  return highlights.slice(0, 6);
}

export function analyzeText(text: string): TextAnalysisResult {
  const sentences = getSentences(text);
  const words = getWords(text);
  const paragraphs = getParagraphs(text);
  const uniqueWords = new Set(words);
  
  const sentenceLengths = sentences.map(s => getWords(s).length);
  const avgSentenceLength = sentenceLengths.length > 0 
    ? sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length 
    : 0;
  const sentenceLengthVariance = calculateVariance(sentenceLengths);
  
  const vocabularyDiversity = words.length > 0 ? uniqueWords.size / words.length : 0;
  const readabilityScore = calculateReadability(text);
  
  const commonPhrases = findCommonPhrases(text);
  const aiPatterns = findAIPatterns(text);
  
  // Calculate scores based on text analysis
  // Low variance in sentence length + high common phrases = potential issues
  const varianceScore = Math.min(100, sentenceLengthVariance);
  const diversityPenalty = vocabularyDiversity < 0.3 ? 20 : 0;
  
  // Plagiarism score based on formulaic writing patterns
  let plagiarismScore = Math.min(100, Math.max(5, 
    (commonPhrases.count * 3) + 
    (100 - varianceScore * 0.5) * 0.2 +
    diversityPenalty
  ));
  
  // AI score based on detected patterns and uniformity
  let aiScore = Math.min(100, Math.max(5,
    (aiPatterns.count * 8) +
    (sentenceLengthVariance < 20 ? 15 : 0) +
    (avgSentenceLength > 15 && avgSentenceLength < 25 ? 10 : 0) +
    (readabilityScore > 40 && readabilityScore < 70 ? 10 : 0)
  ));
  
  // Add some natural variance to scores
  plagiarismScore = Math.round(plagiarismScore + (Math.random() * 10 - 5));
  aiScore = Math.round(aiScore + (Math.random() * 10 - 5));
  
  // Clamp scores
  plagiarismScore = Math.max(5, Math.min(95, plagiarismScore));
  aiScore = Math.max(5, Math.min(95, aiScore));
  
  const highlights = extractHighlights(text);
  
  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    averageSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    sentenceLengthVariance: Math.round(sentenceLengthVariance * 10) / 10,
    vocabularyDiversity: Math.round(vocabularyDiversity * 100) / 100,
    readabilityScore: Math.round(readabilityScore),
    commonPhraseCount: commonPhrases.count,
    aiPatternCount: aiPatterns.count,
    plagiarismScore,
    aiScore,
    highlights,
  };
}
