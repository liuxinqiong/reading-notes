function checkIfExistInvalidPolygon(object, prefix = '') {
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            const element = object[key];
            const currentPrefix = `${prefix}.${key}`
            const isObject = typeof element === 'object' && element !== null;
            if (!isObject) {
                continue;
            }
            if (isObject && element.type === 'Polygon') {
                console.log(currentPrefix)
                const isValid = isValidPolygonJSON(element)
                if (!isValid) {
                    return true
                }
                continue;
            }
            const isExist = checkIfExistInvalidPolygon(element, currentPrefix);
            if (isExist) {
                return true;
            }
        }
    }
    return false;
}

function isValidPolygonJSON(polygonJSON) {
    return polygonJSON.type === 'Polygon' &&
        Array.isArray(polygonJSON.coordinates) &&
        Array.isArray(polygonJSON.coordinates[0]) &&
        Array.isArray(polygonJSON.coordinates[0][0])
        && polygonJSON.coordinates[0][0].length === 2
}