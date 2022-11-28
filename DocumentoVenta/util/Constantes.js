sap.ui.define([], function() {
	"use strict";
	return {
        IdApp: 'DocumentoVenta', 
		services: {
			consultarDocumentoVenta: "http://localhost:2001/api-gateway/consultaventacaja", 
			consultarParametros: "http://localhost:2001/api-gateway/maestra/tabla/parametro/filtro"
		}
	};
});
