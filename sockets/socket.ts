import { Socket } from 'socket.io';
import socketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';
import { mapa } from '../routes/router';


export const usuariosConectados = new UsuariosLista();

export const nuevoMarcador = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('margador-nuevo', (marcador) => {
        // console.log(marcador);
        mapa.agregarMarcador( marcador );
        // io.emit('margador-nuevo', marcador);
        cliente.broadcast.emit('margador-nuevo', marcador);
    })

}

export const marcadorBorrar = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('marcador-borrar', (id) => {
        // console.log(marcador);
        mapa.agregarMarcador( id );
        // io.emit('margador-nuevo', marcador);
        cliente.broadcast.emit('marcador-borrar', id);
    })

}

export const marcadorMover = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('mover', (marcador) => {
        // console.log(marcador);
        mapa.moverMarcador( marcador );
        // io.emit('margador-nuevo', marcador);
        cliente.broadcast.emit('mover', marcador);
    })

}




export const conectarCliente = ( cliente: Socket, io: socketIO.Server ) => {

    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar( usuario );

}


export const desconectar = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('disconnect', () => {
        console.log('Cliente desconectado');

        usuariosConectados.borrarUsuario( cliente.id );

        io.emit('usuarios-activos', usuariosConectados.getLista()  );

    });

}


// Escuchar mensajes
export const mensaje = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('mensaje', (  payload: { de: string, cuerpo: string }  ) => {

        console.log('Mensaje recibido', payload );

        io.emit('mensaje-nuevo', payload );

    });

}

// Configurar usuario
export const configurarUsuario = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('configurar-usuario', (  payload: { nombre: string }, callback: Function  ) => {

        usuariosConectados.actualizarNombre( cliente.id, payload.nombre );

        io.emit('usuarios-activos', usuariosConectados.getLista()  );

        callback({
            ok: true,
            mensaje: `Usuario ${ payload.nombre }, configurado`
        });
    });

}


// Obtener Usuarios
export const obtenerUsuarios = ( cliente: Socket, io: socketIO.Server ) => {

    cliente.on('obtener-usuarios', () => {

        io.to( cliente.id ).emit('usuarios-activos', usuariosConectados.getLista()  );
        
    });

}
