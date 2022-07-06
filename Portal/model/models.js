sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
  ], function(JSONModel, Device) {
    "use strict";
    return {
      createDeviceModel: function() {
        var oModel = new JSONModel(Device);
        oModel.setDefaultBindingMode("OneWay");
        return oModel;
      },
      usuarioLogeadoModel: function() {
        var oUsuario        = {};
        oUsuario.info       = {};
        oUsuario.grupos     = [
                                {"nombreGrupo":"Sistemas", "aplicaciones":[
                                                                            {"nombre":"Usuarios", "descripcion":"App de Usuarios", "url":"appUsuario"}, 
                                                                            {"nombre":"Maestra", "descripcion":"Maestro de Configuración", "url":"appMaestra"}]},
                                {"nombreGrupo":"Reportes", "aplicaciones": [
                                                                            {"nombre":"Reporte de Medicamentos", "descripcion":"Medicamentos", "url":"appRepoMedicamento"}]}
                              ];
        oUsuario.accesos    = [];
        oUsuario.nuevaClave = {};
        oUsuario.empresa    = 'DDDDD';
        var oModel = new JSONModel(oUsuario);
        return oModel;
      }
    };
  });
  