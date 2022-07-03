sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "../controller/BaseController",
  "../servicio/UsuarioService",
  "../servicio/MaestraService",
  "../servicio/RolService", 
	"sap/ui/core/Fragment",
  '../util/UtilPopUps',
	'../util/UtilValidation' 
], function(
    Controller,
    BaseController,
    UsuarioService,
    MaestraService,
    RolService,
    Fragment,
    UtilPopUps,
    UtilValidation
  ) {
    "use strict";
  
    return BaseController.extend("com.telcomdataperu.app.Cliente.controller.Cliente",
      { 
        onInit: function () {
          var self = this; 
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("clienteRoute").attachMatched(this._onRouteMatched, this);
        },
        _onRouteMatched:function(evt){
          this.onFnConsultarUsuario();
          this.onFnConsultarParametros();
          this.onFnConsultarRoles();
        },
        onFnConsultarUsuario:function(sBuscaUsuario){
          try{
            sap.ui.core.BusyIndicator.show(0);
            var that        = this;
            var oParam 		= {}; 
            oParam.sBuscaUsuario = sBuscaUsuario;
            UsuarioService.consultarUsuario(oParam, function(result) {  
              sap.ui.core.BusyIndicator.hide();
              if(result.iCode ===1){
                that.getView().getModel("modelAcceso").setProperty("/iNumItems", result.oResults.length);
                that.getView().getModel("modelAcceso").setProperty("/aUsuarios", result.oResults);
              }else{
                that.getView().getModel("modelAcceso").setProperty("/aUsuarios", []);
                that.getView().getModel("modelAcceso").setProperty("/iNumItems", 0);
              } 
            }, that);
         
            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        },
        onPressCrearUsuario:function(){
          this.getView().getModel("modelAcceso").setProperty("/oUsuarioNuevo", {});
		    	this.navigation(this, "usuarioRegistroRoute",{}); 
        },
        onFnConsultarParametros:function(){
          try{
         
            var that        = this;
            var oParam 		= {}; 
            oParam.sListaCodigoTabla = "tipo-usuario,tipo-documento-persona";
            oParam.iEstadoCampoId    = 1;
            MaestraService.consultarParametros(oParam, function(result) {   
              if(result.iCode ===1){ 
                result.oResults.push({"Codigo":"", "CodigoTabla":"tipo-usuario","Campo1":"--Seleccionar--"}); 
                result.oResults.push({"Codigo":"", "CodigoTabla":"tipo-documento-persona","Campo1":"--Seleccionar--"}); 
                that.getView().getModel("modelAcceso").setProperty("/aListaParametros", result.oResults);
              }else{
                that.getView().getModel("modelAcceso").setProperty("/aListaParametros", []);
              } 
            }, that);
         
            }catch(e){
             
              console.log(e);
            }
        } ,
        onFnConsultarRoles:function(){
          try{
         
            var that        = this;
            var oParam 		= {};  
            oParam.iEstadoRolCod    = 1;
            RolService.consultarRol(oParam, function(result) {   
              if(result.iCode ===1){ 
                result.oResults.push({"Codigo":"", "Nombre":"--Seleccionar--"}); 
                 that.getView().getModel("modelAcceso").setProperty("/aListaRoles", result.oResults);
              }else{
                that.getView().getModel("modelAcceso").setProperty("/aListaRoles", []);
              } 
            }, that);
         
            }catch(e){
             
              console.log(e);
            }
        },
        onPressEditarUsuario:function(oEvent){  
            try{ 
                var control     = oEvent.getSource(); 
                var sPath       = control.getBindingContext("modelAcceso").getPath(); 
                var seleccion   = this.getView().getModel("modelAcceso").getProperty(sPath); 
                var that        = this; 
                var oParam  = {};
                oParam.id   = seleccion.Id; 
                that.navigation(that, "usuarioEditarRoute",oParam);   
              }catch(e){
                sap.ui.core.BusyIndicator.hide();
                console.log(e);
              }
		    	  
        },
        onVerAuditoriaUsuario:function(evt){
    
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
        onPressDetalleUsuario:function(oEvent){  
            try{ 
                var control     = oEvent.getSource(); 
                var sPath       = control.getBindingContext("modelAcceso").getPath(); 
                var seleccion   = this.getView().getModel("modelAcceso").getProperty(sPath); 
                var that        = this; 
                var oParam  = {};
                oParam.id   = seleccion.Id; 
                that.navigation(that, "usuarioDetalleRoute",oParam);   
              }catch(e){
                sap.ui.core.BusyIndicator.hide();
                console.log(e);
              }
		    	  
        },
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
        onPressFiltrarUsuarios:function(){
          try {
            var sFiltroUsuario = this.getView().byId("txtUsuario").getValue(); 
            this.onFnConsultarUsuario(sFiltroUsuario);
          } catch (error) {
            sap.ui.core.BusyIndicator.hide();
            console.log(error);
          }
        }
      }
    );
  });
  