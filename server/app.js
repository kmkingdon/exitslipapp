const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const app = module.exports = express();
const port = parseInt(process.env.PORT || 3000);
const queries = require("./queries");
const session = require('express-session');
const FileStore = require('session-file-store')(session)


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'combined'));
app.use(cors({ origin: true }));
app.use(session({
    secret: 'bquyqueajhbdsdasdsadasr323245',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
    store: new FileStore({ path: '/tmp/sessions' })
}));

// Optional Static file handler:
// app.use('/', express.static('./build'))

const CLIENT_ID = "513094620427-rirnegsip3qjnfbl0cdk6fpk7vn2l7n3.apps.googleusercontent.com";

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

app.post("/verify", (request, response, next) => {
    let token = request.body.token;
 
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  
        });
        const payload = ticket.getPayload();

        queries.login(payload.sub).then(user => { 
         if(user === undefined){    
             let user = {
                 'googleId': payload.sub,
                 'email': payload.email,
                 'name': payload.name,
                 'picture': payload.picture
             };
                queries.create('users', user).then(user => {
                    request.session.user = user;
                    response.json({ user });
                })
        } else {
            let userObject = JSON.parse(JSON.stringify(user))
            request.session.userid = userObject.id;
            console.log(request.session)
            response.json({user});
         }
      })
    }
    verify().catch(console.error);
});


app.get("/", (request, response) => {
    console.log('Session does not exhist')
    console.log(request.session)
    if (request.session && request.session.user) {
        console.log("Session exhists!!!")
        console.log(request.session.user)
        // queries.read('lessonplans', request.params.id).then(plans => {
        //     plans
        //         ? response.json({ plans })
        //         : response.sendStatus(404)
        // }).catch(console.error);
    } 
});

app.post("/lessonplans", (request, response) => {
    queries.create('lesson_plans', request.body).then(plans => {
        response.json({ plans });
    }).catch(console.error);
});

app.put("/lessonplans/:id", (request, response) => {
    queries.update('lesson_plans', request.params.id, request.body).then(plans => {
        response.json({ plans });
    }).catch(console.error);
});

app.delete("/lessontemplates/:id", (request, response) => {
    queries.delete('lesson_templates', request.params.id).then(() => {
        response.sendStatus(204);
    }).catch(console.error);
});






// These 2 `app.use` MUST be last `.use`'s
app.use(notFound)
app.use(errorHandler)




function notFound(req, res, next) {
    const url = req.originalUrl
    if (!/favicon\.ico$/.test(url) && !/robots\.txt$/.test(url)) {
        // Don't log less important (automatic) browser requests
        console.error('[404: Requested file not found] ', url)
    }
    res.status(404).send({ error: 'Url not found', status: 404, url })
}

function errorHandler(err, req, res, next) {
    console.error('ERROR', err)
    const stack = process.env.NODE_ENV !== 'production' ? err.stack : undefined
    res.status(500).send({ error: err.message, stack, url: req.originalUrl })
}

app.listen(port)
    .on('error', console.error.bind(console))
    .on('listening', console.log.bind(console, 'Listening on ' + port));