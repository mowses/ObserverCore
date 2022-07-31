What is ObserverCore?
--------------------------------------
ObserverCore watches javascript object property and value changes. You can bind and trigger custom events to any object change.


Dependencies
--------------------------------------
It depends on "@mowses/Events" and "@mowses/ObjDiff".


Installation
--------------------------------------
```sh
npm i https://github.com/mowses/ObserverCore
```


Usage
----------------------------

```javascript
import ObserverCore from '@mowses/observercore';

const person = new ObserverCore();
```

Setting, extending, getting and applying data:
----------------------------
There are some methods you can use to work with object data:

- **setData([property,] data)**: Use this method to set or replace data from your object. This method uses a shallow copy from the passed *data* to your current object. The first parameter may be a string containing the property path you want to set the data. The second parameter is the data itself. You may omit the *property* to set the whole object with *data*.

```javascript
// example of setting initial data
person.setData({
    name: 'Earl Hickey',
    birthday: new Date('1970-04-25'),
    friends: [
        {name: 'Randy Hickey', type: 'brother'},
        {name: 'Joy', type: 'wife'},
    ],
});

// example of replacing a string
person.setData('name', 'Earl Jehoshaphat Hickey');

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
]);
```

- **extendData([property,] data)**: It works almost the same as *setData*. The difference is that *extendData* uses a deep copy.

```javascript
person.extendData({
    friends: [
        {name: 'Randall "Randy" Dew Hickey'},  // will replace name from friends array at index 0
        undefined,  // wont touch at friend array item at index 1
        {name: 'Lorraine Mariano', type: 'second ex-wife'},  // will add this item to friend list
    ]
});

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
]);
```

- **apply()**: apply the data to the current object and trigger any watches. Internally, this method is scheduled once every time a piece of data is changed. You may call this method manually to dispatch any watches and retrieve the final data state from your object. You only need to call this method if you need to retrieve the updated state data of your object.
- **getData([property])**: retrieve the applied data from the object, optionally using the *property*. 
- **restoreData()**: Let's suppose you want to discard the modifications you did to your data object between the last `apply()`. Calling `restoreData()` will immediately discard any data that was not applied yet.
- **watch([property,] callback)**: Watch for property changes in your data object and dispatches callback when it happens. The first parameter may be a string, an array or a callback. The callback will receive a parameter `data` which contains the following properties:
    - old: The previous data the object held.
    - new: The current data for the object.
    - diff: The difference between old and new values.
    - deleted: The deleted data.

> Note: The callback's data properties old, new, diff and deleted are relative to the root of your object.

You can also watch for data only when a specific action occurs: `add`, `change` or `delete`. Just prefix the property with the action followed by `:`. Example: `add:friends`, `change:friends`, `delete:friends`.

```javascript
person
    .watch('friends', data => {
        console.log('Something happened to our friends');
    })
    .watch('add:friends', data => {
        console.log('I have a new friend');
    })
    .watch('delete:friends', data => {
        console.log('I lost a friend');
    })
    .watch('change:friends', data => {
        console.log('I changed a friend data');
    })
    .watch('friends.1.type', data => {
      console.log(`A friend of mine is no more my ${data.old.friends[1].type}. Now it's my ${data.new.friends[1].type}`);
    });
```

> Currently, we don't support watching properties using wildcards. 

Tests
--------------------------------------
```sh
npm run test
```