

export interface Option {
  id: string;
  text_en: string;
  text_vi: string;
}

export interface QuestionVariant {
  id: string;
  name: string;
  options?: Option[];
}

export interface Question {
  id: string;
  question_en: string;
  question_vi: string;
  example_en?: string;
  example_vi?: string;
  question_variant: QuestionVariant[];
}
