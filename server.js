const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const { nanoid } = require('nanoid');

const app = new Koa();

app.use(cors());
app.use(koaBody({json: true}));

const notes = [];

const router = new Router();

router.get('/notes', async (ctx, next) => {
  ctx.response.body = notes;
});

router.post('/notes', async (ctx, next) => {
  notes.push({ ...ctx.request.body, id: nanoid() });
  ctx.response.body = notes;
});

router.delete('/notes/:id', async(ctx, next) => {
  const noteId = ctx.params.id;
  const index = notes.findIndex(o => o.id === noteId);
  if (index !== -1) {
    notes.splice(index, 1);
  }
  ctx.response.body = notes;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7777;
const server = http.createServer(app.callback());
server.listen(port, () => console.log('server started'));
