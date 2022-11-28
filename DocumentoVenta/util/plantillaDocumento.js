sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox",
  "sap/m/MessageToast"
], function(JSONModel, MessageBox, MessageToast) {
  "use strict";
  return {
 
		generarPlantillaBoleta: function(oParam) {
     
      var elementHTML = `
      <!DOCTYPE html>
        <html>
        <head>
        <title>`+oParam.sNombreDocVenta+`</title>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
        <style>
        body{
        font-size:11px
        }
        h1, h2, h3, h4{
        text-align: center;
        font-family:Arial; 
        font-size:9px;
        }  
        p{
        font-family:Arial; 
        font-size:9px;
        }
        table {
        border-collapse: collapse; 
        border-spacing: 0;
        font-family:Arial; 
        font-size:8px;
        }
        th, td {
        padding: 0 0;
        font-family:Arial; 
        font-size:8px;
        }

        thead th {
        border-top: 1px solid #2f2828; 
        border-bottom: 1px solid #2f2828; 
        text-align: center; 
        font-weight: bold;
        font-family:Arial; 
        font-size:8px; 
        }
        .cabecera{
        text-align: center !important;
        }
        .moneda{
        text-align: right !important;
        }
        .total_monto{
        border-top: 2px solid #2f2828; color: #2f2828;
        }
        .mtotal{
        font-weight: bold;
        }
        img{
        display: block;
        margin: 0px auto;
        width:100px;
        height:100px;

        }
        </style>
        </head> 
        <body>
        <h1>`+oParam.sNombreComercial.toUpperCase()+`</h1>
        <h3>`+oParam.sNombreFiscal.toUpperCase()+`</h2>
        <h3>RUC: `+oParam.sRucEmpresa+`</h3>
        <h4>`+oParam.sDireccionEmpresa+`</h4>
        <hr size="3px" color="black" /> 
        <h2>`+oParam.sTipoDocumentoVenta.toUpperCase() +` ELECTRONICA</h2>
        <h3>`+oParam.sNumDocumentoVenta+`</h3> 
        <p><span><b>FECHA:</b> `+oParam.sFechaEmisionVenta+` </span> <span style="float: right;"><b>HORA:</b> `+oParam.sHoraEmisionVenta+` </span></p>
        <p><span><b>CLIENTE:</b> `+oParam.sClienteVenta+`</span> </p>
        <p><span><b>NRO.DOCUMENTO:</b> `+oParam.sNroIdentificacionClienteVenta+`</span></p>
        <p><span><b>DIRECCIÓN:</b> `+oParam.sDireccionClienteVenta+`</span></p>
        <p><span><b>SEDE:</b> `+oParam.sSedeUsuario+`</span></p> 
        <p><span><b>CAJERO:</b> `+oParam.sUsuarioCaja+`</span><span style="float: right;"><b>FORMA PAGO:</b> `+oParam.sFormaPago+`</span></p> 
        <table border="0" style="width: 100%"> 
        <thead> 
        <tr> 
        <th class="cabecera">DESCRIPCIÓN</th> 
        <th class="cabecera">&nbsp;&nbsp;P.UNIT&nbsp;&nbsp;</th> 
        <th class="cabecera">CANTIDAD</th> 
        <th class="cabecera">IMPORTE</th>
        </tr> 
        </thead>
        <tbody>`;
        var elementHTMLDetalle ="";
        if(oParam.aPedidoDetalle){
          oParam.aPedidoDetalle.forEach(function(e){
            var elementHTMLDetalleItem = `
            <tr> 
              <td>`+e.sProducto+`</td>  
              <td class="moneda">`+e.fPrecio+`</td>  
              <td class="moneda">`+e.fCantidad+" "+e.sUnidadMedida +`</td> 
              <td class="moneda">`+e.fTotal+`</td> 
            </tr>`;
            elementHTMLDetalle = elementHTMLDetalle + elementHTMLDetalleItem;

          });
        }
         
        var  elementHTMLFooter = `
        </tbody>
        <tfoot>
        <tr class="total_monto">

        <td  class="moneda"></td>
        <td  class="moneda"></td> 
        <th class="moneda" >OP. GRAVADA (S/.)</th>
        <td  class="moneda">`+oParam.fOpGravada+`</td>
        </tr>
        <tr>

        <td  class="moneda"></td>
        <td  class="moneda"></td> 
        <th class="moneda">I.G.V (S/.)</th>
        <td  class="moneda">`+oParam.fIgv+`</td>
        </tr>
        <tr>

        <td  class="moneda"></td>
        <td  class="moneda"></td> 
        <th class="moneda">PRECIO VENTA (S/.)</th>
        <td  class="moneda">`+oParam.fPrecioVenta+`</td>
        </tr>
        <tr>

        <td  class="moneda"></td>
        <td  class="moneda"></td> 
        <th class="moneda">DESCUENTO (S/.)</th>
        <td  class="moneda">`+oParam.fDescuento+`</td>
        </tr>
        <tr> 
        <td  class="moneda"></td>
        <td  class="moneda"></td> 
        <th class="moneda mtotal">IMPOR. TOTAL (S/.)</th>
        <td  class="moneda mtotal">`+oParam.fImporteTotal+`</td>
        </tr> 
        </tfoot>
        </table>
        <hr size="1px" color="black" /> 
        <p class="cabecera" >SON: `+oParam.sImporteTotalLetras+`</p>
        <hr size="1px" color="black" /> 
        <img src="`+oParam.sCodQr+`"> 
        <p class="cabecera" > Representación impresa de la Boleta de Venta Electronica, esta puede ser consultada en URL: https://portalose.bizlinks.com.pe/consulta</p> 
        <p class="cabecera" > ** GRACIAS POR SU PREFERENCIA **</p>
        </body>
        </html>`

        var plantilla = elementHTML + elementHTMLDetalle + elementHTMLFooter;
			return plantilla;
		}, 
	 
  };
});
