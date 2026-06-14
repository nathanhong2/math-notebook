export interface Question {
  id: string;
  title: string;
  subject: string;
  questionImage: string | null;
  wrongAnswerImage: string | null;
  practices: boolean[]; // 5 checkboxes
  createdAt: number;
  updatedAt: number;
}
