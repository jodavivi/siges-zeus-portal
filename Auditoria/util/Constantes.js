sap.ui.define([], function() {
	"use strict";
	return {
        IdApp: 'Auditoria', 
		services: {
			consultarAplicacion: "http://localhost:5000/api-gateway/auditoria/aplicacion",
			consultarProceso: "http://localhost:5000/api-gateway/auditoria/aplicacion/proceso",
			consultarAuditoria: "http://localhost:5000/api-gateway/auditoria"
		}
	};
});
