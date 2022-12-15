sap.ui.define([], function() {
	"use strict";
	return {
        IdApp: 'Maestra', 
		services: {
			consultarTablaGenerica: "http://localhost:2001/api-gateway/maestra/tabla",
			consultarEmpresa: "http://localhost:2001/api-gateway/configuracion/empresa",
		}
	};
});
