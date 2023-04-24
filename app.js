// Setup server, session and middleware here.

/*
You will have the following middleware functions:

1. This middleware will apply to the root route / and will do one of the following: If the user is authenticated AND they have a role of admin, the middleware function will redirect them to the /admin route, if the user is authenticated AND they have a role of user, you will redirect them to the /protected route. If the user is NOT authenticated, you will redirect them to the GET /login route.

2. This middleware will only be used for the GET /login route and will do one of the following: If the user is authenticated AND they have a role of admin, the middleware function will redirect them to the /admin route, if the user is authenticated AND they have a role of user, you will redirect them to the /protected route. If the user is NOT authenticated, you will allow them to get through to the GET /login route. A logged in user should never be able to access the login form.

 3. This middleware will only be used for the GET /register route and will do one of the following: If the user is authenticated AND they have a role of admin, the middleware function will redirect them to the /admin route, if the user is authenticated AND they have a role of user, you will redirect them to the /protected route. If the user is NOT authenticated, you will allow them to get through to the GET /register route. A logged in user should never be able to access the registration form.

NOTE: You could do middleware 1,2 and 3 as a single middleware if you like with just more logic to determine the route being accessed and where you need to redirect them. So you can do it as three separate middleware functions or a single one.

4. This middleware will only be used for the GET /protected route and will do one of the following:

If a user is not logged in, you will redirect to the GET /login route.
If the user is logged in, the middleware will "fall through" to the next route calling the next() callback.
Users with both roles admin or user should be able to access the /protected route, so you simply need to make sure they are authenticated in this middleware.
5. This middleware will only be used for the GET /admin route and will do one of the following:

If a user is not logged in, you will redirect to the GET /login route.
If a user is logged in, but they are not an admin user, you will redirect to /error and render a HTML error page saying that the user does not have permission to view the page, and the page must issue an HTTP status code of 403.
If the user is logged in AND the user has a role of admin, the middleware will "fall through" to the next route calling the next() callback.
ONLY USERS WITH A RfOLE of admin SHOULD BE ABLE TO ACCESS THE /admin ROUTE!
6. This middleware will only be used for the GET /logout route and will do one of the following:

1. If a user is not logged in, you will redirect to the GET /login route.

2. if the user is logged in, the middleware will "fall through" to the next route calling the next() callback.

7. Logging Middleware

This middleware will log to your console for every request made to the server, with the following information:

Current Timestamp: new Date().toUTCString()
Request Method: req.method
Request Route: req.originalUrl
Some string/boolean stating if a user is authenticated
There is no precise format you must follow for this. The only requirement is that it logs the data stated above.

An example would be:

[Sun, 14 Apr 2019 23:56:06 GMT]: GET / (Non-Authenticated User)
[Sun, 14 Apr 2019 23:56:14 GMT]: POST /login (Non-Authenticated User)
[Sun, 14 Apr 2019 23:56:19 GMT]: GET /protected (Authenticated User)
[Sun, 14 Apr 2019 23:56:44 GMT]: GET / (Authenticated User)


*/

import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import * as postData from "./data/users.js";
//lets drop the database each time this is run

/*
const db = await dbConnection();
await db.dropDatabase();


try {
    let first_band = await postData.createUser("Patrick","Hill","phill@stevens.edu","Hanlon@1234","admin");
    console.log('The new band has been added.');
    console.log(await first_band);
    first = first_band
  } catch (e) {
    console.log(e);
  }

  try {
    let second_user = await postData.createUser("Aiden","Hill","aidenhill@gmail.com","Hanlon@1234","user");
    console.log('The new band has been added.');
    console.log(await first_band);
    first = first_band
  } catch (e) {
    console.log(e);
  }

  try {
    let check = await postData.checkUser("aidenhill@gmail.com","Hanlon@1234");
    console.log('check = ',check);
  } catch (e) {
    console.log(e);
  }
  await closeConnection();
  console.log('Done');
  */
/*import express from "express";
  import {fileURLToPath} from 'url';
  import {dirname} from 'path';
  import exphbs from 'express-handlebars';


*/

import express from "express";
const app = express();
import session from "express-session";
import configRoutes from "./routes/index.js";
import exphbs from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "./public");

app.use(express.static(publicDir));
app.use(express.json());
app.use(express.urlencoded({ extended: "false" }));

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: false,
  })
);

/*
app.use((req, res, next) => {
  // Log the timestamp, request method, and request route
  console.log(`[${new Date().toUTCString()}] ${req.method} ${req.originalUrl}`);

  // Check if a user is authenticated and log accordingly
  if (req.session.user) {
    console.log('User is authenticated');
    next();
  } else {
    console.log('User is not authenticated');
    console.log("calling login")
    return res.redirect('/login');

    //next();
    console.log("after calling next")


  }

  // Call the next middleware/route
});
*/

// // first middleware
// app.use('/', (req, res, next) => {
//   if (req.session && req.session.user) {
//     // Check user role
//     if (req.session.user.role === 'admin') {
//       // Redirect to admin route
//       res.redirect('/admin');
//     } else if (req.session.user.role === 'user') {
//       // Redirect to protected route
//       res.redirect('/protected');
//     }
//   } else {
//     // User is not authenticated, redirect to login route
//     console.log("redirecting")
//     return res.redirect('/login');
//   }
// });

