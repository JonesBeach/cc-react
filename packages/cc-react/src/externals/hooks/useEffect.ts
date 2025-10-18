import { GLOBALS } from "../../internals/globals";

export const useEffect = (func: FunctionLifecycle["func"], dependencies: any[]) => {
    const element = GLOBALS.NODE_CURRENT!;
    const cursor = element._effectsCursor;

    if (element._effects[cursor] === undefined) {
        element._effects[cursor] = { depCurr: dependencies, func };
    } else {
        element._effects[cursor].depPrev = element._effects[cursor].depCurr;
        element._effects[cursor].depCurr = dependencies;
        element._effects[cursor].func = func;
    }

    element._effectsCursor++;
};
