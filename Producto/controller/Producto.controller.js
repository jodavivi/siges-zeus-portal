sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "../controller/BaseController",
  "../servicio/ProductoService",
  "../servicio/MaestraService", 
	"sap/ui/core/Fragment",
  '../util/UtilPopUps',
	'../util/UtilValidation' 
], function(
    Controller,
    BaseController,
    ProductoService,
    MaestraService, 
    Fragment,
    UtilPopUps,
    UtilValidation
  ) {
    "use strict";
  
    return BaseController.extend("com.telcomdataperu.app.Producto.controller.Producto",
      { 
        onInit: function () {
          var self = this; 
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("productoRoute").attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched:function(evt){
          this.onFnConsultarProducto();
          this.onFnConsultarParametros(); 
        },
        onFnConsultarProducto:function(sBuscarProducto){
          try{
            sap.ui.core.BusyIndicator.show(0);
            var that        = this;
            var oParam 		= {}; 
            oParam.sBuscarProducto = sBuscarProducto;
            ProductoService.consultarProducto(oParam, function(result) {  
              sap.ui.core.BusyIndicator.hide();
              if(result.iCode ===1){
                that.getView().getModel("modelAcceso").setProperty("/iNumItems", result.oResults.length);
                that.getView().getModel("modelAcceso").setProperty("/aProductos", result.oResults);
              }else{
                that.getView().getModel("modelAcceso").setProperty("/aProductos", []);
                that.getView().getModel("modelAcceso").setProperty("/iNumItems", 0);
              } 
            }, that);
         
            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        },
        onPressCrearProducto:function(){
          this.getView().getModel("modelAcceso").setProperty("/oProductoNuevo", {});
		    	this.navigation(this, "ProductoRegistroRoute",{}); 
        },
        onFnConsultarParametros:function(){
          try{
         
            var that        = this;
            var oParam 		= {}; 
            oParam.sListaCodigoTabla = "producto-presentacion";
            oParam.iEstadoCampoId    = 1;
            MaestraService.consultarParametros(oParam, function(result) {   
              if(result.iCode ===1){ 
                result.oResults.push({"Codigo":"", "CodigoTabla":"producto-presentacion","Campo1":"--Seleccionar--"});  
                that.getView().getModel("modelAcceso").setProperty("/aListaParametros", result.oResults);
              }else{
                that.getView().getModel("modelAcceso").setProperty("/aListaParametros", []);
              } 
            }, that);
         
            }catch(e){
             
              console.log(e);
            }
        } , 
        onPressEditarProducto:function(oEvent){  
            try{ 
                var control     = oEvent.getSource(); 
                var sPath       = control.getBindingContext("modelAcceso").getPath(); 
                var seleccion   = this.getView().getModel("modelAcceso").getProperty(sPath); 
                var that        = this; 
                var oParam  = {};
                oParam.id   = seleccion.Id; 
                that.navigation(that, "ProductoEditarRoute",oParam);   
              }catch(e){
                sap.ui.core.BusyIndicator.hide();
                console.log(e);
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
        onPressDetalleProducto:function(oEvent){  
            try{ 
                var control     = oEvent.getSource(); 
                var sPath       = control.getBindingContext("modelAcceso").getPath(); 
                var seleccion   = this.getView().getModel("modelAcceso").getProperty(sPath); 
                var that        = this; 
                var oParam  = {};
                oParam.id   = seleccion.Id; 
                that.navigation(that, "ProductoDetalleRoute",oParam);   
              }catch(e){
                sap.ui.core.BusyIndicator.hide();
                console.log(e);
              }
		    	  
        },
        onPressEliminarProducto:function(){
          try {
            var self = this;
            
            var indexes = self.getView().byId("tblProductos").getSelectedIndices();
            if(indexes.length > 0){
              sap.ui.core.BusyIndicator.show(0);
              var aListaEliminar = [];
              indexes.forEach(function(i) {
                var oParametros = self.getView().byId("tblProductos").getContextByIndex(i).getObject();  
                aListaEliminar.push( oParametros.Id);
              });
              var oParamEliminar = {};
              oParamEliminar.aItems = aListaEliminar;
              UtilPopUps.messageBox("¿Desea eliminar los productos seleccionadas?", 'c', function(bConfirmacion) {
                if (bConfirmacion) {
                  sap.ui.core.BusyIndicator.hide();
                  ProductoService.eliminarProducto(oParamEliminar, function(result) { 
                    sap.ui.core.BusyIndicator.hide();
                    
                    if(result.iCode ===1){
                      UtilPopUps.validarRespuestaServicio(result,'Productos eliminados correctamente',function(e){});
                      //Recargamos los usuarios
                      self.onFnConsultarProducto();  
                      var oTable1 = self.getView().byId("tblProductos");
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
        onPressFiltrarProducto:function(){
          try {
            var sFiltroProducto = this.getView().byId("txtProducto").getValue(); 
            this.onFnConsultarProducto(sFiltroProducto);
          } catch (error) {
            sap.ui.core.BusyIndicator.hide();
            console.log(error);
          }
        },
        onPressLimpiarFiltro: function(){
          this.getView().byId("txtProducto").setValue("");
          this.onFnConsultarProducto(undefined);
        }, 
        onPressVerImagen : function (oEvent) {  
          var control     = oEvent.getSource(); 
          var sPath       = control.getBindingContext("modelAcceso").getPath(); 
          var seleccion   = this.getView().getModel("modelAcceso").getProperty(sPath); 
          console.log(seleccion);
          this.getView().getModel("modelAcceso").setProperty("/oProductoSeleccionado",seleccion); 
          var oDialog 	=	this.getView().byId("DlgListaImagen"); 
          if (!oDialog) {
            oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.Producto.view.frag.dialog.DlgListaImagen", this);
            this.getView().addDependent(oDialog);
          } 
          oDialog.open(); 
         },
         onPressCloseVerImagen: function(){
           this.getView().byId("DlgListaImagen").destroy();  
         }
      }
    );
  });
  