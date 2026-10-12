(function () {
  'use strict';
  var data = window.KOAZA_LIST_DATA;
  if (!data) return;

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function renderTable(id, rows) {
    var table = document.getElementById(id);
    var headers = rows.length ? Object.keys(rows[0]) : [];
    table.innerHTML = '<thead><tr>' + headers.map(function (header) { return '<th scope="col">' + escapeHtml(header) + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (row) {
      return '<tr>' + headers.map(function (header) { return '<td>' + escapeHtml(row[header]) + '</td>'; }).join('') + '</tr>';
    }).join('') + '</tbody>';
  }

  document.getElementById('area-navigation').innerHTML = data.navigation.map(function (group) {
    var places = group.places.map(function (place) {
      return place === data.title ? '<a class="area-link" href="#list-title">' + escapeHtml(place) + '</a>' : '<span class="area-pending" title="一覧ページを準備中です">' + escapeHtml(place) + '</span>';
    }).join('');
    return '<section class="area-group"><span class="area-group__name">' + escapeHtml(group.ward || '仙台城下') + '</span><div class="area-group__places">' + places + '</div></section>';
  }).join('');

  document.getElementById('list-notes').innerHTML = data.notes.map(function (note) { return '<p>' + escapeHtml(note) + '</p>'; }).join('');
  document.getElementById('list-title').textContent = data.title + 'の小字一覧';
  renderTable('main-list', data.main);
  renderTable('extra-list', data.extra);
}());
