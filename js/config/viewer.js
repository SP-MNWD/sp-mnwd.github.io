define([
    'esri/units',
    'esri/geometry/Extent',
    'esri/config',
    /*'esri/urlUtils',*/
    'esri/tasks/GeometryService',
    'esri/layers/ImageParameters',
    'gis/plugins/Google',
    'dojo/i18n!./nls/main',
    'dojo/topic',
    'dojo/sniff'
], function (units, Extent, esriConfig, /*urlUtils,*/ GeometryService, ImageParameters, GoogleMapsLoader, i18n, topic, has) {

    // url to your proxy page, must be on same machine hosting you app. See proxy folder for readme.
    esriConfig.defaults.io.proxyUrl = 'proxy/proxy.ashx';
    esriConfig.defaults.io.alwaysUseProxy = false;

    // add a proxy rule to force specific domain requests through proxy
    // be sure the domain is added in proxy.config
    /*urlUtils.addProxyRule({
        urlPrefix: 'www.example.com',
        proxyUrl: 'proxy/proxy.ashx'
    });*/

    // url to your geometry server.
    esriConfig.defaults.geometryService = new GeometryService('https://enterprise:6443/arcgis/rest/services/Utilities/Geometry/GeometryServer');

    GoogleMapsLoader.KEY = 'AIzaSyAAzePQ-h4QAf6-ZjsRpv0As_MelrmgnnI';

    // helper function returning ImageParameters for dynamic layers
    // example:
    // imageParameters: buildImageParameters({
    //     layerIds: [0],
    //     layerOption: 'show'
    // })
    function buildImageParameters (config) {
        config = config || {};
        var ip = new ImageParameters();
        //image parameters for dynamic services, set to png32 for higher quality exports
        ip.format = 'png32';
        for (var key in config) {
            if (config.hasOwnProperty(key)) {
                ip[key] = config[key];
            }
        }
        return ip;
    }

    return {
        // used for debugging your app
        isDebug: true,

        //default mapClick mode, mapClickMode lets widgets know what mode the map is in to avoid multipult map click actions from taking place (ie identify while drawing).
        defaultMapClickMode: 'identify',
        // map options, passed to map constructor. see: https://developers.arcgis.com/javascript/jsapi/map-amd.html#map1
        mapOptions: {
            basemap: 'topo',
            center: [-117.30891, 33.2242867],
            zoom: 13,
            minZoom: 12,
            maxZoom: 19,
            sliderStyle: 'small',
            logo: false
        },

        // operationalLayers: Array of Layers to load on top of the basemap: valid 'type' options: 'dynamic', 'tiled', 'feature'.
        // The 'options' object is passed as the layers options for constructor. Title will be used in the legend only. id's must be unique and have no spaces.
        // 3 'mode' options: MODE_SNAPSHOT = 0, MODE_ONDEMAND = 1, MODE_SELECTION = 2
        operationalLayers: [{
            type: 'dynamic',
            url: 'https://enterprise:6443/arcgis/rest/services/MasterJS/MapServer',
            title: 'Oceanside',
            options: {
                id: 'Oceanside',
                opacity: 1.0,
                visible: true,
                imageParameters: buildImageParameters()
            },
            layerControlLayerInfos: {
                swipe: true,
                metadataUrl: true,
                expanded: true
            }
        }],
        widgets: {
            myInfo: {
                include: true,
                id: 'myInfo',
                type: 'floating',
                title: 'MyInfo',
                preload: true,
                path: 'gis/dijit/MyInfo',
                options: {
                    attachTo: 'sidebarLeft', // the dom node to place MyInfo
                    position: 'last', // “first”, “last”, or “only”
                    href: 'js/config/myInfo.html' // provide HTML
                    // content: '<div>My Content</div>' // or pass in a string as an alternative to href
                }
            },
            search: {
                include: true,
                type: has('phone') ? 'titlePane' : 'ui',
                path: 'esri/dijit/Search',
                placeAt: has('phone') ? null : 'top-center',
                title: i18n.viewer.widgets.search,
                iconClass: 'fas fa-search',
                position: 0,
                options: 'config/search'
            },
            reverseGeocoder: {
                include: true,
                type: 'invisible',
                path: 'gis/dijit/ReverseGeocoder',
                options: {
                    map: true,
                    mapRightClickMenu: true
                }
            },
            basemaps: {
                include: true,
                id: 'basemaps',
                type: 'ui',
                path: 'gis/dijit/Basemaps',
                placeAt: 'top-right',
                position: 'first',
                options: 'config/basemaps'
            },
            identify: {
                include: true,
                id: 'identify',
                type: 'invisible',
                type: 'titlePane',
                path: 'gis/dijit/Identify',
                title: i18n.viewer.widgets.identify,
                iconClass: 'fas fa-info-circle',
                open: false,
                preload: true,
                position: 3,
                draggable: true,
                options: 'config/identify'
            },
            mapInfo: {
                include: false,
                id: 'mapInfo',
                type: 'domNode',
                path: 'gis/dijit/MapInfo',
                srcNodeRef: 'mapInfoDijit',
                options: {
                    map: true,
                    mode: 'dms',
                    firstCoord: 'y',
                    unitScale: 3,
                    showScale: true,
                    xLabel: '',
                    yLabel: '',
                    minWidth: 286
                }
            },
            scalebar: {
                include: true,
                id: 'scalebar',
                type: 'map',
                path: 'esri/dijit/Scalebar',
                options: {
                    map: true,
                    attachTo: 'bottom-left',
                    scalebarStyle: 'line',
                    scalebarUnit: 'dual'
                }
            },
            overviewMap: {
                include: has('phone') ? false : true,
                id: 'overviewMap',
                type: 'map',
                path: 'esri/dijit/OverviewMap',
                options: {
                    map: true,
                    attachTo: 'bottom-right',
                    color: '#0000CC',
                    height: 100,
                    width: 125,
                    opacity: 0.30,
                    visible: false
                }
            },
            homeButton: {
                include: true,
                id: 'homeButton',
                type: 'ui',
                path: 'esri/dijit/HomeButton',
                placeAt: 'top-left',
                options: {
                    map: true,
                    extent: new Extent({
                        xmin: -117.48325,
                        ymin: 33.12925,
                        xmax: -117.13425,
                        ymax: 33.31925,
                    })
                }
            },
            legend: {
                include: true,
                id: 'legend',
                type: 'titlePane',
                path: 'gis/dijit/Legend',
                title: i18n.viewer.widgets.legend,
                iconClass: 'far fa-fw fa-images',
                open: false,
                position: 1,
                options: {
                    map: true,
                    legendLayerInfos: true
                }
            },
            layerControl: {
                include: true,
                id: 'layerControl',
                type: 'titlePane',
                path: 'gis/dijit/LayerControl',
                title: i18n.viewer.widgets.layerControl,
                iconClass: 'fas fa-fw fa-th-list',
                open: true,
                position: 0,
                options: {
                    map: true,
                    layerControlLayerInfos: true,
                    separated: true,
                    vectorReorder: true,
                    overlayReorder: true,
                }
            },
            draw: {
                include: true,
                id: 'draw',
                type: 'titlePane',
                canFloat: true,
                path: 'gis/dijit/AdvancedDraw',
                title: i18n.viewer.widgets.draw,
                iconClass: 'fas fa-fw fa-paint-brush',
                open: false,
                position: 4,
                options: {
                    map: true,
                    mapClickMode: true
                }
            },
            measure: {
                include: true,
                id: 'measurement',
                type: 'titlePane',
                canFloat: true,
                path: 'gis/dijit/Measurement',
                title: i18n.viewer.widgets.measure,
                iconClass: 'fas fa-fw fa-expand',
                open: false,
                position: 5,
                options: {
                    map: true,
                    mapClickMode: true,
                    defaultAreaUnit: units.SQUARE_MILES,
                    defaultLengthUnit: units.MILES
                }
            },
            print: {
                include: true,
                id: 'print',
                type: 'titlePane',
                canFloat: true,
                path: 'gis/dijit/Print',
                title: i18n.viewer.widgets.print,
                iconClass: 'fas fa-fw fa-print',
                open: false,
                position: 6,
                options: {
                    map: true,
                    printTaskURL: 'https://enterprise:6443/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
                    copyrightText: 'Copyright 2017',
                    authorText: 'City of Oceanside',
                    defaultTitle: 'City of Oceanside',
                    defaultFormat: 'PDF',
                    defaultLayout: 'Letter ANSI A Landscape'
                }
            },
            streetview: {
                include: true,
                id: 'streetview',
                type: 'titlePane',
                canFloat: true,
                position: 9,
                path: 'gis/dijit/StreetView',
                title: i18n.viewer.widgets.streetview,
                iconClass: 'fas fa-fw fa-street-view',
                paneOptions: {
                    resizable: true,
                    resizeOptions: {
                        minSize: {
                            w: 250,
                            h: 250
                        }
                    }
                },
                options: {
                    map: true,
                    mapClickMode: true,
                    mapRightClickMenu: true
                }
            },
            help: {
                include: has('phone') ? false : true,
                id: 'help',
                type: 'floating',
                path: 'gis/dijit/Help',
                title: i18n.viewer.widgets.help,
                iconClass: 'fas fa-fw fa-info-circle',
                paneOptions: {
                    draggable: false,
                    html: '<a href="#"><i class="fas fa-fw fa-info-circle"></i>link</a>'.replace('link', i18n.viewer.widgets.help),
                    domTarget: 'helpDijit',
                    style: 'height:345px;width:450px;'
                },
                options: {}
            }

        }
    };
});
