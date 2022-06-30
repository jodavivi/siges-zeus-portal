sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../servicio/CategoriaService",
	"../controller/BaseController",
	'../util/UtilPopUps',
	'../util/UtilValidation',
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator", 
	'sap/m/MessageToast' 
], function (Controller, CategoriaService, BaseController, UtilPopUps, UtilValidation, Filter, FilterOperator, MessageToast) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.ProductoCategoria.controller.CategoriaRegistro", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("categoriaRegistroRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched:function(evt){
			var that        = this;  
		} ,
		onPressCancelarRegistro:function(){
			try { 
				this.navigation(this, "categoriaRoute",{}); 
			} catch (error) {
				console.log(error);
			}
		},
        onFnRegistrarCategoria:function(oFile){
          try{
            var that = this; 
				sap.ui.core.BusyIndicator.show(0);  
				var oCategoriaPadre = that.getView().getModel("modelAcceso").getProperty("/oCategoriaPadre");
				var oCategoriaNuevo = that.getView().getModel("modelAcceso").getProperty("/oCategoriaNuevo");
				var oParam 					= {}; 
				oParam.sCodTipo 			= oCategoriaNuevo.sCodTipo;  
				oParam.sTipo 				= that.getView().byId("cbxTipo").getSelectedItem().getText();; 
				oParam.sNombre 				= oCategoriaNuevo.sNombre;
				oParam.sDescripcion 		= oCategoriaNuevo.sDescripcion; 
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
				oParam.iOrden 				= parseInt(oCategoriaNuevo.iOrden, 10);   
				oParam.iCodEstadoCategoria	= parseInt(oCategoriaNuevo.iCodEstadoCategoria, 10);   
				oParam.sEstadoCategoria		= that.getView().byId("cbxEstado").getSelectedItem().getText();;   
				CategoriaService.registrarCategoria(oParam, function(result) {  
				sap.ui.core.BusyIndicator.hide();
				UtilPopUps.validarRespuestaServicio(result,'La Categoria se registró correctamente',function(e){});
				if(result.iCode ===1){  
					that.getView().getModel("modelAcceso").setProperty("/oCategoriaNuevo", {}); 
				} 
				}, that);  

            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        }, 
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
	   } ,
	   onPressRegistrarCategoria: function() {
		   try {
			var self = this;
			var sError = UtilValidation.validaFormObligatorio(this,"frmRegistroCategoria"); 
            if(!sError){
				UtilPopUps.messageBox("¿Desea crear la categoria?", 'c', function(bConfirmacion) {
					if (bConfirmacion) {
						var oFileUploader = self.getView().byId("fileUploader"); 
						var oParam = self.getView().byId("fileUploader").getFocusDomRef().files[0];
						if(oParam){
						var formData = new FormData();
						formData.append("files", oParam);
						CategoriaService.subirArchivo(formData, function(result) {   
							//self.onFnRegistrarCategoria(result.oResults);
							if(result.iCode === 1){
								self.onFnRegistrarCategoria(result.oResults);
							}else{
								UtilPopUps.validarRespuestaServicio(result,'La Categoria se registró correctamente',function(e){});
							}
							self.getView().byId("fileUploader").clear();
							}, self); 
						}else{
							self.onFnRegistrarCategoria(undefined);
						} 
					}
				});
			}else{
				sap.m.MessageToast.show("(*) Ingresar los campos obligatorios"); 
			  };
			  
		   } catch (error) {
			   console.log(error);
		   }
		
		
		},
		handleUploadComplete: function(oEvent) {
			 console.log("TERMINAAAAAA");
		}  
	});
});