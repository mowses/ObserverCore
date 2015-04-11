(function($, ObserverCore) {
	function assert(desc, cond) {
		console[cond===true ? 'log': 'error'](desc, cond);
	}

	var observerCore = new ObserverCore();

	console.log('ALL OF THE CONSOLES SHOULD RETURN TRUE TO PASS', observerCore);
	/////////////////////////////////////////////////////////////////////////////
	observerCore.setData(undefined, 'changedname');

	assert('(undefined === \'changedname\')', observerCore.getData(undefined) === 'changedname');
	/////////////////////////////////////////////////////////////////////////////
	observerCore.setData('foialterado');

	assert('( === \'foialterado\')', observerCore.getData() === 'foialterado');
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
	console.log(observerCore.getData());

})(jQuery, ObserverCore);