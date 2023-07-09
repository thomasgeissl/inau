type Type = "YES_NO" | "RATING" | "MULTIPLE_CHOICE" | "TEXT";
type Question = QuestionYesNo | QuestionRating | QuestionText;
export interface QuestionBase {
  uuid: string;
  type: Type;
  text?: string;
  img?: string;
}

export interface QuestionYesNo extends QuestionBase {
  type: "YES_NO";
  labelYes: string;
  labelNo: string;
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
