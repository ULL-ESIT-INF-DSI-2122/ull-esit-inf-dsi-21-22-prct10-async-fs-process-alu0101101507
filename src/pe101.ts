import * as fs from 'fs';
import * as child from 'child_process';
/**
 * Clase que nos permite mirar un fichero
 */
export class watchfile {
    constructor(protected filename: string, protected ls1: string){

    }
/**
 * Funcion que nos permite observar un fichero y el comando ls
 */
    watch(){
        fs.watch("helloworld.txt", (eventType, filename) => {
            console.log("\nEl fichero", filename, "ha sido modificado!");
            console.log("El cambio fue:", eventType);
  
            const ls = child.spawn('ls', ['-l', '-h', `${this.ls1}`,`${this.filename}`]);
            
            ls.stdout.on('data', pieces => {
                console.log(`salida: ${pieces}`);
            });
            ls.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
              });
            });

            setTimeout(
                () => fs.renameSync("helloworld.txt", "holamundo.txt"),
                1000
              );
                
              // Renaming the file back to its old name
              setTimeout(
                () => fs.renameSync("holamundo.txt", "helloworld.txt"),
                2000
              );
                
              // Changing the contents of the file 
              setTimeout(
                () => fs.writeFileSync("helloworld.txt", 
                "Modificando modificando"), 3000
              );
    }
}

/**
 * control de la linea de comandos de la terminal
 */
if (process.argv.length !== 4) {
    console.log('Introduce el fichero que quieres leer con las opciones necesarias (4)');
  } else if (!fs.existsSync(process.argv[2])) {
    console.log('Fichero no encontrado');
  } else {
    const filename = process.argv[2];
    const ls = process.argv[3];
    const opciones = process.argv[4];
    new watchfile(filename, ls);
  }

const x = new watchfile('helloworld.txt', 'ls');
console.log(x.watch());