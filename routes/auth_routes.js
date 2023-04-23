//import express, express router as shown in lecture code
import express from 'express';
const router = express.Router();
router.route('/').get(async (req, res) => {
  //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
  console.log("coming here")
  if (req.session && req.session.user) {
    // Check user role
    if (req.session.user.role === 'admin') {
      // Redirect to admin route
      res.redirect('/admin');
    } else if (req.session.user.role === 'user') {
      // Redirect to protected route
      res.redirect('/protected');
    }
  } else {
    // User is not authenticated, redirect to login route
    res.redirect('/login');
  }
  return res.json({error: 'YOU SHOULD NOT BE HERE!'});
});

router
  .route('/register')
  .get(async (req, res) => {
    //code here for GET
    
  })
  .post(async (req, res) => {
    //code here for POST
    const { firstNameInput, lastNameInput, emailAddressInput, passwordInput, confirmPasswordInput, roleInput } = req.body;

  // Check that all required fields are present
  if (!firstNameInput || !lastNameInput || !emailAddressInput || !passwordInput || !confirmPasswordInput || !roleInput) {
    return res.status(400).render('signup', { error: 'Please fill out all fields.' });
  }

  // Check that firstNameInput is a valid string
  if (!/^[a-zA-Z]+$/.test(firstNameInput) || firstNameInput.length < 2 || firstNameInput.length > 25) {
    return res.status(400).render('signup', { error: 'Please enter a valid first name.' });
  }

  // Check that lastNameInput is a valid string
  if (!/^[a-zA-Z]+$/.test(lastNameInput) || lastNameInput.length < 2 || lastNameInput.length > 25) {
    return res.status(400).render('signup', { error: 'Please enter a valid last name.' });
  }

  // Check that emailAddressInput is a valid email address
  if (!/\S+@\S+\.\S+/.test(emailAddressInput)) {
    return res.status(400).render('signup', { error: 'Please enter a valid email address.' });
  }

  // Check that passwordInput meets the requirements
  if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(passwordInput) || passwordInput.length < 8) {
    return res.status(400).render('signup', { error: 'Please enter a valid password. It must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' });
  }

  // Check that confirmPasswordInput matches passwordInput
  if (passwordInput !== confirmPasswordInput) {
    return res.status(400).render('signup', { error: 'Passwords do not match. Please try again.' });
  }

  // Check that roleInput is either 'admin' or 'user'
  if (roleInput !== 'admin' && roleInput !== 'user') {
    return res.status(400).render('signup', { error: 'Please select a valid role.' });
  }

  // Call your createUser function and pass in the fields from the request.body
  createUser({ firstNameInput, lastNameInput, emailAddressInput, passwordInput, roleInput })
    .then(result => {
      if (result.insertedUser) {
        // If the createUser function was successful, redirect the user to the /login page
        return res.redirect('/login');
      } else {
        // If the createUser function did not return insertedUser, respond with a 500 status code
        return res.status(500).render('signup', { error: 'Internal Server Error' });
      }
    })
    .catch(error => {
      // If there was an error calling the createUser function, render the sign-up screen again with an error message
      return res.status(400).render('signup', { error: error.message });
    });
  });

router
  .route('/login')
  .get(async (req, res) => {
    //code here for GET
    console.log("inside login route here")
    res.render('login', {
      title: 'Login',
      emailId: 'emailAddressInput',
      passwordId: 'passwordInput'
    });
  })
  .post(async (req, res) => {
    //code here for POST
    const { emailAddressInput, passwordInput } = req.body;

  // Validate email address format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailAddressInput)) {
    return res.status(400).render('login', {
      errorMessage: 'Please enter a valid email address',
    });
  }

  // Validate password format and length
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  if (!passwordRegex.test(passwordInput)) {
    return res.status(400).render('login', {
      errorMessage:
        'Please enter a password with at least 8 characters, one uppercase letter, one number, and one special character',
    });
  }

  // Make email address case-insensitive
  const emailAddress = emailAddressInput.toLowerCase();

  try {
    const user = await checkUser(emailAddress, passwordInput);
    if (user) {
      // Set AuthCookie and session.user
      res.cookie('AuthCookie', 'someAuthTokenHere');
      req.session.user = {
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        role: user.role,
      };
      
      // Redirect based on user role
      if (user.role === 'admin') {
        return res.redirect('/admin');
      } else {
        return res.redirect('/protected');
      }
    } else {
      // Invalid login
      return res.status(400).render('login', {
        errorMessage: 'Invalid username and/or password',
      });
    }
  } catch (error) {
    // DB function error
    return res.status(400).render('login', {
      errorMessage: 'An error occurred. Please try again later.',
    });
  }
  });

router.route('/protected').get(async (req, res) => {
  //code here for GET
  const { firstName, role } = req.session.user;
  const currentTime = new Date().toLocaleTimeString();

  let message = `Welcome ${firstName}, the time is now: ${currentTime}. Your role in the system is: ${role}.`;
  if (role === 'admin') {
    message += ` <a href="/admin">Admin Page</a>`;
  }

  message += ` <a href="/logout">Logout</a>`;

  res.send(message);
});

router.route('/admin').get(async (req, res) => {
  //code here for GET
  if (req.session.user.role !== 'admin') {
    res.status(403).send('Forbidden'); // User is not an admin, send 403 Forbidden error
    return;
  }

  var currentTime = new Date().toLocaleTimeString(); // Get current time

  // Render admin view with welcome message, current time, and link to protected route
  res.render('admin', {
    firstName: req.session.user.firstName,
    currentTime: currentTime
  });
});

router.route('/error').get(async (req, res) => {
  //code here for GET
  res.status(500).render('error', {errorMessage: 'An error occurred.'});

});

router.route('/logout').get(async (req, res) => {
  //code here for GET
  res.clearCookie('AuthCookie');

  // Redirect the user to the home page and inform them that they have been logged out
  res.status(200).send("You have been logged out. <a href='/'>Click here to return to the homepage</a>.");

});

export default router;