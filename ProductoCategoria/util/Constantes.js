sap.ui.define([], function() {
	"use strict";
	return {
        IdApp: 'Categoria', 
		services: {
			consultarCategoria: "http://localhost:2001/api-gateway/producto/categoria",
			registrarCategoria:"http://localhost:2001/api-gateway/producto/categoria",
			actualizarCategoria:"http://localhost:2001/api-gateway/producto/categoria?iId={0}",
			eliminarCategoria:"http://localhost:2001/api-gateway/producto/categoria",
			subirArchivo:"http://localhost:3012/documento/upload",
			consultarParametros: "http://localhost:2001/api-gateway/maestra/tabla/parametro/filtro", 
		}
	};
});
