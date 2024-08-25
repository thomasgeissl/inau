type Type = "YES_NO" | "RATING" | "MULTIPLE_CHOICE" | "TEXT";
type Scene = SceneYesNo | SceneRating | QuestionText | SceneChoice;
const types = ["YES_NO", "RATING", "MULTIPLE_CHOICE", "TEXT"] as const;
export { types };
export interface SceneBase {
  uuid: string;
  type: Type;
  timeOut?: number;
  text?: string;
  img?: string;
}

export interface SceneYesNo extends SceneBase {
  type: "YES_NO";
  labelYes: string;
  labelNo: string;
}
export interface SceneChoice extends SceneBase {
  type: "MULTIPLE_CHOICE";
  options: string[];
  numberOfSelections: number;
}
export interface SceneRating extends SceneBase {
  type: "RATING";
  labelMin: string;
  labelMax: string;
}
export interface QuestionText extends SceneBase {
  type: "TEXT";
  wordCount: number;
}

export type { Scene as Scene };
