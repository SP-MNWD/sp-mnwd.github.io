define([
    'esri/tasks/locator',
    'esri/dijit/Search',
    'esri/layers/FeatureLayer',
    'esri/InfoTemplate',
    'esri/config',
    'dojo/has',
    'dojo/domReady!'

], function (Locator, Search, FeatureLayer, InfoTemplate, esriConfig, has) {

    esriConfig.defaults.io.corsEnabledServers.push({
        host: "gis.ci.oceanside.ca.us",
        withCredentials: false
    });

    return {
        map: true,
        mapRightClickMenu: true,
        enableInfoWindow: true,
        enableButtonMode: has('mobile') ? false : true,
        expanded: true,
        allPlaceholder: 'Find an address or APN',
        sources: [{
            placeholder: 'Find an address',
            locator: new Locator('https://enterprise:6443/arcgis/rest/services/AddressLocator_Composite2016/GeocodeServer'),
            singleLineFieldName: 'SingleLine',
            outFields: ['Loc_name'],
            name: 'Address Search',
            enableSuggestions: true,
            localSearchOptions: {
                minScale: 300000,
                distance: 50000
            }
        }, {
			placeholder: 'APN - ex 1470950400',
            featureLayer: new FeatureLayer('https://enterprise:6443/arcgis/rest/services/WebService/Planning/MapServer/2'),
            searchFields: ["APN"],
            name: "Assessor's Parcel Number",
            displayField: "APN",
            exactMatch: false,
            outFields: ["*"],
            maxResults: 6,
            maxSuggestions: 6,
            minCharacters: 6,
            enableSuggestions: true,
            infoTemplate: new InfoTemplate("Search result", "APN: ${APN}"),
            localSearchOptions: {
                minScale: 300000,
                distance: 50000
            }
        }]
    };
});