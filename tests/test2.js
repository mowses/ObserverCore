import ObserverCore from '../ObserverCore.js';

let start = new Date();
let errors = 0;
let watches = {
    'friends': 0,
    'add:friends': 0,
    'delete:friends': 0,
    'change:friends': 0,
    'change:friends.1.type': 0,
};

function assert(desc, cond) {
    errors += cond !== true;
    console[cond === true ? 'log' : 'error'](desc, cond);
}

console.clear();
console.log('###################### TEST2.JS ######################');
/////////////////////////////////////////////////////////////////////////////
const person = new ObserverCore();

person
    .watch('friends', data => {
        watches['friends']++;
    })
    .watch('add:friends', data => {
        watches['add:friends']++;
    })
    .watch('delete:friends', data => {
        watches['delete:friends']++;
    })
    .watch('change:friends', data => {
        watches['change:friends']++;
    })
    .watch('change:friends.1.type', data => {
        watches['change:friends.1.type']++;
    });

// example of setting initial data
person.setData({
    name: 'Earl Hickey',
    birthday: new Date('1970-04-25'),
    friends: [
        {name: 'Randy Hickey', type: 'brother'},
        {name: 'Joy', type: 'wife'},
    ],
}).apply();

// example of replacing a string
person.setData('name', 'Earl Jehoshaphat Hickey').apply();

// example of replacing an array item with updated data
person.setData('friends.1', {
    name: 'Joy Turner',
    type: 'ex-wife',
});

// example of setting a deep property even if it does not exist yet
person.setData('apparitions.seasons.season 1', [
    'Pilot',
    'Quit Smoking',
    'Randy\'s Touchdown',
    'Faked My Own Death',
    'Teacher Earl',
    'Broke Joy\'s Fancy Figurine',
    'Stole Beer from a Golfer',
    'Joy\'s Wedding',
    'Cost Dad the Election',
    'White Lie Christmas',
    'Barn Burner',
    'O Karma, Where Art Thou?',
    'Stole P\'s HD Cart',
    'Monkeys in Space',
    'Something to Live For',
    'The Professor',
    'Didn\'t Pay Taxes',
    'Dad\'s Car',
    'Y2K',
    'Boogeyman',
    'The Bounty Hunter',
    'Stole a Badge',
    'BB',
    'Number One',
]).apply();

person.extendData({
    friends: [
        {name: 'Randall "Randy" Dew Hickey'},  // will replace name from friends array at index 0
        undefined,  // wont touch at friend array item at index 1
        {name: 'Lorraine Mariano', type: 'second ex-wife'},  // will add this item to friend list
    ]
}).apply();

person.extendData('apparitions.seasons.season 2', [
    'Very Bad Things',
    'Jump for Joy',
    'Sticks & Stones',
    'Larceny of a Kitty Cat',
    'Van Hickey',
    'Made a Lady Think I Was God',
    'Mailbox',
    'Robbed a Stoner Blind',
    'Born a Gamblin\' Man',
    'South of the Border, Part Uno',
    'South of the Border, Part Dos',
    'Our \'Cops\' Is On',
    'Buried Treasure',
    'Kept a Guy Locked in a Truck',
    'Foreign Exchange Student',
    'Blow',
    'The Birthday Party',
    'Guess Who\'s Coming Out of Joy',
    'Harassed a Reporter',
    'Two Balls, Two Strikes',
    'G.E.D.',
    'Get a Real Job',
    'The Trial',
]).apply();

/////////////////////////////////////////////////////////////////////////////
console.log('\nASSERT FINAL DATA:');
const final = person.getData();

assert('person.name === Earl Jehoshaphat Hickey', final.name === 'Earl Jehoshaphat Hickey');
assert('person.friends.length === 3', final.friends.length === 3);
assert('person.friends[0].name === Randall "Randy" Dew Hickey', final.friends[0].name === 'Randall "Randy" Dew Hickey');
assert('person.friends[1].name === Joy Turner', final.friends[1].name === 'Joy Turner');
assert('person.friends[1].type === ex-wife', final.friends[1].type === 'ex-wife');
assert('person.friends[2].name === Lorraine Mariano', final.friends[2].name === 'Lorraine Mariano');
assert('person.friends[2].type === second ex-wife', final.friends[2].type === 'second ex-wife');
assert('person.apparitions.seasons.[season 1].length === 24', final.apparitions.seasons['season 1'].length === 24);
assert('person.apparitions.seasons.[season 2].length === 23', final.apparitions.seasons['season 2'].length === 23);

assert('watches[friends] === 3', watches['friends'] === 3);
assert('watches[add:friends] === 2', watches['add:friends'] === 2);
assert('watches[delete:friends] === 0', watches['delete:friends'] === 0);
assert('watches[change:friends] === 2', watches['change:friends'] === 2);
assert('watches[change:friends.1.type] === 1', watches['change:friends.1.type'] === 1);
/////////////////////////////////////////////////////////////////////////////
console.log('\n===============================');
console.info('ERRORS FOUND:', errors);
console.log('Time taken:', new Date().getTime() - start.getTime(), 'ms');
