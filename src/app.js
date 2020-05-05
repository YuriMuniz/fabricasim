import express from 'express';
import cors from 'cors';
import routes from './routes';

import './database';

class App {
    constructor() {
        this.server = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(cors());
        this.server.use(
            cors({
                origin:
                    'https://5eb1a979ba678000060445e6--romantic-swanson-d346aa.netlify.app/',
            })
        );
        this.server.use(express.json());
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;
