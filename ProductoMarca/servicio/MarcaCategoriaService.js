 sap.ui.define([ 
	"../util/UtilResponse",
	"../util/UtilHttp",
	"../util/Constantes",
	"../util/UtilUi"
], function(UtilResponse, UtilHttp, Constantes, UtilUi) {
	"use strict";
	return {
		consultarMarcaCategoria: function(oParam, callback,context) {
			UtilHttp.httpGet(Constantes.services.consultarMarcaCategoria+UtilUi.geneararFiltro(oParam) , Constantes.IdApp, function(result) {
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
		registrarMarcaCategoria: function(oParam, callback,context) {
			UtilHttp.httpPost(Constantes.services.registrarMarcaCategoria, oParam, Constantes.IdApp, function(result) {
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
		eliminarMarcaCategoria: function(oParam, callback,context) {
			UtilHttp.httpDelete(Constantes.services.eliminarMarcaCategoria, oParam, Constantes.IdApp, function(result) {
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
