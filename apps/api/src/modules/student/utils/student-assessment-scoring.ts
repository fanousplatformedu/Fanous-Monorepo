import { IntelligenceKey } from "@prisma/client";

export const INTELLIGENCE_QUESTION_MAP: Record<IntelligenceKey, number[]> = {
  MUSICAL: [2, 4, 13, 23, 28, 34, 42, 65, 73, 75],
  INTRAPERSONAL: [1, 16, 19, 31, 45, 57, 58, 61, 78],
  NATURALISTIC: [8, 18, 20, 21, 27, 33, 38, 44, 51, 60],
  LINGUISTIC: [6, 9, 17, 29, 35, 37, 55, 56, 63, 64, 70],
  INTERPERSONAL: [12, 14, 30, 41, 48, 52, 59, 66, 72, 79],
  LOGICAL_MATHEMATICAL: [5, 10, 11, 19, 22, 24, 32, 36, 69],
  BODILY_KINESTHETIC: [3, 7, 15, 26, 39, 40, 43, 47, 62, 67, 74],
  VISUAL_SPATIAL: [25, 29, 44, 49, 50, 53, 54, 68, 71, 76, 77, 80],
};

export type TSubmittedAnswer = {
  questionNumber: number;
  value: number;
};

export type TIntelligenceScore = {
  rawScore: number;
  maxScore: number;
  percentage: number;
  intelligence: IntelligenceKey;
  level: "VERY_STRONG" | "STRONG" | "MEDIUM" | "NEEDS_SUPPORT";
};

export function calculateIntelligenceScores(
  answers: TSubmittedAnswer[],
): TIntelligenceScore[] {
  const answerMap = new Map<number, number>();
  for (const answer of answers) {
    answerMap.set(answer.questionNumber, answer.value);
  }

  return Object.entries(INTELLIGENCE_QUESTION_MAP).map(
    ([intelligence, questionNumbers]) => {
      const rawScore = questionNumbers.reduce(
        (sum, questionNumber) => sum + (answerMap.get(questionNumber) ?? 0),
        0,
      );

      const maxScore = questionNumbers.length * 5;
      const percentage =
        maxScore > 0 ? Math.round((rawScore / maxScore) * 100) : 0;

      let level: TIntelligenceScore["level"] = "NEEDS_SUPPORT";
      if (percentage >= 80) level = "VERY_STRONG";
      else if (percentage >= 60) level = "STRONG";
      else if (percentage >= 40) level = "MEDIUM";

      return {
        level,
        rawScore,
        maxScore,
        percentage,
        intelligence: intelligence as IntelligenceKey,
      };
    },
  );
}

export const getDominantIntelligence = (
  scores: TIntelligenceScore[],
): IntelligenceKey => {
  return [...scores].sort((a, b) => b.percentage - a.percentage)[0]
    .intelligence;
};

export const getAverageOverallScore = (
  scores: TIntelligenceScore[],
): number => {
  if (!scores.length) return 0;
  const total = scores.reduce((sum, item) => sum + item.percentage, 0);
  return Math.round(total / scores.length);
};
