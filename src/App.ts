import * as express from 'express';
import * as http from 'http';

const app:any = express();
app.server = new http.Server(app);

export default app;