// // second middleware
// app.use('/login', (req, res, next) => {
//   console.log("i am in login route ")

//   if (req.session && req.session.user) {
//     // Check user role
//     if (req.session.user.role === 'admin') {
//       // Redirect to admin route
//       res.redirect('/admin');
//     } else if (req.session.user.role === 'user') {
//       // Redirect to protected route
//       res.redirect('/protected');
//     }
//   } else {
//     // User is not authenticated, redirect to login route
//     console.log("i am hereeeeeeeeeeeeeee")

//     res.render('login');
//   }
//   return res.json({error: 'YOU SHOULD NOT BE HERE!'});
// });

// third middleware
// app.use('/register', (req, res, next) => {
//   if (req.session.user) {
//       // If user is authenticated, redirect to protected route
//       if (req.session.user.role === 'user') {
//         res.redirect('/protected');
//       }
//       // If user is authenticated as admin, redirect to admin route
//       else if (req.session.user.role === 'admin') {
//         res.redirect('/admin');
//       }
//     }
//     else {
//       // If user is not authenticated, render registration form
//       res.redirect('/register');
//     }
// });

// fourth middleware

// app.use('/protected', (req, res, next) => {
//   if (!req.session.user) {
//     // User is not logged in, redirect to the login page
//     return res.redirect('/login');
//   }

//   // User is logged in, check if they have the necessary role
//   const { role } = req.session.user;
//   if (role !== 'admin' && role !== 'user') {
//     // User does not have the necessary role, respond with a 403 Forbidden status
//     return res.status(403).send('Access denied');
//   }

//   // User has the necessary role, continue to the next middleware/route
//   next();
// });

// // 5th middleware
// app.use('/admin', (req, res, next) => {
//   if (!req.session.user) {
//     // User is not logged in, redirect to the login page
//     return res.redirect('/login');
//   }

//   // User is logged in, check if they have the necessary role
//   const { role } = req.session.user;
//   if (role !== 'admin') {
//     // User does not have the necessary role, render an error view with a 403 status
//     return res.status(403).render('error', {title: 'Error', error_displayed: `You do not have permission to view this page`});
//   }

//   // User has the necessary role, continue to the next middleware/route
//   next();
// });

// 6th middleware

/*
app.use('/logout', (req, res, next) => {
  if (!req.session.user) {
    // User is not logged in, redirect to the login page
    return res.redirect('/login');
  }

  // User is logged in, continue to the next middleware/route
  next();
});



/*

app.use('/private', (req, res, next) => {
  console.log(req.session.id);
  if (!req.session.user) {
    return res.redirect('/');
  } else {
    next();
  }
});

app.use('/login', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/private');
  } else {
    //here I',m just manually setting the req.method to post since it's usually coming from a form
    req.method = 'POST';
    next();
  }
});

*/

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
//app.set('view engine', 'handlebars');
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});

/*

  const app = express();
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const static_ = express.static(__dirname + "/public");

  import configRoutes from "./routes/index.js";
import session from 'express-session'

app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: false
}))
//configRoutes(app);


  // Middleware function for redirecting to protected/admin pages
function redirectToPage(req, res, next) {
    // Check if user is authenticated
    if (req.session.user) {
      // Check user role and redirect accordingly
      if (req.session.user.role === 'admin') {
        return res.redirect('/admin');
      } else if (req.session.user.role === 'user') {
        return res.redirect('/protected');
      }
    }

    // If user is not authenticated, redirect to login page
    return res.redirect('/login');
  }

  // Middleware function for preventing logged in user from accessing login page
  function preventLoginAccess(req, res, next) {
    // Check if user is authenticated
    if (req.session.user) {
      // Check user role and redirect accordingly
      if (req.session.user.role === 'admin') {
        return res.redirect('/admin');
      } else if (req.session.user.role === 'user') {
        return res.redirect('/protected');
      }
    }

    // If user is not authenticated, allow access to login page
    return next();
  }

  // Middleware function for preventing logged in user from accessing registration page
  function preventRegisterAccess(req, res, next) {
    // Check if user is authenticated
    if (req.session.user) {
      // Check user role and redirect accordingly
      if (req.session.user.role === 'admin') {
        return res.redirect('/admin');
      } else if (req.session.user.role === 'user') {
        return res.redirect('/protected');
      }
    }

    // If user is not authenticated, allow access to registration page
    return next();
  }

  // Register the middleware functions for their respective routes
  app.get('/', redirectToPage);
  app.get('/login', preventLoginAccess, (req, res) => {
    // Render login page
    res.render('login');
  });
  app.get('/register', preventRegisterAccess, (req, res) => {
    // Render registration page
    res.render('register');
  });

  function loggingMiddleware(req, res, next) {
    // Log current timestamp, request method, and route
    console.log(`[${new Date().toUTCString()}] ${req.method} ${req.originalUrl}`);

    // Check if user is authenticated
    const isAuthenticated = req.session.user ? true : false;

    // Log authentication status
    console.log(`User authenticated: ${isAuthenticated}`);

    // Call next middleware
    next();
  }

  // Register the middleware for all routes
  app.use(loggingMiddleware);

  app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


  configRoutes(app);

  app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
  });

  */
