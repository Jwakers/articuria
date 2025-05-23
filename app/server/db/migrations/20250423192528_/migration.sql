-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('PERSONAL_EXPERIENCES', 'HYPOTHETICAL_SCENARIOS', 'CURRENT_EVENTS', 'PROFESSIONAL_DEVELOPMENT', 'ETHICAL_DILEMMAS', 'CULTURE_AND_SOCIETY', 'NATURE_AND_ENVIRONMENT', 'CREATIVITY_AND_IMAGINATION');

-- AlterTable
ALTER TABLE "TableTopic" ADD COLUMN     "difficulty" "Difficulty",
ADD COLUMN     "themes" "Theme";
