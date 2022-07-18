/* global moment:true */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	'sap/m/MessageBox',
	"sap/m/MessageToast",
	"sap/m/Label",
	"sap/m/Text",
	"sap/m/Button",
	"sap/m/Input",
	"sap/m/Dialog"
], function(Controller, JSONModel, MessageBox, MessageToast,
	Label,
	Text,
	Button,
	Input,
	Dialog) {
	"use strict";
	return {
		isPhone: function() {
			return window.innerWidth < 600;
		},
		fnLimpiarCampos: function(validadorGrupoSelect, validarGrupoteInput, icontabBar) {
			var bValidatedSelect = true;
			var bValidatedInput = true;
			if (validadorGrupoSelect) {
				var aControlSelect = sap.ui.getCore().byFieldGroupId(validadorGrupoSelect);
				aControlSelect.forEach(function(oControl) {
					try {
							oControl.setSelectedKey("")
							oControl.setValueState("None");
 							oControl.removeStyleClass("ErrorInput");
					} catch (e) {
						jQuery.sap.log.info("------");
					}
				});
			}
			if (validarGrupoteInput) {
				var aControlInput = sap.ui.getCore().byFieldGroupId(validarGrupoteInput);
				aControlInput.forEach(function(oControl) {
						try {
							oControl.setValue("");
							oControl.setValueState("None");
							oControl.removeStyleClass("ErrorInput");
						} catch (e) {
							jQuery.sap.log.info("------");
						}
				});
			}
		},
		fnValidarCampos: function(validadorGrupoSelect, validarGrupoteInput, icontabBar) {
			var bValidatedSelect = true;
			var bValidatedInput = true;
			if (validadorGrupoSelect) {
				var aControlSelect = sap.ui.getCore().byFieldGroupId(validadorGrupoSelect);
				aControlSelect.forEach(function(oControl) {
					try {
						if (oControl.getSelectedKey() === "" || oControl.getSelectedKey() === "0" || oControl.getSelectedKey() === "1" ) {
							oControl.setValueState("Error");
							oControl.addStyleClass("ErrorInput");
						} else {
							oControl.setValueState("None");
							oControl.removeStyleClass("ErrorInput");
						}
					} catch (e) {
						jQuery.sap.log.info("------");
					}
				});
				bValidatedSelect = aControlSelect.every(function(oControl) {
					var activar;
					try {
						activar = oControl.getValueState() === "None";
					} catch (e) {
						activar = true;
					}
					return activar;
				});
			}
			if (validarGrupoteInput) {
				var aControlInput = sap.ui.getCore().byFieldGroupId(validarGrupoteInput);
				aControlInput.forEach(function(oControl) {
					if (oControl.getRequired()) {
						if (oControl.getValue().length === 0) {
							oControl.setValueState("Error");
							oControl.addStyleClass("ErrorInput");
							oControl.setValueStateText("Dato Obligatorio");
						} else {
							oControl.setValueState("None");
							oControl.removeStyleClass("ErrorInput");
						}
					}
				});
				bValidatedInput = aControlInput.every(function(oControl) {
					return oControl.getValueState() === "None";
				});
			}
			var validaCampos = (bValidatedSelect === true && bValidatedInput === true) ? true : false;
			if (!validaCampos) {
				return false;
			} else {
				return true;
			}
		},

		fnValidarDescripcion: function(iconTabBar, array) {
			if (array.length >= 1) {
				return true;
			} else {
				iconTabBar.setSelectedKey("/ListDescripcion");
				var mensaje = 'Deben agregar una descripción al proyecto';
				sap.m.MessageToast.show(mensaje, {
					duration: 5000,
					width: "25em"
				});
				return false;
			}
		},

		validarCampoUnit: function(oEvent) {
			//	Obtiene los controles
			if (oEvent.getSource().getId().split("--")[1] === "inputMonto") {
				this.limitarInputMonto();
			}

			var sUserInput = oEvent.getParameter("value");
			var oInputControl = oEvent.getSource();
			if (sUserInput.length > 0) {
				oInputControl.setValueState("None");
			} else {
				oInputControl.setValueState("Error");
			}
		},
		validarSelectUnit: function(oEvent) {
			this.limitarInputMonto();

			var sUserInput = oEvent.getSource().getSelectedKey();
			var oInputControl = oEvent.getSource();
			if (sUserInput) {
				oInputControl.setValueState(sap.ui.core.ValueState.None);
			} else {
				oInputControl.setValueState(sap.ui.core.ValueState.Error);
			}
		},

		/* Recibe un string y devuelve solo números */
		validarSoloNumeros: function(e) {
			var reg = new RegExp(/[0-9]/g);
			var eValue;
			e.match(reg) ? eValue = e.match(reg).join('') : eValue = "";
			return eValue;
		},

		/* Recibe un string y devuelve solo numeros y punto */
		validarNumerosExtra: function(e) {
			var reg = new RegExp(/[0-9]|\./g);
			var eValue;
			e.match(reg) ? eValue = e.match(reg).join('') : eValue = "";
			return eValue;
		},

		validarEmail: function(string, oEvent) {
			var regex;
			var isValidated;
			regex =
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			isValidated = regex.test(String(string).toLowerCase());

			isValidated ? oEvent.getSource().setValueState("None") : oEvent.getSource().setValueState("Error");
			//return test;
			//console.log(test);

		},

		limpiarError: function(validadorGrupoSelect, validarGrupoteInput) {
			if (validadorGrupoSelect) {
				var aControlSelect = sap.ui.getCore().byFieldGroupId(validadorGrupoSelect);
				aControlSelect.forEach(function(oControl) {
					try {
						oControl.setValueState("None");
					} catch (e) {
						jQuery.sap.log.info("------");
					}
				});
			}
			if (validarGrupoteInput) {
				var aControlInput = sap.ui.getCore().byFieldGroupId(validarGrupoteInput);
				aControlInput.forEach(function(oControl) {
					oControl.setValueState("None");
				});
			}
		},
		validaFormObligatorio: function(self, form)
        {
			var oForm = self.getView().byId(form).getContent();
            var sError = false;

			oForm.forEach(function(Field) {
				try {
					if (typeof Field.getValue === "function") {
						 if(Field.getRequired() === true){
							if (!Field.getValue() || Field.getValue().length < 1) {
								Field.setValueState("Error"); 
								sError = true;

							} else {
								Field.setValueState("None");
							} 

						}
					}
					if(typeof Field.getSelectedItem() === "object" && Field.getSelectedItem() !== null ){
						if(Field.getRequired() === true ){
							if(Field.getSelectedKey() === "" || Field.getSelectedKey() === 0 ){
								Field.setValueState("Error"); 
								sError = true;
							}else{
								Field.setValueState("None");
							}
						}
						
					}
				} catch (error) {
					console.log(error);
				} 
			});
			
			return sError;

        },
		limipiarFormObligatorio: function(self, form)
        {
			var oForm = self.getView().byId(form).getContent();
            var sError = false;

			oForm.forEach(function(Field) {
				try {
					if (typeof Field.getValue === "function") {
						 if(Field.getRequired() === true){ 
								Field.setValueState("None"); 
						}
					}
					if(typeof Field.getSelectedItem() === "object" && Field.getSelectedItem() !== null ){
						if(Field.getRequired() === true ){
							 
								Field.setValueState("None"); 
						}
						
					}
				} catch (error) {
					console.log(error);
				} 
			});
			
			return sError;

        }
	};
});
