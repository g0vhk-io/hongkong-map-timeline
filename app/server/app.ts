import * as express from 'express';
import * as helmet from 'helmet';
import * as mobxReact from 'mobx-react';
import * as next from 'next';
import * as path from 'path';

import env from '../lib/env';

mobxReact.useStaticRendering(true);

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const { PRODUCTION_URL_APP } = env;
const ROOT_URL = dev ? `http://localhost:${port}` : PRODUCTION_URL_APP;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // give all Nextjs's request to Nextjs before anything else
  server.get('/_next/*', (req, res) => {
    handle(req, res);
  });

  server.get('/static/*', (req, res) => {
    handle(req, res);
  });

  server.use(helmet());
  server.use(express.json());

  if (!dev) {
    server.set('trust proxy', 1); // sets req.hostname, req.ip
  }

  server.get('/robots.txt', (_, res) => {
    res.sendFile(path.join(__dirname, '../static', 'robots.txt'));
  });

  server.get('/place/:slug/:uuid', (req, res) => {
    return app.render(req, res, '/place', { slug: req.params.slug, uuid: req.params.uuid })
  })

  server.get('*', (req, res) => {
    handle(req, res);
  });

  server.listen(port, err => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on ${ROOT_URL}`);
  });
});
