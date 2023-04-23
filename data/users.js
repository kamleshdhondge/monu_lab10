//import mongo collections, bcrypt and implement the following data functions
import {ObjectId} from 'mongodb';
import {posts} from '../config/mongoCollections.js'
import bcrypt from 'bcrypt';

import validation from '../helpers.js';

export const createUser = async (
  firstName,
  lastName,
  emailAddress,
  password,
  role
) => {
  // check if all inputs are supplied
  if (!firstName || !lastName || !emailAddress || !password || !role) {
    throw new Error('All fields are required');
  }
  
  // Check first name
  const firstNameRegex = /^[A-Za-z]+$/;
  if (!firstNameRegex.test(firstName) || firstName.length < 2 || firstName.length > 25) {
    throw new Error('First name should be a valid string with length between 2 and 25 characters');
  }

  // Check last name
  const lastNameRegex = /^[A-Za-z]+$/;
  if (!lastNameRegex.test(lastName) || lastName.length < 2 || lastName.length > 25) {
    throw new Error('Last name should be a valid string with length between 2 and 25 characters');
  }

  // Check email address format
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(emailAddress)) {
    throw new Error('Email address should be a valid format');
  }

  // Convert email address to lowercase for case-insensitive matching
  const lowercaseEmail = emailAddress.toLowerCase();

  // Check if email already exists in the database
  const db = await posts();
  const existingUser = await db.findOne({ emailAddress: lowercaseEmail });
  if (existingUser) {
    throw new Error('A user with this email address already exists');
  }

  // Check password format
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
  if (!passwordRegex.test(password) || password.length < 8) {
    throw new Error('Password should be a valid format with length of at least 8 characters, and contain at least one uppercase character, one number, and one special character');
  }

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check role
  const lowercaseRole = role.toLowerCase();
  if (lowercaseRole !== 'admin' && lowercaseRole !== 'user') {
    throw new Error('Role should be either "admin" or "user"');
  }

  // Insert the user into the database
  const result = await db.insertOne({
    _id: new ObjectId(),
    firstName,
    lastName,
    emailAddress: lowercaseEmail,
    password: hashedPassword,
    role: lowercaseRole
  });

  //if (result.insertedCount === 1) {
    //return { insertedUser: true };
  //} else {
    //throw new Error('User could not be inserted');
  //}

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
  const db = await posts();

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
