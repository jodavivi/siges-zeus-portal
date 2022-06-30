sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "../controller/BaseController",
  "../servicio/MarcaService",
  "../servicio/MaestraService",
  "../servicio/RolService", 
	"sap/ui/core/Fragment",
  '../util/UtilPopUps',
	'../util/UtilValidation',
  "../servicio/MarcaCategoriaService", 
  "../servicio/CategoriaService",
  '../util/UtilUi' 
], function(
    Controller,
    BaseController,
    MarcaService,
    MaestraService,
    RolService,
    Fragment,
    UtilPopUps,
    UtilValidation,
    MarcaCategoriaService,
    CategoriaService,
    UtilUi
  ) {
    "use strict";
  
    return BaseController.extend("com.telcomdataperu.app.ProductoMarca.controller.Marca",
      { 
        onInit: function () {
          var self = this; 
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("productoMarcaRoute").attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched:function(evt){
          this.onFnConsultarMarca(); 
        },
        onFnConsultarMarca:function(sBuscaMarca){
          try{
            sap.ui.core.BusyIndicator.show(0);
            var that        = this;
            var oParam 		= {};  
            oParam.sBuscaMarca = sBuscaMarca;
            MarcaService.consultarMarca(oParam, function(result) {  
              sap.ui.core.BusyIndicator.hide();
              if(result.iCode ===1){
                that.getView().getModel("modelAcceso").setProperty("/iNumItems", result.oResults.length);
                that.getView().getModel("modelAcceso").setProperty("/aMarca", result.oResults);
              }else{
                that.getView().getModel("modelAcceso").setProperty("/aMarca", []);
                that.getView().getModel("modelAcceso").setProperty("/iNumItems", 0);
              } 
            }, that);
         
            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        },
        onFnConsultarMarcaCategoria:function(oFiltro){
          try{
            sap.ui.core.BusyIndicator.show(0);
            var that        = this;
            var oParam 		= {};  
            oParam.iMarcaId = oFiltro.iMarcaId;
            MarcaCategoriaService.consultarMarcaCategoria(oParam, function(result) {  
              sap.ui.core.BusyIndicator.hide();
              if(result.iCode ===1){
                that.getView().getModel("modelAcceso").setProperty("/aMarcaCategoria", result.oResults);
              }else{
                that.getView().getModel("modelAcceso").setProperty("/aMarcaCategoria", []); 
              } 
            }, that);
            
            that.onFnConsultarCategoria();
            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        },
        onPressGoMarcaCategoria:function(oEvent){

          try {
            var control = oEvent.getSource(); 
            var sPath = control.getBindingContext("modelAcceso").getPath(); 
			      var seleccion = this.getView().getModel("modelAcceso").getProperty(sPath); 
			      this.getView().getModel("modelAcceso").setProperty("/oMarcaSeleccionado", seleccion);

            this.getView().getModel("modelAcceso").setProperty("/sMarcacategoriaSel", "de " + seleccion.Nombre);
             
            var oFiltro = {};
            oFiltro.iMarcaId = seleccion.Id;
            this.onFnConsultarMarcaCategoria(oFiltro);
          } catch (error) {
            console.log(error);
          }
        },
        onPressCrearMarca:function(){
          var oDialog 	=	this.getView().byId("DlgCrearMarca"); 
          if (!oDialog) {
            oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.ProductoMarca.view.frag.dialog.DlgCrearMarca", this);
            this.getView().addDependent(oDialog);
          } 
          oDialog.open();
        },
        onPressCloseCrearMarca:function(){
          this.getView().byId("DlgCrearMarca").destroy();  
        },
        onfnCrearMarca:function(){
          try {
            var self = this;
            var sError = UtilValidation.validaFormObligatorio(this,"frmCrearMarca"); 
                  if(!sError){
              UtilPopUps.messageBox("¿Desea crear la categoria?", 'c', function(bConfirmacion) {
                if (bConfirmacion) {
                  sap.ui.core.BusyIndicator.show(0);   
                  var oFileUploader = self.getView().byId("fileUploader"); 
                  var oParam = self.getView().byId("fileUploader").getFocusDomRef().files[0];
                  if(oParam){
                      var formData = new FormData();
                      formData.append("files", oParam);
                      MarcaService.subirArchivo(formData, function(result) {  
                        if(result.iCode === 1){
                          
                          self.onFnRegistrarMarca(result.oResults);
                        }else{
                          UtilPopUps.validarRespuestaServicio(result,'La Categoria se registró correctamente',function(e){});
                        }
                        sap.ui.core.BusyIndicator.hide();   
                        self.getView().byId("fileUploader").clear();
                      }, self); 
                  }else{
                    self.onFnRegistrarMarca(undefined);
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
        onFnRegistrarMarca:function(oFile){
          try{
              var that = this; 
              sap.ui.core.BusyIndicator.show(0);   
              var oMarcaNuevo = that.getView().getModel("modelAcceso").getProperty("/oMarcaNuevo");
              var oParam 					= {}; 
              oParam.sNombre 		    = oMarcaNuevo.sNombre;  
              oParam.sDescripcion   = oMarcaNuevo.sDescripcion; 
              if(oFile){
                oParam.sImagen 		= oFile.sNombreArchivo;   
              }
              oParam.sDescripcion 		= oMarcaNuevo.sDescripcion;  
              oParam.iCodEstadoMarca	= parseInt(oMarcaNuevo.iCodEstadoMarca, 10);   
              oParam.sEstadoMarca		  = that.getView().byId("cbxEstado").getSelectedItem().getText();;   
              MarcaService.registrarMarca(oParam, function(result) {  
                sap.ui.core.BusyIndicator.hide();
                UtilPopUps.validarRespuestaServicio(result,'La Marca se registró correctamente',function(e){});
                if(result.iCode ===1){  
                  that.getView().getModel("modelAcceso").setProperty("/oMarcaNuevo", {}); 
                } 
                that.onFnConsultarMarca();
              }, that);  

            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        }, 
        onPressEditarMarca:function(oEvent){  
            try{ 
                var control     = oEvent.getSource(); 
                var sPath       = control.getBindingContext("modelAcceso").getPath(); 
                var seleccion   = this.getView().getModel("modelAcceso").getProperty(sPath); 
                this.getView().getModel("modelAcceso").setProperty("/oMarcaEditar",seleccion ); 
                var oDialog 	=	this.getView().byId("DlgEditarMarca"); 
                if (!oDialog) {
                  oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.ProductoMarca.view.frag.dialog.DlgEditarMarca", this);
                  this.getView().addDependent(oDialog);
                } 
                oDialog.open();
              }catch(e){
                sap.ui.core.BusyIndicator.hide();
                console.log(e);
              }
		    	  
        },
        onPressCloseEditarMarca:function(){
          this.getView().byId("DlgEditarMarca").destroy();  
        },
        onPressfnEditarMarca:function(){
          
          try {
            var self = this;
            var sError = UtilValidation.validaFormObligatorio(this,"frmEditarMarca"); 
                  if(!sError){
              UtilPopUps.messageBox("¿Desea editar la marca?", 'c', function(bConfirmacion) {
                if (bConfirmacion) {
                  sap.ui.core.BusyIndicator.show(0);   
                  var oFileUploader = self.getView().byId("fileUploader2"); 
                  var oParam = self.getView().byId("fileUploader2").getFocusDomRef().files[0];
                  if(oParam){
                      var formData = new FormData();
                      formData.append("files", oParam);
                      MarcaService.subirArchivo(formData, function(result) {  
                        if(result.iCode === 1){
                          self.onFnEditarMarca(result.oResults);
                        }else{
                          UtilPopUps.validarRespuestaServicio(result,'La Categoria se registró correctamente',function(e){});
                        }
                        self.getView().byId("fileUploader2").clear();
                      }, self); 
                  }else{
                    self.onFnEditarMarca(undefined);
                  } 
                  sap.ui.core.BusyIndicator.hide();   
                }
              });
            }else{
              sap.m.MessageToast.show("(*) Ingresar los campos obligatorios"); 
              };
              
          } catch (error) {
            console.log(error);
          }

        }, 
        onFnEditarMarca:function(oFile){
          try{
              var that = this; 
              sap.ui.core.BusyIndicator.show(0);   
              var oMarcaEditar = that.getView().getModel("modelAcceso").getProperty("/oMarcaEditar");
              var oParam 					= {}; 
              oParam.iId            = oMarcaEditar.Id;
              oParam.sNombre 		    = oMarcaEditar.Nombre;  
              oParam.sDescripcion   = oMarcaEditar.Descripcion; 
              if(oFile){
                oParam.sImagen 		= oFile.sNombreArchivo;   
              }
              oParam.sDescripcion 		= oMarcaEditar.Descripcion;  
              oParam.iCodEstadoMarca	= parseInt(oMarcaEditar.CodEstadoMarca, 10);   
              oParam.sEstadoMarca		  = that.getView().byId("cbxEstado2").getSelectedItem().getText();;   
              MarcaService.actualizarMarca(oParam, function(result) {  
                sap.ui.core.BusyIndicator.hide();
                UtilPopUps.validarRespuestaServicio(result,'La Marca se actualizó correctamente',function(e){});
                if(result.iCode ===1){  
                  that.getView().getModel("modelAcceso").setProperty("/oMarcaEditar", {}); 
                } 
                that.onFnConsultarMarca();
              }, that);  

            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        },
        onVerAuditoriaMarca:function(evt){
    
          var sPathParamSeleccionado = evt.getSource().getBindingContext("modelAcceso").getPath()
          var oParamSeleccionado  =  this.getView().getModel("modelAcceso").getProperty(sPathParamSeleccionado);    
          this.getView().getModel("modelAcceso").setProperty("/oMarcaAuditoria",oParamSeleccionado); 
          var oButton = evt.getSource(),
            oView = this.getView();
    
          if (!this._AuditoriaAplicacion) {
            this._AuditoriaAplicacion = Fragment.load({
              id: oView.getId(),
              name: "com.telcomdataperu.app.ProductoMarca.view.frag.dialog.AuditoriaMarca",
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
        onPressVerMarca:function(oEvent){  
            try{ 
                var control     = oEvent.getSource(); 
                var sPath       = control.getBindingContext("modelAcceso").getPath(); 
                var seleccion   = this.getView().getModel("modelAcceso").getProperty(sPath); 
                this.getView().getModel("modelAcceso").setProperty("/oMarcaVer",seleccion ); 
                var oDialog 	=	this.getView().byId("DlgVerMarca"); 
                if (!oDialog) {
                  oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.ProductoMarca.view.frag.dialog.DlgVerMarca", this);
                  this.getView().addDependent(oDialog);
                } 
                oDialog.open();
              }catch(e){
                sap.ui.core.BusyIndicator.hide();
                console.log(e);
              }
		    	  
        } ,
        onPressEliminarUsuario:function(){
          try {
            var self = this;
            
            var indexes = self.getView().byId("tblUsuarios").getSelectedIndices();
            if(indexes.length > 0){
              sap.ui.core.BusyIndicator.show(0);
              var aListaUsuariosEliminar = [];
              indexes.forEach(function(i) {
                var oParametros = self.getView().byId("tblUsuarios").getContextByIndex(i).getObject();  
                aListaUsuariosEliminar.push( oParametros.Id);
              });
              var oParamEliminar = {};
              oParamEliminar.aItems = aListaUsuariosEliminar;
              UtilPopUps.messageBox("¿Desea eliminar los usuarios seleccionadas?", 'c', function(bConfirmacion) {
                if (bConfirmacion) {
                  sap.ui.core.BusyIndicator.hide();
                  UsuarioService.eliminarUsuario(oParamEliminar, function(result) { 
                    sap.ui.core.BusyIndicator.hide();
                    
                    if(result.iCode ===1){
                      UtilPopUps.validarRespuestaServicio(result,'Usuarios eliminados correctamente',function(e){});
                      //Recargamos los usuarios
                      self.onFnConsultarUsuario(self);  
                      var oTable1 = self.getView().byId("tblUsuarios");
                      oTable1.clearSelection(); 
                      self.getView().getModel("modelAcceso").refresh();
                    } 
                  }, self); 
                }else{
                  sap.ui.core.BusyIndicator.hide();
                }
              }); 
            }else{ 
                sap.m.MessageToast.show("Seleccionar Aplicación"); 
              } 
          } catch (error) {
            sap.ui.core.BusyIndicator.hide();
            console.log(error);
          }
        },
        onPressCloseVerMarca:function(){
          this.getView().byId("DlgVerMarca").destroy();  
        }, 
        onPressVerImagen : function (oEvent) {  
          var control     = oEvent.getSource(); 
          var sPath       = control.getBindingContext("modelAcceso").getPath(); 
          var seleccion   = this.getView().getModel("modelAcceso").getProperty(sPath); 
          this.getView().getModel("modelAcceso").setProperty("/oMarcaVer",seleccion); 
          var oDialog 	=	this.getView().byId("DlgMarcaImagen"); 
          if (!oDialog) {
            oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.ProductoMarca.view.frag.dialog.MarcaImagen", this);
            this.getView().addDependent(oDialog);
          } 
          oDialog.open(); 
         },
         onPressCloseCategoriaImagen:function(){
          this.getView().byId("DlgMarcaImagen").destroy();  
         },
         onPressFiltrarMarca:function(){
           try {
             var sFiltroMarca = this.getView().byId("txtBuscar").getValue();
             console.log(sFiltroMarca);
             this.onFnConsultarMarca(sFiltroMarca);
           } catch (error) {
             sap.ui.core.BusyIndicator.hide();
             console.log(error);
           }
         },
         onPressLimpiarFiltro:function(){ 
           try { 
               this.getView().byId("txtBuscar").setValue("");
               this.onFnConsultarMarca();
           } catch (error) {
             
           }
         },
         onPressEliminarMarca:function(){
           try {
             var self = this;
             
             var indexes = self.getView().byId("tblMarcas").getSelectedIndices();
             if(indexes.length > 0){
               sap.ui.core.BusyIndicator.show(0);
               var aListaMarcasEliminar = [];
               indexes.forEach(function(i) {
                 var oParametros = self.getView().byId("tblMarcas").getContextByIndex(i).getObject();  
                 aListaMarcasEliminar.push( oParametros.Id);
               });
               var oParamEliminar = {};
               oParamEliminar.aItems = aListaMarcasEliminar;
               UtilPopUps.messageBox("¿Desea eliminar las marcas seleccionadas?", 'c', function(bConfirmacion) {
                 if (bConfirmacion) {
                   sap.ui.core.BusyIndicator.hide();
                   MarcaService.eliminarMarca(oParamEliminar, function(result) { 
                     sap.ui.core.BusyIndicator.hide();
                     
                     if(result.iCode ===1){
                       UtilPopUps.validarRespuestaServicio(result,'Marcas eliminadas correctamente',function(e){});
                       //Recargamos los usuarios
                       self.onFnConsultarMarca();  
                       var oTable1 = self.getView().byId("tblMarcas");
                       oTable1.clearSelection(); 
                       self.getView().getModel("modelAcceso").refresh();
                     } 
                   }, self); 
                 }else{
                   sap.ui.core.BusyIndicator.hide();
                 }
               }); 
             }else{ 
                 sap.m.MessageToast.show("Seleccionar Marca"); 
               } 
           } catch (error) {
             sap.ui.core.BusyIndicator.hide();
             console.log(error);
           }
         },
         onPressConsultarCategoria:function(){
           try { 
            var oDialog 	=	this.getView().byId("DlgAgregarCategoria"); 
            if (!oDialog) {
              oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.ProductoMarca.view.frag.dialog.DlgAgregarCategoria", this);
              this.getView().addDependent(oDialog);
            } 
            oDialog.open(); 

            var oTreeTable = this.getView().byId("tblAgregarCategoria");
            oTreeTable.expandToLevel(4);

           } catch (error) {
             console.log(error);
           }
         },
         onFnConsultarCategoria:function(sBuscaCategoria){
           try{
             sap.ui.core.BusyIndicator.show(0);
             var that        = this;
             var oParam 		= {}; 
             oParam.iCodEstadoCategoria = 1; 
             CategoriaService.consultarCategoria(oParam, function(result) {  
               sap.ui.core.BusyIndicator.hide();
               if(result.iCode ===1){
 
                 var aNuevaListaCategoria = {};
                 aNuevaListaCategoria.listaAccesos = UtilUi.generarTree(result.oResults, null);
 
                 that.getView().getModel("modelAcceso").setProperty("/iNumItemsCat", result.oResults.length);
                 that.getView().getModel("modelAcceso").setProperty("/aCategoria", aNuevaListaCategoria);
 
   
 
               }else{
                 that.getView().getModel("modelAcceso").setProperty("/aCategoria", []);
                 that.getView().getModel("modelAcceso").setProperty("/iNumItemsCat", 0);
               } 
             }, that);
          
             }catch(e){
               sap.ui.core.BusyIndicator.hide();
               console.log(e);
             }
         },
         onPressFiltrarCategoria:function(){
           try { 
               var sQuery = this.getView().byId("txtInputCategoria").getValue();  
               var oFilter1 = new sap.ui.model.Filter("Codigo", sap.ui.model.FilterOperator.Contains, sQuery);
               var oFilter2 = new sap.ui.model.Filter("Nombre", sap.ui.model.FilterOperator.Contains, sQuery);
               var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2], false);  
               this.getView().byId("tblAgregarCategoria").getBinding().filter(allFilter, "Application"); 
           } catch (error) {
             sap.ui.core.BusyIndicator.hide();
             console.log(error);
           }
         },
         onPressLimpiarFiltro:function(){ 
           try { 
               this.getView().byId("txtInputCategoria").setValue("");
               var oFilter1 = new sap.ui.model.Filter("Codigo", sap.ui.model.FilterOperator.Contains, "");
               var oFilter2 = new sap.ui.model.Filter("Nombre", sap.ui.model.FilterOperator.Contains, "");
               var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2], false);  
               this.getView().byId("tblAgregarCategoria").getBinding().filter(allFilter, "Application"); 
           } catch (error) {
             
           }
         },
         onPressCloseAgregarCategoria:function(){
           this.onPressLimpiarFiltro();
           this.getView().byId("DlgAgregarCategoria").destroy();  
         },
         onPressRegistrarCategoria:function(){
           try {
             var self = this;
             var indexes = self.getView().byId("tblAgregarCategoria").getSelectedIndices();
             if(indexes.length > 0){
               var aListaAppAgregar = [];
               indexes.forEach(function(i) {
                 var oAppSeleccionado = self.getView().byId("tblAgregarCategoria").getContextByIndex(i).getObject();  
                 aListaAppAgregar.push( oAppSeleccionado.Id);
               });
               UtilPopUps.messageBox("¿Desea Registrar las categorias seleccionadas?", 'c', function(bConfirmacion) {
                 if (bConfirmacion) {
                   sap.ui.core.BusyIndicator.show(0);
                   var oParam =  {};
                   oParam.iMarcaId = self.getView().getModel("modelAcceso").getProperty("/oMarcaSeleccionado").Id;
                   oParam.aItems =  aListaAppAgregar;
                   MarcaCategoriaService.registrarMarcaCategoria(oParam, function(result) {  
                     sap.ui.core.BusyIndicator.hide(); 
                     if(result.iCode ===1){ 
                       UtilPopUps.validarRespuestaServicio(result,'Categorias registradas correctamente',function(e){});
                       var oTable1 = self.getView().byId("tblAgregarCategoria");
                       oTable1.clearSelection();   
                       self.onFnConsultarMarcaCategoria(oParam);
                       self.onPressCloseAgregarCategoria();
                     } 
                   }, this);
                 }
               }); 
             }
           } catch (error) {
             
           } 
         },
         onPressEliminarCategoria:function(){
          try {
            var self = this; 
            var indexes = self.getView().byId("tblMarcaCategoria").getSelectedIndices();
            if(indexes.length > 0){
              sap.ui.core.BusyIndicator.show(0);
              var aListaUsuariosEliminar = [];
              indexes.forEach(function(i) {
                var oParametros = self.getView().byId("tblMarcaCategoria").getContextByIndex(i).getObject();  
                aListaUsuariosEliminar.push( oParametros.Id);
              });
              var oParamEliminar = {};
              oParamEliminar.aItems = aListaUsuariosEliminar;
              UtilPopUps.messageBox("¿Desea eliminar las categorias seleccionadas?", 'c', function(bConfirmacion) {
                if (bConfirmacion) {
                  sap.ui.core.BusyIndicator.hide();
                  MarcaCategoriaService.eliminarMarcaCategoria(oParamEliminar, function(result) { 
                    sap.ui.core.BusyIndicator.hide();
                    
                    if(result.iCode ===1){
                      UtilPopUps.validarRespuestaServicio(result,'Categorias eliminadas correctamente',function(e){});
                      //Recargamos 
                      var oParam =  {};
                       oParam.iMarcaId = self.getView().getModel("modelAcceso").getProperty("/oMarcaSeleccionado").Id;
                       self.onFnConsultarMarcaCategoria(oParam);
                      var oTable1 = self.getView().byId("tblMarcaCategoria");
                      oTable1.clearSelection(); 
                      self.getView().getModel("modelAcceso").refresh();
                    } 
                  }, self); 
                }else{
                  sap.ui.core.BusyIndicator.hide();
                }
              }); 
            }else{ 
                sap.m.MessageToast.show("Seleccionar Categoria"); 
              } 
          } catch (error) {
            sap.ui.core.BusyIndicator.hide();
            console.log(error);
          }
         }
      }
    );
  });
  