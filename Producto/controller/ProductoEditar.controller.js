sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../servicio/ProductoService",
	"../controller/BaseController",
	'../util/UtilPopUps',
	'../util/UtilValidation', 
	"../servicio/MarcaService",  
	"../servicio/ProductoImagenService",  
	"../servicio/CategoriaService", 
	'../util/UtilUi', 
	"sap/ui/core/Fragment",
], function (Controller, ProductoService, BaseController, UtilPopUps, UtilValidation, MarcaService, ProductoImagenService, CategoriaService, UtilUi, Fragment) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Producto.controller.ProductoEditar", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("ProductoEditarRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched:function(evt){ 
			var  iProductoId   = evt.getParameter("arguments").id; 
			this.onFnConsultarCategoria();
			this.onFnConsultarProductoxFiltro(iProductoId);
			this.onFnConsultarImagenProducto(iProductoId);
		},
        onFnConsultarProductoxFiltro:function(iProductoId){
          try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				oParam.iId		= iProductoId;
				ProductoService.consultarProducto(oParam, function(result) {   
				if(result.iCode ===1){ 
					that.getView().getModel("modelAcceso").setProperty("/oProductoSeleccionado", result.oResults[0]);
					that.onFnConsultarMarcaxCategoriaId(result.oResults[0].CategoriaId);
				}else{
					that.getView().getModel("modelAcceso").setProperty("/oProductoSeleccionado", []);
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
				this.navigation(this, "productoRoute",{}); 
			} catch (error) {
				console.log(error);
			}
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
		onFnConsultarImagenProducto:function(iProductoId){
			try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				oParam.iProductoId = iProductoId;
				ProductoImagenService.consultarProductoImagen(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide();
				  if(result.iCode ===1){  
					that.getView().getModel("modelAcceso").setProperty("/aProductoImagen", result.oResults); 
					that.getView().getModel("modelAcceso").setProperty("/iNumImagenItems", result.oResults.length); 
					
				  }else{
					that.getView().getModel("modelAcceso").setProperty("/aProductoImagen", []); 
				  } 
				}, that);
			 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		},
		onPressTabDetalle:function(e){
			var iTabSeleccionado = this.getView().byId("iconTabDetalleEditar").getSelectedKey();
			if(parseInt(iTabSeleccionado, 10) === 1 ){
				this.getView().getModel("modelAcceso").setProperty("/bGuardar",true);
			}else{
				this.getView().getModel("modelAcceso").setProperty("/bGuardar",false);
			}
		},
        onEditarProducto:function(){
          try{
            var that = this;
            var sError = UtilValidation.validaFormObligatorio(this,"frmEditarProducto"); 
            if(!sError){
              UtilPopUps.messageBox("¿Desea actualizar el producto?", 'c', function(bConfirmacion) {
              if (bConfirmacion) {
				var oProductoSeleccionado = that.getView().getModel("modelAcceso").getProperty("/oProductoSeleccionado");  
				  	sap.ui.core.BusyIndicator.show(0);  
				
				var oParamEditarProducto = {};
				oParamEditarProducto.iId 					= oProductoSeleccionado.Id;
				if(that.getView().getModel("modelAcceso").getProperty("/oCategoriaSeleccionado").Id === undefined){
					oParamEditarProducto.iCategoriaId	 		= oProductoSeleccionado.CategoriaId;  
				}else{
					oParamEditarProducto.iCategoriaId	 		= that.getView().getModel("modelAcceso").getProperty("/oCategoriaSeleccionado").Id;  
				}
				
				oParamEditarProducto.iMarcaId 				= oProductoSeleccionado.MarcaId;
				oParamEditarProducto.sNombre 				= oProductoSeleccionado.Nombre;
				oParamEditarProducto.sDescripcion 			= oProductoSeleccionado.Descripcion;
				oParamEditarProducto.sCodPresentacion 		= oProductoSeleccionado.CodPresentacion;
				oParamEditarProducto.sPresentacion 			= that.getView().byId("cbxPresentacion").getSelectedItem().getText();
				//ParamEditarProducto.iOrden					= oProductoSeleccionado.Orden;
				oParamEditarProducto.sCodigoBarra			= oProductoSeleccionado.CodigoBarra;
				oParamEditarProducto.iCodEstadoProducto		= oProductoSeleccionado.CodEstadoProducto;
				oParamEditarProducto.sEstadoProducto		= that.getView().byId("cbxEstado").getSelectedItem().getText();

				ProductoService.actualizarProducto(oParamEditarProducto, function(result) {  
				sap.ui.core.BusyIndicator.hide();
				UtilPopUps.validarRespuestaServicio(result,'El producto se actualizó correctamente',function(e){});
				if(result.iCode ===1){   
					that.getView().getModel("modelAcceso").setProperty("/bActivarEdicion", true); 
					that.getView().getModel("modelAcceso").setProperty("/bTabActivar",true); 
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
        } , 
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
	   }  ,
	   onPressSelectCategoria:function(evt){
		   try {
			var sPathCategoriaSeleccionado = evt.getSource().getBindingContext("modelAcceso").getPath()
			var oCategoriaSeleccion  =  this.getView().getModel("modelAcceso").getProperty(sPathCategoriaSeleccionado);     
			this.getView().getModel("modelAcceso").setProperty("/oCategoriaSeleccionado", oCategoriaSeleccion); 
			
			this.getView().getModel("modelAcceso").setProperty("/oProductoSeleccionado/Categoria/Nombre", oCategoriaSeleccion.Nombre);  
			
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
		this.getView().getModel("modelAcceso").setProperty("/oProductoSeleccionado/Categoria/Nombre", ""); 
		 
	   },
	   onBuscarCategoria:function(oEvent){ 
			var sQuery = this.getView().byId("buscarCategoria").getValue();  
			var oFilter1 = new sap.ui.model.Filter("Codigo", sap.ui.model.FilterOperator.Contains, sQuery);
			var oFilter2 = new sap.ui.model.Filter("Nombre", sap.ui.model.FilterOperator.Contains, sQuery);
			var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2], false);  
			this.getView().byId("tblSelecionCategoria").getBinding().filter(allFilter, "Application");
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
			   var oProductoSeleccionado = that.getView().getModel("modelAcceso").getProperty("/oProductoSeleccionado");
			   var oImagenProductoNuevo = that.getView().getModel("modelAcceso").getProperty("/oImagenProductoNuevo");
			   oParam.iProductoId 		= oProductoSeleccionado.Id;
			   oParam.sImagen 			= (oFile) ? oFile.sNombreArchivo : "";
			   oParam.iOrden 			= (oImagenProductoNuevo.iOrden) === undefined ? 1 : oImagenProductoNuevo.iOrden;
			   oParam.iCodEstadoImagen = parseInt(oImagenProductoNuevo.iCodEstadoImagen,10);
			   oParam.sEstadoImagen    = that.getView().byId("cbxEstadoImagen").getSelectedItem().getText(); 

			   ProductoImagenService.registrarImagenProducto(oParam, function(result) {  
				 sap.ui.core.BusyIndicator.hide();
				 if(result.iCode ===1){  
				   that.getView().getModel("modelAcceso").setProperty("/oImagenProductoNuevo", {}); 
				   that.onPressCloseRegistroImagen();
				   that.onFnConsultarImagenProducto(oProductoSeleccionado.Id);
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
	   onPressEditarImagen:function(evt){
		try {
			var sPathImagebSeleccionado = evt.getSource().getBindingContext("modelAcceso").getPath()
			var oImagenSeleccion  =  this.getView().getModel("modelAcceso").getProperty(sPathImagebSeleccionado);     
			this.getView().getModel("modelAcceso").setProperty("/oImagenProductoSeleccionado", oImagenSeleccion); 

			var oDialog 	=	this.getView().byId("DlgActualizarImagen"); 
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.Producto.view.frag.dialog.DlgActualizarImagen", this);
				this.getView().addDependent(oDialog);
			} 
			oDialog.open();
		} catch (error) {
			console.log(error);
		}
	   },
	   onVerAuditoriaProducto:function(evt){
   
		 var sPathParamSeleccionado = evt.getSource().getBindingContext("modelAcceso").getPath()
		 var oParamSeleccionado  =  this.getView().getModel("modelAcceso").getProperty(sPathParamSeleccionado);    
		 this.getView().getModel("modelAcceso").setProperty("/oUsuarioAuditoria",oParamSeleccionado); 
		 var oButton = evt.getSource(),
		   oView = this.getView();
   
		 if (!this._AuditoriaAplicacion) {
		   this._AuditoriaAplicacion = Fragment.load({
			 id: oView.getId(),
			 name: "com.telcomdataperu.app.Usuario.view.frag.dialog.AuditoriaUsuario",
			 controller: this
		   }).then(function (oPopover) {
			 oView.addDependent(oPopover);
			 return oPopover;
		   });
		 }
		 this._AuditoriaAplicacion.then(function (oPopover){ 
		   oPopover.openBy(oButton);
		 });
	   },
	   onPressActualzarImagen:function(){
		   try{
		    var self = this;
			var sError = UtilValidation.validaFormObligatorio(this,"frmActualizarImagen"); 
			if(!sError){
				UtilPopUps.messageBox("¿Desea actualizar la imagen?", 'c', function(bConfirmacion) {
					if (bConfirmacion) {
							sap.ui.core.BusyIndicator.show(0);
							var oFileUploader = self.getView().byId("fileUploaderActualizarImagen"); 
							var oParam = self.getView().byId("fileUploaderActualizarImagen").getFocusDomRef().files[0];
							if(oParam){
							var formData = new FormData();
							formData.append("files", oParam);
							ProductoImagenService.subirArchivo(formData, function(result) {   
								//self.onFnRegistrarCategoria(result.oResults);
								if(result.iCode === 1){
									console.log(result);
									self.onFnActualizarImagen(result.oResults);
								}else{
									UtilPopUps.validarRespuestaServicio(result,'La Imagen se subió correctamente',function(e){});
								}
								sap.ui.core.BusyIndicator.hide();
								self.getView().byId("fileUploaderActualizarImagen").clear();
							}, self); 
						}else{
							self.onFnActualizarImagen(undefined);
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
	   onFnActualizarImagen:function(oFile){
		   try{
			   sap.ui.core.BusyIndicator.show(0);
			   var that        = this;
			   var oParam 		= {}; 
			   var oProductoSeleccionado = that.getView().getModel("modelAcceso").getProperty("/oProductoSeleccionado");
			   var oImagenProductoSeleccionado = that.getView().getModel("modelAcceso").getProperty("/oImagenProductoSeleccionado");
			   oParam.iId 				= oImagenProductoSeleccionado.Id;
			   oParam.sImagen 			= (oFile) ? oFile.sNombreArchivo : oImagenProductoSeleccionado.Imagen;
			   oParam.iOrden 			= (oImagenProductoSeleccionado.Orden) === undefined ? 1 : oImagenProductoSeleccionado.Orden;
			   oParam.iCodEstadoImagen = parseInt(oImagenProductoSeleccionado.CodEstadoImagen,10);
			   oParam.sEstadoImagen    = that.getView().byId("cbxEstadoImagen").getSelectedItem().getText(); 
				console.log(oParam);
			   ProductoImagenService.actualizarImagenProducto(oParam, function(result) {  
				 sap.ui.core.BusyIndicator.hide();
				 if(result.iCode ===1){   
				   that.onPressCloseEditarImagen();
				   that.onFnConsultarImagenProducto(oProductoSeleccionado.Id);
				 } else{ 
				 }
				 UtilPopUps.validarRespuestaServicio(result,'La Imagen se guardo correctamente',function(e){});
			   }, that); 
				
			   }catch(e){
				 sap.ui.core.BusyIndicator.hide();
				 console.log(e);
			   }
	   },
	   onPressCloseEditarImagen: function(){
		   this.getView().byId("DlgActualizarImagen").destroy();  
	   },
	   onPressEliminarProductoImagen:function(){
		 try {
		   var self = this;
		   
		   var indexes = self.getView().byId("tbImagenes").getSelectedIndices();
		   var oProductoSeleccionado = self.getView().getModel("modelAcceso").getProperty("/oProductoSeleccionado");
		   if(indexes.length > 0){
			 sap.ui.core.BusyIndicator.show(0);
			 var aListaEliminar = [];
			 indexes.forEach(function(i) {
			   var oParametros = self.getView().byId("tbImagenes").getContextByIndex(i).getObject();  
			   aListaEliminar.push( oParametros.Id);
			 });
			 var oParamEliminar = {};
			 oParamEliminar.aItems = aListaEliminar;
			 UtilPopUps.messageBox("¿Desea eliminar las imagenes seleccionadas?", 'c', function(bConfirmacion) {
			   if (bConfirmacion) {
				 sap.ui.core.BusyIndicator.hide();
				 ProductoImagenService.eliminarImagenProducto(oParamEliminar, function(result) { 
				   sap.ui.core.BusyIndicator.hide();
				   
				   if(result.iCode ===1){
					 UtilPopUps.validarRespuestaServicio(result,'Imagenes eliminados correctamente',function(e){});
					 //Recargamos los usuarios
					 self.onFnConsultarImagenProducto(oProductoSeleccionado.Id);
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
	   }
	});
});