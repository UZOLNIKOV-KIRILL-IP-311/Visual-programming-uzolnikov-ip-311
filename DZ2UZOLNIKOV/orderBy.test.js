const orderBy = require('./orderBy');

describe('orderBy testing', () => {
    test('Correct sorting by multiple properties', () => {
        const data = [
            { name: "Bob", age: 22 },
            { name: "Patric", age: 43 },
            { name: "Jane", age: 34 },
            { name: "Bob", age: 35 }
        ];
        const properties = ["name", "age"];
        const result = orderBy(data, properties);
        expect(result).toEqual([
            { name: "Bob", age: 22 },
            { name: "Bob", age: 35 },
            { name: "Jane", age: 34 },
            { name: "Patric", age: 43 }
        ]);
    });

    test('Exception when passing non-array of objects', () => {
        const invalidData = [1, 2, 3];
        const properties = ["name"];
        expect(() => orderBy(invalidData, properties)).toThrow(TypeError);
    });

    test('Exception when property is missing in objects', () => {
        const data = [
            { name: "Bob", age: 22 },
            { name: "Patric"} 
        ];
        const properties = ["age"];
        expect(() => orderBy(data, properties)).toThrow(Error);
    });

});