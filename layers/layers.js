var wms_layers = [];

var format_sendaikoazamap_0 = new ol.format.GeoJSON();
var features_sendaikoazamap_0 = format_sendaikoazamap_0.readFeatures(json_sendaikoazamap_0, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_sendaikoazamap_0 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_sendaikoazamap_0.addFeatures(features_sendaikoazamap_0);
var lyr_sendaikoazamap_0 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_sendaikoazamap_0, 
                style: style_sendaikoazamap_0,
                popuplayertitle: 'sendai-koaza-map',
                interactive: true,
    title: 'sendai-koaza-map<br />\
    <img src="styles/legend/sendaikoazamap_0_0.png" /> 仙台<br />\
    <img src="styles/legend/sendaikoazamap_0_1.png" /> 南小泉<br />\
    <img src="styles/legend/sendaikoazamap_0_2.png" /> 蒲町<br />\
    <img src="styles/legend/sendaikoazamap_0_3.png" /> 伊在<br />\
    <img src="styles/legend/sendaikoazamap_0_4.png" /> 六丁目<br />\
    <img src="styles/legend/sendaikoazamap_0_5.png" /> <br />' });
var format_sendaioazamap_1 = new ol.format.GeoJSON();
var features_sendaioazamap_1 = format_sendaioazamap_1.readFeatures(json_sendaioazamap_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_sendaioazamap_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_sendaioazamap_1.addFeatures(features_sendaioazamap_1);
var lyr_sendaioazamap_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_sendaioazamap_1, 
                style: style_sendaioazamap_1,
                popuplayertitle: 'sendai-oaza-map',
                interactive: false,
                title: '<img src="styles/legend/sendaioazamap_1.png" /> sendai-oaza-map'
            });

lyr_sendaikoazamap_0.setVisible(true);lyr_sendaioazamap_1.setVisible(true);
var layersList = [lyr_sendaikoazamap_0,lyr_sendaioazamap_1];
lyr_sendaikoazamap_0.set('fieldAliases', {'大字': '大字', '小字': '小字', });
lyr_sendaioazamap_1.set('fieldAliases', {'大字': '大字', });
lyr_sendaikoazamap_0.set('fieldImages', {'大字': 'TextEdit', '小字': 'TextEdit', });
lyr_sendaioazamap_1.set('fieldImages', {'大字': 'TextEdit', });
lyr_sendaikoazamap_0.set('fieldLabels', {'大字': 'inline label - visible with data', '小字': 'inline label - always visible', });
lyr_sendaioazamap_1.set('fieldLabels', {'大字': 'no label', });
lyr_sendaioazamap_1.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});