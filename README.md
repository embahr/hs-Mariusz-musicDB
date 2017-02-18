## Simple Music Recommendations!

A simplistic recommendation engine for a social music player system. It takes note of what music a user has listened to, which people they follow (and music they have listened to) and from there recommends some songs which are new to the user.


Built on **Node.js** with **Express.js**. The database was created in  **MongoDB**, and connected using **Mongoose**.


## Installation

In terminal, navigate to project directory.

To install dependencies from package.json:

```bash
$ npm install
```


Start the server:

```bash
$ node app
```


### The following end points are available


##### `GET /music`
Returns JSON with entire music collection.


##### `GET /users`
Returns JSON with all current users, the music they have listened to, and who they follow.


##### `POST /follow`
Add one follow relationship

the request body has 2 params:
- from: \<user ID\>
- to: \<user ID\>

> Example use: {"from": "a", "to": "e"}


##### `GET /listen/:user`
Returns JSON with a specific user's listens.

> Example use: /listen/a


##### `POST /listen`
Add one song as the user has just listened.

the request body has 2 params:
- user: \<user ID\>
- music: \<music ID\>

> Example use: {"user": "c", "music": "m3"}


##### `GET /recommendations`
Returns 5 music recommendations to current user.

Query string has:
- user: \<user ID\>

> Example use: /recommendations?user=a


The response is formatted as follows:

```json
{
  "list": ["<music ID>", "<music ID>", "<music ID>", "<music ID>", "<music ID>"]
}
```
