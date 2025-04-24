// table-topics-seed.ts
import { db } from "@/app/server/db";
import { TableTopic } from "@prisma/client";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

// pnpm dlx tsx scripts/table-topics-seed.ts

async function main() {
  const topics: Pick<TableTopic, "topic" | "difficulty" | "themes">[] = [
    // PERSONAL_EXPERIENCES
    {
      topic:
        "Describe a moment when you had to step outside your comfort zone. What did you learn?",
      difficulty: "INTERMEDIATE",
      themes: ["PERSONAL_EXPERIENCES"],
    },
    {
      topic: "Share a childhood memory that shaped who you are today.",
      difficulty: "BEGINNER",
      themes: ["PERSONAL_EXPERIENCES"],
    },
    {
      topic:
        "Tell us about a time when you failed but ultimately grew from the experience.",
      difficulty: "INTERMEDIATE",
      themes: ["PERSONAL_EXPERIENCES"],
    },
    {
      topic:
        "Describe your proudest achievement and why it means so much to you.",
      difficulty: "BEGINNER",
      themes: ["PERSONAL_EXPERIENCES"],
    },
    {
      topic:
        "Share a moment when your perspective on something important completely changed.",
      difficulty: "ADVANCED",
      themes: ["PERSONAL_EXPERIENCES"],
    },

    // HYPOTHETICAL_SCENARIOS
    {
      topic:
        "If you could master any skill instantly, what would it be and how would you use it?",
      difficulty: "BEGINNER",
      themes: ["HYPOTHETICAL_SCENARIOS"],
    },
    {
      topic:
        "If you could have dinner with any three people from history, who would you choose and why?",
      difficulty: "INTERMEDIATE",
      themes: ["HYPOTHETICAL_SCENARIOS"],
    },
    {
      topic:
        "Imagine you could live in any fictional world for a month. Where would you go and what would you do?",
      difficulty: "BEGINNER",
      themes: ["HYPOTHETICAL_SCENARIOS"],
    },
    {
      topic:
        "If you had to live without either the internet or electricity (but not both), which would you choose and how would you adapt?",
      difficulty: "ADVANCED",
      themes: ["HYPOTHETICAL_SCENARIOS"],
    },
    {
      topic:
        "If you could send a message to yourself 10 years ago, what would you say in just one sentence?",
      difficulty: "INTERMEDIATE",
      themes: ["HYPOTHETICAL_SCENARIOS"],
    },

    // PROFESSIONAL_DEVELOPMENT
    {
      topic:
        "Describe a skill you believe will be essential in your industry five years from now.",
      difficulty: "ADVANCED",
      themes: ["PROFESSIONAL_DEVELOPMENT"],
    },
    {
      topic:
        "Share a leadership lesson you've learned from a colleague or mentor.",
      difficulty: "INTERMEDIATE",
      themes: ["PROFESSIONAL_DEVELOPMENT"],
    },
    {
      topic: "How do you balance productivity and wellbeing in your work life?",
      difficulty: "INTERMEDIATE",
      themes: ["PROFESSIONAL_DEVELOPMENT"],
    },
    {
      topic:
        "Describe your approach to learning a new professional skill quickly.",
      difficulty: "BEGINNER",
      themes: ["PROFESSIONAL_DEVELOPMENT"],
    },
    {
      topic:
        "Talk about a time when you had to adapt to significant change in your professional life.",
      difficulty: "ADVANCED",
      themes: ["PROFESSIONAL_DEVELOPMENT", "PERSONAL_EXPERIENCES"],
    },

    // ETHICAL_DILEMMAS
    {
      topic: "Is it ever justified to break a promise? Explain your reasoning.",
      difficulty: "ADVANCED",
      themes: ["ETHICAL_DILEMMAS"],
    },
    {
      topic:
        "Should companies prioritise profit or social responsibility when they conflict?",
      difficulty: "EXPERT",
      themes: ["ETHICAL_DILEMMAS", "PROFESSIONAL_DEVELOPMENT"],
    },
    {
      topic: "Discuss the ethics of using AI to replace human workers.",
      difficulty: "ADVANCED",
      themes: ["ETHICAL_DILEMMAS", "PROFESSIONAL_DEVELOPMENT"],
    },
    {
      topic:
        "Is honesty always the best policy? Share your perspective with examples.",
      difficulty: "INTERMEDIATE",
      themes: ["ETHICAL_DILEMMAS"],
    },
    {
      topic:
        "Discuss whether privacy should be sacrificed for security in today's digital world.",
      difficulty: "EXPERT",
      themes: ["ETHICAL_DILEMMAS"],
    },

    // CULTURE_AND_SOCIETY
    {
      topic:
        "How has a book, film, or piece of art changed your perspective on society?",
      difficulty: "INTERMEDIATE",
      themes: ["CULTURE_AND_SOCIETY", "PERSONAL_EXPERIENCES"],
    },
    {
      topic:
        "Describe a cultural tradition you admire from a culture different from your own.",
      difficulty: "BEGINNER",
      themes: ["CULTURE_AND_SOCIETY"],
    },
    {
      topic: "How has technology changed the way we form communities?",
      difficulty: "ADVANCED",
      themes: ["CULTURE_AND_SOCIETY"],
    },
    {
      topic: "Discuss how language shapes our understanding of the world.",
      difficulty: "EXPERT",
      themes: ["CULTURE_AND_SOCIETY"],
    },
    {
      topic:
        "Share how generational differences have affected your relationships or workplace.",
      difficulty: "INTERMEDIATE",
      themes: ["CULTURE_AND_SOCIETY", "PROFESSIONAL_DEVELOPMENT"],
    },

    // NATURE_AND_ENVIRONMENT
    {
      topic:
        "Describe your connection to a particular natural place and why it matters to you.",
      difficulty: "BEGINNER",
      themes: ["NATURE_AND_ENVIRONMENT", "PERSONAL_EXPERIENCES"],
    },
    {
      topic:
        "How has your awareness of environmental issues changed throughout your life?",
      difficulty: "INTERMEDIATE",
      themes: ["NATURE_AND_ENVIRONMENT"],
    },
    {
      topic:
        "Share a small environmental change you've made that others could adopt.",
      difficulty: "BEGINNER",
      themes: ["NATURE_AND_ENVIRONMENT"],
    },
    {
      topic:
        "Discuss the balance between economic development and environmental protection.",
      difficulty: "EXPERT",
      themes: ["NATURE_AND_ENVIRONMENT", "ETHICAL_DILEMMAS"],
    },
    {
      topic: "How might humans adapt to climate change in the next century?",
      difficulty: "ADVANCED",
      themes: ["NATURE_AND_ENVIRONMENT"],
    },

    // CREATIVITY_AND_IMAGINATION
    {
      topic:
        "Invent a new holiday and explain its significance and traditions.",
      difficulty: "INTERMEDIATE",
      themes: ["CREATIVITY_AND_IMAGINATION"],
    },
    {
      topic:
        "Describe a world where one fundamental law of physics is different. How would life adapt?",
      difficulty: "EXPERT",
      themes: ["CREATIVITY_AND_IMAGINATION"],
    },
    {
      topic:
        "If you could create a new subject to be taught in all schools, what would it be and why?",
      difficulty: "INTERMEDIATE",
      themes: ["CREATIVITY_AND_IMAGINATION", "CULTURE_AND_SOCIETY"],
    },
    {
      topic:
        "Design your ideal city of the future. What features would make it unique?",
      difficulty: "ADVANCED",
      themes: ["CREATIVITY_AND_IMAGINATION"],
    },
    {
      topic: "Create a modern fable that teaches an important life lesson.",
      difficulty: "ADVANCED",
      themes: ["CREATIVITY_AND_IMAGINATION"],
    },
  ] as const;

  console.log(`Starting to seed ${topics.length} table topics...`);

  await Promise.all(
    topics.map(({ topic, difficulty, themes }) =>
      db.tableTopic.upsert({
        where: { topic },
        create: { topic, difficulty, themes },
        update: {},
      }),
    ),
  );

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
