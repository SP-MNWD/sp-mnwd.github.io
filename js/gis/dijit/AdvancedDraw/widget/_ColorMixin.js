define([
    'dojo/_base/declare',
    'dojo/_base/Color'

],
function (declare,
    Color) {

    return declare(null, {

        _esriColorArrayToDojoColor: function (esriColor) {

            esriColor[3] /= 255;

            return Color.fromArray(esriColor);

        },

        _dojoColorToEsriColorArray: function (dojoColor) {

            var colorsArray = dojoColor.toRgba();
            colorsArray[3] = Math.round(colorsArray[3] * 255);

            return colorsArray;

        }

    });
}
);