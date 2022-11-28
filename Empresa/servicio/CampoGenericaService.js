 sap.ui.define([ 
	"../util/UtilResponse",
	"../util/UtilHttp",
	"../util/Constantes",
	"../util/UtilUi"
], function(UtilResponse, UtilHttp, Constantes, UtilUi) {
	"use strict";
	return {
		consultarParametrosTabla: function(oParam, callback,context) {
			UtilHttp.httpGet(Constantes.services.consultarParametrosTabla+"?iId="+oParam.iId , Constantes.IdApp, function(result) {
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
		consultarParametrosxFiltro: function(oParam, callback,context) {
			UtilHttp.httpGet(Constantes.services.consultarParametrosFiltro+UtilUi.geneararFiltro(oParam) , Constantes.IdApp, function(result) {
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
		registrarParametroTabla: function(oParam, callback,context) {
			UtilHttp.httpPost(Constantes.services.registrarParametroTabla+"?iId="+oParam.iId, oParam, Constantes.IdApp, function(result) {
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
		eliminarParametroTabla: function(oParam, callback,context) {
			UtilHttp.httpDelete(Constantes.services.eliminarParametroTabla, oParam, Constantes.IdApp, function(result) {
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
		actualizarParametroTabla: function(oParam, callback,context) {
			UtilHttp.httpPut(Constantes.services.actualizarParametroTabla+"?iId="+oParam.iId, oParam, Constantes.IdApp, function(result) {
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
