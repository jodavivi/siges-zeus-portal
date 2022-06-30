sap.ui.define([], function() {
	"use strict";
	return {
        IdApp: 'Accesos', 
		services: {
			consultarAplicacion: "http://localhost:2001/api-gateway/seguridad/aplicacion",
			crearAplicacion: "http://localhost:2001/api-gateway/seguridad/aplicacion",
			actualizarAplicacion: "http://localhost:2001/api-gateway/seguridad/aplicacion?iId={0}",
			eliminarAplicacion: "http://localhost:2001/api-gateway/seguridad/aplicacion",
			consultarGrupo: "http://localhost:2001/api-gateway/seguridad/grupo",
			crearGrupo: "http://localhost:2001/api-gateway/seguridad/grupo",
			eliminarGrupo: "http://localhost:2001/api-gateway/seguridad/grupo",
			actualizarGrupo: "http://localhost:2001/api-gateway/seguridad/grupo?iId={0}",
			consultarGrupoAplicacion: "http://localhost:2001/api-gateway/seguridad/grupoaplicacion",
			registrarGrupoAplicacion: "http://localhost:2001/api-gateway/seguridad/grupoaplicacion",
			eliminarGrupoAplicacionAsignado: "http://localhost:2001/api-gateway/seguridad/grupoaplicacion",
			consultarGrupoAplicacionFaltante: "http://localhost:2001/api-gateway/seguridad/grupoaplicacion/faltante",
			consultarRol:"http://localhost:2001/api-gateway/seguridad/rol",
			consultarRolAplicacion:"http://localhost:2001/api-gateway/seguridad/rol/aplicacion",
			consultarRolAplicacionSinAsignar:"http://localhost:2001/api-gateway/seguridad/rol/aplicacionsinasignar?sCodRol={0}",
			crearRol:"http://localhost:2001/api-gateway/seguridad/rol",
			actualizarRol:"http://localhost:2001/api-gateway/seguridad/rol?iId={0}",
			eliminarRol:"http://localhost:2001/api-gateway/seguridad/rol",
			registrarAplicacionxRol:"http://localhost:2001/api-gateway/seguridad/rol/aplicacion?sCodRol={0}",
			eliminarAplicacionxRol:"http://localhost:2001/api-gateway/seguridad/rol/aplicacion"
		}
	};
});
