type Type = "YES_NO" | "RATING" | "MULTIPLE_CHOICE" | "TEXT";
type Question = QuestionYesNo | QuestionRating
export interface QuestionBase {
  uuid: string;
  type: Type;
  text?: string;
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

export type {Question}