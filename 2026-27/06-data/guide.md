# Guide — Data

> Draft outline. Each section is a gap to fill.

## 1. APIs, REST and HTTP verbs

Chapter 00 introduced the client–server pattern and what an HTTP request looks like. Here we use it on purpose.

### What an API is

An **API** (application programming interface) is a contract a server offers: *send me this request and I will
answer with that data.* You don't see the server's code, only the contract: which URLs exist, which verbs they
accept, and what the data looks like. PokéAPI is an API; so is Supabase; so is every AI model provider.

A web API has three parts:

- **where**: a URL per resource, e.g. `/pokemon/25`, `/favorites`, `/favorites/7`;
- **what**: an HTTP **verb** (method) that says what to do with it;
- **how**: a data format both sides agree on. Almost always JSON.

### REST: nouns in the URL, verbs in the method

REST is a convention, not a library: the URL names the **thing**, the verb says **what to do** with it.

| Verb | Means | Example | Body | Safe to repeat? |
|---|---|---|---|---|
| `GET` | Read | `GET /favorites`, `GET /favorites/7` | none | yes — changes nothing |
| `POST` | Create | `POST /favorites` | the new item | no — twice makes two |
| `PUT` | Replace the whole item | `PUT /favorites/7` | the full item | yes — same result |
| `PATCH` | Change some fields | `PATCH /favorites/7` | only what changes | usually |
| `DELETE` | Remove | `DELETE /favorites/7` | none | yes — already gone |

These map one-to-one to the four database operations you'll meet next (**CRUD**: create, read, update, delete)
and to SQL's `INSERT`, `SELECT`, `UPDATE`, `DELETE`.

Avoid verbs in URLs: `/getFavorites`, `/deleteFavorite?id=7`. If an agent designs an API like that, ask for REST.

### Status codes: read the first digit

| Range | Meaning | Common ones |
|---|---|---|
| `2xx` | It worked | `200` OK · `201` Created · `204` No Content |
| `3xx` | Look elsewhere | `301` Moved · `304` Not Modified (use your cache) |
| `4xx` | The client got it wrong | `400` Bad Request · `401` Unauthorized (who are you?) · `403` Forbidden (not allowed) · `404` Not Found · `429` Too Many Requests |
| `5xx` | The server got it wrong | `500` Internal Server Error · `503` Service Unavailable |

`fetch` does **not** throw on `404` or `500`; it only throws when the network fails. Always check `res.ok`.

### Calling an API from JavaScript

```js
// Read
const res = await fetch('/api/favorites');
if (!res.ok) throw new Error(`HTTP ${res.status}`);
const favorites = await res.json();

// Create
await fetch('/api/favorites', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ pokemon: 25 }),
});

// Change one field
await fetch('/api/favorites/7', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ note: 'my first' }),
});

// Remove
await fetch('/api/favorites/7', { method: 'DELETE' });
```

From the terminal, `curl` does the same:

```bash
curl -i https://pokeapi.co/api/v2/pokemon/25
curl -i -X POST -H "Content-Type: application/json" -d '{"pokemon":25}' http://localhost:3000/api/favorites
```

### Reading an API with an agent

- Give the agent the API docs or an example response, not just the name. It will invent fields otherwise.
- Ask it to handle the error cases too: `!res.ok`, an empty list, a slow network.
- Verify in the Network tab: method, URL, status and body of every request it wrote.
- Keys stay on the server. If an API needs a secret, the browser calls *your* server, and your server calls the API (chapter 07).

## 2. SQL essentials

_To write._

## 3. NoSQL documents

_To write._

## 4. Supabase client, CRUD, realtime, row-level security

_To write._

## 5. Database MCP: read-only first

_To write._
