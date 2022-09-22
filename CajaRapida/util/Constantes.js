sap.ui.define([], function() {
	"use strict";
	return {
        IdApp: 'CajaRapida', 
		services: {
			validarAperturaCaja: "http://localhost:2001/api-gateway/asignacioncaja/verificar", 
			consultarParametros: "http://localhost:2001/api-gateway/maestra/tabla/parametro/filtro",
			consultarProductoDisponibilidad: "http://localhost:2001/api-gateway/producto/inventario/disponibilidad",
			consultarCliente: "http://localhost:2001/api-gateway/cliente",
			facturacionRapida: "http://localhost:2001/api-gateway/facturacion/ventarapida"
		}
	};
});
