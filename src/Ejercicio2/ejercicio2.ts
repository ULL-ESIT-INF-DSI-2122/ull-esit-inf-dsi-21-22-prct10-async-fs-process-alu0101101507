import * as fs from 'fs';
import * as child from 'child_process';
import * as yargs from 'yargs';
import * as chalk from 'chalk';

/**
 * Funcion que nos devuelve el numero de lineas en las que se encuentra una palabra con el uso de pipe
 * @param filename nombre del fichero
 * @param word palabra a buscar
 */
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

/**
 * Funcion que nos devuelve el numero de lineas en las que se encuentra una palabra sin el uso de pipe
 * @param filename nombre del fichero
 * @param word palabra a buscar
 */
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

/**
 * Comando para la busqueda de la palabra mediante la funcion con tuberia
 */
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

/**
 * Comandos de yargs que se introduciran por terminal para el uso de la busqueda de la palabra sin la tuberia
 */
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