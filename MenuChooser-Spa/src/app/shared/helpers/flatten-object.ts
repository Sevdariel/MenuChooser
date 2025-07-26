export function flattenObject(obj: any, parentKey = '', separator = '.'): any {
    return Object.keys(obj).reduce((acc, key) => {
        const fullKey = parentKey ? `${parentKey}${separator}${key}` : key;
        const lastKey = key.split(separator).pop() || key;

        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            // If the value is an object (and not null or array), recursively flatten it
            Object.assign(acc, flattenObject(obj[key], fullKey, separator));
        } else {
            // Otherwise, add the property to the result with just the last part of the key
            acc[lastKey] = obj[key];
        }

        return acc;
    }, {} as Record<string, any>);
}
