Hunting Bluebirds (...or bird ghosts?)
======================================

Note: Going to: Detective story - tools for the hunter



whoami
======

[Fredrik Liljegren](https://fredrik.liljegren.org/)
[@fiddur](https://twitter.com/fiddur)

[![auth0logo](https://cdn.auth0.com/styleguide/latest/lib/logos/img/badge.png) Auth0](https://auth0.com/)

Note: NodeJs is garbage collected - saw tooth



![Memory normal](memoryLeak/memory-1-normal.png)



![Leaking](./memoryLeak/memory-2-leaking.png)



![Node 8.8](./memoryLeak/memory-3-node88.png)



Let's code...
-------------

Note:

* 1.js - try, dump, compare, gc, compare, dump, dump, compare
* 2.js - ...  process.stdout.write  \n
* 3.js
* 4.js

* Down hosts - timeout of 228 seconds: login0.myauth0.com:9229

* Heapdump



In conclusion
-------------

* `chrome://inspect`
* Get a baseline (do 100 req) <!-- .element: class="fragment" data-fragment-index="1" -->
* Collect garbage             <!-- .element: class="fragment" data-fragment-index="2" -->
* Produce volume              <!-- .element: class="fragment" data-fragment-index="3" -->
* Beware of sensor echoes (use heapdump)  <!-- .element: class="fragment" data-fragment-index="4" -->

Happy hunting
