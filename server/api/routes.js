import { users } from './data.json';
import nosql from 'nosql';
import debug from 'debug';
import url from 'url'

// TODO: boilerplate function example remove later
const simplifyUsers = (collection) => collection
  .map(({ user, seed }) => ({ ...user, seed }))
  .map(({ email, name, seed, picture }) => ({ email, name, seed, picture }));

export default function (router) {
  // shows all highscores
  router.get('/highscores',
    async function (ctx) {
      let promise = await new Promise((resolve, reject) => {
        const db = nosql.load('./database/highscore.nosql');
        db.all((err, results) => {
          if ( err ) {
            reject(err);
          } else {
            let top10 = results;
            top10.sort((a,b) => { return b.score-a.score });
            top10 = top10.slice(0,10);
            resolve(top10);
          }
        });
      });

      ctx.body = JSON.stringify(promise);
    }
  );

  router.get('/highscores/add',
    async function (ctx) {
      let promise = await new Promise((resolve, reject) => {
        const db = nosql.load('./database/highscore.nosql');
        const _query = url.parse(ctx.request.url, true).query;
        debug('dev')('/highscores/add', _query);
        if ( _query.score > 0 && _query.name.length > 1 ) {
          db.insert({ name: _query.name, score: _query.score });
          resolve({ success: 'Added score' });
        } else {
          resolve({ err: 'failed validation' });
        }
      });

      ctx.body = JSON.stringify(promise);
    }
  );


  // boilerplate stuff, remove later
  router.get('/users', async function (ctx) {
    ctx.body = simplifyUsers(users.slice(0, 10));
  });

  router.get('/users/:seed', async function (ctx) {
    const { seed } = ctx.params;
    const [ result ] = simplifyUsers(users.filter(user => user.seed === seed));

    if (!result) {
      ctx.body = { error: { message: 'User not found' } };
    } else {
      ctx.body = result;
    }
  });
}
