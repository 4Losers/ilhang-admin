import { isObject, isArray, camelCase, mapKeys, map } from 'lodash';

export const convertToCamelCase = (data: any): any => {
    if (isArray(data)) {
        return map(data, convertToCamelCase);
    }

    if (isObject(data)) {
        return mapKeys(data, (_, key) => camelCase(key));
    }

    return data;
}; 