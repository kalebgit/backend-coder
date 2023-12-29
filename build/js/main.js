"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { promises } = require("fs");
//ERROR WHEN AN INSTANCE ID IS DUPLICATED
class DuplicateID extends Error {
    constructor(message) {
        super(message);
        this.name = "DuplicateID";
    }
}
//ERROR WHEN AN INSTANCE IS NOT FOUND
class InstanceNotFound extends Error {
    constructor(message) {
        super(message);
        this.name = "InstanceNotFound";
    }
}
//ABSTRACT CLASS TO REPRESENT ALL INSTANCES: PRODUCTS, USERS, ETC
class Instance {
    constructor(id) {
        this.id = id;
    }
}
// CLASS THAT WILL MANAGE PRODUCTS, USERS, ETC
class Manager {
    constructor(file) {
        this.file = file;
        this._instances = [];
    }
    //FUNCTION TO ADD AN INSTANCE
    addInstance(instance) {
        if (this.getInstanceById(instance.id)) {
            throw new DuplicateID("No puedes ingresar un id que ya ha sido registrado, vuelve a intentarlo");
        }
        else {
            this.readFileAndUpdateInstances()
                .then(() => {
                this._instances.push(instance);
                console.log("el elemento fue agregado");
            })
                .catch((err) => {
                console.log(err);
            });
        }
    }
    addInstances(instances) {
        if (this._instances.some((value) => instances.some((ArgumentValue) => value.id == ArgumentValue.id))) {
            throw new DuplicateID("No puedes ingresar un id que ya ha sido registrado, vuelve a intentarlo");
        }
        else {
            this.readFileAndUpdateInstances()
                .then(() => {
                this._instances = this._instances.concat(instances);
                console.log("los elementos fueron agregados");
            })
                .catch((err) => {
                console.log(err);
            });
        }
    }
    //GETTER OF INSTANCES
    getInstances() {
        this.readFileAndUpdateInstances()
            .then(() => {
            return this._instances;
        })
            .catch((err) => {
            console.log("error al recuperar los datos: " + err);
        });
    }
    //FUNCTION TO UPDATE AN INSTANCE
    updateInstance(id, newInstance) {
        this.readFileAndUpdateInstances()
            .then(() => {
            if (this.getInstanceById(id) && id == newInstance.id) {
                const index = this._instances.findIndex((value) => value.id == id);
                this._instances[index] = newInstance;
                this.writeFile();
                console.log("El elemento fue actualizado");
            }
            else {
                throw new InstanceNotFound("elemento no encontrado por id");
            }
        })
            .catch((err) => {
            console.log(err);
        });
    }
    //FUNCTION TO DELETE AN INSTANCE
    deleteInstance(id) {
        this.readFileAndUpdateInstances()
            .then(() => {
            if (this.getInstanceById(id)) {
                const index = this._instances.findIndex((value) => value.id == id);
                this._instances.splice(index, 1);
                this.writeFile();
            }
            else {
                throw new InstanceNotFound("elemento no encontrado por id");
            }
        });
    }
    //FUNCTION TO GET INSTANCE BY ITS ID
    getInstanceById(id) {
        let instanceFound = this._instances.find((value) => {
            return value.id == id;
        });
        return instanceFound;
    }
    //FUNCTION TO WRITE ON THE FILE
    writeFile() {
        promises.writeFile(this.file, JSON.stringify(this._instances), { encoding: 'utf-8' })
            .then((value) => {
            console.log("resultado de la escritura del archivo: " + value);
        })
            .catch((err) => {
            console.log("Ups hubo un error al querer escribir en el archivo los datos: " + err);
        });
    }
    //ASYNC FUNCTION TO UPDATE THE INSTANCES FROM THE FILE
    readFileAndUpdateInstances() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(this.file);
                console.log(promises);
                this._instances = JSON.parse(yield promises.readFile(this.file.toString(), { encoding: 'utf-8' }));
                return Promise.resolve();
            }
            catch (err) {
                console.log("Ups hubo un error y no se pudieron actualizar los datos: " + err);
                return Promise.reject();
            }
        });
    }
}
//CLASSES FOR ALL THE INSTANCES
//PRODUCT
class Product extends Instance {
    //using index signatures to access 
    constructor(title, description, price, thumbnail, code, stock) {
        super(Product.idCounter);
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        Product.idCounter++;
    }
}
Product.idCounter = 0;
class User extends Instance {
    constructor(username, password, name, lastName, age) {
        super(User.idCounter);
        this.username = username;
        this.password = password;
        this.name = name;
        this.lastName = lastName;
        this.age = age;
        User.idCounter++;
    }
    dummyFunction() {
        this.password = this.password;
    }
}
User.idCounter = 0;
try {
    const pathProducts = "../data/products.txt";
    const pathUsers = "../data/users.txt";
    const users = [new User("Emilianokal", "Kjimenez05#", "Emiliano", "Jimenez", 18),
        new User("Pedromar", "Pmartinez01#", "Pedro", "Martinez", 23),
        new User("Lunagon", "Lgonzalez02#", "Luna", "Gonzalez", 20),
        new User("Anague", "Aguerrero03$", "Ana", "Guerrero", 27),
        new User("Carlosriv", "Crivas04$", "Carlos", "Rivas", 30)];
    const products = [new Product("Pastel de chocolate", " rebanada de Chocolate con vainilla", 270, "path", "AAA027", 60),
        new Product("Ensalada Cesar", "Pollo con mezcla verde", 99, "path", "BBB018", 36),
        new Product("Helado", "Sabores fresa o chocolate", 45, "path", "CCC067", 54),
        new Product("Pizza", "Rebanada de peperoni o hawaiana", 40, "path", "DDD009", 78),
        new Product("Chicken Bake", "Relleno de pechuga de pollo", 65, "path", "EEE035", 87),];
    let productManager = new Manager(pathProducts);
    let usersManager = new Manager(pathUsers);
    productManager.addInstance(products[0]);
    usersManager.addInstance(users[0]);
}
catch (error) {
    console.log("ups hubo un error");
    console.log(error);
}
finally {
    console.log("fin del programa");
}
