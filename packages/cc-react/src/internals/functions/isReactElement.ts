export function isReactElement(arg: any): boolean {
    if (typeof arg !== "object") {
        return false;
    }

    const keys = Object.keys(arg);
    return keys.includes("children") && keys.includes("props");
}
