# Guide — Setup & mental model

> Draft outline. Each section is a gap to fill.

## 1. How the web works: the client–server pattern

Almost everything you build in this course is two programs talking over a network:

- the **client** asks for something: a browser, a mobile app, a script, your coding agent;
- the **server** answers: a computer that is always on, waiting for requests.

```text
  CLIENT                                   SERVER
  (browser)   ── request:  GET /index.html ──►   (GitHub Pages)
              ◄── response: 200 OK + HTML  ──
```

The client always starts. The server never calls you first; it only answers what it is asked.
(Chapter 08 shows the ways around that: SSE, WebSockets, webhooks.)

### From a URL to a page

1. **URL.** You type `https://pokeapi.co/api/v2/pokemon/pikachu`: protocol, host name, path.
2. **DNS.** The host name `pokeapi.co` is turned into the server's IP address, like a phone book.
3. **HTTP request.** The browser connects (encrypted, because of `https`) and sends a request.
4. **HTTP response.** The server sends back a status code, headers and a body (HTML, CSS, JS, JSON, images).
5. **Render.** For HTML, the browser builds the page, then sends *more* requests for every CSS file, script and image it references.

### A request is just text

```http
GET /api/v2/pokemon/pikachu HTTP/1.1
Host: pokeapi.co
Accept: application/json
```

```http
HTTP/1.1 200 OK
Content-Type: application/json

{ "name": "pikachu", "id": 25, ... }
```

| Part | What it says | Examples |
|---|---|---|
| Method | What you want to do | `GET` read · `POST` create · `PUT`/`PATCH` change · `DELETE` remove |
| Path | Which resource | `/pokemon/25`, `/index.html` |
| Headers | Extra information | `Content-Type`, `Authorization`, `Cache-Control` |
| Status | How it went | `200` OK · `301` moved · `404` not found · `401` not allowed · `500` server error |

### Who does what

| Client | Server |
|---|---|
| Shows the interface and reacts to the user | Stores the data and the files |
| Runs HTML, CSS and JavaScript | Runs the rules: who can see or change what |
| Anyone can read and change it: **never trust it** | Keeps the secrets: API keys, passwords, tokens |
| One per user | Serves many clients at once |

The rule that follows you through the whole course: **anything sent to the client is public.** An API key in
your JavaScript is a leaked key. That is why chapter 07 puts AI calls behind your own small server.

### The same pattern, all course long

| Chapter | Client | Server |
|---|---|---|
| 01 Web fundamentals | Your browser | GitHub Pages (static files) and PokéAPI (JSON) |
| 02 Agentic IDEs | Your IDE or agent CLI | The model provider (Anthropic, OpenAI, Google…) |
| 06 Data | Your web app | An API and a database (Supabase) |
| 07 AI in the product | Your web app → your server | The model provider |
| 08 Realtime | Browser and game agent | The Agent Wars server |

### Try it

- Open DevTools → **Network**, reload any site and click a request: method, status, headers, response.
- From the terminal: `curl -i https://pokeapi.co/api/v2/pokemon/pikachu` prints the raw response.
- Ask your agent: *"explain every request this page makes when it loads"*, then check its answer in the Network tab.

## 2. Terminal essentials

_To write._

## 3. Git: init, add, commit, branch, push, pull request

_To write._

## 4. GitHub account, repos, Pages

_To write._

## 5. Installing the course tool (agentic IDE) and the account it needs

_To write._
