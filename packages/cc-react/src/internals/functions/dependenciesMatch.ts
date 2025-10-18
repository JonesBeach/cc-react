export function dependenciesMatch(mount: FunctionLifecycle) {
    for (let i = 0; i < mount.depCurr.length; i++) {
        // there's something terribly wrong if the arrays are not the same length
        const currDependency = mount.depCurr[i];
        const previousDependency = mount.depPrev![i];

        if (currDependency !== previousDependency) {
            return false;
        }
    }

    return true;
}
