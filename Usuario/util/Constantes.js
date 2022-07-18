sap.ui.define([], function() {
	"use strict";
	return {
        IdApp: 'Usuario', 
		services: {
			consultarUsuario: "http://localhost:2001/api-gateway/seguridad/usuario",
			consultarUsuarioEmpresaAll: "http://localhost:2001/api-gateway/seguridad/usuario/all",
			consultarParametros: "http://localhost:2001/api-gateway/maestra/tabla/parametro/filtro",
			consultarRol:"http://localhost:2001/api-gateway/seguridad/rol",
			consultarRolUsuario:"http://localhost:2001/api-gateway/seguridad/usuario/rol",
			consultarRolUsuarioNoAsignado:"http://localhost:2001/api-gateway/seguridad/usuario/rol/noasigando",
			registrarUsuario:"http://localhost:2001/api-gateway/seguridad/usuario",
			actualizarUsuario:"http://localhost:2001/api-gateway/seguridad/usuario?iId={0}",
			asignarEmpresaUsuario:"http://localhost:2001/api-gateway/seguridad/usuario/asignarempresa?iId={0}",
			eliminarUsuario:"http://localhost:2001/api-gateway/seguridad/usuario",
			consultaEstadoClave:"http://localhost:2001/api-gateway/seguridad/usuario/estadoclave",
			resetearClave:"http://localhost:2001/api-gateway/seguridad/usuario/clave/reset",
		}
	};
});
