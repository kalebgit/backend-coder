
const {promises} = require("fs")

  //ERROR WHEN AN INSTANCE ID IS DUPLICATED
  class DuplicateID extends Error{
    public name: string

    constructor(message: string){
      super(message)
      this.name = "DuplicateID"
    }

  }

  //ERROR WHEN AN INSTANCE IS NOT FOUND
  class InstanceNotFound extends Error{
    public name: string

    constructor(message: string){
      super(message)
      this.name = "InstanceNotFound"
    }

  }
  

  //ABSTRACT CLASS TO REPRESENT ALL INSTANCES: PRODUCTS, USERS, ETC
  abstract class Instance{
    constructor(readonly id: number){
    }
  }

  

  // CLASS THAT WILL MANAGE PRODUCTS, USERS, ETC
  class Manager<T extends Instance>{
    private _instances: T[] = []
    constructor(private file: string){}

    //FUNCTION TO ADD AN INSTANCE
    public addInstance(instance: T): void{
      if(this.getInstanceById(instance.id)){
        throw new DuplicateID("No puedes ingresar un id que ya ha sido registrado, vuelve a intentarlo")
      }else{
        this.readFileAndUpdateInstances()
          .then(()=>{
            this._instances.push(instance)
            console.log("el elemento fue agregado")
          })
          .catch((err)=>{
            console.log(err)
          })
        
      }
    }

    public addInstances(instances: T[]): void{
      if(this._instances.some((value: T)=>instances.some((ArgumentValue: T)=>value.id == ArgumentValue.id))){
        throw new DuplicateID("No puedes ingresar un id que ya ha sido registrado, vuelve a intentarlo")
      }else{
        this.readFileAndUpdateInstances()
          .then(()=>{
            this._instances = this._instances.concat(instances)
            console.log("los elementos fueron agregados")
          })
          .catch((err)=>{
            console.log(err)
          })
        
      }
    }

    //GETTER OF INSTANCES
    public getInstances(): T[] | void{
      this.readFileAndUpdateInstances()
        .then(()=>{
          return this._instances
        })
        .catch((err)=>{
          console.log("error al recuperar los datos: " + err)
        })
      
    }


    //FUNCTION TO UPDATE AN INSTANCE
    public updateInstance(id: number, newInstance: T): void{
      this.readFileAndUpdateInstances()
        .then(()=>{
          if(this.getInstanceById(id) && id == newInstance.id){
            const index: number = this._instances.findIndex((value: T)=>value.id == id)
            this._instances[index] = newInstance
            this.writeFile()
            console.log("El elemento fue actualizado")
          }
          else{
            throw new InstanceNotFound("elemento no encontrado por id")
          }
        })
        .catch((err)=>{
          console.log(err)
        })
      
    }

    //FUNCTION TO DELETE AN INSTANCE
    public deleteInstance(id: number): void{
      this.readFileAndUpdateInstances()
        .then(()=>{
          if(this.getInstanceById(id)){
            const index: number = this._instances.findIndex((value: T)=>value.id == id)
            this._instances.splice(index, 1)
            this.writeFile()
          }
          else{
            throw new InstanceNotFound("elemento no encontrado por id")
          }
        })
    }


    //FUNCTION TO GET INSTANCE BY ITS ID
    public getInstanceById(id: number): (T | undefined){
      let instanceFound: T | undefined = this._instances.find((value: T): boolean=>{
        return value.id == id
      })  
      return instanceFound
    }



    //FUNCTION TO WRITE ON THE FILE
    public writeFile(): void{
      promises.writeFile(this.file, JSON.stringify(this._instances), {encoding: 'utf-8'})
        .then((value: any)=>{
          console.log("resultado de la escritura del archivo: " + value)
        })
        .catch((err: any)=>{
          console.log("Ups hubo un error al querer escribir en el archivo los datos: " + err)
        })
    }


    //ASYNC FUNCTION TO UPDATE THE INSTANCES FROM THE FILE
    public async readFileAndUpdateInstances(): Promise<(T | void)>{
      try{
        console.log(this.file)
        console.log(promises)
        this._instances = JSON.parse(await promises.readFile(this.file.toString(), {encoding: 'utf-8'})) as T[]
        return Promise.resolve()
      }
      catch(err){
        console.log("Ups hubo un error y no se pudieron actualizar los datos: " + err)
        return Promise.reject()
      }
    }
  } 


  //CLASSES FOR ALL THE INSTANCES

  //PRODUCT
  class Product extends Instance{
    [index: (string)]: any
    private static idCounter: number = 0
    //using index signatures to access 
    
    constructor(public title: string, public description: string, 
      public price: number, public thumbnail: string, 
      public code: string, public stock: number){
        super(Product.idCounter)
        Product.idCounter++
    } 
  }

  class User extends Instance{
    [index: (string)]: any

    private static idCounter: number = 0

    constructor(public username: string, private password: string, 
      public name: string, public lastName:string, public age: number
      ){
        super(User.idCounter)
        User.idCounter++
      }
    
    public dummyFunction(): void{
      this.password = this.password
    }
  }


  try{
    const pathProducts: string = "../data/products.txt"
    const pathUsers: string = "../data/users.txt"
    
    const users = [new User("Emilianokal", "Kjimenez05#", "Emiliano", "Jimenez", 18),
    new User("Pedromar", "Pmartinez01#", "Pedro", "Martinez", 23),
    new User("Lunagon", "Lgonzalez02#", "Luna", "Gonzalez", 20),
    new User("Anague", "Aguerrero03$", "Ana", "Guerrero", 27),
    new User("Carlosriv", "Crivas04$", "Carlos", "Rivas", 30)]

    const products = [new Product("Pastel de chocolate", " rebanada de Chocolate con vainilla", 270, "path", "AAA027", 60),
    new Product("Ensalada Cesar", "Pollo con mezcla verde", 99, "path", "BBB018", 36),
    new Product("Helado", "Sabores fresa o chocolate", 45, "path", "CCC067", 54),
    new Product("Pizza", "Rebanada de peperoni o hawaiana", 40, "path", "DDD009", 78),
    new Product("Chicken Bake", "Relleno de pechuga de pollo", 65, "path", "EEE035", 87),]

    let productManager: Manager<Product> = new Manager<Product>(pathProducts)
    let usersManager: Manager<User> = new Manager<User>(pathUsers)

    productManager.addInstance(products[0])
    usersManager.addInstance(users[0])

  }catch(error){
    console.log("ups hubo un error")
    console.log(error)
  }finally{
    console.log("fin del programa")
  }
  