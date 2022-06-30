sap.ui.define([], function() {
	"use strict";
	return {
        IdApp: 'Auditoria', 
		services: {
			consultarAplicacion: "http://localhost:2001/api-gateway/auditoria/aplicacion",
			consultarProceso: "http://localhost:2001/api-gateway/auditoria/aplicacion/proceso",
			consultarAuditoria: "http://localhost:2001/api-gateway/auditoria"
		}
	};
});
