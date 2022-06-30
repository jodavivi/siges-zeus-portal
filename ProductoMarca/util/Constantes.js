sap.ui.define([], function() {
	"use strict";
	return {
        IdApp: 'Usuario', 
		services: {
			consultarMarca: "http://localhost:2001/api-gateway/producto/marca",
			consultarMarcaCategoria: "http://localhost:2001/api-gateway/producto/marca/categoria",
			registrarMarca: "http://localhost:2001/api-gateway/producto/marca",
			actualizarMarca: "http://localhost:2001/api-gateway/producto/marca?iId={0}",
			subirArchivo:"http://localhost:3012/documento/upload",
			eliminarMarca: "http://localhost:2001/api-gateway/producto/marca",
			consultarCategoria: "http://localhost:2001/api-gateway/producto/categoria", 
			registrarMarcaCategoria: "http://localhost:2001/api-gateway/producto/marca/categoria",
			eliminarMarcaCategoria: "http://localhost:2001/api-gateway/producto/marca/categoria",
		}
	};
});
