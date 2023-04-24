// In this file, you must perform all client-side validation for every single form input (and the role dropdown) on your pages. The constraints for those fields are the same as they are for the data functions and routes. Using client-side JS, you will intercept the form's submit event when the form is submitted and If there is an error in the user's input or they are missing fields, you will not allow the form to submit to the server and will display an error on the page to the user informing them of what was incorrect or missing.  You must do this for ALL fields for the register form as well as the login form. If the form being submitted has all valid data, then you will allow it to submit to the server for processing. Don't forget to check that password and confirm password match on the registration form!

// event listner on submit
const form = document.querySelector('#registration-form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const firstName = form.elements.firstNameInput.value.trim();
  const lastName = form.elements.lastNameInput.value.trim();
  const emailAddress = form.elements.emailAddressInput.value.trim();
  const password = form.elements.passwordInput.value.trim();
  const confirmPassword = form.elements.confirmPasswordInput.value.trim();
  const role = form.elements.roleInput.value.trim();

  const errors = [];

  if (!firstName) {
    errors.push('First name is required');
  } else if (!/^[a-zA-Z]{2,25}$/.test(firstName)) {
    errors.push('First name must be a valid string between 2 and 25 characters long with no numbers');
  }

  if (!lastName) {
    errors.push('Last name is required');
  } else if (!/^[a-zA-Z]{2,25}$/.test(lastName)) {
    errors.push('Last name must be a valid string between 2 and 25 characters long with no numbers');
  }

  if (!emailAddress) {
    errors.push('Email address is required');
  } else if (!/\S+@\S+\.\S+/.test(emailAddress)) {
    errors.push('Email address must be in a valid format');
  }

  if (!password) {
    errors.push('Password is required');
  } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(password)) {
    errors.push('Password must be at least 8 characters long with at least one uppercase letter, one number, and one special character');
  }

  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  if (role !== 'admin' && role !== 'user') {
    errors.push('Role must be either "admin" or "user"');
  }

  if (errors.length > 0) {
    // Display the errors to the user
    const errorList = document.createElement('ul');
    errors.forEach(error => {
      const errorItem = document.createElement('li');
      errorItem.textContent = error;
      errorList.appendChild(errorItem);
    });
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('error');
    errorDiv.appendChild(errorList);
    form.appendChild(errorDiv);
  } else {
    // Send the form data to the server
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName,
        lastName,
        emailAddress,
        password,
        role
      })
    });

    if (response.ok) {
      // Registration successful, redirect to home page or login page
      window.location.href = '/'; // replace with desired page URL
    } else {
      // Registration failed, display error message
      const errorMessage = await response.text();
      const errorDiv = document.createElement('div');
      errorDiv.classList.add('error');
      errorDiv.textContent = errorMessage;
      form.appendChild(errorDiv);
    }
  }
});

const login_form = document.querySelector('#login-form');
login_form.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    
    const emailAddress = login_form.elements.emailAddressInput.value.trim();
    const password = login_form.elements.passwordInput.value.trim();
  
    const errors = [];
  
 
  
    if (!emailAddress) {
      errors.push('Email address is required');
    } else if (!/\S+@\S+\.\S+/.test(emailAddress)) {
      errors.push('Email address must be in a valid format');
    }
  
    if (!password) {
      errors.push('Password is required');
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/.test(password)) {
      errors.push('Password must be at least 8 characters long with at least one uppercase letter, one number, and one special character');
    }
  
 
    if (errors.length > 0) {
      // Display the errors to the user
      const errorList = document.createElement('ul');
      errors.forEach(error => {
        const errorItem = document.createElement('li');
        errorItem.textContent = error;
        errorList.appendChild(errorItem);
      });
      const errorDiv = document.createElement('div');
      errorDiv.classList.add('error');
      errorDiv.appendChild(errorList);
      form.appendChild(errorDiv);
    } 
  });