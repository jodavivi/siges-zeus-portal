sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../servicio/UsuarioService",
	"../controller/BaseController",
	'../util/UtilPopUps',
	'../util/UtilValidation' ,
	"../servicio/RolService"
], function (Controller, UsuarioService, BaseController, UtilPopUps, UtilValidation, RolService) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Usuario.controller.UsuarioEditar", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("usuarioEditarRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched:function(evt){ 
			this.iUsuarioId   = evt.getParameter("arguments").id; 
			this.onFnConsultarUsuarioxFiltro(this.iUsuarioId);
			this.onFnConsultarRolUsuario(this.iUsuarioId);
			UtilValidation.limipiarFormObligatorio(this,"frmEditarUsuario");
			this.aRolEliminado = [];
		},
        onFnConsultarUsuarioxFiltro:function(iUsuarioId){
          try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				oParam.iId		= iUsuarioId;
				UsuarioService.consultarUsuario(oParam, function(result) {   
				if(result.iCode ===1){ 
					that.getView().getModel("modelAcceso").setProperty("/oUsuarioSeleccionado", result.oResults[0]);
					 
				}else{
					that.getView().getModel("modelAcceso").setProperty("/oUsuarioSeleccionado", []);
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
				this.navigation(this, "usuarioRoute",{}); 
			} catch (error) {
				console.log(error);
			}
		},
        onEditarUsuario:function(){
          try{
            var that = this;
            var sError = UtilValidation.validaFormObligatorio(this,"frmEditarUsuario"); 
            if(!sError){
              UtilPopUps.messageBox("¿Desea actualizar el usuario?", 'c', function(bConfirmacion) {
              if (bConfirmacion) {
				sap.ui.core.BusyIndicator.show(0); 
				var aParametros = that.getView().getModel("modelAcceso").getProperty("/aListaParametros");
				var aListaRoles = that.getView().getModel("modelAcceso").getProperty("/aListaRoles");
				var oUsuarioEditar = that.getView().getModel("modelAcceso").getProperty("/oUsuarioSeleccionado");
				var oParam 					= {}; 
				oParam.iId					= oUsuarioEditar.Id;
				oParam.sCodTipoUsuario 		= oUsuarioEditar.CodTipoUsuario; 
				var aTipoUsuario = aParametros.filter(function (item) {
					return item.Codigo === oUsuarioEditar.CodTipoUsuario;
				}); 
				oParam.sTipoUsuario 		= aTipoUsuario[0].Campo1;
				oParam.sCodTipoDocumento 	= oUsuarioEditar.CodTipoDocumento;
				var aTipoDocumento= aParametros.filter(function (item) {
					return item.Codigo === oUsuarioEditar.CodTipoDocumento;
				}); 
				oParam.sTipoDocumento 		= aTipoDocumento[0].Campo1;
				oParam.sNumDocumento 		= oUsuarioEditar.NumDocumento;
				oParam.sNombre 				= oUsuarioEditar.Nombre;
				oParam.sApellido 			= oUsuarioEditar.Apellido;
				oParam.sUsuario 			= oUsuarioEditar.Usuario;
				oParam.sEmail 				= oUsuarioEditar.Email; 
				oParam.aRol					= [];
				var aRolesAsignados = that.getView().getModel("modelAcceso").getProperty("/aListaRolesUsuarioEditar");
 
				 aRolesAsignados.forEach(function(e){
					if(e.Estado){
						oParam.aRol.push(
							{
								"sCodRol":e.CodRol,
								"sRol":e.Rol,
								"sEstado" : e.Estado
							}
						);
					} 
				 });
				 that.aRolEliminado.forEach(function(e){
					oParam.aRol.push(
						{
							"iId": e.Id,
							"sCodRol":e.CodRol,
							"sRol":e.Rol,
							"sEstado" : "D"
						}
					);
				 });

				oParam.iCodEstadoUsuario	= parseInt(oUsuarioEditar.UsuarioEmpresa[0].CodEstadoItem, 10);   
				if(oParam.iCodEstadoUsuario === 1){
					oParam.sEstadoUsuario = "Activo";
				}else{
					oParam.sEstadoUsuario = "Desactivo";
				}   
				UsuarioService.actualizarUsuario(oParam, function(result) {  
					sap.ui.core.BusyIndicator.hide();
					UtilPopUps.validarRespuestaServicio(result,'El Usuario se actualizó correctamente',function(e){});
					that.onFnConsultarRolUsuario(that.iUsuarioId);
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
        onFnConsultarRolUsuario:function(iUsuarioId){
          try{
				sap.ui.core.BusyIndicator.show(0);
				var that        = this;
				var oParam 		= {}; 
				oParam.iUsuarioId		= iUsuarioId;
				UsuarioService.consultarUsuarioRol(oParam, function(result) {   
				if(result.iCode ===1){ 
					that.getView().getModel("modelAcceso").setProperty("/aListaRolesUsuarioEditar", result.oResults);
				}else{
					that.getView().getModel("modelAcceso").setProperty("/aListaRolesUsuarioEditar", []);
				} 
				sap.ui.core.BusyIndicator.hide();
				}, that);
         
            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        },
		onPressBuscarRolAll:function(){
			try{
				
				var that        = this; 
				sap.ui.core.BusyIndicator.show(0);
				var oParam 		= {};  
				RolService.consultarRol(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide(); 
				  if(result.iCode ===1){ 
					that.getView().getModel("modelAcceso").setProperty("/aListaRoles", result.oResults);
					that.onPressBuscarRol();
				  } 
				}, that);
			 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		}  ,
		onPressBuscarRol: async function(){ 
			var oDialog 	=	this.getView().byId("DlgAgregarRol"); 
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.Usuario.view.frag.dialog.DlgAgregarRol", this);
				this.getView().addDependent(oDialog);
			} 
			oDialog.open();
		},
		onPressAgregarRolUsuario: function(oEvent){
			try {
				var that        = this;  
				var numRegistros = [];
				var aListaRolesUsuario = JSON.parse(JSON.stringify(that.getView().getModel("modelAcceso").getProperty("/aListaRolesUsuarioEditar")));
				var aDataActual = {};
				aListaRolesUsuario.forEach(function(e,i){
					e.Posicion = i;
					aDataActual[e.CodRol] = e;

				});
				var oList = this.byId("aListRoles"), 
				oBinding = oList.getBinding("items"); 
				var items = oList.getSelectedItems(); 
				for (var i = 0; i < items.length; i++) { 
					var item = items[i]; 
					var context = item.getBindingContext("modelAcceso"); 
					var obj = context.getProperty(null, context);  
					if(aDataActual[obj.Codigo]){
						sap.m.MessageToast.show("El rol "+ obj.Nombre+", ya esta agregado"); 
						continue;
					}
					var nuevoRol 	= {};
					nuevoRol.Id   	= '';
					nuevoRol.IdTemp = that.generarIdTemp();
					nuevoRol.CodRol = obj.Codigo;
					nuevoRol.Rol = obj.Nombre; 
					numRegistros = that.getView().getModel("modelAcceso").getProperty("/aListaRolesUsuarioEditar");
					nuevoRol.Posicion = 0;
					nuevoRol.Estado = 'C';
					if(numRegistros.length > 0){
						nuevoRol.Posicion = numRegistros.length;
					}
					
					numRegistros.push(nuevoRol);
					that.getView().getModel("modelAcceso").setProperty("/aListaRolesUsuarioEditar", numRegistros);
					that.getView().getModel("modelAcceso").refresh();
					that.onPressCloseBuscarRol();
				} 
				
			} catch (e) {
				sap.ui.core.BusyIndicator.hide();
				console.log(e);
			}
			
		},
		onPressCloseBuscarRol:function(){
			this.getView().byId("DlgAgregarRol").destroy();  
		},
		generarIdTemp: function () {
			var fecha = new Date();
			var fechaIso = fecha.toISOString();
			var fechaString = fechaIso.toString().replace(/:/g, "").replace(/-/g, "").replace(".", "").replace("Z", "").replace("T", "");
			var randon = Math.floor((Math.random() * 1000000) + 1);
			var idTransaccion = fechaString + "" + randon;
			return idTransaccion;
		},
		onPressEliminarRolUsuario: function(){
			var self = this;
			var indexes = self.getView().byId("tbRolesEditar").getSelectedIndices();
			//var aListaRolesUsuario = self.getView().getModel("modelAcceso").getProperty("/aListaRolesUsuarioEditar");
			if(indexes.length > 0){
				var aListaUsuariosEliminar = [];
				indexes.forEach(function(i) {
				  var oParametros = self.getView().byId("tbRolesEditar").getContextByIndex(i).getObject();    
				   aListaUsuariosEliminar.push(oParametros); 
				});
				var oTable1 = self.getView().byId("tbRolesEditar");
                      oTable1.clearSelection(); 
				aListaUsuariosEliminar.forEach(function(e){
					var ListaActual  = self.getView().getModel("modelAcceso").getProperty("/aListaRolesUsuarioEditar");
					var nuevoArray =  ListaActual.filter((item) => item.CodRol !== e.CodRol);
					if(e.Id > 0){
						self.aRolEliminado.push(e);
					}
					self.getView().getModel("modelAcceso").setProperty("/aListaRolesUsuarioEditar", nuevoArray);
					self.getView().getModel("modelAcceso").refresh()  
				}); 
			}  
			self.getView().getModel("modelAcceso").refresh();
		}
	});
});