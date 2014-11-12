var search = document.forms.search, xhr;

$(search.elements.namedItem('query')).on('input', _.debounce(function() {
	var action = search.action,
		type = search.getAttribute('type'),
		query = this.value;

	xhr && xhr.abort();
	     // $.post('/search', params, fn)
	xhr = $[type](action, {query: query}, function(res) {
		var resultTemplate = '';

		$.each(res.items, function(index, item) {
			resultTemplate += _.template($('#list-technologies__i').html())({
				name: item.name,
				href: item.archive_url,
				src: item.avatar_url,
				stars: item.watchers
			})
		});

		resultTemplate = _.template($('#list-technologies').html())({
			template: resultTemplate
		});
		$('body').addClass('expanded');
		$('.b-result').html(resultTemplate);
	})
}, 1000));