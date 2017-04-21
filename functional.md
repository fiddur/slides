[Functional & Dysfunctional Coding](https://www.meetup.com/Software-Craftsmanship-Goteborg/events/235569168/)

* 18:20 <sup>20+10</sup>  Intro to FP in JS
* 18:50 <sup>20+10</sup>  Dysfunctional coding
* 19:20 <sup>20</sup>     Examples and experiences from other languages
  * Ruby - Amber Wilkie
  * PHP - Samuel Ytterbrink
* 19:40 <sup>20</sup>     Refactoring and discussions
  * Why should we do this (rather than go fully functional in e.g. Haskell)?



A tale about Passports
======================


```javascript
function MyStrategy(verify) {
  this._verify = verify
}
util.inherits(MyStrategy, passport.Strategy)

MyStrategy.prototype.authenticate = function(req, options) {
  this._verify(
    req.body.username, req.body.password, (err, user) => {
      if (err)     return this.error(err)
      if (profile) return this.success(user)
      else         this.fail()
    }
  )
}
```

Note: Ok? Must be from inheritance...


passport.Strategy
-----------------

```javascript
function Strategy() {
}

Strategy.prototype.authenticate = (req, options) => {
  throw new Error('Strategy#authenticate must be...')
};
```
Note: runtime equivalent of abstract method


![Nothing](functional/empty.jpg)

Note: digging around...


```bash
passport.js (main module)
└─ lib
   └─ middleware
      └─ authenticate.js L191
```

```javascript
// ----- BEGIN STRATEGY AUGMENTATION -----
// Augment the new strategy instance with action functions.
strategy.success = function(user, info) {
  ...
```

Note: finally see the function fingerprint


![Three arms](functional/threearms.jpg)

Note:
Child of nothing, surgically given extra arms.



whoami
======

[Fredrik Liljegren](https://fredrik.liljegren.org/)
[@fiddur](https://twitter.com/fiddur)

[![auth0logo](https://cdn.auth0.com/styleguide/latest/lib/logos/img/badge.png) Auth0](https://auth0.com/)

Note:
I'm here to ask you NOT alter my instances!
Meetup sponsored by Auth0.
Please interrupt me with any questions.
NOT here to do a JS ad...



FP in JS
========

Note:
FP is declarative, like SQL
Like spreadsheets.  Excel probably most used FP language.
FP as opposed to imperative, not to OOP.

* First-class and higher-order functions
* Pure functions
* Recursion
* Immutable data.

Lazy evaluation, no strict types.


First-class and higher-order functions
--------------------------------------

Note:
Functions as variables.
Pass to other functions.
Returned from functions.
As tools!


```javascript
function myFun(arg) {
  // "this" is locally bound...
  return myReturnValue
}

const myFun2 = arg => myReturnValue

const myFun3 = (arg1, arg2) => returnValue

const myFun4 = arg => {
  more stuff
}
```


All JS functions are Closures
-----------------------------

```
function getRandomFunction(number) {
  const myClosureRandomFunction = () => number
  return myClosureRandomFunction
}

const randomNines  = getRandomFunction(9)
const randomEights = getRandomFunction(8)

console.log(randomNines())  // 9
console.log(randomEights()) // 8
```

Note:
Captures surrounding state.


Currying
--------

```javascript
const add = a => b => a + b
const addTwo = add(2)
console.log(addTwo(3)) // 5
```


More useful for...

```javascript
const getUserData = serverUri => async userId => {
  const data = await request({
    uri:  `${serverUri}/users/${userId}`,
    json: true,
  })
  return Immutable.fromJS(data)
}
```


Pure functions
--------------

 * Given the same input, will always return the same output.
 * Produces no side effects.
 * Relies on no external mutable state.

Note:
Event sourcing is functional storage.

Decoupling emit and handle.

Messaging - sending pure data

Actor model and message passing

Factory methods, dependency injection, or just-a-function...


```javascript
const add = (a, b) => a + b

const greeting = name => `Hello ${name}!`
```

Note:
Meaningless without return value.
Fully memoizable / cacheable


### ...meanwhile, in the real world...

```javascript
const greetingHeader = name => element(
  'h1', { class: 'greeting' }, greeting(name)
)

const welcomePage = { name, menuOptions } => element(
  'body', {}, [
    greetingHeader(name),
    myNiceMenu(menuOptions),
  ]
)

// And somewhere out there, some side effectful shit
render(welcomePage(userState), bodyElement)
```

Note: Preact style frontend


### map

Transform a collection...

```javascript
const myList = ['foo', 'bar']
const myUpperList = myList.map(
  value => value.toUpperCase()
)
console.log(myUpperList) // ['FOO', 'BAR']
```


### filter

```
const myList = [9, 5, 2, 9, 8]
const pureList = myList.filter(
  value => value === 9
)
console.log(pureList) // [9, 9]
```


### reduce

```javascript
const myList = ['foo', 'bar']
const listAsText = myList.reduce(
  (text, value) => `${text}\nRow ${index}: ${value}`,
  ''
)
console.log(listAsText)
// Row 0: foo
// Row 1: bar
```


```
const myList = [9, 5, 2, 9, 8]
const nineThirdsMultiplied = myList
  .filter(value => value === 9)                   // [9, 9]
  .map(value => value / 3)                        // [3, 3]
  .reduce((product, value) => product * value, 1) // 9
```


### tail recursion

```
const n = 1000000000
const ð = 1.0 / n
const startTime = Date.now()

const addΔ = (left, Σ) => {
  if (left === 0) return Σ
  const x = (left - 0.5) * ð
  return addΔ(left - 1, Σ + (1.0 / (1.0 + x * x)))
}
const π = 4 * ð * addΔ(n, 0)
const elapseTime = (Date.now() - startTime) / 1e3
console.log('pi_sequential', π, n, elapseTime)
```

Note: Only in harmony


### forEach

Perform something (sideeffectful)
```javascript
const myList = ['foo', 'bar']
myList.forEach(
  value => launchRocket(value)
)
```

Note: Don't use `map` for side effects.



Dysfunctional coding
====================


### Mutating variables

Note: When you don't really need it...


![Three arms](functional/threearms.jpg)


![Tools](functional/drill.png)


```javascript
MyStrategy.prototype.authenticate = function(
  req, options, { error, fail, success }
) {
  this._verify(
    req.body.username, req.body.password, (err, user) => {
      if (err)     return error(err)
      if (profile) return success(user)
      else         fail()
    }
  )
}
```


Mutatable properties

```javascript
const myObj = {
  foo: 'bar',
  baz: 'qux',
}

myObj.foo = 'Hello!'
```


Using mutating core methods

```javascript
const myList = ['foo', 'bar']
myList.push('baz')
// mylist === ['foo', 'bar', 'baz']
```

Note: If a deep function does this...  Hard to test, follow, read.


```javascript
const myList  = ['foo', 'bar']
const newList = [...myList, 'baz'] // ['foo', 'bar', 'baz']
```

Note: Make new array instead


Or use Immutable.js
...an object oriented functional library...

```javascript
const myList = Immutable.List(['foo', 'bar'])
const newList = myList.push('baz')

const myMap = Immutable.Map({ 
  foo: 'bar',
  baz: 'qux',
}
const newMap = myMap.set('foo', 'Hello!')
```

Note:
Optimizations for lots of mutations.
Perhaps you think you don't want that for a User model?
If we can do it with program libraries, we can do it with users:  Any change == new version!


Mutating arguments

```javascript
const loginUser = async (user, password) => {
  if (await bcrypt.compare(myPlaintextPassword, hash)) {
    user.authenticated = true
  } else {
    throw new Error('Bad password')
  }
}
```


With eslint `no-param-reassign`

```javascript
    user.authenticated = true

//  --> Assignment to property of function parameter 'user'.
//  --> [no-param-reassign]

```

Note:
eslint almost makes javascript into a real programming language.


### Having side effects in unexpected places

```javascript
User.prototype.setEmail = function(email) {
  const oldEmail = this.email
  this.email     = email
  sendUpdatedEmailNotification(user, oldEmail)
}
```

Note: Logging is ok, imho


```javascript
function setEmail(user, email) {
  const newUser = Object.assign({}, user, { email: 'new@mail' })
  // ...
}

setEmail(user, 'new@mail')
sendUpdatedEmailNotification(user, oldEmail)
```


### Mutating state deep down

```javascript
Users.prototype.setName = function setName(name) {
  this.name = name
  await db.collection('users').findOneAndUpdate(
    { id: this.id },
    { $set: { name } }
  )
}
```

Note: Though, the caller would probably expect it...


Can it be decoupled?

```javascript
/// In Users module
const getState = events => events.reduce(applyEvent, {})

Users.actions.setName = eventStore => (userId, name, version) {
  const state = getState(
    eventStore.getAllUntil(userId, version)
  )
  if (!state.id) {
    throw new Error('User must exist to change name.')
  }

  const event = { event: 'nameChange', name }
  return [event]
}
```


```javascript
/// In some app setups
const setName = Users.actions.setName(eventStore)

/// In some PUT-handler
try {
  const user = Users.getById(req.params.id)
  const events = setName(user.id, 'My New Name', user.version)
  await eventStore.emit(user.id, events, user.version)
} catch (err) {
  if (err.code === 'bad_version') {
    res.set({ETag: err.actualVersion}).sendStatus(preconditionFailed)
  }
  throw err
}
```


```javascript
/// In Some Users projection
eventStore
  .filter(event => event.type === 'users')
  .forEach(
    event => db.collection('users').findOneAndUpdate(
      { id: event.stream },
      { $set: { name } }
    )
```


### Fetching app state from deep functions


### Mixing queries, commands and side effects

Note:
Unnecessary inheritance instead of composition

Mutating state on queries (CQS)


Refactoring examples
====================

Note:

Really hard time to find something with a reasonable complexity that isn't
huge.

Also hard time to not go into EventSourcing too much.

Transforming an app to functional...

Begin refactoring in the deep end.

Going functional == good practices TDD, like "Don't look for things"

One step at a time.

Mixing OO libs with functional approach...  amqplib


The Why
=======

Note:
Understandable
Readable
Testable
Modifyable
Extendable

TODO

* Förbered videokamera
  * Hållare!
  * Upplösning?
* Screenrecorder - upplösning filstorlek
* Namnbrickor?
* Engångstallrikar
