sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../servicio/CategoriaService",
	"../controller/BaseController",
	'../util/UtilPopUps',
	'../util/UtilValidation' 
], function (Controller, CategoriaService, BaseController, UtilPopUps, UtilValidation) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.ProductoCategoria.controller.CategoriaEditar", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("categoriaEditarRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched:function(evt){ 
			var  iCategoriaId   = evt.getParameter("arguments").id; 
			this.onFnConsultarCategoriaxFiltro(iCategoriaId);
		},
        onFnConsultarCategoriaxFiltro:function(iCategoriaId){
          try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				oParam.iId		= iCategoriaId;
				oParam.bBuscarPadre = true;
				CategoriaService.consultarCategoria(oParam, function(result) {   
					if(result.iCode ===1){ 
						if(result.oResults.length > 1){
							that.getView().getModel("modelAcceso").setProperty("/oCategoriaPadre", result.oResults[1]);	
							that.getView().getModel("modelAcceso").setProperty("/oCategoriaSeleccionado", result.oResults[0]);
						}else{
							that.getView().getModel("modelAcceso").setProperty("/oCategoriaPadre", {});	
							that.getView().getModel("modelAcceso").setProperty("/oCategoriaSeleccionado", result.oResults[0]);
						} 
					}else{
						that.getView().getModel("modelAcceso").setProperty("/oCategoriaSeleccionado", []);
					} 
					sap.ui.core.BusyIndicator.hide();
				}, that);
         
            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        },
		onPressCancelarEdicion:function(){
			try { 
				this.navigation(this, "categoriaRoute",{}); 
			} catch (error) {
				console.log(error);
			}
		},
        onFnEditarCategoria:function(oFile){
          try{
            var that = this; 
				sap.ui.core.BusyIndicator.show(0);  
				var oCategoriaPadre = that.getView().getModel("modelAcceso").getProperty("/oCategoriaPadre");
				var oCategoriaEditar = that.getView().getModel("modelAcceso").getProperty("/oCategoriaSeleccionado");
				var oParam 					= {}; 
				oParam.iId					= oCategoriaEditar.Id;
				oParam.sCodTipo 			= oCategoriaEditar.CodTipo;  
				oParam.sTipo 				= that.getView().byId("cbxTipo").getSelectedItem().getText();; 
				oParam.sNombre 				= oCategoriaEditar.Nombre;
				oParam.sDescripcion 		= oCategoriaEditar.Descripcion; 
				var iNivel = 1;
				var sPadre = "";
				var iPadreId = undefined;
				if(oCategoriaPadre !== undefined){
					iNivel = oCategoriaPadre.Nivel + 1;
					sPadre = ((oCategoriaPadre.Padre === null || oCategoriaPadre.Padre === "") ? "" : oCategoriaPadre.Padre) + oCategoriaPadre.Codigo ;
					iPadreId = oCategoriaPadre.Id;
				} 
				if(oFile){
					oParam.sImagen 		= oFile.sNombreArchivo;   
				}
				oParam.iNivel 				= iNivel;   
				oParam.sPadre 				= sPadre;
				oParam.iPadreId 			= iPadreId;  
				oParam.iOrden 				= parseInt(oCategoriaEditar.Orden, 10);   
				oParam.iCodEstadoCategoria	= parseInt(oCategoriaEditar.CodEstadoCategoria, 10);   
				oParam.sEstadoCategoria		= that.getView().byId("cbxEstado").getSelectedItem().getText();
				CategoriaService.actualizarCategoria(oParam, function(result) {  
					sap.ui.core.BusyIndicator.hide();
					UtilPopUps.validarRespuestaServicio(result,'La Categoria se actualizó correctamente',function(e){});
					if(result.iCode ===1){  
						//that.getView().getModel("modelAcceso").setProperty("/oCategoriaSeleccionado", {}); 
					} 
				}, that);  
            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        } , 
		onPressCategoriaSuperior : function (oEvent) {  

		   var oDialog 	=	this.getView().byId("DlgSeleccionarCategoria"); 
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.ProductoCategoria.view.frag.dialog.CategoriaSuperior", this);
				this.getView().addDependent(oDialog);
			} 
			oDialog.open();

			var oTreeTable = this.getView().byId("tblSelecionCategoria");
			oTreeTable.expandToLevel(4);
	   },
	   onPressSelectCategoria:function(evt){
		   try {
			var sPathRolSeleccionado = evt.getSource().getBindingContext("modelAcceso").getPath()
			var oCategoriaSeleccion  =  this.getView().getModel("modelAcceso").getProperty(sPathRolSeleccionado);     
			this.getView().getModel("modelAcceso").setProperty("/oCategoriaPadre", oCategoriaSeleccion);
			this.onPressCloseSelectCategoria();
		   } catch (error) {
			   
		   }
	   },
	   onPressCloseSelectCategoria: function(){
		   this.getView().byId("DlgSeleccionarCategoria").destroy();  
	   },
	   onLimpiarCategoriaSuperior:function(){
		this.getView().getModel("modelAcceso").setProperty("/oCategoriaPadre", {});
	   },
	   onBuscarCategoria:function(oEvent){ 
			var sQuery = this.getView().byId("buscarCategoria").getValue();  
			var oFilter1 = new sap.ui.model.Filter("Codigo", sap.ui.model.FilterOperator.Contains, sQuery);
			var oFilter2 = new sap.ui.model.Filter("Nombre", sap.ui.model.FilterOperator.Contains, sQuery);
			var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2], false);  
			this.getView().byId("tblSelecionCategoria").getBinding().filter(allFilter, "Application");
	   }, 
	   onPressVerImagen : function (oEvent) {  
		 var oDialog 	=	this.getView().byId("DlgCategoriaImagen"); 
		 if (!oDialog) {
		   oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.ProductoCategoria.view.frag.dialog.CategoriaImagen", this);
		   this.getView().addDependent(oDialog);
		 } 
		 oDialog.open(); 
		},
		onPressCloseCategoriaImagen:function(){
		 this.getView().byId("DlgCategoriaImagen").destroy();  
		},
		onPressEditarCategoria: function() {
			try {
			 var self = this;
			 var sError = UtilValidation.validaFormObligatorio(this,"frmEditarCategoria"); 
			 if(!sError){
				 UtilPopUps.messageBox("¿Desea editar la categoria?", 'c', function(bConfirmacion) {
					 if (bConfirmacion) {
						 var oFileUploader = self.getView().byId("fileUploader"); 
						 var oParam = self.getView().byId("fileUploader").getFocusDomRef().files[0];
						 if(oParam){
						 var formData = new FormData();
						 formData.append("files", oParam);
						 CategoriaService.subirArchivo(formData, function(result) {   
							 //self.onFnRegistrarCategoria(result.oResults);
							 if(result.iCode === 1){
								 self.onFnEditarCategoria(result.oResults);
							 }else{
								 UtilPopUps.validarRespuestaServicio(result,'La Categoria se registró correctamente',function(e){});
							 }
							 self.getView().byId("fileUploader").clear();
							 }, self); 
						 }else{
							 self.onFnEditarCategoria(undefined);
						 } 
					 }
				 });
			 }else{
				 sap.m.MessageToast.show("(*) Ingresar los campos obligatorios"); 
			   };
			   
			} catch (error) {
				console.log(error);
			}
		 
		 
		 }     
	});
});