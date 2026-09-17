// 💡 設定1：ラベルを強制出現させたい最低のズームレベル（12）
const MIN_ZOOM_FOR_LABEL = 12; 

// 💡 設定2：文字の大きさの倍率
const LABEL_SCALE_RATIO = 0.8;

// 💡 設定3：ヘッダーに表示するテキストの設定
const HEADER_TITLE = "仙台市小字地図"; 
const HEADER_TWITTER = "X(Twitter): @raimu_sendai"; 

// 🌟 地図のカスタムスタイルを適用する関数
function applyCustomMapSettings() {
    if (typeof map === 'undefined' || !map.getLayers) return;

    map.getLayers().forEach((layer) => {
        // タイルレイヤー（背景地図など）は除外
        if (layer instanceof ol.layer.Tile) return;

        // すでにカスタムスタイルのバックアップがあるか確認
        if (!layer._originalStyle) {
            const currentStyle = layer.getStyle();
            if (!currentStyle) return;
            layer._originalStyle = currentStyle; // 元のスタイル関数を保存
        }

        const originalStyle = layer._originalStyle;

        // レイヤーのスタイル関数を設定
        layer.setStyle(function(feature, resolution) {
            let styles = (typeof originalStyle === 'function') 
                ? originalStyle(feature, resolution) 
                : originalStyle;

            if (!styles) return styles;

            const styleArray = Array.isArray(styles) ? styles : [styles];
            const currentZoom = map.getView().getZoom();

            styleArray.forEach((style) => {
                // 1. 【透明度】塗りつぶし（Fill）を0.3に変更
                const fill = style.getFill();
                if (fill) {
                    let color = fill.getColor();
                    if (color && typeof color === 'string') {
                        if (typeof ol !== 'undefined' && ol.color && ol.color.asArray) {
                            let rgba = ol.color.asArray(color).slice();
                            rgba[3] = 0.3;
                            fill.setColor(rgba);
                        }
                    } else if (Array.isArray(color)) {
                        let newColor = [...color];
                        newColor[3] = 0.3;
                        fill.setColor(newColor);
                    }
                }

                // 2. 【ラベル制御】
                const textStyle = style.getText();
                if (textStyle) {
                    if (typeof textStyle.setScale === 'function') {
                        textStyle.setScale(LABEL_SCALE_RATIO);
                    }
                    if (typeof textStyle.setTextAlign === 'function') {
                        textStyle.setTextAlign('center');
                    }
                    if (typeof textStyle.setOffsetX === 'function') {
                        textStyle.setOffsetX(0);
                    }
                    if (typeof textStyle.setOffsetY === 'function') {
                        textStyle.setOffsetY(0);
                    }
                    if (typeof textStyle.setTextBaseline === 'function') {
                        textStyle.setTextBaseline('middle');
                    }
                    if (typeof textStyle.setPriority === 'function') {
                        textStyle.setPriority(Infinity); 
                    }
                    if (typeof textStyle.setOverflow === 'function') {
                        textStyle.setOverflow(true);
                    }

                    if (!style._originalTextObject) {
                        style._originalTextObject = textStyle;
                    }

                    // ズームレベルに応じた表示切替
                    if (currentZoom >= MIN_ZOOM_FOR_LABEL) {
                        style.setText(style._originalTextObject);
                    } else {
                        style.setText(null);
                    }
                }
            });

            return styles;
        });
    });

    // 初回再描画の呼び出し
    refreshVectorLayers();
}

// ベクターレイヤーを強制的に再描画する関数
function refreshVectorLayers() {
    if (typeof map === 'undefined') return;
    map.getLayers().forEach((layer) => {
        if (!(layer instanceof ol.layer.Tile) && typeof layer.changed === 'function') {
            layer.changed();
        }
    });
}

// 🌟 上部ヘッダーを作成して画面に設置する関数
function createTopHeader() {
    if (document.getElementById('custom-map-header')) return;

    const header = document.createElement('div');
    header.id = 'custom-map-header';

    header.style.position = 'fixed';
    header.style.top = '0';
    header.style.left = '0';
    header.style.width = '100%';
    header.style.height = '50px';
    header.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
    header.style.backdropFilter = 'blur(5px)';
    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.15)';
    header.style.zIndex = '9999';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.padding = '0 20px';
    header.style.boxSizing = 'border-box';
    header.style.pointerEvents = 'auto';
    header.style.fontFamily = 'sans-serif';

    const leftText = document.createElement('div');
    leftText.style.fontSize = '24px';
    leftText.style.color = '#111111';
    leftText.style.fontWeight = 'bold';
    leftText.textContent = HEADER_TITLE;

    const rightText = document.createElement('div');
    rightText.style.fontSize = '13px';
    rightText.style.color = '#444444';
    rightText.style.fontWeight = 'bold';
    rightText.textContent = HEADER_TWITTER;

    header.appendChild(leftText);
    header.appendChild(rightText);
    document.body.appendChild(header);
}

// ⚡ ロード監視とマップ準備完了を待ってから実行
window.addEventListener('load', () => {
    createTopHeader();

    // qgis2webの map 変数が確実に生成されるのを待機して適用
    const checkMapExist = setInterval(() => {
        if (typeof map !== 'undefined') {
            clearInterval(checkMapExist);
            applyCustomMapSettings();

            // ズーム終了時にレイヤー更新を登録
            map.getView().on('moveend', refreshVectorLayers);
        }
    }, 100);
});
