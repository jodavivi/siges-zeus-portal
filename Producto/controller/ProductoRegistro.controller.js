sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../servicio/ProductoService",
	"../controller/BaseController",
	'../util/UtilPopUps',
	'../util/UtilValidation',
	"../servicio/CategoriaService", 
	'../util/UtilUi',
	"../servicio/MarcaService",  
	"../servicio/ProductoImagenService",  
], function (Controller, ProductoService, BaseController, UtilPopUps, UtilValidation, CategoriaService, UtilUi, MarcaService, ProductoImagenService) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Producto.controller.ProductoRegistro", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("ProductoRegistroRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched:function(evt){
			var that        = this; 
			this.onFnConsultarCategoria();
			this.onLimpiarCategoria();
			this.onPressTabDetalle();
		} ,
		onPressCancelarRegistro:function(){
			try { 
				this.navigation(this, "productoRoute",{}); 
			} catch (error) {
				console.log(error);
			}
		},
        onRegistrarProducto:function(){
          try{
            var that = this;
            var sError = UtilValidation.validaFormObligatorio(this,"frmRegistroProducto"); 
            if(!sError){
              UtilPopUps.messageBox("¿Desea crear el producto?", 'c', function(bConfirmacion) {
              if (bConfirmacion) {

				var oProductoNuevo = that.getView().getModel("modelAcceso").getProperty("/oProductoNuevo");  
				oProductoNuevo.sEstadoProducto		= that.getView().byId("cbxEstado").getSelectedItem().getText();
				oProductoNuevo.sPresentacion		= that.getView().byId("cbxPresentacion").getSelectedItem().getText();
				oProductoNuevo.iCategoriaId			= that.getView().getModel("modelAcceso").getProperty("/oCategoriaSeleccionado").Id;  
			  	sap.ui.core.BusyIndicator.show(0);  
				 
				ProductoService.registrarProducto(oProductoNuevo, function(result) {  
				sap.ui.core.BusyIndicator.hide();
				UtilPopUps.validarRespuestaServicio(result,'El producto se registró correctamente',function(e){});
				if(result.iCode ===1){   
					that.getView().getModel("modelAcceso").setProperty("/bActivarEdicion", false); 
					that.getView().getModel("modelAcceso").setProperty("/bTabActivar",true);
					that.getView().getModel("modelAcceso").setProperty("/oProductoNuevo/sCodigo", result.oResults.Codigo);
					that.getView().getModel("modelAcceso").setProperty("/oProductoNuevo/iId", result.oResults.Id);
				} 
				}, that); 
 
              }
            });
            }else{
              sap.m.MessageToast.show("(*) Ingresar los campos obligatorios"); 
            };
            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        }, 
		onPressCategoria : function (oEvent) {  

		   var oDialog 	=	this.getView().byId("DlgSeleccionarCategoria"); 
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.Producto.view.frag.dialog.Categoria", this);
				this.getView().addDependent(oDialog);
			} 
			oDialog.open();
			var oTreeTable = this.getView().byId("tblSelecionCategoria");
			oTreeTable.expandToLevel(4);
 
	   }, 
        onFnConsultarCategoria:function(sBuscaCategoria){
          try{
            sap.ui.core.BusyIndicator.show(0);
            var that        = this;
            var oParam 		= {}; 
            oParam.sBuscaCategoria = sBuscaCategoria;
			oParam.iCodEstadoCategoria = 1;
            CategoriaService.consultarCategoria(oParam, function(result) {  
              sap.ui.core.BusyIndicator.hide();
              if(result.iCode ===1){

                var aNuevaListaCategoria = {};
				aNuevaListaCategoria.listaAccesos = UtilUi.generarTree(result.oResults, null);
 
                that.getView().getModel("modelAcceso").setProperty("/aCategoria", aNuevaListaCategoria);
 
              }else{
                that.getView().getModel("modelAcceso").setProperty("/aCategoria", []); 
              } 
            }, that);
         
            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        },
		onPressSelectCategoria:function(evt){
			try {
			 var sPathCategoriaSeleccionado = evt.getSource().getBindingContext("modelAcceso").getPath()
			 var oCategoriaSeleccion  =  this.getView().getModel("modelAcceso").getProperty(sPathCategoriaSeleccionado);     
			 this.getView().getModel("modelAcceso").setProperty("/oCategoriaSeleccionado", oCategoriaSeleccion);
			 this.getView().getModel("modelAcceso").setProperty("/oCategoriaSeleccionado", oCategoriaSeleccion);
			 this.onPressCloseSelectCategoria();
			 this.getView().getModel("modelAcceso").setProperty("/aMarca", []); 
			 this.onFnConsultarMarcaxCategoriaId(oCategoriaSeleccion.Id);
			} catch (error) {
				console.log(error);
			}
		},
		onPressCloseSelectCategoria: function(){
			this.getView().byId("DlgSeleccionarCategoria").destroy();  
		},
		onLimpiarCategoria:function(){
		 this.getView().getModel("modelAcceso").setProperty("/oCategoriaSeleccionado", {});
		 this.getView().getModel("modelAcceso").setProperty("/oProductoNuevo/iMarcaId", 0); 
		 this.getView().getModel("modelAcceso").setProperty("/aMarca", []);
		 this.getView().getModel("modelAcceso").setProperty("/bActivarEdicion", true); 
		 //this.getView().getModel("modelAcceso").setProperty("/bGuardar",true);
		 //this.getView().getModel("modelAcceso").setProperty("/bTabActivar",false);
		}, 
        onFnConsultarMarcaxCategoriaId:function(iCategoria){
          try{
            sap.ui.core.BusyIndicator.show(0);
            var that        = this;
            var oParam 		= {}; 
            oParam.iCategoriaId = iCategoria; 
            MarcaService.consultarMarca(oParam, function(result) {  
              sap.ui.core.BusyIndicator.hide();
              if(result.iCode ===1){ 
				result.oResults.push({"Id":"", "Nombre": "--Seleccionar--"});
                that.getView().getModel("modelAcceso").setProperty("/aMarca", result.oResults);
 
              }else{
                that.getView().getModel("modelAcceso").setProperty("/aMarca", []); 
              } 
            }, that);
         
            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        },
		onPressTabDetalle:function(e){
			var iTabSeleccionado = this.getView().byId("iconTabDetalle").getSelectedKey();
			if(parseInt(iTabSeleccionado, 10) === 1 ){
				this.getView().getModel("modelAcceso").setProperty("/bGuardar",true);
			}else{
				this.getView().getModel("modelAcceso").setProperty("/bGuardar",false);
			}
		},
		onPressNuevoRegistro:function(){
			this.onLimpiarCategoria();
			this.getView().getModel("modelAcceso").setProperty("/oCategoriaSeleccionado", {});
			this.getView().getModel("modelAcceso").setProperty("/oProductoNuevo", {});
			this.getView().getModel("modelAcceso").setProperty("/oProductoNuevo/iMarcaId", 0); 
			this.getView().getModel("modelAcceso").setProperty("/bActivarEdicion", true); 
			this.getView().getModel("modelAcceso").setProperty("/bTabActivar",false);
		},
		onFnConsultarImagenProducto:function(){
			try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				oParam.iProductoId = that.getView().getModel("modelAcceso").getProperty("/oProductoNuevo/iId");
				ProductoImagenService.consultarProductoImagen(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide();
				  if(result.iCode ===1){  
					that.getView().getModel("modelAcceso").setProperty("/aProductoImagen", result.oResults); 
				  }else{
					that.getView().getModel("modelAcceso").setProperty("/aProductoImagen", []); 
				  } 
				}, that);
			 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		},
		onPressSubirArchivo:function(){
			try {
				var oDialog 	=	this.getView().byId("DlgRegistrarImagen"); 
				if (!oDialog) {
					oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.Producto.view.frag.dialog.DlgRegistrarImagen", this);
					this.getView().addDependent(oDialog);
				} 
				oDialog.open();
			} catch (error) {
				console.log(error);
			}
		},
		onPressSubirImagen:function(){
			try {
				var self = this;
				var sError = UtilValidation.validaFormObligatorio(this,"frmRegistrarImagen"); 
				if(!sError){
					UtilPopUps.messageBox("¿Desea subir la imagen?", 'c', function(bConfirmacion) {
						if (bConfirmacion) {
								sap.ui.core.BusyIndicator.show(0);
								var oFileUploader = self.getView().byId("fileUploaderImagen"); 
								var oParam = self.getView().byId("fileUploaderImagen").getFocusDomRef().files[0];
								if(oParam){
								var formData = new FormData();
								formData.append("files", oParam);
								ProductoImagenService.subirArchivo(formData, function(result) {   
									//self.onFnRegistrarCategoria(result.oResults);
									if(result.iCode === 1){
										console.log(result);
										self.onFnGuardarImagen(result.oResults);
									}else{
										UtilPopUps.validarRespuestaServicio(result,'La Imagen se subió correctamente',function(e){});
									}
									sap.ui.core.BusyIndicator.hide();
									self.getView().byId("fileUploaderImagen").clear();
								}, self); 
							}else{
								self.onFnGuardarImagen(undefined);
							} 
						}
					});
				}else{
					sap.m.MessageToast.show("(*) Ingresar los campos obligatorios"); 
				  };
				  
			   } catch (error) {
				   console.log(error);
				   sap.ui.core.BusyIndicator.hide();
			   }
		},
		onFnGuardarImagen:function(oFile){
			try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				var oProductoNuevo = that.getView().getModel("modelAcceso").getProperty("/oProductoNuevo");
				var oImagenProductoNuevo = that.getView().getModel("modelAcceso").getProperty("/oImagenProductoNuevo");
				oParam.iProductoId 		= oProductoNuevo.iId;
				oParam.sImagen 			= (oFile) ? oFile.sNombreArchivo : "";
				oParam.iOrden 			= (oImagenProductoNuevo.iOrden) === undefined ? 1 : oImagenProductoNuevo.iOrden;
				oParam.iCodEstadoImagen = oImagenProductoNuevo.iCodEstadoImagen;
				oParam.sEstadoImagen    = that.getView().byId("cbxEstadoImagen").getSelectedItem().getText(); 
 
				ProductoImagenService.registrarImagenProducto(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide();
				  if(result.iCode ===1){  
					that.getView().getModel("modelAcceso").setProperty("/oImagenProductoNuevo", {}); 
					that.onPressCloseRegistroImagen();
					that.onFnConsultarImagenProducto();
				  } else{ 
				  }
				  UtilPopUps.validarRespuestaServicio(result,'La Imagen se guardo correctamente',function(e){});
				}, that); 
				 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		},
		onPressCloseRegistroImagen: function(){
			this.getView().byId("DlgRegistrarImagen").destroy();  
		},
        onPressEliminarImagenProducto:function(){
          try {
            var self = this;
            
            var indexes = self.getView().byId("tbImagenes").getSelectedIndices();
            if(indexes.length > 0){
              sap.ui.core.BusyIndicator.show(0);
              var aListaImagenEliminar = [];
              indexes.forEach(function(i) {
                var oParametros = self.getView().byId("tbImagenes").getContextByIndex(i).getObject();  
                aListaImagenEliminar.push( oParametros.Id);
              });
              var oParamEliminar = {};
              oParamEliminar.aItems = aListaImagenEliminar;
              UtilPopUps.messageBox("¿Desea eliminar las imagenes seleccionadas?", 'c', function(bConfirmacion) {
                if (bConfirmacion) {
                  sap.ui.core.BusyIndicator.hide();
                  ProductoImagenService.eliminarImagenProducto(oParamEliminar, function(result) { 
                    sap.ui.core.BusyIndicator.hide();
                    
                    if(result.iCode ===1){
                      UtilPopUps.validarRespuestaServicio(result,'Imagenes eliminados correctamente',function(e){});
                      //Recargamos los usuarios
                      self.onFnConsultarImagenProducto(self);  
                      var oTable1 = self.getView().byId("tbImagenes");
                      oTable1.clearSelection(); 
                      self.getView().getModel("tbImagenes").refresh();
                    } 
                  }, self); 
                }else{
                  sap.ui.core.BusyIndicator.hide();
                }
              }); 
            }else{ 
                sap.m.MessageToast.show("Seleccionar Imagen"); 
              } 
          } catch (error) {
            sap.ui.core.BusyIndicator.hide();
            console.log(error);
          }
        },
		onBuscarCategoria:function(oEvent){ 
			 var sQuery = this.getView().byId("buscarCategoria").getValue();  
			 var oFilter1 = new sap.ui.model.Filter("Codigo", sap.ui.model.FilterOperator.Contains, sQuery);
			 var oFilter2 = new sap.ui.model.Filter("Nombre", sap.ui.model.FilterOperator.Contains, sQuery);
			 var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2], false);  
			 this.getView().byId("tblSelecionCategoria").getBinding().filter(allFilter, "Application");
		}
		   
	});
});