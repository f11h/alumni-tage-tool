import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from '@tsed/common';
import "@tsed/typeorm";

@ServerSettings({
    rootDir: __dirname,
    acceptMimes: ['application/json'],
    password: "sss",
    typeorm: [
        {
            name: 'default',
            type: 'mariadb',
            entities: [
                `${__dirname}/model/**/*`
            ],
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT, 10) || 3306,
            username: process.env.DB_USER || 'att',
            password: process.env.DB_PASSWORD || 'att',
            database: process.env.DB_DB || 'att',
            synchronize: true
        }
    ]
})
export class Server extends ServerLoader {

    public $onMountingMiddlewares(): void {
        this
            .use(GlobalAcceptMimesMiddleware)
            .use(require('cookie-parser')())
            .use(require('compression')({}))
            .use(require('body-parser').json())
            .use(require('body-parser').urlencoded({extended: true}));

        return null;
    };
}
