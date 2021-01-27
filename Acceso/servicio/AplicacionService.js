 sap.ui.define([ 
	"../util/UtilResponse",
	"../util/UtilHttp",
	"../util/Constantes",
	"../util/UtilUi"
], function(UtilResponse, UtilHttp, Constantes, UtilUi) {
	"use strict";
	return {
		consultarAplicacion: function(oParam, callback,context) {
			UtilHttp.httpGet(Constantes.services.consultarAplicacion+UtilUi.geneararFiltro(oParam) , Constantes.IdApp, function(result) {
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
		consultarGrupoAplicacion: function(oParam, callback,context) {
			UtilHttp.httpGet(Constantes.services.consultarGrupoAplicacion+UtilUi.geneararFiltro(oParam) , Constantes.IdApp, function(result) {
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
		crearAplicacion: function(oParam, callback,context) {
			UtilHttp.httpPost(Constantes.services.crearAplicacion, oParam, Constantes.IdApp, function(result) {
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
		}  , 
		actualizarAplicacion: function(oParam, callback,context) {
			UtilHttp.httpPut(Constantes.services.actualizarAplicacion.replace("{0}", oParam.iId), oParam, Constantes.IdApp, function(result) {
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
		eliminarAplicacion: function(oParam, callback,context) {
			UtilHttp.httpDelete(Constantes.services.eliminarAplicacion, oParam, Constantes.IdApp, function(result) {
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
