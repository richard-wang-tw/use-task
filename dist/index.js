import { identity } from "fp-ts/lib/function";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";
const caches = {};
const readTaskFromCache = (id) => O.fromNullable(caches[id]);
const createNewTaskCache = ({ id, task, }) => ({
    result: O.none,
    promise: task().then((result) => pipe(readTaskFromCache(id), O.map((cache) => {
        cache.result = O.some(result);
    }))),
});
const caseNewTask = (input) => () => pipe(createNewTaskCache(input), (cache) => {
    caches[input.id] = cache;
    throw cache.promise;
});
const caseExistingTask = (id) => (cache) => pipe(cache.result, O.fold(() => {
    throw cache.promise;
}, identity));
export const useTask = ({ id, task }) => pipe(readTaskFromCache(id), O.fold(caseNewTask({ id, task }), caseExistingTask(id)));
export const deleteTaskCache = (id) => {
    pipe(readTaskFromCache(id), O.map(() => {
        delete caches[id];
    }));
};
