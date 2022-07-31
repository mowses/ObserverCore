import ObserverCore from './ObserverCore.js';

let start = new Date();
let errors = 0;

function assert(desc, cond) {
    errors += cond !== true;
    console[cond === true ? 'log' : 'error'](desc, cond);
}

let observerCore = new ObserverCore();

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
    movies: [1, 2, 3]
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
observerCore.setData('movies.drama[2].lorem.ipsum', [1, 2, 3, 4, 5]);

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
observerCore.setData('foo', 'foo').apply();
assert('(foo === "foo")', observerCore.getData('foo') === 'foo');
observerCore.setData('foo', null).apply();
assert('(foo === null)', observerCore.getData('foo') === null);
/////////////////////////////////////////////////////////////////////////////
///ASSERT FOR INHERITED PROPERTIES:
let movies = {
    adventure: ['Indy John: The hunters of lost arc']
};
movies.__proto__ = {
    getMadeIn: function () {
        return 'made in HoleWood';
    },
    state: 'Carly Forny'
};
observerCore.setData({
    movies: movies
}).apply();

console.log('\nASSERT FOR INHERITED PROPERTIES: YOU SHOULD NEVER INHERIT PROPERTIES');
assert('(movies.adventure[0] === \'Indy John: The hunters of lost arc\')', observerCore.getData('movies.adventure[0]') === 'Indy John: The hunters of lost arc');  // I have changed ObserverCore to make it bring prototyped properties when using utils.getProp
assert('getData().movies.adventure[0] === \'Indy John: The hunters of lost arc\')', observerCore.getData().movies.adventure[0] === 'Indy John: The hunters of lost arc');
assert('(movies).hasOwnProperty(\'adventure\') === true', observerCore.getData('movies').hasOwnProperty('adventure') === true);
assert('(movies).state === \'Carly Forny\')', observerCore.getData('movies').state === 'Carly Forny');
assert('(movies.state) === \'Carly Forny\'', observerCore.getData('movies.state') === 'Carly Forny');  // now getProp returns __proto__ properties too
assert('(movies.hasOwnProperty(\'state\') === false)', observerCore.getData('movies').hasOwnProperty('state') === false);
assert('(movies.getMadeIn() === \'made in HoleWood\')', observerCore.getData('movies').getMadeIn() === 'made in HoleWood');
assert('(movies.hasOwnProperty(\'getMadeIn\') === false)', observerCore.getData('movies').hasOwnProperty('getMadeIn') === false);

console.log('\nASSERT FOR CHANGES:');
let watches = 0;
let should_not_run = 0;

observerCore
    .watch('movies.adventure[0]', function (data) {
        assert('(watch(\'movies.adventure[0]\') - old value: ' + data.old.movies.adventure[0] + ' new value: ' + data.new.movies.adventure[0], data.diff.movies.adventure[0] === 'The Adventure of Indiana Dog: Hunting for Bones');
        assert('above watch should run once:', (++watches === 1));
    })
    .watch('movies.getMadeIn', function (data) {
        assert('(watch(\'movies.getMadeIn\') - old value: ' + data.old.movies.getMadeIn + ' new value: ' + data.new.movies.getMadeIn, data.new.movies.getMadeIn !== data.old.movies.getMadeIn);
        assert('watch should not run because we set a property from a __proto__ object:', (++should_not_run === 0));
    })
    .watch('movies.state', function (data) {
        assert('(watch(\'movies.state\') - old value: ' + data.old.movies.state + ' new value: ' + data.new.movies.state, data.new.movies.state !== data.old.movies.state);
        assert('watch should not run because we set a property from a __proto__ object:', (++should_not_run === 0));
    })
    .watch('movies.directors.s', function (data) {
        assert('watch should not run because we set a property from a __proto__ object:', (++should_not_run === 0));
    });

let changed_movies = {
    adventure: ['The Adventure of Indiana Dog: Hunting for Bones']
};

