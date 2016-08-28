(function($, ObserverCore) {
	var errors = 0;
	function assert(desc, cond) {
		errors += cond!==true;
		console[cond===true ? 'log': 'error'](desc, cond);
	}

	var observerCore = new ObserverCore();

	console.clear();
	console.log('ALL OF THE CONSOLES SHOULD RETURN TRUE TO PASS', observerCore);
	/////////////////////////////////////////////////////////////////////////////
	observerCore.setData(undefined, 'changedname');

	assert('(undefined === \'changedname\')', observerCore.getData(undefined) === 'changedname');
	/////////////////////////////////////////////////////////////////////////////
	observerCore.setData({
		lorem: {
			ipsum: 'ipsum'
		}
	});
	observerCore.setData('somefoo', null);

	assert('(\'somefoo\' === null)', observerCore.getData('somefoo') === null);
	assert('(\'lorem.ipsum\' === \'ipsum\')', observerCore.getData('lorem.ipsum') === 'ipsum');
	/////////////////////////////////////////////////////////////////////////////
	observerCore.setData('foialterado');

	assert('(getData() === \'foialterado\')', observerCore.getData() === 'foialterado');
	/////////////////////////////////////////////////////////////////////////////
	observerCore.setData({
		music: false
	});

	assert('(music === false)', observerCore.getData('music') === false);
	/////////////////////////////////////////////////////////////////////////////
	observerCore.setData({
		music: 'lorem',
		movies: [1,2,3]
	});

	assert('(music === \'lorem\')', observerCore.getData('music') === 'lorem');
	assert('(movies.length === 3)', observerCore.getData('movies').length === 3);
	/////////////////////////////////////////////////////////////////////////////
	observerCore.setData({
		music: {
			metal: 'hasmetal'
		}
	});

	assert('(music.metal === \'hasmetal\')', observerCore.getData('music.metal') === 'hasmetal');
	assert('(movies === undefined)', observerCore.getData('movies') === undefined);
	/////////////////////////////////////////////////////////////////////////////
	observerCore.setData('movies.drama', 'hasdrama');

	assert('(music.metal === \'hasmetal\')', observerCore.getData('music.metal') === 'hasmetal');
	assert('(movies.drama === \'hasdrama\')', observerCore.getData('movies.drama') === 'hasdrama');
	/////////////////////////////////////////////////////////////////////////////
	observerCore.setData('movies.drama[2]', 'prop 2');

	assert('(movies.drama[2] === \'prop 2\')', observerCore.getData('movies.drama[2]') === 'prop 2');
	/////////////////////////////////////////////////////////////////////////////
	observerCore.setData('movies.drama[2].lorem.ipsum', [1,2,3,4,5]);

	assert('(movies.drama[2].lorem.ipsum.length === 5)', observerCore.getData('movies.drama[2].lorem.ipsum').length === 5);
	/////////////////////////////////////////////////////////////////////////////
	observerCore.setData('movies.drama[2].lorem.ipsum[3]', {
		name: 'hasname'
	});

	assert('(movies.drama[2].lorem.ipsum[3].name === \'hasname\')', observerCore.getData('movies.drama[2].lorem.ipsum[3].name') === 'hasname');
	/////////////////////////////////////////////////////////////////////////////
	observerCore.setData('movies.drama[2].lorem.ipsum[3].name', 'changedname');

	assert('(movies.drama[2].lorem.ipsum[3].name === \'changedname\')', observerCore.getData('movies.drama[2].lorem.ipsum[3].name') === 'changedname');
	/////////////////////////////////////////////////////////////////////////////
	observerCore.setData('movies.drama.actors', [{
		name: 'Al Pafuncio',
		kind: 'Bird'
	}, {
		name: 'Brad Hole',
		kind: 'Unhuman'
	}]);

	assert('(movies.drama.actors.length === 2)', observerCore.getData('movies.drama.actors').length === 2);
	assert('(movies.drama.actors[0].name === \'Al Pafuncio\')', observerCore.getData('movies.drama.actors[0].name') === 'Al Pafuncio');
	assert('(movies.drama.actors[1].name === \'Brad Hole\')', observerCore.getData('movies.drama.actors[1].name') === 'Brad Hole');
	/////////////////////////////////////////////////////////////////////////////
	observerCore.setData('movies.drama.actors[1].oscars', 0);

	assert('(movies.drama.actors[1].oscars === 0)', observerCore.getData('movies.drama.actors[1].oscars') === 0);
	/////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////
	/// EXTENDDATA
	/////////////////////////////////////////////////////////////////////////////
	observerCore.extendData(undefined, {'outrachave': 'outrovalor'});

	assert('(outrachave === \'outrovalor\')', observerCore.getData('outrachave') === 'outrovalor');
	/////////////////////////////////////////////////////////////////////////////
	observerCore.extendData({'novachave': 'novovalor'});

	assert('(novachave === \'novovalor\')', observerCore.getData('novachave') === 'novovalor');
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	observerCore.extendData('movies', {
		action: 'hasaction'
	});

	assert('(movies.action === \'hasaction\')', observerCore.getData('movies.action') === 'hasaction');
	/////////////////////////////////////////////////////////////////////////////
	observerCore.extendData('movies.comedy.actors', [{
		name: 'Gym Carry',
		kind: 'Clow'
	}]);

	assert('(movies.comedy.actors.length === 1)', observerCore.getData('movies.comedy.actors').length === 1);
	assert('(movies.comedy.actors[0].name === \'Gym Carry\')', observerCore.getData('movies.comedy.actors[0].name') === 'Gym Carry');
	/////////////////////////////////////////////////////////////////////////////
	observerCore.extendData({
		movies: {
			suspense: {
				actors: 'no actors'
			},
			drama: {
				'3': {
					lorem: 'algo'
				}
			},
			comedy: {
				actors: [{
					name: 'Will Smithers',
					kind: 'MIB'
				}]
			}
		}
	});

	assert('(movies.suspense.actors === \'no actors\')', observerCore.getData('movies.suspense.actors') === 'no actors');
	assert('(movies.drama[3].lorem === \'algo\')', observerCore.getData('movies.drama[3].lorem') === 'algo');
	// SHOULD REPLACE OR ADD THE NEW ACTOR???
	// GYM CARRY no more exists
	assert('(movies.comedy.actors[0].name !== \'Gym Carry\')', observerCore.getData('movies.comedy.actors[0].name') !== 'Gym Carry');
	// because he was replaced by Will Smithers
	assert('(movies.comedy.actors[0].kind === \'MIB\')', observerCore.getData('movies.comedy.actors[0].kind') === 'MIB');
	/////////////////////////////////////////////////////////////////////////////
	observerCore.extendData('movies.comedy.actors[1]', {
		name: 'Jacky Shun',
		kind: 'Martial Arts Fighter'
	});

	assert('(movies.comedy.actors[1].name === \'Jacky Shun\')', observerCore.getData('movies.comedy.actors[1].name') === 'Jacky Shun');
	/////////////////////////////////////////////////////////////////////////////
	observerCore.extendData('movies.comedy.actors[0]', {
		kind: 'A crazy in the piece',
		bornAt: 'Philadelphy'
	});

	assert('(movies.comedy.actors[0].kind === \'A crazy in the piece\')', observerCore.getData('movies.comedy.actors[0].kind') === 'A crazy in the piece');
	assert('(movies.comedy.actors[0].bornAt === \'Philadelphy\')', observerCore.getData('movies.comedy.actors[0].bornAt') === 'Philadelphy');
	/////////////////////////////////////////////////////////////////////////////
	observerCore.extendData('movies.comedy.actors', [undefined, undefined, {
		name: 'Chris Sucker',
		kind: 'Thin Voice Man'
	}]);

	assert('(movies.comedy.actors.length === 3)', observerCore.getData('movies.comedy.actors').length === 3);
	assert('(movies.comedy.actors[2].name === \'Chris Sucker\')', observerCore.getData('movies.comedy.actors[2].name') === 'Chris Sucker');
	/////////////////////////////////////////////////////////////////////////////
	///ASSERT FOR INHERITED PROPERTIES:
	var movies = {
		adventure: ['Indy John: The hunters of lost arc']
	};
	movies.__proto__ = {
		getMadeIn: function() {
			return 'made in HoleWood';
		},
		state: 'Carly Forny'
	};
	observerCore.setData({
		movies: movies
	}).apply();

	console.log('ASSERT FOR INHERITED PROPERTIES: YOU SHOULD NEVER INHERIT PROPERTIES');
	assert('(movies.adventure[0] === undefined)', observerCore.getData('movies.adventure[0]') === undefined);  // in previous versions of jquery it would return a value but now gonna return undefined because it was prototyped
	assert('getData().movies.adventure[0] === \'Indy John: The hunters of lost arc\')', observerCore.getData().movies.adventure[0] === 'Indy John: The hunters of lost arc');  // but if we really want to get the value for prototyped objects, we should do this way
	assert('(movies).hasOwnProperty(\'adventure\') === true', observerCore.getData('movies').hasOwnProperty('adventure') === true);
	assert('(movies).state === \'Carly Forny\')', observerCore.getData('movies').state === 'Carly Forny');
	assert('(movies.state) === undefined', observerCore.getData('movies.state') === undefined);
	assert('(movies.hasOwnProperty(\'state\') === false)', observerCore.getData('movies').hasOwnProperty('state') === false);
	assert('(movies.getMadeIn() === \'made in HoleWood\')', observerCore.getData('movies').getMadeIn() === 'made in HoleWood');
	assert('(movies.hasOwnProperty(\'getMadeIn\') === false)', observerCore.getData('movies').hasOwnProperty('getMadeIn') === false);

	console.log('ASSERT FOR CHANGES:');
	var watches = 0;
	var should_not_run = 0;
	observerCore
	.watch('movies.adventure[0]', function(data) {
		assert('(watch(\'movies.adventure[0]\') - old value: ' + data.old.movies.adventure[0] + ' new value: ' + data.new.movies.adventure[0], data.diff.movies.adventure[0] === 'The Adventure of Indiana Dog: Hunting for Bones');
		assert('above watch should run once:', (++watches === 1));
	})
	.watch('movies.getMadeIn', function(data) {
		assert('(watch(\'movies.getMadeIn\') - old value: ' + data.old.movies.getMadeIn + ' new value: ' + data.new.movies.getMadeIn, data.new.movies.getMadeIn !== data.old.movies.getMadeIn);
		assert('above watch should run once:', (++watches === 2));
	})
	.watch('movies.state', function(data) {
		assert('(watch(\'movies.state\') - old value: ' + data.old.movies.state + ' new value: ' + data.new.movies.state, data.new.movies.state !== data.old.movies.state);
		assert('above watch should run once:', (++watches === 3));
	})
	.watch('movies.directors.s', function(data) {
		var old_value = ObserverCore.utils.getProp(data.old, ['movies', 'directors', 's']),
			new_value = data.new.movies.directors.s;

		// maybe this should not run? because its watching for a __proto__ property...
		//++should_not_run;
		
		++watches;
		assert('(watch(\'movies.directors.s\') - old value: ' + old_value + ' new value: ' + new_value, new_value !== old_value);
	});

	var changed_movies = {
		adventure: ['The Adventure of Indiana Dog: Hunting for Bones']
	};
	changed_movies.__proto__ = {
		getMadeIn: function() {
			return 'made in RoleHood';
		},
		state: 'Los Angelitos',
		directors: {
			s: 'Spielber Stevel',
			m: 'Mel Bigson'
		}
	};

	observerCore.setData({
		movies: changed_movies
	}).apply();
	/*observerCore.extendData({
		movies: {
			action: ['The God, the Bald, the Ogre']
		}
	}).apply();*/

	observerCore
	.watch('movies.directors.s', function(data) {
		var old_value = ObserverCore.utils.getProp(data.old, ['movies', 'directors', 's']),
			new_value = data.new.movies.directors.s;

		++should_not_run;
		/*++watches;

		assert('(watch(\'movies.directors.s\') - old value != new value && new value === \'Spencer Stillber\'', new_value !== old_value && new_value === 'Spencer Stillber');*/
	});
	changed_movies.directors.s = 'Spencer Stillber';
	observerCore.apply();

	/////////////////////////////////////////////////////////////////////////////
	observerCore.watch('destination', function(data) {
		if (data.old.destination) return;
		assert('(watch(\'destination\') - old value === null: ', data.old.destination === undefined);
		assert('(watch(\'destination\') - old value: ' + data.old.destination + ' new value: ' + data.new.destination, data.diff.destination.x === 100 && data.diff.destination.y === 200);
		assert('above watch should run once:', (++watches === 5));
	})
	.watch('destination', function(data) {
		if (!data.old.destination) return;
		assert('(watch(\'destination\') - old value: ' + data.old.destination + ' new value: ' + data.new.destination, data.new.destination === null);
		assert('above watch should run once:', (++watches === 6));
	})
	observerCore.setData('destination', {
		x: 100,
		y: 200
	}).apply();
	observerCore.setData('destination', null).apply();
	/////////////////////////////////////////////////////////////////////////////
	observerCore
	.watch('somevar0001', function(data) {
		if (data.old.somevar0001 === data.new.somevar0001) {
			assert('(watch(\'somevar0001\') - old value: ' + data.old.somevar0001 + ' new value: ' + data.new.somevar0001 + ' both should be different', false);
		}
	});
	observerCore.setData('somevar0001', null).apply();
	observerCore.setData('somevar0001', null).apply();
	observerCore.setData('somevar0001', 1).apply();
	observerCore.setData('somevar0001', 1).apply();
	observerCore.setData('somevar0001', true).apply();
	observerCore.setData('somevar0001', true).apply();
	observerCore.setData('somevar0001', false).apply();
	observerCore.setData('somevar0001', false).apply();
	/*observerCore.setData('somevar0001', undefined).apply();*/
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	/// showing that extending proto is a BAD IDEA:
	var a = {movies: {
		adventure: ['aventchura']
	}};
	var b = {movies: {
		action: ['acao']
	}};
	a.movies.__proto__ = {
		getMadeIn: function() {console.log('madein');}
	};

	console.log('===============================');
	console.log('jQuery object inheritance problem: before inherit:');
	assert('a.movies.adventure[0] == \'aventchura\'', a.movies.adventure[0] == 'aventchura');
	assert('a.movies.getMadeIn !== undefined', a.movies.getMadeIn !== undefined);
	assert('a.movies.action === undefined', a.movies.action === undefined);
	console.log('after $.extend():');
	$.extend(true, a, b);
	assert('a.movies.adventure === undefined', a.movies.adventure === undefined);  // lost property because it was inherited with __proto__
	assert('a.movies.getMadeIn === undefined', a.movies.getMadeIn === undefined);
	assert('a.movies.action[0] === \'acao\'', a.movies.action[0] === 'acao');

	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////
	console.log('===============================');
	var total_watches_should_run = 6;
	assert('all watches have run', watches === total_watches_should_run);
	assert('should_not_run === 0', should_not_run === 0);
	console.info('ERRORS FOUND:', errors);
	console.warn('I discovered that extending object __proto__ or prototype is such a bad idea. It will break jQuery. John Resig says it in: http://markmail.org/message/tv7vxcir6w3p2h5e and http://stackoverflow.com/questions/1827458/prototyping-object-in-javascript-breaks-jquery');
	console.warn('Previous versions of jQuery did not break like that. Now, try to just change jquery to version 2.1.1 and see a lot of errors. I had to change tests.js file to fit the new jQuery version (from now 3.1.0)');
	

	/////////////////////////////////////////////////////////////////////////////
	//console.log(observerCore.getData());

})(jQuery, ObserverCore);