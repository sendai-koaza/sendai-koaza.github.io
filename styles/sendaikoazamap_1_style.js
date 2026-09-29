var size = 0;
var placement = 'point';
var koazaPolygonOpacity = 0.3;
var koazaBoundaryOpacity = 1;
function categories_sendaikoazamap_1(feature, value, size, resolution, labelText,
                       labelFont, labelFill, bufferColor, bufferWidth,
                       placement, textAlign, offsetX, offsetY, overflow, repeat) {
    var valueStr = (value !== null && value !== undefined) ? value.toString() : 'default';
    switch(valueStr) {
        case '仙台':
            return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(227,26,28,' + koazaBoundaryOpacity + ')', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 1.9}),fill: new ol.style.Fill({color: 'rgba(110,218,166,' + koazaPolygonOpacity + ')'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth, textAlign, offsetX, offsetY, overflow, repeat)
    })];
			break;

        case '南小泉':
            return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(227,26,28,' + koazaBoundaryOpacity + ')', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 1.9}),fill: new ol.style.Fill({color: 'rgba(222,69,89,' + koazaPolygonOpacity + ')'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth, textAlign, offsetX, offsetY, overflow, repeat)
    })];
			break;

        case '蒲町':
            return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(227,26,28,' + koazaBoundaryOpacity + ')', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 1.9}),fill: new ol.style.Fill({color: 'rgba(110,202,96,' + koazaPolygonOpacity + ')'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth, textAlign, offsetX, offsetY, overflow, repeat)
    })];
			break;

        case '伊在':
            return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(227,26,28,' + koazaBoundaryOpacity + ')', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 1.9}),fill: new ol.style.Fill({color: 'rgba(195,219,100,' + koazaPolygonOpacity + ')'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth, textAlign, offsetX, offsetY, overflow, repeat)
    })];
			break;

        case '六丁目':
            return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(227,26,28,' + koazaBoundaryOpacity + ')', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 1.9}),fill: new ol.style.Fill({color: 'rgba(48,75,229,' + koazaPolygonOpacity + ')'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth, textAlign, offsetX, offsetY, overflow, repeat)
    })];
			break;

        case '霞目':
            return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(227,26,28,' + koazaBoundaryOpacity + ')', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 1.9}),fill: new ol.style.Fill({color: 'rgba(202,47,171,' + koazaPolygonOpacity + ')'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth, textAlign, offsetX, offsetY, overflow, repeat)
    })];
			break;

        case '長喜城':
            return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(227,26,28,' + koazaBoundaryOpacity + ')', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 1.9}),fill: new ol.style.Fill({color: 'rgba(239,193,140,' + koazaPolygonOpacity + ')'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth, textAlign, offsetX, offsetY, overflow, repeat)
    })];
			break;
        case '南目':
            return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(227,26,28,' + koazaBoundaryOpacity + ')', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 1.9}),fill: new ol.style.Fill({color: 'rgba(125,211,230,' + koazaPolygonOpacity + ')'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth, textAlign, offsetX, offsetY, overflow, repeat)
    })];
			break;
default:
            return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(227,26,28,' + koazaBoundaryOpacity + ')', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 1.9}),fill: new ol.style.Fill({color: 'rgba(174,129,213,' + koazaPolygonOpacity + ')'}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth, textAlign, offsetX, offsetY, overflow, repeat)
    })];
			break;
    }};

var style_sendaikoazamap_1 = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    
    var labelText = ""; 
    var value = feature.get("大字");
    var labelFont = "19.5px \'Open Sans\', sans-serif";
    var labelFill = "#ff0000";
    var bufferColor = "#fafafa";
    var bufferWidth = 3.0;
    var textAlign = 'center';
    var offsetX = 0;
    var offsetY = 0;
    var overflow = true;
    var repeat = 0;
    var placement = 'point';
    labelFont = "15px sans-serif";
    var koazaLabelResolution = window.innerWidth <= 620 ? 9.56 : 6.76;
    if (feature.get("小字") !== null && resolution > 0 && resolution < koazaLabelResolution) {
        labelText = String(feature.get("小字"));
    }
    
    var style = categories_sendaikoazamap_1(feature, value, size, resolution, labelText,
                          labelFont, labelFill, bufferColor,
                          bufferWidth, placement, textAlign, offsetX, offsetY, overflow, repeat);

    return style;
};