changed_movies.__proto__ = {
    getMadeIn: function () {
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

changed_movies.prototype = {
    getMadeIn: function () {
        return 'made in RoleHood';
    },
    state: 'Los Angelitos',
    directors: {
        s: 'Spielber Stevel',
        m: 'Mel Bigson'
    }
};

observerCore.setData('movies', changed_movies).apply();

assert('watches === 1 (changed only movies.adventure[0]) (properties from "prototype" and "__proto__" should not trigger watch)', watches === 1);

observerCore
    .watch('movies.directors.s', function (/*data*/) {
        assert('watch should not run when changed property directly from object property:', (++should_not_run === 0));
    });
changed_movies.directors.s = 'Spencer Stillber';
observerCore.apply();

/////////////////////////////////////////////////////////////////////////////
// WATCHING SAME PROPERTY
// should trigger in the same order it was defined
observerCore.watch('destination', function (data) {
    assert('(watch(\'destination\') - old value === undefined: ', data.old.destination === undefined);
    assert('(watch(\'destination\') - old value: ' + data.old.destination + ' new value: ' + JSON.stringify(data.new.destination) + ': x === 100 && y === 200', data.diff.destination.x === 100 && data.diff.destination.y === 200);
    assert('watching property "destination" (1):', (++watches === 2));
});

observerCore.watch('destination', function (data) {
    assert('(watch(\'destination\') - old value === undefined: ', data.old.destination === undefined);
    assert('(watch(\'destination\') - old value: ' + data.old.destination + ' new value: ' + JSON.stringify(data.new.destination) + ': x === 100 && y === 200', data.diff.destination.x === 100 && data.diff.destination.y === 200);
    assert('watching property "destination" (2):', (++watches === 3));
});

observerCore.setData('destination', {
    x: 100,
    y: 200
}).apply();
/////////////////////////////////////////////////////////////////////////////
assert('watches === 3', watches === 3);
assert('should_not_run === 0', should_not_run === 0);
/////////////////////////////////////////////////////////////////////////////
observerCore
    .watch('somevar0001', function (data) {
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
console.log('\n===============================');
console.log('object inheritance problem: before inherit:');
let a = {
    movies: {
        action: ['acción'],
        adventure: ['aventchura']
    }
};

let b = {
    movies: {
        action: ['ação'],
        terror: ['terrifique'],
    }
};

a.movies.__proto__ = {
    getMadeIn: function () {
        console.log('madein');
    },
    action: ['proto A action'],
    comedy: ['comedy'],
};

b.movies.__proto__ = {
    getAction: function () {
        console.log('action');
    },
    action: ['proto B action'],
    documentary: ['discover it'],
};

console.log('\nproto-A:');
observerCore.setData('protoa', a).apply();
let protoa = observerCore.getData('protoa');
assert('observerCore.getData(\'protoa\').movies.action[0] == \'acción\'', protoa.movies.action[0] == 'acción');
assert('observerCore.getData(\'protoa\').movies.adventure[0] == \'aventchura\'', protoa.movies.adventure[0] == 'aventchura');
assert('observerCore.getData(\'protoa\').movies.getMadeIn === isFunction', ObserverCore.prototype.utils.isFunction(protoa.movies.getMadeIn));
assert('observerCore.getData(\'protoa\').movies.comedy[0] === \'comedy\'', protoa.movies.comedy[0] === 'comedy');

console.log('\nproto-B:');
observerCore.setData('protob', b).apply();
let protob = observerCore.getData('protob');
assert('observerCore.getData(\'protob\').movies.action[0] == \'ação\'', protob.movies.action[0] == 'ação');
assert('observerCore.getData(\'protob\').movies.terror[0] == \'terrifique\'', protob.movies.terror[0] == 'terrifique');
assert('observerCore.getData(\'protob\').movies.getAction === isFunction', ObserverCore.prototype.utils.isFunction(protob.movies.getAction));
assert('observerCore.getData(\'protob\').movies.documentary[0] === \'discover it\'', protob.movies.documentary[0] === 'discover it');

console.log('\nmerging A+B:');
observerCore.extendData('protoa', b).apply();
let protoab = observerCore.getData('protoa');
assert('protoab.movies.action[0] == \'ação\'', protoab.movies.action[0] == 'ação');
assert('protoab.movies.adventure[0] == \'aventchura\'', protoab.movies.adventure[0] == 'aventchura');
assert('protoab.movies.terror[0] == \'terrifique\'', protoab.movies.terror[0] == 'terrifique');
assert('protoab.movies.comedy[0] == \'comedy\'', protoab.movies.comedy[0] == 'comedy');
assert('protoab.movies.documentary[0] == \'discover it\'', protoab.movies.documentary[0] == 'discover it');
assert('protoab.movies.getAction === isFunction', ObserverCore.prototype.utils.isFunction(protoab.movies.getAction));
assert('protoab.movies.getMadeIn === isFunction', ObserverCore.prototype.utils.isFunction(protoab.movies.getMadeIn));
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/// now ObserverCore supports set model data to any object type like new MyConstructor()
console.log('\nSupporting constructor instances values');

function Custom() {
    this.method1 = function () {
        return 'method1 runs';
    }
    this.method2 = function () {
        return 'method2 runs';
    }
    this.property1 = 'property1 value';
    this.property2 = Math.random();
}

observerCore
    .watch('date', function (data) {
        assert('data.diff.date.constructor.name === \'Date\'', data.diff.date.constructor.name === 'Date');
        assert('typeof data.diff.date === \'object\'', typeof data.diff.date === 'object');
        assert('data.diff.date instanceof Date', data.diff.date instanceof Date);
        assert('watch date should run once:', (++watches === 4));
    })
    .watch('custom', function (data) {
        assert('typeof data.diff.custom === \'object\'', typeof data.diff.custom === 'object');
        assert('data.diff.custom.method1() === \'method1 runs\'', data.diff.custom.method1() === 'method1 runs');
        assert('data.diff.custom.method2() === \'method2 runs\'', data.diff.custom.method2() === 'method2 runs');
        assert('data.diff.custom.property1 === \'property1 value\'', data.diff.custom.property1 === 'property1 value');
        assert('ObserverCore.utils.getProp(data, \'diff.custom.property1\') === \'property1 value\'', ObserverCore.prototype.utils.getProp(data, 'diff.custom.property1') === 'property1 value');
        assert('watch custom should run once:', (++watches === 5));
    })
    .watch('math', function (data) {
        assert('data.diff.math.constructor.name === \'Object\'', data.diff.math.constructor.name === 'Object');
        assert('typeof data.diff.math === \'object\'', typeof data.diff.math === 'object');
        assert('data.diff.math instanceof Object', data.diff.math instanceof Object);
        assert('watch math should run once:', (++watches === 6));
    });

// https://api.jquery.com/jquery.extend/
// Properties that are an object constructed via new MyCustomObject(args),
// or built-in JavaScript types such as Date or RegExp, are not re-constructed
// and will appear as plain Objects in the resulting object or array.
observerCore.extendData({
    date: new Date(),
    custom: new Custom(),
    custom2: new Custom(),
    math: Math
}).apply();

observerCore.watch('custom2', function (data) {
    assert('data.diff.custom2.constructor.name === \'Object\'', data.diff.custom2.constructor.name === 'Object');
    assert('typeof data.diff.custom2 === \'object\'', typeof data.diff.custom2 === 'object');
    assert('data.diff.custom2 instanceof Object', data.diff.custom2 instanceof Object);
    assert('data.diff.custom2.property1 === undefined', data.diff.custom2.property1 === undefined);
    assert('data.diff.custom2.extended.extendedProperty === \'extended property using extendData\'', data.diff.custom2.extended.extendedProperty === 'extended property using extendData');

    assert('above watch should run once:', (++watches === 7));
});
observerCore.extendData('custom2.extended', {
    extendedProperty: 'extended property using extendData'
}).apply();

/////////////////////////////////////////////////////////////////////////////
console.log('\n===============================');
console.warn('I discovered that extending object __proto__ or prototype is such a bad idea. It will break jQuery. John Resig says it in: http://markmail.org/message/tv7vxcir6w3p2h5e and http://stackoverflow.com/questions/1827458/prototyping-object-in-javascript-breaks-jquery');

let total_watches_should_run = 7;
assert(`${total_watches_should_run} watches have run:`, watches === total_watches_should_run);
assert('should_not_run === 0', should_not_run === 0);
console.info('ERRORS FOUND:', errors);
console.log('Time taken:', new Date().getTime() - start.getTime(), 'ms');

/////////////////////////////////////////////////////////////////////////////
//console.log(observerCore.getData());