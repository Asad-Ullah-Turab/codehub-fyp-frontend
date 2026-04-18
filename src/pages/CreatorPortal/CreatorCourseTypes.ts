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

export type CodeExample = {
  title: string;
  description: string;
  code: string;
  language: string;
  input: string;
  expectedOutput: string;
  order: number;
  notes: string;
  explanation: string;
};

export type ResourceItem = {
  title: string;
  url: string;
  type: "documentation" | "article" | "video" | "reference" | "example";
  description: string;
  order: number;
};

export type LessonForm = {
  title: string;
  description: string;
  content: string;
  order: number;
  videoUrl: string;
  duration: number;
  difficulty: string;
  estimatedHours: number;
  codeExamples: CodeExample[];
  notes: string[];
  tips: string[];
  resources: ResourceItem[];
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
