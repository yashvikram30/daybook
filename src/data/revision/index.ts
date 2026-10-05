import { W1, W2 } from "./w01-02";
import { W3, W4 } from "./w03-04";
import { W5, W6 } from "./w05-06";
import { W7, W8 } from "./w07-08";
import { W9, W10 } from "./w09-10";
import { W11, W12 } from "./w11-12";
import { W13, W14 } from "./w13-14";
import { W15, W16 } from "./w15-16";
import { CARDS } from "./cards";
import type { Question } from "./types";

/** Every revision question, week 1 first. */
export const QUESTIONS: Question[] = [
  ...W1,
  ...W2,
  ...W3,
  ...W4,
  ...W5,
  ...W6,
  ...W7,
  ...W8,
  ...W9,
  ...W10,
  ...W11,
  ...W12,
  ...W13,
  ...W14,
  ...W15,
  ...W16,
  ...CARDS,
];
