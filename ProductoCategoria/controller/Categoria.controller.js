sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "../controller/BaseController",
  "../servicio/CategoriaService",
  "../servicio/MaestraService", 
	"sap/ui/core/Fragment",
  '../util/UtilPopUps',
	'../util/UtilValidation',
  '../util/UtilUi' 
], function(
    Controller,
    BaseController,
    CategoriaService,
    MaestraService, 
    Fragment,
    UtilPopUps,
    UtilValidation,
    UtilUi
  ) {
    "use strict";
  
    return BaseController.extend("com.telcomdataperu.app.ProductoCategoria.controller.Categoria",
      { 
        onInit: function () {
          var self = this; 
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("categoriaRoute").attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched:function(evt){
          this.onFnConsultarCategoria(); 
        },
        onFnConsultarCategoria:function(sBuscaCategoria){
          try{
            sap.ui.core.BusyIndicator.show(0);
            var that        = this;
            var oParam 		= {}; 
            oParam.sBuscaCategoria = sBuscaCategoria;
            CategoriaService.consultarCategoria(oParam, function(result) {  
              sap.ui.core.BusyIndicator.hide();
              if(result.iCode ===1){

                var aNuevaListaCategoria = {};
					      aNuevaListaCategoria.listaAccesos = UtilUi.generarTree(result.oResults, null);

                that.getView().getModel("modelAcceso").setProperty("/iNumItems", result.oResults.length);
                that.getView().getModel("modelAcceso").setProperty("/aCategoria", aNuevaListaCategoria);

                var oTreeTable = that.getView().byId("tblCategoria");
			          oTreeTable.expandToLevel(4);

              }else{
                that.getView().getModel("modelAcceso").setProperty("/aCategoria", []);
                that.getView().getModel("modelAcceso").setProperty("/iNumItems", 0);
              } 
            }, that);
         
            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        },
        onPressRegistrarCategoria:function(){
          var self = this;
          var indexes = self.getView().byId("tblCategoria").getSelectedIndices();
          var aCategoriaPadre = [];
          indexes.forEach(function(i) {
            var oCat = self.getView().byId("tblCategoria").getContextByIndex(i).getObject();  
            aCategoriaPadre.push(oCat);
          });
          self.getView().getModel("modelAcceso").setProperty("/oCategoriaPadre", aCategoriaPadre[0]);
          self.getView().getModel("modelAcceso").setProperty("/oCategoriaNuevo", {});
		    	self.navigation(self, "categoriaRegistroRoute",{}); 
        },
        
        onPressEditarCategoria:function(oEvent){  
            try{ 
                var control     = oEvent.getSource(); 
                var sPath       = control.getBindingContext("modelAcceso").getPath(); 
                var seleccion   = this.getView().getModel("modelAcceso").getProperty(sPath); 
                var that        = this; 
                var oParam  = {};
                oParam.id   = seleccion.Id; 
                that.navigation(that, "categoriaEditarRoute",oParam);   
              }catch(e){
                sap.ui.core.BusyIndicator.hide();
                console.log(e);
              }
		    	  
        },
        onVerAuditoriaCategoria:function(evt){
    
          var sPathParamSeleccionado = evt.getSource().getBindingContext("modelAcceso").getPath()
          var oParamSeleccionado  =  this.getView().getModel("modelAcceso").getProperty(sPathParamSeleccionado);    
          this.getView().getModel("modelAcceso").setProperty("/oCategoriaAuditoria",oParamSeleccionado); 
          var oButton = evt.getSource(),
            oView = this.getView();
    
          if (!this._AuditoriaAplicacion) {
            this._AuditoriaAplicacion = Fragment.load({
              id: oView.getId(),
              name: "com.telcomdataperu.app.ProductoCategoria.view.frag.dialog.AuditoriaCategoria",
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
        onPressDetalleCategoria:function(oEvent){  
            try{ 
                var control     = oEvent.getSource(); 
                var sPath       = control.getBindingContext("modelAcceso").getPath(); 
                var seleccion   = this.getView().getModel("modelAcceso").getProperty(sPath); 
                var that        = this; 
                var oParam  = {};
                oParam.id   = seleccion.Id; 
                that.navigation(that, "categoriaDetalleRoute",oParam);   
              }catch(e){
                sap.ui.core.BusyIndicator.hide();
                console.log(e);
              }
		    	  
        },
        onPressEliminarCategoria:function(){
          try {
            var self = this;
            
            var indexes = self.getView().byId("tblCategoria").getSelectedIndices();
            if(indexes.length > 0){
              sap.ui.core.BusyIndicator.show(0);
              var aListaUsuariosEliminar = [];
              indexes.forEach(function(i) {
                var oParametros = self.getView().byId("tblCategoria").getContextByIndex(i).getObject();  
                aListaUsuariosEliminar.push( oParametros.Id);
              });
              var oParamEliminar = {};
              oParamEliminar.aItems = aListaUsuariosEliminar;
              UtilPopUps.messageBox("¿Desea eliminar las categorias seleccionadas?", 'c', function(bConfirmacion) {
                if (bConfirmacion) {
                  sap.ui.core.BusyIndicator.hide();
                  CategoriaService.eliminarCategoria(oParamEliminar, function(result) { 
                    sap.ui.core.BusyIndicator.hide();
                    
                    if(result.iCode ===1){
                      UtilPopUps.validarRespuestaServicio(result,'Categorias eliminadas correctamente',function(e){});
                      //Recargamos los usuarios
                      self.onFnConsultarCategoria();  
                      var oTable1 = self.getView().byId("tblCategoria");
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
        },
        onPressFiltrarCategoria:function(){
          try { 
              var sQuery = this.getView().byId("txtCategoria").getValue();  
              var oFilter1 = new sap.ui.model.Filter("Codigo", sap.ui.model.FilterOperator.Contains, sQuery);
              var oFilter2 = new sap.ui.model.Filter("Nombre", sap.ui.model.FilterOperator.Contains, sQuery);
              var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2], false);  
              this.getView().byId("tblCategoria").getBinding().filter(allFilter, "Application"); 
          } catch (error) {
            sap.ui.core.BusyIndicator.hide();
            console.log(error);
          }
        },
        onPressLimpiarFiltro:function(){ 
          try { 
              this.getView().byId("txtCategoria").setValue("");
              var oFilter1 = new sap.ui.model.Filter("Codigo", sap.ui.model.FilterOperator.Contains, "");
              var oFilter2 = new sap.ui.model.Filter("Nombre", sap.ui.model.FilterOperator.Contains, "");
              var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2], false);  
              this.getView().byId("tblCategoria").getBinding().filter(allFilter, "Application"); 
          } catch (error) {
            
          }
        }, 
        onPressVerImagen : function (oEvent) {  
          var control     = oEvent.getSource(); 
          var sPath       = control.getBindingContext("modelAcceso").getPath(); 
          var seleccion   = this.getView().getModel("modelAcceso").getProperty(sPath); 
          this.getView().getModel("modelAcceso").setProperty("/oCategoriaSeleccionado",seleccion); 
          var oDialog 	=	this.getView().byId("DlgCategoriaImagen"); 
          if (!oDialog) {
            oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.ProductoCategoria.view.frag.dialog.CategoriaImagen", this);
            this.getView().addDependent(oDialog);
          } 
          oDialog.open(); 
         },
         onPressCloseCategoriaImagen:function(){
          this.getView().byId("DlgCategoriaImagen").destroy();  
         }
      }
    );
  });
  