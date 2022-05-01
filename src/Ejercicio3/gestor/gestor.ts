import { Nota } from "../nota/nota";
import * as fs from 'fs';
import * as chalk from 'chalk';
/**
 * Clase encargada de la gestion de las notas: añadir nuevas notas, modificar las notas, borrar las notas, mostrar una lista de notas y mostrar el contenido de una nota en concreto
 */
export class Gestor {
  constructor(){

  }
  


  verDir(user: string) {

  }
  /**
   * Funcion que añade una nueva nota a la lista
   * @param user usuario creador de esa nota
   * @param new_nota nuevo objeto nota
   */
  addNota(user: string, new_nota: Nota){
    if (fs.existsSync(`./database/${user}`)){
      console.log(chalk.green('Existe el directorio'));
      fs.access(new_nota.getTitulo(), fs.constants.F_OK, (err) => {
        console.log(chalk.red((`${new_nota.getTitulo()} ${err ? 'Existe la nota' : 'No existe la nota'}`)));
      });
    } else {
      fs.mkdirSync(`./database/${user}`); 
      const nota = {"Titulo": new_nota.getTitulo(), "Cuerpo": new_nota.getCuerpo(), "Color": new_nota.getColor()};
      const aux = JSON.stringify(nota);
      fs.writeFileSync(`./database/${user}/${new_nota.getTitulo()}`+ ".json", aux);
        console.log(chalk.green('Se ha añadido la nota'));
    }
  }

  /**
   * Funcion que modifica el objeto nota que especifique el usuario
   * @param user usuario creador de la nota
   * @param new_nota nuevo objeto nota que nos quedara despues de modificar
   * @param aux2 nota que vamos a modificar
   * @param titulo titulo que modificaremos
   * @param cuerpo cuerpo de la nota que modificaremos
   * @param color color de la nota que modificaremos
   */
  modNota(user: string, new_nota: Nota, aux2: string, titulo: string, cuerpo: string, color: string){
    if(fs.existsSync(`./database/${user}/${aux2}`)) {
      new_nota.setTitulo(titulo);
      new_nota.setCuerpo(cuerpo);
      new_nota.setColor(color)
      const nota = {"Titulo": new_nota.getTitulo(), "Cuerpo": new_nota.getCuerpo(), "Color": new_nota.getColor()};
      const aux = JSON.stringify(nota);
      fs.writeFileSync(`./database/${user}/${aux2}`, aux);
        console.log(chalk.green('Se ha modificado la nota'));
    } else {
      console.log(chalk.red("No existe la nota en la lista"));
    }
  }

  /**
   * Funcion que nos eliminara una nota
   * @param user usuario propietario de la nota
   * @param aux nota a eliminar
   */
  delNota(user: string, aux: string){
    if(fs.existsSync(`./database/${user}/${aux}`)) {
      fs.rmSync(`./database/${user}/${aux}`);
        console.log(chalk.green('Se ha eliminado la nota'));
    } else {
      console.log(chalk.red("No existe la nota en la lista"));
    }
  }

  /**
   * Fichero que nos mostrara las notas creadas
   * @param user usuario creador de las notas
   */
  mostrarTitulos(user: string){
    let filename = fs.readdirSync(`./database/${user}`);

    console.log("\nTitulos de las notas de la lista: ");
    filename.forEach((file => {
      console.log(chalk.blue(file));
    }));
  }

  /**
   * Funcion que nos leera el contenido de una nota en concreto
   * @param user usuario creador y propietario de la nota
   * @param aux nota a leer
   */
  readNota(user: string, aux: string){
    if(fs.existsSync(`./database/${user}/${aux}`)){
      console.log(fs.readFileSync(`./database/${user}/${aux}`, "utf8"));
    } else {
      console.log(chalk.red('Error la nota no se encuentra en la lista'))
    }
  }
}
