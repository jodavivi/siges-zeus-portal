sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../servicio/UsuarioService",
	"../controller/BaseController",
	'../util/UtilPopUps',
	'../util/UtilValidation' ,
	"../servicio/RolService"
], function (Controller, UsuarioService, BaseController, UtilPopUps, UtilValidation, RolService) {
	"use strict";

	return BaseController.extend("com.telcomdataperu.app.Usuario.controller.UsuarioRegistro", {
		onInit: function () {
			var self = this; 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("usuarioRegistroRoute").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched:function(evt){
			var that        = this; 
			that.getView().getModel("modelAcceso").setProperty("/aListaRolesUsuario", []);
			that.getView().getModel("modelAcceso").setProperty("/bActivar", false);
			this.oUsuarioExistente = undefined; // 0:false, 1:true
		} ,
		onPressCancelarRegistro:function(){
			try { 
				this.navigation(this, "usuarioRoute",{}); 
			} catch (error) {
				console.log(error);
			}
		},
        onRegistrarUsuario:function(){
          try{
            var that = this;
            var sError = UtilValidation.validaFormObligatorio(this,"frmRegistroUsuario"); 
			var aListaRoles = that.getView().getModel("modelAcceso").getProperty("/aListaRolesUsuario");
			if(aListaRoles.length === 0){
				sap.m.MessageToast.show("Debe Asignar un rol al usuario"); 
				return;
			}
            if(!sError){ 
				if(this.oUsuarioExistente){
					that.onFnAsignarEmpresaUsuario();
				}else{
					that.onFnRegistrarUsuario();
				}
            }else{
              sap.m.MessageToast.show("(*) Ingresar los campos obligatorios"); 
            };
            }catch(e){
              sap.ui.core.BusyIndicator.hide();
              console.log(e);
            }
        },
		onFnRegistrarUsuario: function(){
			try{
				var that = this; 
				  UtilPopUps.messageBox("¿Desea crear el usuario?", 'c', function(bConfirmacion) {
				  if (bConfirmacion) {
					sap.ui.core.BusyIndicator.show(0); 
					var aParametros = that.getView().getModel("modelAcceso").getProperty("/aListaParametros");
					
					var oUsuarioNuevo = that.getView().getModel("modelAcceso").getProperty("/oUsuarioNuevo");
					var oParam 					= {}; 
					oParam.sCodTipoUsuario 		= oUsuarioNuevo.sCodTipoUsuario; 
					var aTipoUsuario = aParametros.filter(function (item) {
						return item.Codigo === oUsuarioNuevo.sCodTipoUsuario;
					}); 
					oParam.sTipoUsuario 		= aTipoUsuario[0].Campo1;
					oParam.sCodTipoDocumento 	= oUsuarioNuevo.sCodTipoDocumento;
					var aTipoDocumento= aParametros.filter(function (item) {
						return item.Codigo === oUsuarioNuevo.sCodTipoDocumento;
					}); 
					oParam.sTipoDocumento 		= aTipoDocumento[0].Campo1;
					oParam.sNumDocumento 		= oUsuarioNuevo.sNumDocumento;
					oParam.sNombre 				= oUsuarioNuevo.sNombre;
					oParam.sApellido 			= oUsuarioNuevo.sApellido;
					oParam.sUsuario 			= oUsuarioNuevo.sUsuario;
					oParam.sEmail 				= oUsuarioNuevo.sEmail; 
					oParam.aRol					= that.getView().getModel("modelAcceso").getProperty("/aListaRolesUsuario");
					oParam.iCodEstadoUsuario	= parseInt(oUsuarioNuevo.iCodEstado, 10);   
					UsuarioService.registrarUsuario(oParam, function(result) {  
					sap.ui.core.BusyIndicator.hide();
					UtilPopUps.validarRespuestaServicio(result,'El Usuario se registró correctamente',function(e){});
					if(result.iCode ===1){   
						that.getView().getModel("modelAcceso").setProperty("/aListaRolesUsuario", []);
						that.getView().getModel("modelAcceso").setProperty("/bActivar", false);
						that.getView().getModel("modelAcceso").setProperty("/oUsuarioNuevo", {}); 
					} 
					}, that); 
				  }
				}); 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		},
		onFnAsignarEmpresaUsuario: function(){
			try{
				var that = this;
				  
				  UtilPopUps.messageBox("¿Desea asignar la empresa actual al usuario?", 'c', function(bConfirmacion) {
				  if (bConfirmacion) {
					sap.ui.core.BusyIndicator.show(0);   
					var oParam 				= {};  
					oParam.iId 				= that.oUsuarioExistente.Id; 
					oParam.aRol				= that.getView().getModel("modelAcceso").getProperty("/aListaRolesUsuario");
					UsuarioService.asignarEmpresaUsuario(oParam, function(result) {  
					sap.ui.core.BusyIndicator.hide();
					UtilPopUps.validarRespuestaServicio(result,'El Usuario se registró correctamente',function(e){});
					if(result.iCode ===1){   
						that.getView().getModel("modelAcceso").setProperty("/aListaRolesUsuario", []);
						that.getView().getModel("modelAcceso").setProperty("/bActivar", false);
						that.getView().getModel("modelAcceso").setProperty("/oUsuarioNuevo", {});
						that.oUsuarioExistente = undefined;
					} 
					}, that); 
				  }
				}); 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		},
		buscarUsuario: function(){
			try{
				
				var that        = this;
				var sFiltroUsuario = this.getView().byId("txtBuscarUsuario").getValue(); 
				if(!sFiltroUsuario || sFiltroUsuario===""){
					sap.m.MessageToast.show("Ingrese el usuario a consultar"); 
					return;
				}
				sap.ui.core.BusyIndicator.show(0);
				var oParam 		= {}; 
				oParam.sUsuario = sFiltroUsuario;
				UsuarioService.consultarUsuarioEmpresaAll(oParam, function(result) {  
				  sap.ui.core.BusyIndicator.hide(); 
				  if(result.iCode ===1){
					var oEmpresaSeleccionada = JSON.parse(localStorage.empresa);  
					var oUsuarioEmpresaActual = undefined;
					var iCantidadEmpresas = 0;
					var oUsuarioEncontrado = {};

					result.oResults.forEach(function(e){
						iCantidadEmpresas = e.UsuarioEmpresa.length;
						oUsuarioEncontrado = e;
						e.UsuarioEmpresa.forEach(function(x){ 
							if(x.CodEmpresa === oEmpresaSeleccionada.CodEmpresa){
								oUsuarioEmpresaActual = x;
							} 
						});
					});
					if(oUsuarioEmpresaActual){
						sap.m.MessageToast.show("El usuario ya existe en la sociedad"); 
						return;
					}
					if(!oUsuarioEmpresaActual && iCantidadEmpresas > 0){
						UtilPopUps.messageBox("El usuario ya existe en otra sociedad, desea agregar el usuario a esta sociedad?", 'c', function(bConfirmacion) {
							if (bConfirmacion) {	
								that.oUsuarioExistente = oUsuarioEncontrado;
								var oUsuarioNuevo = that.getView().getModel("modelAcceso").getProperty("/oUsuarioNuevo");
								oUsuarioNuevo.sCodTipoUsuario = oUsuarioEncontrado.CodTipoUsuario;
								oUsuarioNuevo.sUsuario = oUsuarioEncontrado.Usuario;
								oUsuarioNuevo.sCodTipoDocumento = oUsuarioEncontrado.CodTipoDocumento;
								oUsuarioNuevo.sNumDocumento = oUsuarioEncontrado.NumDocumento;
								oUsuarioNuevo.sNombre = oUsuarioEncontrado.Nombre; 
								oUsuarioNuevo.sApellido = oUsuarioEncontrado.Apellido; 
								oUsuarioNuevo.sEmail = oUsuarioEncontrado.Email;  
								oUsuarioNuevo.iCodEstado = oUsuarioEncontrado.CodEstadoUsuario; 
								that.getView().getModel("modelAcceso").refresh();
							}else{
								
								console.log("CANCEL");
							}
						});
					}
					
				  }else{ 
					that.getView().getModel("modelAcceso").setProperty("/bActivar", true);
					that.oUsuarioExistente = undefined;
				  } 
				}, that);
			 
				}catch(e){
				  sap.ui.core.BusyIndicator.hide();
				  console.log(e);
				}
		},
		onPressBuscarRol: async function(){ 
			var oDialog 	=	this.getView().byId("DlgAgregarRol"); 
			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(this.getView().getId(), "com.telcomdataperu.app.Usuario.view.frag.dialog.DlgAgregarRol", this);
				this.getView().addDependent(oDialog);
			} 
			oDialog.open();
		},
		onPressCloseBuscarRol:function(){
			this.getView().byId("DlgAgregarRol").destroy();  
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
		},
		onPressAgregarRolUsuario: function(oEvent){
			try {
				var that        = this;  
				var numRegistros = [];
				var aListaRolesUsuario = JSON.parse(JSON.stringify(that.getView().getModel("modelAcceso").getProperty("/aListaRolesUsuario")));
				var aDataActual = {};
				aListaRolesUsuario.forEach(function(e,i){
					e.Posicion = i;
					aDataActual[e.Codigo] = e;

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
					nuevoRol.iId   	= '';
					nuevoRol.iIdTemp = that.generarIdTemp();
					nuevoRol.sCodigo = obj.Codigo;
					nuevoRol.sNombre = obj.Nombre; 
					numRegistros = that.getView().getModel("modelAcceso").getProperty("/aListaRolesUsuario");
					nuevoRol.Posicion = 0;
					if(numRegistros.length > 0){
						nuevoRol.Posicion = numRegistros.length;
					}
					
					numRegistros.push(nuevoRol);
					that.getView().getModel("modelAcceso").setProperty("/aListaRolesUsuario", numRegistros);
					that.getView().getModel("modelAcceso").refresh();
					that.onPressCloseBuscarRol();
				} 
				
			} catch (e) {
				sap.ui.core.BusyIndicator.hide();
				console.log(e);
			}
			
		},generarIdTemp: function () {
			var fecha = new Date();
			var fechaIso = fecha.toISOString();
			var fechaString = fechaIso.toString().replace(/:/g, "").replace(/-/g, "").replace(".", "").replace("Z", "").replace("T", "");
			var randon = Math.floor((Math.random() * 1000000) + 1);
			var idTransaccion = fechaString + "" + randon;
			return idTransaccion;
		},
		onPressEliminarRolUsuario: function(){
			var self = this;
			var indexes = self.getView().byId("tbRoles").getSelectedIndices();
			var aListaRolesUsuario = self.getView().getModel("modelAcceso").getProperty("/aListaRolesUsuario");
			if(indexes.length > 0){
				var aListaUsuariosEliminar = [];
				indexes.forEach(function(i) {
				  var oParametros = self.getView().byId("tbRoles").getContextByIndex(i).getObject();    
				   aListaUsuariosEliminar.push(oParametros.sCodigo); 
				});
				var oTable1 = self.getView().byId("tbRoles");
                      oTable1.clearSelection(); 
				aListaUsuariosEliminar.forEach(function(e){
					var ListaActual  = self.getView().getModel("modelAcceso").getProperty("/aListaRolesUsuario");
					var nuevoArray =  ListaActual.filter((item) => item.sCodigo !== e);
					self.getView().getModel("modelAcceso").setProperty("/aListaRolesUsuario", nuevoArray);
					self.getView().getModel("modelAcceso").refresh()  
				}); 
			}  
			self.getView().getModel("modelAcceso").refresh();
		}

	});
});