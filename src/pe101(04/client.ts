import * as fs from 'fs';
import * as child from 'child_process';
import * as net from 'net';


/**
 * Conceccion al socket del servidor
 */
const client = net.connect({port: 60300});

/**
 * Recibir por linea de comandos el fichero
 */

 if (process.argv.length !== 5) {
  console.log('Introduzca un fichero valido.');
} else {
  const filename = process.argv[4];
  client.write(filename);
/**
 * Concatenacion de los trozos de datos mandados al socket
 */
let wholeData = '';
client.on('data', (dataChunk) => {
  wholeData += dataChunk;
});

/**
 * Metodo para mostrar el mensaje en modo JSON por la pantalla del cliente y acabar con la funcion del cliente
 */
client.on('end', () => {
  const message = JSON.parse(wholeData);
  console.log(message)
  console.log("Finalizacion del cliente")
});
}
