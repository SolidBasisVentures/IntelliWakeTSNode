export declare const KeyboardLine: (question: string, validAnswers?: string[] | undefined) => Promise<string>;
export declare const KeyboardKey: (question?: string | undefined, validKeys?: string[] | ((key: string) => boolean) | undefined) => Promise<string>;
