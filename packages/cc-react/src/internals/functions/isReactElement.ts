export function isReactElement(arg: any): boolean {
    if (typeof arg !== "object" || arg === null) {
        return false;
    }

    const keys = Object.keys(arg);
    return keys.includes("children") && keys.includes("props");
}
