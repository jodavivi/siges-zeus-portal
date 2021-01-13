sap.ui.define([], function() {
	"use strict";
	return {
        IdApp: 'Maestra', 
		services: {
			consultarTablaGenerica: "http://localhost:5000/api-gateway/maestra/tabla",
			registrarTablaGenerica: "http://localhost:5000/api-gateway/maestra/tabla",
			actualizarTablaGenerica: "http://localhost:5000/api-gateway/maestra/tabla",
			eliminarTablaGenerica: "http://localhost:5000/api-gateway/maestra/tabla",
			consultarParametrosTabla:  "http://localhost:5000/api-gateway/maestra/tabla/parametro",
			consultarParametrosFiltro:  "http://localhost:5000/api-gateway/maestra/tabla/parametro/filtro",
			registrarParametroTabla: "http://localhost:5000/api-gateway/maestra/tabla/parametro",
			eliminarParametroTabla: "http://localhost:5000/api-gateway/maestra/tabla/parametro",
			actualizarParametroTabla: "http://localhost:5000/api-gateway/maestra/tabla/parametro"
		}
	};
});
