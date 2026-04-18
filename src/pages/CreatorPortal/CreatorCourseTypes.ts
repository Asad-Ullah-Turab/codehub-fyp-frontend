import type { CourseSection, CourseLesson, Quiz } from "../../services/adminCourseAPI";

export type CourseEnrollment = {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  status: string;
  enrollmentDate: string;
  overallProgress: number;
  totalTimeSpentMinutes: number;
  notes?: string;
};

export type SectionForm = {
  title: string;
  description: string;
  order: number;
  estimatedHours: number;
};

export type LessonForm = {
  title: string;
  description: string;
  content: string;
  order: number;
  duration: number;
  difficulty: string;
};

export type QuizOption = {
  text: string;
  isCorrect: boolean;
};

export type QuizQuestion = {
  question: string;
  type: string;
  options: QuizOption[];
  points: number;
  explanation: string;
};

export type QuizForm = {
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number;
  questions: QuizQuestion[];
};
