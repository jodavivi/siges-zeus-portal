sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageBox",
  "sap/m/MessageToast"
], function(JSONModel, MessageBox, MessageToast) {
  "use strict";
  return {
    stringToDate1:function(cadena){
      if(cadena !== undefined && cadena !== null){
        var fecha = cadena.split("-");
        return new Date(fecha[2]+"-"+fecha[1]+"-"+fecha[0]);
      }
      return "";
    },
    messageStrip: function(controller, id, message, tipo) {

      var control = controller.getView().byId(id);
      control.setText(message);
      control.setShowIcon(true);
      control.setShowCloseButton(false);

      if (!tipo) {
        control.setType("Information");
      }

      if (tipo.toUpperCase() === "E") {
        control.setType("Error");
      }

      if (tipo.toUpperCase() === "S") {
        control.setType("Success");
      }

      if (tipo.toUpperCase() === "W") {
        control.setType("Warning");
      }

      if (tipo.toUpperCase() === "I") {
        control.setType("Information");
      }
    },
    objectListItemSelectedItem: function(event, model) {
      return event.getSource().getBindingContext(model).getObject();
    },
    messageBox: function(mensaje, tipo, callback) {
      if (tipo.toUpperCase() === "C") {
        MessageBox.show(mensaje, {
          icon: MessageBox.Icon.QUESTION,
          title: "Confirmación",
          actions: [MessageBox.Action.YES, MessageBox.Action.NO],
          onClose: function(sAnswer) {
            return callback(sAnswer === MessageBox.Action.YES);
          }
        });
      }

      if (tipo.toUpperCase() === "E") {
        MessageBox.error(mensaje, {
          onClose: function(sAnswer) {
            return callback(sAnswer === MessageBox.Action.YES);
          }
        });
      }

      if (tipo.toUpperCase() === "S") {
        MessageBox.success(mensaje, {
          onClose: function(sAnswer) {
            return callback(sAnswer === MessageBox.Action.YES);
          }
        });
      }

    },
    messageToast: function(data) {
      return MessageToast.show(data, {
        duration: 3000
      });
    },
    imageResize: function(srcData, width, height) {
      var imageObj = new Image(),
        canvas = document.createElement("canvas"),
        ctx = canvas.getContext('2d'),
        xStart = 0,
        yStart = 0,
        aspectRadio,
        newWidth,
        newHeight;

      imageObj.src = srcData;
      canvas.width = width;
      canvas.height = height;

      aspectRadio = imageObj.height / imageObj.width;

      if (imageObj.height < imageObj.width) {
        //horizontal
        aspectRadio = imageObj.width / imageObj.height;
        newHeight = height,
          newWidth = aspectRadio * height;
        xStart = -(newWidth - width) / 2;
      } else {
        //vertical
        newWidth = width,
          newHeight = aspectRadio * width;
        yStart = -(newHeight - height) / 2;
      }

      ctx.drawImage(imageObj, xStart, yStart, newWidth, newHeight);

      return canvas.toDataURL("image/jpeg", 0.75);
    },
    resizeImg: function(img, maxWidth, maxHeight, degrees) {
      var imgWidth = img.width,
        imgHeight = img.height;

      var ratio = 1,
        ratio1 = 1,
        ratio2 = 1;
      ratio1 = maxWidth / imgWidth;
      ratio2 = maxHeight / imgHeight;

      // Use the smallest ratio that the image best fit into the maxWidth x maxHeight box.
      if (ratio1 < ratio2) {
        ratio = ratio1;
      } else {
        ratio = ratio2;
      }
      var canvas = document.createElement("canvas");
      var canvasContext = canvas.getContext("2d");
      var canvasCopy = document.createElement("canvas");
      var copyContext = canvasCopy.getContext("2d");
      var canvasCopy2 = document.createElement("canvas");
      var copyContext2 = canvasCopy2.getContext("2d");
      canvasCopy.width = imgWidth;
      canvasCopy.height = imgHeight;
      copyContext.drawImage(img, 0, 0);

      // init
      canvasCopy2.width = imgWidth;
      canvasCopy2.height = imgHeight;
      copyContext2.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvasCopy2.width, canvasCopy2.height);

      var rounds = 1;
      var roundRatio = ratio * rounds;
      for (var i = 1; i <= rounds; i++) {

        // tmp
        canvasCopy.width = imgWidth * roundRatio / i;
        canvasCopy.height = imgHeight * roundRatio / i;

        copyContext.drawImage(canvasCopy2, 0, 0, canvasCopy2.width, canvasCopy2.height, 0, 0, canvasCopy.width, canvasCopy.height);

        // copy back
        canvasCopy2.width = imgWidth * roundRatio / i;
        canvasCopy2.height = imgHeight * roundRatio / i;
        copyContext2.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvasCopy2.width, canvasCopy2.height);

      } // end for

      canvas.width = imgWidth * roundRatio / rounds;
      canvas.height = imgHeight * roundRatio / rounds;
      canvasContext.drawImage(canvasCopy2, 0, 0, canvasCopy2.width, canvasCopy2.height, 0, 0, canvas.width, canvas.height);

      if (degrees == 90 || degrees == 270) {
        canvas.width = canvasCopy2.height;
        canvas.height = canvasCopy2.width;
      } else {
        canvas.width = canvasCopy2.width;
        canvas.height = canvasCopy2.height;
      }

      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      if (degrees == 90 || degrees == 270) {
        canvasContext.translate(canvasCopy2.height / 2, canvasCopy2.width / 2);
      } else {
        canvasContext.translate(canvasCopy2.width / 2, canvasCopy2.height / 2);
      }
      canvasContext.rotate(degrees * Math.PI / 180);
      canvasContext.drawImage(canvasCopy2, -canvasCopy2.width / 2, -canvasCopy2.height / 2);

      var dataURL = canvas.toDataURL();
      return dataURL;
    },
    loading: function(bShow) {
      if (bShow === true) {
        sap.ui.core.BusyIndicator.show(10);
      } else {
        sap.ui.core.BusyIndicator.hide();
      }
    },
    getValueIN18: function(context, nameField) {
      return context.getView().getModel("i18n").getResourceBundle().getText(nameField);
      //{i18n>Description_TEXT}
    },
    generarTree: function(arr, nivelObjetivo) {
      var tree = [],
        mappedArr = {},
        arrElem,
        mappedElem;

      // En primer lugar mapear los nodos de la matriz a un objeto -> crear
      // una tabla
      var i = 0;
      var len = [];
      for (i = 0, len = arr.length; i < len; i++) {
        arrElem = arr[i];
        mappedArr[arrElem.codigo] = arrElem;
        mappedArr[arrElem.codigo].listaAfiliados = [];
      }
      var id = {};
      for (id in mappedArr) {
        if (mappedArr.hasOwnProperty(id)) {
          mappedElem = mappedArr[id];
          // Si el elemento no está en el nivel raíz, se agrega a su matriz de
          // hijos.
          if (mappedElem.nivel !== nivelObjetivo) {
            try {
              mappedArr[mappedElem.codigoReferido].listaAfiliados.push(mappedElem);
            } catch (e) {

            }

          }
          // Si el elemento está en el nivel raíz, se agrega al array de
          // elementos de primer nivel.
          else {
            tree.push(mappedElem);
          }
        }
      }
      return tree;
    },
	decodeJwt:function(token){
    if(!token){
      return {};
    }
		var base64Url = token.split('.')[1];
		var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));

		return JSON.parse(jsonPayload);
	}
  };
});
