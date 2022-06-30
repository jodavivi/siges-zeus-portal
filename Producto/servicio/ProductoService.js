 sap.ui.define([ 
	"../util/UtilResponse",
	"../util/UtilHttp",
	"../util/Constantes",
	"../util/UtilUi"
], function(UtilResponse, UtilHttp, Constantes, UtilUi) {
	"use strict";
	return {
		consultarProducto: function(oParam, callback,context) {
			UtilHttp.httpGet(Constantes.services.consultarProducto+UtilUi.geneararFiltro(oParam) , Constantes.IdApp, function(result) {
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
		registrarProducto: function(oParam, callback,context) {
			UtilHttp.httpPost(Constantes.services.registrarProducto, oParam, Constantes.IdApp, function(result) {
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
		actualizarProducto: function(oParam, callback,context) {
			UtilHttp.httpPut(Constantes.services.actualizarProducto.replace("{0}", oParam.iId), oParam, Constantes.IdApp, function(result) {
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
		eliminarProducto: function(oParam, callback,context) {
			UtilHttp.httpDelete(Constantes.services.eliminarProducto, oParam, Constantes.IdApp, function(result) {
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
