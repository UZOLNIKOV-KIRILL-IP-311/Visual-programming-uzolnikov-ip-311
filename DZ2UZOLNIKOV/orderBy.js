
function orderBy(array, properties) {
    if (!Array.isArray(array)) {
        throw new TypeError("Первый аргумент должен быть массивом!");
    }

    if (!array.every(item => typeof item === "object" && item !== null)) {
        throw new TypeError("Все элементы массива должны быть объектами!");
    }

    if (!Array.isArray(properties) || !properties.every(prop => typeof prop === "string")) {
        throw new TypeError("Второй аргумент должен быть массивом строк!");
    }

    const sortedArray = [...array];

    sortedArray.sort((a, b) => {
        for (const prop of properties) {
            if (!(prop in a) || !(prop in b)) {
                throw new Error(`Свойство "${prop}" отсутствует в одном из объектов!`);
            }

            if (a[prop] < b[prop]) return -1;
            if (a[prop] > b[prop]) return 1;
        }
        return 0;
    });

    return sortedArray;
}

module.exports = orderBy;