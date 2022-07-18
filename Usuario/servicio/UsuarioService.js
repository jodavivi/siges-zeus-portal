 sap.ui.define([ 
	"../util/UtilResponse",
	"../util/UtilHttp",
	"../util/Constantes",
	"../util/UtilUi"
], function(UtilResponse, UtilHttp, Constantes, UtilUi) {
	"use strict";
	return {
		consultarUsuarioEmpresaAll: function(oParam, callback,context) {
			UtilHttp.httpGet(Constantes.services.consultarUsuarioEmpresaAll+UtilUi.geneararFiltro(oParam) , Constantes.IdApp, function(result) {
				var oAuditResponse = result.oAuditResponse;
				if (oAuditResponse.iCode === 1) {
					callback(UtilResponse.success(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode > 1) {
					callback(UtilResponse.warn(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode < 0 && oAuditResponse.iCode !== -1000) {
					callback(UtilResponse.error(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode === -1000) {
					callback(UtilResponse.exception(oAuditResponse.sMessage));
				}
			}, context);
		} ,
		consultarUsuario: function(oParam, callback,context) {
			UtilHttp.httpGet(Constantes.services.consultarUsuario+UtilUi.geneararFiltro(oParam) , Constantes.IdApp, function(result) {
				var oAuditResponse = result.oAuditResponse;
				if (oAuditResponse.iCode === 1) {
					callback(UtilResponse.success(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode > 1) {
					callback(UtilResponse.warn(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode < 0 && oAuditResponse.iCode !== -1000) {
					callback(UtilResponse.error(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode === -1000) {
					callback(UtilResponse.exception(oAuditResponse.sMessage));
				}
			}, context);
		} , 
		registrarUsuario: function(oParam, callback,context) {
			UtilHttp.httpPost(Constantes.services.registrarUsuario, oParam, Constantes.IdApp, function(result) {
				var oAuditResponse = result.oAuditResponse;
				if (oAuditResponse.iCode === 1) {
					callback(UtilResponse.success(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode > 1) {
					callback(UtilResponse.warn(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode < 0 && oAuditResponse.iCode !== -1000) {
					callback(UtilResponse.error(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode === -1000) {
					callback(UtilResponse.exception(oAuditResponse.sMessage));
				}
			}, context);
		} , 
		actualizarUsuario: function(oParam, callback,context) {
			UtilHttp.httpPut(Constantes.services.actualizarUsuario.replace("{0}", oParam.iId), oParam, Constantes.IdApp, function(result) {
				var oAuditResponse = result.oAuditResponse;
				if (oAuditResponse.iCode === 1) {
					callback(UtilResponse.success(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode > 1) {
					callback(UtilResponse.warn(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode < 0 && oAuditResponse.iCode !== -1000) {
					callback(UtilResponse.error(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode === -1000) {
					callback(UtilResponse.exception(oAuditResponse.sMessage));
				}
			}, context);
		}, 
		asignarEmpresaUsuario: function(oParam, callback,context) {
			UtilHttp.httpPut(Constantes.services.asignarEmpresaUsuario.replace("{0}", oParam.iId), oParam, Constantes.IdApp, function(result) {
				var oAuditResponse = result.oAuditResponse;
				if (oAuditResponse.iCode === 1) {
					callback(UtilResponse.success(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode > 1) {
					callback(UtilResponse.warn(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode < 0 && oAuditResponse.iCode !== -1000) {
					callback(UtilResponse.error(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode === -1000) {
					callback(UtilResponse.exception(oAuditResponse.sMessage));
				}
			}, context);
		},
		eliminarUsuario: function(oParam, callback,context) {
			UtilHttp.httpDelete(Constantes.services.eliminarUsuario, oParam, Constantes.IdApp, function(result) {
				var oAuditResponse = result.oAuditResponse;
				if (oAuditResponse.iCode === 1) {
					callback(UtilResponse.success(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode > 1) {
					callback(UtilResponse.warn(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode < 0 && oAuditResponse.iCode !== -1000) {
					callback(UtilResponse.error(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode === -1000) {
					callback(UtilResponse.exception(oAuditResponse.sMessage));
				}
			}, context);
		}, 
		consultarEstadoClave: function(oParam, callback,context) {
			UtilHttp.httpGet(Constantes.services.consultaEstadoClave+UtilUi.geneararFiltro(oParam) , Constantes.IdApp, function(result) {
				var oAuditResponse = result.oAuditResponse;
				if (oAuditResponse.iCode === 1) {
					callback(UtilResponse.success(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode > 1) {
					callback(UtilResponse.warn(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode < 0 && oAuditResponse.iCode !== -1000) {
					callback(UtilResponse.error(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode === -1000) {
					callback(UtilResponse.exception(oAuditResponse.sMessage));
				}
			}, context);
		}, 
		resetearClave: function(oParam, callback,context) {
			UtilHttp.httpPut(Constantes.services.resetearClave, oParam, Constantes.IdApp, function(result) {
				var oAuditResponse = result.oAuditResponse;
				if (oAuditResponse.iCode === 1) {
					callback(UtilResponse.success(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode > 1) {
					callback(UtilResponse.warn(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode < 0 && oAuditResponse.iCode !== -1000) {
					callback(UtilResponse.error(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode === -1000) {
					callback(UtilResponse.exception(oAuditResponse.sMessage));
				}
			}, context);
		} ,
		consultarUsuarioRolNoAsignado: function(oParam, callback,context) {
			UtilHttp.httpGet(Constantes.services.consultarRolUsuarioNoAsignado+UtilUi.geneararFiltro(oParam) , Constantes.IdApp, function(result) {
				var oAuditResponse = result.oAuditResponse;
				if (oAuditResponse.iCode === 1) {
					callback(UtilResponse.success(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode > 1) {
					callback(UtilResponse.warn(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode < 0 && oAuditResponse.iCode !== -1000) {
					callback(UtilResponse.error(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode === -1000) {
					callback(UtilResponse.exception(oAuditResponse.sMessage));
				}
			}, context);
		},
		consultarUsuarioRol: function(oParam, callback,context) {
			UtilHttp.httpGet(Constantes.services.consultarRolUsuario+UtilUi.geneararFiltro(oParam) , Constantes.IdApp, function(result) {
				var oAuditResponse = result.oAuditResponse;
				if (oAuditResponse.iCode === 1) {
					callback(UtilResponse.success(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode > 1) {
					callback(UtilResponse.warn(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode < 0 && oAuditResponse.iCode !== -1000) {
					callback(UtilResponse.error(oAuditResponse.sIdTransaction, oAuditResponse.sMessage, result.oData));
				} else if (oAuditResponse.iCode === -1000) {
					callback(UtilResponse.exception(oAuditResponse.sMessage));
				}
			}, context);
		}
	};
});
