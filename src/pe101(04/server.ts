import * as fs from 'fs';
import * as child from 'child_process';
import * as net from 'net';

/**
 * Creacion del server con su coneccion
 */
const server = net.createServer((connection) => {
    console.log('Un cliente se ha conectado.');


    connection.on('data', (data) => {
        if(fs.existsSync(data)){
        /**
         * Creacion del proceso hijo cat
         */
        const cat = child.spawn('cat', [data.toString()]);

        /**
         * Introduccion de la salida de cat en un fichero
         */
        let file = '';
        cat.stdout.on('data', (data) => {
          file = data.toString();
        });

        /**
         * Metodo para enviar el fichero para que se le muestre al cliente
         */
        cat.on('close', () => {
          connection.write(JSON.stringify(file));
          connection.end();
        });
        } else {
            console.log("No se encuentra el fichero o la ruta especificada")
            connection.on('error', (err) => {
                console.log(err)
                connection.end();
            });
        }
    });
      
    /**
     * Funcion que al cierre del cliente nos muestra un mensaje
     */
    connection.on('close', () => {
        console.log('Un cliente se ha desconectado.');
        connection.end();
    });
    /**
     * Metodo que finaliza la comunicacion con el cliente
     */   
    connection.on('end', () => {
        console.log("Finalizacion de comunicacion con el cliente")
    });    

    }).listen(60300, () => {
        console.log('Esperando por un cliente.');
    });

  