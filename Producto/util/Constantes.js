sap.ui.define([], function() {
	"use strict";
	return {
        IdApp: 'Producto', 
		services: {
			consultarProducto: "http://localhost:2001/api-gateway/producto",
			consultarParametros: "http://localhost:2001/api-gateway/maestra/tabla/parametro/filtro",
			consultarCategoria:"http://localhost:2001/api-gateway/producto/categoria",
			consultarMarca:"http://localhost:2001/api-gateway/producto/marca/categoria/filtro", 
			registrarProducto:"http://localhost:2001/api-gateway/producto",
			actualizarProducto:"http://localhost:2001/api-gateway/producto?iId={0}",
			eliminarProducto:"http://localhost:2001/api-gateway/producto",
			consultarImagenProducto: "http://localhost:2001/api-gateway/producto/imagen",
			registrarImagenProducto: "http://localhost:2001/api-gateway/producto/imagen",
			eliminarImagenProducto: "http://localhost:2001/api-gateway/producto/imagen",
			actualizarImagenProducto:"http://localhost:2001/api-gateway/producto/imagen?iId={0}",
			subirArchivo:"http://localhost:3012/documento/upload" 
		}
	};
});
