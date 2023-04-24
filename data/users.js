//import mongo collections, bcrypt and implement the following data functions
import {ObjectId} from 'mongodb';
import {users} from '../config/mongoCollections.js'
import bcrypt from 'bcrypt';
import exportedMethods from '../helpers.js';
import validation from '../helpers.js';

export const createUser = async ({
  firstNameInput,
  lastNameInput,
  emailAddressInput,
  passwordInput,
  roleInput
}) => {
  let resultObj = {
     insertedUser: false,
     errorMessage: ""
  };

  try {
    firstNameInput = exportedMethods.checkString(firstNameInput);
    firstNameInput = firstNameInput.trim();
    if (
      !/^[a-zA-Z]+$/.test(firstNameInput) ||
      firstNameInput.length < 2 ||
      firstNameInput.length > 25
    ) {
      resultObj.errorMessage= "First Name is not in valid format";
      return resultObj;
    }
  } catch (e) {
    console.log(e);
    resultObj.errorMessage= "First Name is not in valid format in Exp" ;
    return resultObj;

  }
  //LastNamecheck
  try {
    lastNameInput = exportedMethods.checkString(lastNameInput);
    lastNameInput = lastNameInput.trim();
    if (
      !/^[a-zA-Z]+$/.test(lastNameInput) ||
      lastNameInput.length < 2 ||
      lastNameInput.length > 25
    ) {
      resultObj.errorMessage= "Last Name is not in valid format";
      return resultObj;
    }
  } catch (e) {
    resultObj.errorMessage= "Last Name is not in valid format";
    return resultObj;
  }

  //Email Check
  try {
    emailAddressInput = exportedMethods.checkString(emailAddressInput);
    emailAddressInput = emailAddressInput.trim();
    emailAddressInput = emailAddressInput.toLowerCase();
    if (
      !/\S+@\S+\.\S+/.test(emailAddressInput)
    ) {
      resultObj.errorMessage= "Email is not in valid format";
      return resultObj;
    }
  } catch (e) {
    resultObj.errorMessage= "Email is not in valid format";
    return resultObj;
  }

  //Password Check
   try {
    passwordInput = exportedMethods.checkString(passwordInput);
    passwordInput = passwordInput.trim();
    if (
      !/^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(passwordInput)
    ) {
      resultObj.errorMessage= "Password is not in valid format";
      return resultObj;
    }
  } catch (e) {
    resultObj.errorMessage= "Password is not in valid format";
    return resultObj;
    }

   roleInput = roleInput.toLowerCase();
  // Check that roleInput is either 'admin' or 'user'
  if (roleInput !== "admin" && roleInput !== "user") {
    resultObj.errorMessage= "Role is not in valid format";
    return resultObj;
  }
  const db = await users();
  const existingUser = await db.findOne({ emailAddress: emailAddressInput });
  if (existingUser) {
    resultObj.errorMessage= "User with same email already exits";
    return resultObj;
    //throw new Error('A user with this email address already exists');
  }
  const hashedPassword = await bcrypt.hash(passwordInput, 10);

  // Check role
  const lowercaseRole = roleInput.toLowerCase();
  if (lowercaseRole !== 'admin' && lowercaseRole !== 'user') {
    resultObj.errorMessage='Role should be either "admin" or "user"';
    return resultObj;
    // throw new Error('Role should be either "admin" or "user"');
  }

  // Insert the user into the database
  const result = await db.insertOne({
    _id: new ObjectId(),
    firstName: firstNameInput,
    lastName: lastNameInput,
    emailAddress: emailAddressInput,
    password: passwordInput,
    role: roleInput
  });

  if (result.acknowledged) {
    return { insertedUser: true, errorMessage: "" };
  } else {

    throw new Error('User could not be inserted');
  }


  // // Check first name
  // const firstNameRegex = /^[A-Za-z]+$/;
  // if (!firstNameRegex.test(firstName) || firstName.length < 2 || firstName.length > 25) {
  //   throw new Error('First name should be a valid string with length between 2 and 25 characters');
  // }

  // // Check last name
  // const lastNameRegex = /^[A-Za-z]+$/;
  // if (!lastNameRegex.test(lastName) || lastName.length < 2 || lastName.length > 25) {
  //   throw new Error('Last name should be a valid string with length between 2 and 25 characters');
  // }

  // // Check email address format
  // const emailRegex = /\S+@\S+\.\S+/;
  // if (!emailRegex.test(emailAddress)) {
  //   throw new Error('Email address should be a valid format');
  // }

  // // Convert email address to lowercase for case-insensitive matching
  // const lowercaseEmail = emailAddress.toLowerCase();

  // Check if email already exists in the database

  // // Check password format
  // const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
  // if (!passwordRegex.test(password) || password.length < 8) {
  //   throw new Error('Password should be a valid format with length of at least 8 characters, and contain at least one uppercase character, one number, and one special character');
  // }

  // Hash the password using bcrypt


};

export const checkUser = async (emailAddress, password) => {
  if (!emailAddress || !password) {
    throw new Error("Both emailAddress and password must be supplied");
  }

  // Check if emailAddress is a valid email address format
  if (!/[^@]+@[^@]+\.[^@]+/.test(emailAddress)) {
    throw new Error("emailAddress should be a valid email address format");
  }

  // Normalize emailAddress to lowercase
  emailAddress = emailAddress.toLowerCase();

  // Check if password is valid
  if (password.length < 8 || /\s/.test(password)) {
    throw new Error("Password should be at least 8 characters long and not contain spaces");
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error("Password should contain at least one uppercase character");
  }
  if (!/\d/.test(password)) {
    throw new Error("Password should contain at least one number");
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(password)) {
    throw new Error("Password should contain at least one special character");
  }

  // Query the database for the emailAddress
  const db = await users();

  const user = await db.findOne({ emailAddress: emailAddress });

  // If user is not found, throw an error
  if (!user) {
    throw new Error("Either the email address or password is invalid");
  }

  // Use bcrypt to compare the hashed password in the database with the password input parameter
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Either the email address or password is invalid");
  }

  // If passwords match, return the following fields of the user
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
    role: user.role,
  };
};
