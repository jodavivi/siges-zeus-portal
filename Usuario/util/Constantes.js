sap.ui.define([], function() {
	"use strict";
	return {
        IdApp: 'Usuario', 
		services: {
			consultarUsuario: "http://localhost:2001/api-gateway/seguridad/usuario",
			consultarParametros: "http://localhost:2001/api-gateway/maestra/tabla/parametro/filtro",
			consultarRol:"http://localhost:2001/api-gateway/seguridad/rol",
			registrarUsuario:"http://localhost:2001/api-gateway/seguridad/usuario",
			actualizarUsuario:"http://localhost:2001/api-gateway/seguridad/usuario?iId={0}",
			eliminarUsuario:"http://localhost:2001/api-gateway/seguridad/usuario",
			consultaEstadoClave:"http://localhost:2001/api-gateway/seguridad/usuario/estadoclave",
			resetearClave:"http://localhost:2001/api-gateway/seguridad/usuario/clave/reset",
		}
	};
});
