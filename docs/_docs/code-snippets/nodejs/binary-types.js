const IgniteClient = require('apache-ignite-client');
const IgniteClientConfiguration = IgniteClient.IgniteClientConfiguration;
const ObjectType = IgniteClient.ObjectType;
const CacheEntry = IgniteClient.CacheEntry;
const ComplexObjectType = IgniteClient.ComplexObjectType;

class Person {
    constructor(id = null, name = null, salary = null) {
        this.id = id;
        this.name = name;
        this.salary = salary;
    }
}

async function putGetComplexAndBinaryObjects() {
    const igniteClient = new IgniteClient();
    try {
        await igniteClient.connect(new IgniteClientConfiguration('127.0.0.1:10800'));
        const cache = await igniteClient.getOrCreateCache('myPersonCache');
        // Complex Object type for JavaScript Person class instances
        const personComplexObjectType = new ComplexObjectType(new Person(0, '', 0)).
        setFieldType('id', ObjectType.PRIMITIVE_TYPE.INTEGER);
        // Set cache key and value types
        cache.setKeyType(ObjectType.PRIMITIVE_TYPE.INTEGER).
        setValueType(personComplexObjectType);
        // Put Complex Objects to the cache
        await cache.put(1, new Person(1, 'John Doe', 1000));
        await cache.put(2, new Person(2, 'Jane Roe', 2000));
        // Get Complex Object; returned value is an instance of Person class
        const person = await cache.get(1);
        console.log(person);

        // New CacheClient instance of the same cache to operate with BinaryObjects
        const binaryCache = igniteClient.getCache('myPersonCache').
        setKeyType(ObjectType.PRIMITIVE_TYPE.INTEGER);
        // Get Complex Object from the cache in a binary form, returned value is an instance of BinaryObject class
        let binaryPerson = await binaryCache.get(2);
        console.log('Binary form of Person:');
        for (let fieldName of binaryPerson.getFieldNames()) {
            let fieldValue = await binaryPerson.getField(fieldName);
            console.log(fieldName + ' : ' + fieldValue);
        }
        // Modify Binary Object and put it to the cache
        binaryPerson.setField('id', 3, ObjectType.PRIMITIVE_TYPE.INTEGER).
        setField('name', 'Mary Major');
        await binaryCache.put(3, binaryPerson);

        // Get Binary Object from the cache and convert it to JavaScript Object
        binaryPerson = await binaryCache.get(3);
        console.log(await binaryPerson.toObject(personComplexObjectType));

        await igniteClient.destroyCache('myPersonCache');
    }
    catch (err) {
        console.log(err.message);
    }
    finally {
        igniteClient.disconnect();
    }
}

putGetComplexAndBinaryObjects();