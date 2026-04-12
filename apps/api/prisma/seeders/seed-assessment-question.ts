import { MULTIPLE_INTELLIGENCE_QUESTIONS } from "@assessment/constants/multiple-intelligence-question";
import { TSeedCtx } from "@ctypes/seed.type";

export const seedAssessmentQuestions = async (ctx: TSeedCtx) => {
  const { prisma } = ctx;

  for (const q of MULTIPLE_INTELLIGENCE_QUESTIONS) {
    const question = await prisma.assessmentQuestion.upsert({
      where: { code: q.code },
      update: {
        text: q.text,
        order: q.order,
        isActive: true,
      },
      create: {
        code: q.code,
        text: q.text,
        order: q.order,
        isActive: true,
      },
      select: {
        id: true,
        code: true,
      },
    });

    await prisma.assessmentQuestionIntelligence.deleteMany({
      where: { questionId: question.id },
    });

    if (q.intelligenceKeys.length) {
      await prisma.assessmentQuestionIntelligence.createMany({
        data: q.intelligenceKeys.map((intelligenceKey) => ({
          questionId: question.id,
          intelligenceKey,
        })),
      });
    }
  }
};
