
var cachedValues = {};

// Flux store Singleton way
export default Object.assign({}, {
    init (defaultValues) {
        for (const prop in defaultValues) {
            console.log('Query prop ' + prop);
            let testValue = window.localStorage.getItem(prop);
            if (testValue !== undefined && testValue !== null) {
                cachedValues[prop] = JSON.parse(testValue);
                console.log("Esitia valor para " + prop + ' ' + testValue)
            } else {
                window.localStorage.setItem(prop, JSON.stringify(defaultValues[prop]));
                console.log("No Esitia valor para " + prop + ', guardamos ' + defaultValues[prop])
            }
        }
    },
    get (prop) {
        return cachedValues[prop]
    },
    set (prop, value) {
        window.localStorage.setItem(prop, JSON.stringify(value));
    }
  });
