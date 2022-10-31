export type LangCode = "all" | "es" | "en" | "de" | "fr";
export type VideoTypeCode = "all" | "news" | "entertainment" | "finance";

export interface Language {
  name: string;
  code: LangCode;
  emoji: string;
}

export interface VideoType {
  name: string;
  code: VideoTypeCode;
  emoji: string;
}
