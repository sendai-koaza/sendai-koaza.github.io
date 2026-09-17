(function () {
    'use strict';
    var initialExtent = [15685226.741739, 4613114.098135, 15692580.637673, 4617549.007290];
    var panels = [
        '<section id="layers-panel" class="site-panel" hidden aria-label="レイヤー設定"><button class="panel-close" type="button" aria-label="閉じる">×</button><h2>背景・レイヤー</h2><label class="layer-option"><input type="checkbox" data-layer="koaza" checked> 小字界・小字名</label><label class="layer-option"><input type="checkbox" data-layer="oaza" checked> 大字界</label><label class="opacity-control">背景地図の濃さ <input type="range" min="0" max="100" value="100" aria-label="背景地図の濃さ"></label><button class="map-home" type="button">仙台の表示範囲へ戻る</button></section>',
        '<section id="legend-panel" class="site-panel" hidden aria-label="凡例"><button class="panel-close" type="button" aria-label="閉じる">×</button><h2>凡例</h2><h3>小字</h3><div class="legend-row"><img src="styles/legend/sendaikoazamap_1_0.png" alt="">仙台</div><div class="legend-row"><img src="styles/legend/sendaikoazamap_1_1.png" alt="">南小泉</div><div class="legend-row"><img src="styles/legend/sendaikoazamap_1_2.png" alt="">蒲町</div><div class="legend-row"><img src="styles/legend/sendaikoazamap_1_3.png" alt="">伊在</div><div class="legend-row"><img src="styles/legend/sendaikoazamap_1_4.png" alt="">六丁目</div><h3>大字</h3><div class="legend-row"><img src="styles/legend/sendaioazamap_2.png" alt="">大字界</div></section>',
        '<section id="about-panel" class="site-panel" hidden aria-label="この地図について"><button class="panel-close" type="button" aria-label="閉じる">×</button><h2>この地図について</h2><p>仙台市域の小字・大字を閲覧するための地図です。地図上の範囲をクリックすると、属性情報を確認できます。</p><p>境界や名称は資料に基づく参考情報です。権利関係・行政手続きなどの正式な確認には利用しないでください。</p><p>背景地図：<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank" rel="noopener">国土地理院タイル</a></p><p>更新日・データ出典は、確認後にこの欄へ追記できます。</p></section>'
    ];
    document.body.insertAdjacentHTML('beforeend', panels.join(''));
    function closePanels() { document.querySelectorAll('.site-panel').forEach(function (panel) { panel.hidden = true; }); document.querySelectorAll('[data-panel-target]').forEach(function (button) { button.setAttribute('aria-expanded', 'false'); }); }
    document.querySelectorAll('[data-panel-target]').forEach(function (button) { button.setAttribute('aria-expanded', 'false'); button.addEventListener('click', function () { var panel = document.getElementById(button.dataset.panelTarget); var open = panel.hidden; closePanels(); panel.hidden = !open; button.setAttribute('aria-expanded', String(open)); }); });
    document.querySelectorAll('.panel-close').forEach(function (button) { button.addEventListener('click', closePanels); });
    var layerByKey = { koaza: lyr_sendaikoazamap_1, oaza: lyr_sendaioazamap_2 };
    document.querySelectorAll('[data-layer]').forEach(function (input) { input.addEventListener('change', function () { layerByKey[input.dataset.layer].setVisible(input.checked); }); });
    document.querySelector('.opacity-control input').addEventListener('input', function (event) { lyr__0.setOpacity(Number(event.target.value) / 100); });
    document.querySelector('.map-home').addEventListener('click', function () { map.getView().fit(initialExtent, { size: map.getSize(), duration: 350, padding: [82, 20, 20, 20] }); closePanels(); });
}());
