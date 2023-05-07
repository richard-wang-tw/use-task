import * as T from "fp-ts/Task";
export type UseTaskInput<Result> = {
    id: string;
    task: T.Task<Result>;
};
export declare const useTask: <Result>({ id, task }: UseTaskInput<Result>) => Result;
export declare const deleteTaskCache: (id: string) => void;
