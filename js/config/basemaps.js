define([
    'esri/dijit/Basemap',
    'esri/dijit/BasemapLayer',
    'dojo/i18n!./nls/main'
], function (Basemap, BasemapLayer, i18n) {

    return {
        map: true, // needs a reference to the map

        // define all valid basemaps here.
        basemaps: {
            streets: {},
            satellite: {},
            topo: {},
            Ortho2014: {
                title: 'Imagery 2014',
                basemap: {
                    baseMapLayers: [{
                        url: 'https://enterprise:6443/arcgis/rest/services/Ortho2014_NAD83_MedResolution_WebMercator/MapServer'
                    }]
                }
            },
            Ortho2017: {
                title: 'Imagery 2017',
                basemap: {
                    baseMapLayers: [{
                        url: 'https://enterprise:6443/arcgis/rest/services/Ortho2017_NAD83_MedResolution_WebMercator/MapServer'
                    }]
                }
            }
        }
    };
});