[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct10-async-fs-process-alu0101101507/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2122/ull-esit-inf-dsi-21-22-prct10-async-fs-process-alu0101101507?branch=main) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2122_ull-esit-inf-dsi-21-22-prct10-async-fs-process-alu0101101507&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2122_ull-esit-inf-dsi-21-22-prct10-async-fs-process-alu0101101507)
# Práctica 10 - Sistema de ficheros y creación de procesos en Node.js

## Ejercicio 1

Para este ejercicio hemos de realizar una traza de ejecucion paso a paso mostrando el contenido de la pila de llamadas, el registro de eventos de la api y la cola de manejadores, usando como ejemplo el siguiente codigo:

```typescript
import {access, constants, watch} from 'fs';

if (process.argv.length !== 3) {
  console.log('Please, specify a file');
} else {
  const filename = process.argv[2];

  access(filename, constants.F_OK, (err) => {
    if (err) {
      console.log(`File ${filename} does not exist`);
    } else {
      console.log(`Starting to watch file ${filename}`);

      const watcher = watch(process.argv[2]);

      watcher.on('change', () => {
        console.log(`File ${filename} has been modified somehow`);
      });

      console.log(`File ${filename} is no longer watched`);
    }
  });
}
```

TRAZA:

Paso 1:


|  Pila de llamada              | Registros de eventos de la api  | Cola de manejadores  |
|----------------------------   |---------------------------------|----------------------|
|if (process.argv.lengths != 3) |                                 |                      |

Primero entra a la pila de llamadas la comprovacion de la longuitud de parametros por teminal, lo cual si no se cumplu mostrara el error de especificar un fichero si no seguira adelante

Paso 2: 


|  Pila de llamada                | Registros de eventos de la api       | Cola de manejadores      |
|-----------------------------    |--------------------------------------|--------------------------|
|const filename = process.argv[2] |                                      |                          |

Seguira la asignaicon del fichero a la variable filename con el atributo que se pasa por paramtro en la posicion de argv[2]

Paso 3: 


