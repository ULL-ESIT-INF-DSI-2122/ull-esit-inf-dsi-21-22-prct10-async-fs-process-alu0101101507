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


|  Pila de llamada            | Registros de eventos de la api  | Cola de manejadores  |
|-----------------------------|---------------------------------|----------------------|
|Access(comprobar el fichero) |                                 |                      |
|console.log(Ver el fichero)  |                                 |                      |
|                             |                                 |                      |
|                             |                                 |                      |
|                             |                                 |                      |

Primero se pasa a la pilla de llamadas la ejecucion del access y se comprueba si existe el fichero y empieza a observar el fichero y se muestra por pantalla el `console.log(`Starting to watch file ${filename}`)`, es decir eso entra en la pila lo primero y como solo esta ello sale de la pila instantaneamente mostrando por terminal ese mensaje.

Paso 2: 


|  Pila de llamada            | Registros de eventos de la api       | Cola de manejadores      |
|-----------------------------|--------------------------------------|--------------------------|
|                             |const watcher = watch(process.argv[2])| watcher.on('change', () )|
|                             |                                      |                          |
|                             |                                      |                          |
|                             |                                      |                          |
|                             |                                      |                          |


Ahora se crea el atributo watcher que sera usado por el metodo watcher.on que pasara a la cola de manejadores (para ser procesao mas tarde por el bucle de eventos lo cual lo mandara a la pila de llamadas mas adelante)


Paso 3: 


|  Pila de llamada                                      | Registros de eventos de la api       | Cola de manejadores      |
|-------------------------------------------------------|--------------------------------------|--------------------------|
|console.log(`File ${filename} is no longer watched`)   |                                      | watcher.on('change', () )|
|                                                       |                                      |                          |
|                                                       |                                      |                          |
|                                                       |                                      |                          |
|                                                       |                                      |                          |


Ahora entra en la pila de llamadas es `console.log(`File ${filename} is no longer watched`)` y por como funciona el bucle de eventos se nos sacara primero lo que hay en la pilla de llamadas, entonces se mostrara por terminal el mensaje del console.log y despues se procesara lo que se encuentra en la cola de manejadores

Paso 4:


|  Pila de llamada                                      | Registros de eventos de la api       | Cola de manejadores      |
|-------------------------------------------------------|--------------------------------------|--------------------------|
|watcher.on('change', () )                              |                                      |                          |
|                                                       |                                      |                          |
|                                                       |                                      |                          |
|                                                       |                                      |                          |
|                                                       |                                      |                          |


Ahora el bucle de eventos pasa la funcion que se encuentra en la cola de manejadores a la pila de llamadas para mostrar su resultado, pero una vez mostrado el resultado lo volvera a mandar a la cola de manejadores ya que la funcion watch se va a quedar permanentemente mirando el fichero hasta que el programa se termine, por tanto seguirian los siguientes pasos:


Paso 5: 


|  Pila de llamada                                      | Registros de eventos de la api       | Cola de manejadores      |
|-------------------------------------------------------|--------------------------------------|--------------------------|
|                                                       |                                      | watcher.on('change', () )|
|                                                       |                                      |                          |
|                                                       |                                      |                          |
|                                                       |                                      |                          |
|                                                       |                                      |                          |

y asi sucesivamente hasta que cerremos el programa, es decir que mientras se modifique el fichero seguira mostrandoce el console.log de dentro del metodo `watcher.on()`.


**¿Qué hace la función access?**

La funcion access lo que nos permite es conocer los permisos que tenemos sobre un fichero o directorio o si el fichero existe como es este caso, ya que tenemos como modo el constants.F_OK que lo que nos permite averiguar no son los permisos del fichero si no simplemente si el fichero existe o no.

**¿Para qué sirve el objeto constants?**

El objeto constants sirve como un enum en el cual se enumeran los permisos que se tienen con cada modo, es decir constant.R_OK tiene un flag que nos permite leer un fichero mediante los procesos de llamada, asi pues hay muchos otros modos, pero en resumen es un enum el cual tiene enlistados los permisos y mediante los modos se escoge los permisos a comprobar por cada proceso


## Ejercicio 2


