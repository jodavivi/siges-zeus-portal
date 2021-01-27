sap.ui.define([], function() {
	"use strict";
	return {
        IdApp: 'Accesos', 
		services: {
			consultarAplicacion: "http://localhost:5000/api-gateway/seguridad/aplicacion",
			crearAplicacion: "http://localhost:5000/api-gateway/seguridad/aplicacion",
			actualizarAplicacion: "http://localhost:5000/api-gateway/seguridad/aplicacion?iId={0}",
			eliminarAplicacion: "http://localhost:5000/api-gateway/seguridad/aplicacion",
			consultarGrupo: "http://localhost:5000/api-gateway/seguridad/grupo",
			consultarGrupoAplicacion: "http://localhost:5000/api-gateway/seguridad/grupoaplicacion",
			consultarRol:"http://localhost:5000/api-gateway/seguridad/rol",
			consultarRolAplicacion:"http://localhost:5000/api-gateway/seguridad/rol/aplicacion"
		}
	};
});
