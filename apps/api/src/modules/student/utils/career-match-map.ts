import { TCareerMatchItem } from "@student/types/student.types";
import { IntelligenceKey } from "@prisma/client";

const CAREER_MATCH_MAP: Record<IntelligenceKey, TCareerMatchItem[]> = {
  LINGUISTIC: [
    {
      title: "Content Strategist",
      description:
        "Writing, storytelling, editorial and communication-heavy roles.",
      fitReason: "Strong verbal expression and language processing.",
      score: 92,
    },
    {
      title: "Lawyer",
      description: "Argumentation, persuasion and structured language work.",
      fitReason: "High linguistic reasoning and communication clarity.",
      score: 88,
    },
  ],
  LOGICAL_MATHEMATICAL: [
    {
      title: "Software Engineer",
      description: "Problem solving, logic, structure and systems thinking.",
      fitReason: "Strong analytical and mathematical reasoning.",
      score: 93,
    },
    {
      title: "Data Analyst",
      description: "Data interpretation, reporting and model-driven thinking.",
      fitReason: "High logic and numerical pattern recognition.",
      score: 89,
    },
  ],
  MUSICAL: [
    {
      title: "Music Producer",
      description: "Audio composition, rhythm and sound arrangement.",
      fitReason: "Strong sensitivity to sound and musical structure.",
      score: 91,
    },
  ],
  BODILY_KINESTHETIC: [
    {
      title: "Physiotherapist",
      description: "Movement-oriented applied care and physical coordination.",
      fitReason: "Strong body control and motion-based learning.",
      score: 87,
    },
  ],
  VISUAL_SPATIAL: [
    {
      title: "Architect",
      description: "Spatial design, structure visualization and planning.",
      fitReason: "High visual and spatial interpretation.",
      score: 94,
    },
    {
      title: "UI Designer",
      description: "Visual hierarchy, layout and experience design.",
      fitReason: "Strong layout and visualization skill.",
      score: 88,
    },
  ],
  NATURALISTIC: [
    {
      title: "Environmental Researcher",
      description: "Nature systems, observation and ecosystem analysis.",
      fitReason: "Strong sensitivity to environmental patterns.",
      score: 90,
    },
  ],
  INTERPERSONAL: [
    {
      title: "School Counselor",
      description: "Support, guidance and social communication.",
      fitReason: "Strong empathy and collaboration skill.",
      score: 93,
    },
    {
      title: "HR Specialist",
      description: "People operations, communication and support.",
      fitReason: "High interpersonal engagement and people-awareness.",
      score: 86,
    },
  ],
  INTRAPERSONAL: [
    {
      title: "Psychologist",
      description: "Self-awareness, reflection and emotional analysis.",
      fitReason: "Strong internal reflection and self-understanding.",
      score: 91,
    },
    {
      title: "Researcher",
      description: "Independent inquiry, deep focus and self-directed work.",
      fitReason: "High internal discipline and reflective cognition.",
      score: 85,
    },
  ],
};

export const getCareerMatchesByDominantIntelligence = (
  intelligence: IntelligenceKey,
): TCareerMatchItem[] => {
  return CAREER_MATCH_MAP[intelligence] ?? [];
};
