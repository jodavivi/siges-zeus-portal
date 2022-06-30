sap.ui.define([], function() {
	"use strict";
	return {
		IdApp: 'Portal',
		urlWebLogin:'http://localhost/siges-zeus-login', 
		validaClaveUsuario:"http://localhost:2001/api-gateway/seguridad/usuario/validaestadoclave",
		cambiarClaveUsuario:"http://localhost:2001/api-gateway/seguridad/usuario/clave"
	};
});
