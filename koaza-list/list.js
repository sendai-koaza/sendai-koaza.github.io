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
      var listNumber = String(index).padStart(3, '0');
      var rowId = options.rowPrefix ? ' id="' + options.rowPrefix + listNumber + '"' : '';
      return '<tr' + rowId + '>' + headers.map(function (header) {
        var value = escapeHtml(row[header]);
        if (options.linkNames && header === '地名') {
          var number = 'No.' + listNumber;
          var mapName = data.mapAliases[row[header]] || row[header];
          return '<td><span class="place-number">' + number + '</span><a class="place-link" href="../?koaza=' + encodeURIComponent(mapName) + '">' + value + '</a></td>';
        }
        if (header === 'リンク' && row[header]) {
          return '<td><a href="' + value + '" target="_blank" rel="noopener">開く</a></td>';
        }
        return '<td>' + value + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody>';
  }

  document.getElementById('area-navigation').innerHTML = data.navigation.map(function (group) {
    var places = group.places.map(function (place) {
      return place === data.title ? '<a class="area-link" href="#list-title">' + escapeHtml(place) + '</a>' : '<span class="area-pending">' + escapeHtml(place) + '</span>';
    }).join('');
    return '<section class="area-group"><span class="area-group__name">' + escapeHtml(group.ward || '仙台城下') + '</span><div class="area-group__places">' + places + '</div></section>';
  }).join('');

  document.getElementById('list-notes').innerHTML = data.notes.map(function (note) { return '<p>' + escapeHtml(note) + '</p>'; }).join('');
  document.getElementById('list-title').textContent = data.title + 'の小字一覧';
  renderTable('main-list', data.main, { rowPrefix: 'koaza-', linkNames: true });
  renderTable('extra-list', data.extra);
  renderTable('references-list', data.references);

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
