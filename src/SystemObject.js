/**
 * Base class for all classes defining some shared members.
 */
const typeNameToFromJson = new Map();

export default class SystemObject {

    /**
     * All classes that support json marshalling and unmarshalling need to register.
     */
    static register(typeName, fromJson) {
        if(!typeName){
            throw new Error("Missing typeName");
        }
        if(typeof typeName !== "string"){
            throw new Error("Expected string typeName got " + typeName);
        }
        if(!fromJson){
            throw new Error("Missing function fromJson");
        }
        if(typeof fromJson !== "function"){
            throw new Error("Expected function fromJson got " + fromJson);
        }
        typeNameToFromJson.set(typeName, fromJson);
    }

    /**
     * Unmarshalls the json which has a type and value.
     */
    static fromJsonWithType(json) {
        var result;

        const typeType = typeof json;
        switch(typeType) {
            case "boolean":
            case "number":
            case "string":
                result = json;
                break;
            case "object":
                if(Array.isArray(json)) {
                    fromJsonWithTypeFail(json);
                }
                if(json){
                    const {type, value} = json;
                    if(!type){
                        throw new Error("Missing type got " + json);
                    }
                    if(typeof type !== "string"){
                        throw new Error("Expected string type got " + type);
                    }
                    const unmarshaller = typeNameToFromJson.get(type);
                    if(!unmarshaller){
                        throw new Error("Unable to find unmarshaller for " + type);
                    }
                    result = unmarshaller(value);
                }else {
                    result = null;
                }
                break;
            default:
                fromJsonWithTypeFail(json);
        }

        return result;
    }

    /**
     * Unmarshalls the json array using the element factory function.
     */
    static fromJsonList(json, element) {
        if(!json){
            throw new Error("Missing array");
        }
        if(!Array.isArray(json)){
            throw new Error("Expected array json got " + json);
        }
        if(!element){
            throw new Error("Missing element");
        }
        if(typeof element !== "function"){
            throw new Error("Expected function element got " + element);
        }
        return json.map(e => element(e));
    }

    /**
     * Unmarshalls a json array where each element has its type set.
     */
    static fromJsonListWithType(json) {
        return SystemObject.fromJsonList(
            json,
            SystemObject.fromJsonWithType
        );
    }

    static toJsonWithType(value) {
        if(null == value){
            throw new Error("Missing value");
        }

        let json;

        if(value instanceof SystemObject){
            json = value.toJsonWithType();
        }else {
            const type = typeof value;
            switch(type) {
                case "boolean":
                    json = {
                        type: "boolean",
                        value: value,
                    };
                    break;
                case "string":
                    json = {
                        type: "string",
                        value: value,
                    };
                    break;
                case "number":
                    json = {
                        type: "double",
                        value: value,
                    };
                    break;
                case "object":
                case "function":
                    throw new Error("Unsupported type " + value);
            }
        }

        return json;
    }

    // eslint-disable-next-line no-useless-constructor
    constructor() {
    }

    equals(other) {
        return this === other;
    }

    toJson() {
        throw new Error("Not yet implemented.");
    }

    typeName() {
        throw new Error("Not yet implemented.");
    }

    toJsonWithType() {
        return {
            type: this.typeName(),
            value: this.toJson()
        };
    }
}

function fromJsonWithTypeFail(json) {
    throw new Error("Expected boolean/string/null/number/object got " + json);
}

function unmarshallDouble(json) {
    if(typeof json !== "number"){
        throw new Error("Expected number got " + JSON.stringify(json));
    }
    return json;
}

SystemObject.register("double", unmarshallDouble);

function unmarshallString(json) {
    if(typeof json !== "string"){
        throw new Error("Expected string got " + JSON.stringify(json));
    }
    return json;
}

SystemObject.register("string", unmarshallString);