|  Pila de llamada                                      | Registros de eventos de la api       | Cola de manejadores      |
|-------------------------------------------------------|--------------------------------------|--------------------------|
|access(filename, constants.F_OK, (err)                 |                                      |                          |
|                                                       |                                      |                          |
|                                                       |                                      |                          |
|                                                       |                                      |                          |
|                                                       |                                      |                          |

Ahora entra el access a la pila de llamada, al ser un metodo dado por la api pasara al registro de evento de la api para procesarce

Paso 4:


|  Pila de llamada                                      | Registros de eventos de la api       | Cola de manejadores      |
|-------------------------------------------------------|--------------------------------------|--------------------------|
|                                                       |access(filename, constants.F_OK, (err)|                          |


Al pasar esto aqui es donde se procesara el acces mandando a la cola de manejadores a las funciones que requieran de su uso


Paso 5: 


|  Pila de llamada                                      | Registros de eventos de la api       | Cola de manejadores      |
|-------------------------------------------------------|--------------------------------------|--------------------------|
|console.log(`Starting to watch file ${filename}`);     |                                      |                          |


En la pila de llamadas se pondria el console.log mostrado y seria sacado de la pila instantanemanete mostrando por pantalla

Paso 6: 

|  Pila de llamada                                      | Registros de eventos de la api       | Cola de manejadores      |
|-------------------------------------------------------|--------------------------------------|--------------------------|
| const watcher = watch(process.argv[2]);               |                                      |                          |



En este paso es donde se asignara el fichero a observar por el metodo watch() por lo que entrara en la pilla de llamadas y saldra de ella con la asignacion ya realizada

Paso 7:

|  Pila de llamada                                      | Registros de eventos de la api       | Cola de manejadores        |
|-------------------------------------------------------|--------------------------------------|-------------------------   |
|                                                       |                                      |watcher.on('change', () => {|


En este paso el metodo acces pasara a la cola de manejadores la funcion watcher.on que es la que nos permitira ver si el fichero ha sido modificado de alguna manera


Paso 8:

|  Pila de llamada                                      | Registros de eventos de la api       | Cola de manejadores        |
|-------------------------------------------------------|--------------------------------------|-------------------------   |
|console.log(`File ${filename} is no longer watched`);  |                                      |watcher.on('change', () => {|

Aqui al tratarse de un proceso asincrono todo el programa, entra en la pila de llamadas el console.log(`File ${filename} is no longer watched`); lo que hace que s emuestre antes de acabar y que el programa seguira escuchando hasta que no decidamos cerrar el programa, pero al tratarce de un proceso asincrono este mensaje se procesa y sale antes de la pila de llamadas que el resultado del watcher.on()

Paso 9: 

|  Pila de llamada                                      | Registros de eventos de la api       | Cola de manejadores        |
|-------------------------------------------------------|--------------------------------------|-------------------------   |
|watcher.on('change', () => {                           |                                      |                            |


En este punto de la cola de manejadores mediante el **bucle de eventos** se pasa el resultado del metodo watcher.on a la pila de llamadas para que salga de ahi y muestre por pantalla como se ha modificado el fichero

Paso 10:

|  Pila de llamada                                      | Registros de eventos de la api       | Cola de manejadores        |
|-------------------------------------------------------|--------------------------------------|-------------------------   |
|                                                       |watcher.on('change', () => {          |                            |


Aqui se pasa la funcion watcher.on de la pila de llamadas al registro de eventos de la api ya que todavia tiene que seguir haciendo una funcion

Paso 11: 


|  Pila de llamada                                      | Registros de eventos de la api       | Cola de manejadores        |
|-------------------------------------------------------|--------------------------------------|-------------------------   |
|                                                       |                                      |watcher.on('change', () => {|


Ahora mediante el **bucle de eventos** se vuelve a mandar a la cola de manejadores a la funcion watcher.on ya que ha de seguir observando el fichero ante el posible cambio que ocurra y entrara en un movimeinto ciclico hasta que se decida cerrar el programa

**¿Qué hace la función access?**

La funcion access lo que nos permite es conocer los permisos que tenemos sobre un fichero o directorio o si el fichero existe como es este caso, ya que tenemos como modo el constants.F_OK que lo que nos permite averiguar no son los permisos del fichero si no simplemente si el fichero existe o no.

**¿Para qué sirve el objeto constants?**

El objeto constants sirve como un enum en el cual se enumeran los permisos que se tienen con cada modo, es decir constant.R_OK tiene un flag que nos permite leer un fichero mediante los procesos de llamada, asi pues hay muchos otros modos, pero en resumen es un enum el cual tiene enlistados los permisos y mediante los modos se escoge los permisos a comprobar por cada proceso


# Ejercicio 2

Para este ejercicio hemos de crear un programa que devuelva el numero de ocurrecias de una palabra en un fichero de texto, es decir el numero de lineas en el que se encuentra esa palabra, dando tanto el fichero como la palabra a buscar por terminal por el usuario.

Para lo anterior este programa se nos pide que realicemos la busqueda y digamos el numero de la repeticion de la palabra en un fichero de dos maneras,  la primera manera sera con el metodo pipe() quedando de la siguiente manera:

```typescript
function pipe(filename: string, word: string){
  if (fs.existsSync(filename)){
    const cat = child.spawn('cat', [filename]);
    const grep = child.spawn('grep', ['-c', word]);
    cat.stdout.pipe(grep.stdin);

    let grepOutput = '';
    grep.stdout.on('data', (piece) => {
      grepOutput += piece;
    });
  
    grep.on('close', () => {
      let x: number = +grepOutput
      if(x > 0) {
        process.stdout.write(chalk.yellow(`La palabra ${word} se encuentra en ${x} lineas del fichero`));
      } else {
        console.log(chalk.red(`La palabra ${word} no se encuentra en el fichero`));
      }
    });
  } else {
    console.log(chalk.red('El fichero no existe'))
  }
}
```

En esta funcion definiremos los dos procesos hijos, cat y grep, con el metodo spawn, y al metodo grep lo definiremos con la opcion -c ya que esta opcion nos muestra el numero de lineas en las que se encuentra la palabra que queremos buscar el numero de lineas en las que se encuentra dicha palabra, despues realizamos la union de ambos procesos con el pipe lo que nos permite comunicar la salida del cat (cat.stdout) con la entrada del proceso grep (grep.stdin), mas tarde hemos de almacenar la salida de grep en una string auxiliar y ddespues mediante grep.on mostraremos en la llamada de `close` si el numero de ocurrecias es mayor que 0 entonces se mostrara en cuantas lineas se encuentra esa palabra, si no es mayor que 0 entonces implica que esa palabra no se encuentra en el fichero.


Despues tenemos la funcion que realizara lo mismo que la anterior pero sin contar con el uso del metodo pipe(), quedando de la siguiente manera:

```typescript
function nopipe(filename: string, word: string){
  if (fs.existsSync(filename)){
    const cat = child.spawn('cat', [filename]);
    const grep = child.spawn('grep', ['-c', word]);

    cat.stdout.on("data", (data) => {
      grep.stdin.write(data);
    });

    cat.on("close", () => {
      grep.stdin.end();
    });

    let grepOutput = '';
    grep.stdout.on('data', (piece) => {
      grepOutput += piece;
    });

    grep.on('close', () => {
      let x: number = +grepOutput
      if(x > 0){
        console.log(chalk.yellow(`La palabra ${word} se encuentra en ${x} lineas del fichero`));
      } else {
        console.log(chalk.red(`La palabra ${word} no se encuentra en el fichero`));
      }
    });
  } else {
    console.log(chalk.red('El fichero no existe'));
  }
}
```

En esta funcion haremos lo mismo que en la anterior, definiremos los procesos y los comunicaremos pero sin el metodo pipe(), en este caso haremos una comunicacion que ira dato por dato entre el cat.stdout y el grep.stdin, al cual una vez cmpletado tendremos que cerrar mediante el cat.on('close', ()) en donde se le pondra un final a la entrada del grep en cat, despues procederemos de la misma manera que en la funcion anterior, almacenaremos la salida del grep en una variable auxiliar que despues en grep.on() mostraremos, si es mayor que 0 el numero de ocurrecias mostraremos el numero de lineas en el que se encuentra la palabra, si no entonces se mostrara que la palabra no se encuentra en el fichero.


Ahora para el manejo de los argumentos por terminal he utilizado el yargs que en este caso cntaremos con dos que simplemente nos pediran el usuario junto a la ejecucion del fichero y se verian algo asi:

```typescript
yargs.command({
  command: 'pipe',
  describe: 'Leer un fichero y hacerle grep',
  builder: {
    file: {
      describe: 'file',
      demandOption: true,
      type: 'string',
    },
    word: {
      describe: 'word',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.file === 'string' &&
        typeof argv.word === 'string' &&
        process.argv.length == 5) {
        console.log(pipe(argv.file, argv.word))
    } else {
      console.log(chalk.red("Ha intoducido un numero de parametros erroneos por encima de los permitidos, solo puede introducir 5 parametros:"))
      console.log(chalk.red(`node ejercicio2.js pipe --file="prueba.txt" --word="Hola""`))
    }
  },
});

yargs.command({
  command: 'nopipe',
  describe: 'Leer un fichero y hacerle grep',
  builder: {
    file: {
      describe: 'file',
      demandOption: true,
      type: 'string',
    },
    word: {
      describe: 'word',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.file === 'string' &&
        typeof argv.word === 'string' &&
        process.argv.length == 5) {
        console.log(nopipe(argv.file, argv.word))
    } else {
      console.log(chalk.red("Ha intoducido un numero de parametros erroneos por encima de los permitidos, solo puede introducir 5 parametros:"))
      console.log(chalk.red(`node ejercicio2.js nopipe --file="prueba.txt" --word="Hola""`))
    }
  },
});

yargs.parse()
```


# Ejercicio 3

En este ejercicio hemos de crear una aplicacion en la cual que reciba desde la línea de comandos el nombre de un usuario de la aplicación de notas.

Para llevar a cabo esto he creado una funcion que nos permite observar el directorio de un usuario, el especificado por el usuario, y que nos dira si se ha modificado, creado o borrado un fichero, y lce tal que asi:

```typescript
function watcher(user: string){
  console.log("Hola")
  if (fs.existsSync(`./database/${user}/`)){
    console.log(`Se esta empezando a mirar el fichero del usuario : ${user}`)
    const x = fs.watch(`./database/${user}/`, (eventType, filename) => {
        if(eventType === "change"){
          console.log(`El fichero ${filename} de ha modificado`);
        }else if( eventType === "rename"){
          console.log(`El fichero ${filename} se ha eliminado/creado`);
        } else {
          console.log(chalk.red(`No se ha encontrado el directorio/fichero`));
        }
      });
  } else {
    console.log(chalk.red("No se ha podido observar el directorio porque no se encuentra ningun usuario con ese nombre"));
  }
}
```

En la funcion primero comprobamos si existe el directorio del usuario especificado, si no es asi nos saltaria un erros, y despues dentro mediante el metodo watch() de la api podemos observar un fichero o directorio como es este cado y reaccionar a los eventos que ocurra, pues si se modifica algo del fichero saltara el evento 'change' y entonces se nos mostrara el fichero que se ha modificado de todos los que haya en el directorio, y si se crea o se elimina un fichero nos saltara el evento 'rename' y nos mostrara por pantalla el fichero que se ha borrado o creado dentro del directorio.


Para llevar a cabo esto mediante yargs procesamos los parametros especificados por linea de comando de la siguiente manera:

```typescript
yargs.command({
  command: 'ver',
  describe: 'Observar una nota',
  builder: {
    user: {
      describe: 'Usuario',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      console.log(watcher(argv.user))
    } else {
      console.log(chalk.red("Introduce un usuario valido."))
    }
  },
});

yargs.parse()
```

Aqui procesaremos que se nos pase un usuario junto a la ejecucion del programa para poder observar el directorio d dicho usuario en su totalidad, si no pusieramos nada nos saltaria un error como ahi se muestra

**¿Cómo haría para mostrar, no solo el nombre, sino también el contenido del fichero, en el caso de que haya sido creado o modificado?**
Para mostrar el contenido del fichero podriamos hacer uso del cat, creandolo con el proceso hijo spawm, pues podriamos mirar y pasarle al cat el fichero que se este modificando y al pasarlo por el cat se nos mostraria su contenido modificado, o con el que se haya creado el fichero, asi pues tendriamos que hacer algo asi:

```typescript
const cat = child.spawn('cat', [filename])

cat.stdout.pipe(process.stdout)
```

y esto lo meteriamos dentro de los if de change y rename para que cuando ocurra un if con su evento se nos muestre el interior de el propio fichero.

**¿Cómo haría para que no solo se observase el directorio de un único usuario sino todos los directorios correspondientes a los diferentes usuarios de la aplicación de notas?**

Para que se observace no solo el directorio del usuario habria que especificar el path del directorio entero, en mi caso ./database/ y asi se quedaria mirando a todos los cambios que ocurran por debajo de ese directorio y tambien hemos de poner la opcion de recursive en el metodo watch() ya que nos permitira mirar tanto directorios como subdirectorios dentro del directorio ./database