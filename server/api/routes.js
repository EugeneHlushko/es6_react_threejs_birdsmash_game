import { users } from './data.json';
import nosql from 'nosql';
import debug from 'debug';

// TODO: boilerplate function example remove later
const simplifyUsers = (collection) => collection
  .map(({ user, seed }) => ({ ...user, seed }))
  .map(({ email, name, seed, picture }) => ({ email, name, seed, picture }));

export default function (router) {
  // shows all highscores
  // TODO: sort top 10
  router.get('/highscores',
    async function (ctx) {
      let promise = await new Promise((resolve, reject) => {
        const db = nosql.load('./database/highscore.nosql');
        db.all((err, results) => {
          if ( err ) {
            reject(err);
          } else {
            debug('dev')('selected guys are', results);
            resolve(results);
          }
        });
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
