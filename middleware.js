/*
You can choose to define all your middleware functions here, 
export them and then import them into your app.js and attach them that that.
add.use(myMiddleWare()). you can also just define them in the app.js if you like as seen in lecture 10's lecture code example. If you choose to write them in the app.js, you do not have to use this file. 
*/


function requireAuth(req, res, next) {
    if (!req.session.user) { // Check if user is not logged in
      return res.redirect('/login'); // Redirect to login page
    }
    // Check if user is authenticated
    if (req.session.user.role !== 'admin' && req.session.user.role !== 'user') {
      return res.sendStatus(403); // Forbidden
    }
    // User is authenticated, call next middleware
    next();
  }


  function requireAdmin(req, res, next) {
    // Check if user is not logged in
    if (!req.session.user) {
      return res.redirect('/login');
    }
  
    // Check if user is not an admin
    if (req.session.user.role !== 'admin') {
      // Render an error page
      return res.status(403).render('error', { message: 'You do not have permission to view this page.' });
    }
  
    // User is logged in and is an admin, call next middleware
    next();
  }

  function requireLogout(req, res, next) {
    // Check if user is not logged in
    if (!req.session.user) {
      return res.redirect('/login');
    }
  
    // User is logged in, call next middleware
    next();
  }
  