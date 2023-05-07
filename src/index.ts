import { identity } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";
import * as T from "fp-ts/Task";

type TaskCache = {
  result: O.Option<unknown>;
  promise: Promise<unknown>;
};

type TaskCacheRecord = Record<string, TaskCache>;

type UseTaskInput<Result> = {
  id: string;
  task: T.Task<Result>;
};

const caches: TaskCacheRecord = {};

const readTaskFromCache = (id: string) => O.fromNullable(caches[id]);

const createNewTaskCache = <Result>({
  id,
  task,
}: UseTaskInput<Result>): TaskCache => ({
  result: O.none,
  promise: task().then((result) =>
    pipe(
      readTaskFromCache(id),
      O.map((cache) => {
        cache.result = O.some(result);
      })
    )
  ),
});

const caseNewTask =
  <Result>(input: UseTaskInput<Result>) =>
  () =>
    pipe(createNewTaskCache(input), (cache) => {
      caches[input.id] = cache;
      throw cache.promise;
    });

const caseExistingTask = (id: string) => (cache: TaskCache) =>
  pipe(
    cache.result,
    O.fold(() => {
      throw cache.promise;
    }, identity)
  );

export const useTask = <Result>({ id, task }: UseTaskInput<Result>) =>
  pipe(
    readTaskFromCache(id),
    O.fold(caseNewTask({ id, task }), caseExistingTask(id))
  ) as Result;

export const deleteTaskCache = (id: string) => {
  pipe(
    readTaskFromCache(id),
    O.map(() => {
      delete caches[id];
    })
  );
};
