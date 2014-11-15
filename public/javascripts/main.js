var search = document.forms.search, xhr;
var model = [];

function render(model, sort) {
	console.log('render');
	var resultTemplate = '';

	var _model = $.extend({}, model);

	if (sort) {
		if ('type' in sort) {
			_model.items = _model.items.filter(function(item) {
				return item.type === sort.type
			})
		}
	}

	$.each(_model.items, function(index, item) {
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

	var title = _.template($('#list-title-found').html())({
		count: _model.items.length
	});


	$('.project').addClass('expanded');
	$('.b-result-body').html(resultTemplate);
	$('.b-result-title').html(title)
};

$(search.elements.namedItem('query')).on('input', _.debounce(function() {
	var action = search.action,
		type = search.getAttribute('type'),
		query = this.value;

	xhr && xhr.abort();
	xhr = $[type](action, {query: query}, function(res) {
		model = res;
		render(model);
	})
}, 1000));

$('.b-result-nav a').click(function (e) {
	e.preventDefault()
	$(this).tab('show');

	var index = $('.b-result-nav a').index(this);
	if (index === 1) {
		render(model, {type: 'github'})
	} else if (index === 2) {
		render(model, {type: 'cdnjs'})
	} else {
		render(model)
	}
});

$('.pagination a').click(function (e) {
	e.preventDefault()
	$(this).tab('show');

})