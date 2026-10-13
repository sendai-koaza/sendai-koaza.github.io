(function () {
  'use strict';
  var data = window.KOAZA_LIST_DATA;
  if (!data) return;

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function renderTable(id, rows, options) {
    var table = document.getElementById(id);
    var headers = rows.length ? Object.keys(rows[0]) : [];
    options = options || {};
    table.innerHTML = '<thead><tr>' + headers.map(function (header) { return '<th scope="col">' + escapeHtml(header) + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (row, index) {
      var listNumber = String(index + (options.startNumber || 0)).padStart(3, '0');
      var rowId = options.rowPrefix ? ' id="' + options.rowPrefix + listNumber + '"' : '';
      var rowClass = options.emphasizeFirst && index === 0 ? ' class="oaza-row"' : '';
      return '<tr' + rowId + rowClass + '>' + headers.map(function (header) {
        var value = escapeHtml(row[header]);
        if (options.linkNames && header === '地名') {
          var number = options.showNumbers === false ? '' : '<span class="place-number">No.' + listNumber + '</span>';
          var mapName = data.mapAliases[row[header]] || row[header];
          return '<td>' + number + '<a class="place-link" href="' + data.mapBase + '?oaza=' + encodeURIComponent(data.oaza) + '&koaza=' + encodeURIComponent(mapName) + '">' + value + '</a></td>';
        }
        if (header === 'リンク' && row[header]) {
          return '<td><a href="' + value + '" target="_blank" rel="noopener">' + value + '</a></td>';
        }
        return '<td>' + value + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody>';
  }

  document.getElementById('area-navigation').innerHTML = data.navigation.map(function (group) {
    var places = group.places.map(function (place) {
      return data.pageLinks[place] ? '<a class="area-link" href="' + data.pageLinks[place] + '">' + escapeHtml(place) + '</a>' : '<span class="area-pending">' + escapeHtml(place) + '</span>';
    }).join('');
    return '<section class="area-group"><span class="area-group__name">' + escapeHtml(group.ward || '仙台城下') + '</span><div class="area-group__places">' + places + '</div></section>';
  }).join('');

  document.getElementById('list-notes').innerHTML = data.notes.map(function (note) { return '<p>' + escapeHtml(note) + '</p>'; }).join('');
  document.getElementById('list-title').textContent = data.title + 'の小字一覧';
  renderTable('main-list', data.main, { rowPrefix: 'koaza-', linkNames: true, emphasizeFirst: true });
  renderTable('extra-list', data.extra);
  renderTable('references-list', data.references);
  if (!data.extra.length) document.getElementById('extra-section').hidden = true;
  if (!data.references.length) document.getElementById('references-section').hidden = true;

  function fitTablesToDesktop() {
    if (window.innerWidth <= 620) return;
    document.querySelectorAll('.list-table').forEach(function (table) {
      var wrapper = table.parentElement;
      var size = 12;
      table.style.fontSize = size + 'px';
      while (wrapper.scrollWidth > wrapper.clientWidth && size > 6) {
        size -= 0.5;
        table.style.fontSize = size + 'px';
      }
    });
  }
  fitTablesToDesktop();
  window.addEventListener('resize', fitTablesToDesktop);
}());
