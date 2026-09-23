(function () {
  'use strict';
  var form = document.querySelector('.archive-filters');
  if (!form) return;
  var search = document.getElementById('post-search');
  var topic = document.getElementById('post-topic');
  var status = document.getElementById('archive-results');
  var empty = document.getElementById('archive-empty');
  var rows = Array.from(document.querySelectorAll('[data-post-title]')).map(function (el) {
    return { el: el, title: el.dataset.postTitle.toLocaleLowerCase(), topics: JSON.parse(el.dataset.postTopics) };
  });
  function filter() {
    var terms = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    var count = 0;
    rows.forEach(function (row) {
      var match = terms.every(function (term) { return row.title.includes(term); }) && (!topic.value || row.topics.includes(topic.value));
      row.el.hidden = !match;
      if (match) count++;
    });
    document.querySelectorAll('.archive-year-group').forEach(function (group) {
      group.hidden = !group.querySelector('li:not([hidden])');
    });
    status.textContent = count + ' of ' + rows.length + ' articles';
    empty.hidden = count !== 0;
  }
  form.hidden = false;
  status.hidden = false;
  form.addEventListener('submit', function (event) { event.preventDefault(); });
  search.addEventListener('input', filter);
  topic.addEventListener('change', filter);
  form.addEventListener('reset', function () { search.value = ''; topic.value = ''; filter(); });
  filter();
})();
