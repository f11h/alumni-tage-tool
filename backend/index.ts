import {Server} from './server';

new Server().start()
    .then(() => {
        console.log('Server started...');
    }).catch(console.error);
