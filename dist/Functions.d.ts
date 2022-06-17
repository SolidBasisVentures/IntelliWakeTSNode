export declare const KeyboardLine: (question: string, validAnswers?: string[]) => Promise<string>;
export declare const KeyboardKey: (question?: string, validKeys?: string[] | ((key: string) => boolean) | undefined) => Promise<string>;
