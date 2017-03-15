whoami
======

[Fredrik Liljegren](https://fredrik.liljegren.org/)
[@fiddur](https://twitter.com/fiddur)

[![auth0logo](https://cdn.auth0.com/styleguide/latest/lib/logos/img/badge.png) Auth0](https://auth0.com/)

Note: Conveniently linked…



[Webtask.io](https://webtask.io/)
---------------------------------

* (JS) Function as a Service
* Trigger on HTTP(S) or cron

(by Auth0)



Serverless Apps
---------------

* On Github pages
* …or on lousy hosting
* …or just because it's "serverless"!

Note:
Github pages, SOME sugar

Just a quick example


**Example: [fitbitCadence](https://github.com/fiddur/fitbitCadence)**

A static HTML using three tasks as backend.

```javascript
<a onclick="awaitLogin()" 
   href="https://webtask.it.aut … /authenticateFitbit"
   target="_blank">
  Login…
</a>
```

Implementing fitbit authentication by opening one webtask…


`authenticateFitbit`

Redirect to webtask, authenticate user, get JWT back.

Finishes by rendering a page:
```html
<html><head></head><body><script>
  window.opener.postMessage("${userJwt}", "*")
  window.close()
</script></body></html>
```


`receivePush`

Receives new fitbit entries, stores them in a free cloud mongodb.

```javascript
const app = require('express')()
app.use(require('body-parser').json())
app.post('/', (req, res) => {...})
app.get('/', (req, res) => {...})

module.exports = (context, req, res) => {
  return require('webtask-tools').fromExpress(app)(context, req, res)
}
```

Note: More power with express app.  Simpler today?


`cadence`

```javascript
module.exports = (ctx, done) => {
  // Verify and decode jwt.
  const userData = jwt.verify(
    ctx.query.user, ctx.secrets.JWT_SECRET
  )

  // Fetch runs from storage.
  MongoClient.connect(ctx.secrets.MONGO_URL)
    .then(db => db
            .collection('users')
            .findOne({fitbitId: userData.sub}))
    .then(user => done(null, {runs: user.runsByDate}))
    .catch(err => done(err))
}
```


Let's try it on http://fiddur.github.io/fitbitCadence/

and the [webtask editor](https://webtask.io/edit)

Note: Demo webtask editor



Service extensions
------------------

* Programmable hooks or rules
* Used in [Auth0 authentication](https://manage.auth0.com/#/hooks) to customize
  and enhance user login.

Note: E.g. discount hooks



Slash Webtask
-------------

Note:

For anything, convenience shortcut

Demo `/wt`
