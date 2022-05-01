import * as fs from 'fs';
import * as child from 'child_process';
import * as yargs from 'yargs';
import * as chalk from 'chalk';

/**
 * Funcion que nos permite observar dentro del directorio de cada usuario para ver que ficheros han sido modificados
 * @param user usuario del cual miraremos el directorio
 */
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

/**
 * Comando de yargs que nos permite recoger por terminal el usuario del cual se mirara el directorio
 */
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