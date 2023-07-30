type Type = "YES_NO" | "RATING" | "MULTIPLE_CHOICE" | "TEXT";
type Question = QuestionYesNo | QuestionRating | QuestionText | QuestionMultipleChoice;
const types = ["YES_NO", "RATING", "MULTIPLE_CHOICE", "TEXT"] as const;
export {types}
export interface QuestionBase {
  uuid: string;
  type: Type;
  timeOut?: number;
  text?: string;
  img?: string;
}

export interface QuestionYesNo extends QuestionBase {
  type: "YES_NO";
  labelYes: string;
  labelNo: string;
}
export interface QuestionMultipleChoice extends QuestionBase {
  type: "MULTIPLE_CHOICE";
  options: string[];
  numberOfSelections: number;
}
export interface QuestionRating extends QuestionBase {
  type: "RATING";
  labelMin: string;
  labelMax: string;
}
export interface QuestionText extends QuestionBase {
  type: "TEXT";
  wordCount: number;
}

export type { Question };
