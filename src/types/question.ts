

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
  topics_questions: {
    id: string;
    topic_id: string;
    question_id: string;
    topics: {
      id: string;
      name_en: string;
      name_vi: string;
    };
  }[];
  question_set_id?: string;
}
