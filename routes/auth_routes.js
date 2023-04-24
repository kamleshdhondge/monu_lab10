//import express, express router as shown in lecture code
import express from "express";
import exportedMethods from "../helpers.js";
import { createUser,checkUser } from "../data/users.js";

const router = express.Router();

router
  .route("/register")
  .get(async (req, res) => {
    res.render("register", {
      title: "Login",
      emailAddressInput: "emailAddressInput",
      passwordInput: "passwordInput",
      lastNameInput: "lastNameInput",
      confirmPasswordInput: "confirmPasswordInput",
      roleInput: "roleInput",
    });
  })
  .post(async (req, res) => {
    let {
      firstNameInput,
      lastNameInput,
      emailAddressInput,
      passwordInput,
      confirmPasswordInput,
      roleInput,
    } = req.body;

    try {
      firstNameInput = exportedMethods.checkString(firstNameInput);
      firstNameInput = firstNameInput.trim();
      if (
        !/^[a-zA-Z]+$/.test(firstNameInput) ||
        firstNameInput.length < 2 ||
        firstNameInput.length > 25
      ) {
        return res
          .status(400)
          .render("register", { error: "Please enter a valid first name." });
      }
    } catch (e) {
      res
        .status(400)
        .render("register", { error: "Firstname is not entered correctly" });
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
        return res
          .status(400)
          .render("register", { error: "Please enter a valid last name." });
      }
    } catch (e) {
      res
        .status(400)
        .render("register", { error: "LastName is not entered correctly" });
    }

    //Email Check
    try {
      emailAddressInput = exportedMethods.checkString(emailAddressInput);
      emailAddressInput = emailAddressInput.trim();
      emailAddressInput = emailAddressInput.toLowerCase();
      if (!/\S+@\S+\.\S+/.test(emailAddressInput)) {
        return res
          .status(400)
          .render("register", { error: "Please enter a valid email" });
      }
    } catch (e) {
      res
        .status(400)
        .render("register", { error: "Email is not entered correctly" });
    }

    //Password Check
    try {
      passwordInput = exportedMethods.checkString(passwordInput);
      passwordInput = passwordInput.trim();
      if (
        !/^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/gm.test(
          passwordInput
        )
      ) {
        return res
          .status(400)
          .render("register", { error: "Password is not in correct format" });
      }
    } catch (e) {
      res
        .status(400)
        .render("register", { error: "Password is not in correct format" });
    }

    // Check that confirmPasswordInput matches passwordInput
    if (passwordInput !== confirmPasswordInput) {
      return res.status(400).render("register", {
        error: "Passwords do not match. Please try again.",
      });
    }

    // Check that roleInput is either 'admin' or 'user'
    if (roleInput !== "admin" && roleInput !== "user") {
      return res
        .status(400)
        .render("register", { error: "Please select a valid role." });
    }
    // Call your createUser function and pass in the fields from the request.body
    createUser({
      firstNameInput,
      lastNameInput,
      emailAddressInput,
      passwordInput,
      roleInput,
    })
      .then((result) => {
        if (result.insertedUser) {
          // If the createUser function was successful, redirect the user to the /login page
          return res.redirect("/login");
        } else {
          // What user entered incorrectly
          return res
            .status(400)
            .render("register", { error: result.errorMessage });
        }
      })
      .catch((error) => {
        // Server error
        return res
          .status(500)
          .render("register", { error: "Internal Server Error" });
      });
  });

// // Check that all required fields are present
// if (
//   !firstNameInput ||
//   !lastNameInput ||
//   !emailAddressInput ||
//   !passwordInput ||
//   !confirmPasswordInput ||
//   !roleInput
// ) {
//   return res
//     .status(400)
//     .render("register", { error: "Please fill out all fields." });
// }

// // Check that firstNameInput is a valid string
// if (
//   !/^[a-zA-Z]+$/.test(firstNameInput) ||
//   firstNameInput.length < 2 ||
//   firstNameInput.length > 25
// ) {
//   return res
//     .status(400)
//     .render("register", { error: "Please enter a valid first name." });
// }

// // Check that lastNameInput is a valid string
// if (
//   !/^[a-zA-Z]+$/.test(lastNameInput) ||
//   lastNameInput.length < 2 ||
//   lastNameInput.length > 25
// ) {
//   return res
//     .status(400)
//     .render("register", { error: "Please enter a valid last name." });
// }

// // Check that emailAddressInput is a valid email address
// if (!/\S+@\S+\.\S+/.test(emailAddressInput)) {
//   return res
//     .status(400)
//     .render("register", { error: "Please enter a valid email address." });
// }

// // Check that passwordInput meets the requirements
// if (
//   !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(passwordInput) ||
//   passwordInput.length < 8
// ) {
//   return res.status(400).render("register", {
//     error:
//       "Please enter a valid password. It must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
//   });
// }

router
  .route("/login")
  .get(async (req, res) => {
    res.render("login", {
      title: "Login",
      emailAddressInput: "emailAddressInput",
      passwordInput: "passwordInput",
    });
  })
  .post(async (req, res) => {
    let { emailAddressInput, passwordInput } = req.body;
    //Email Check

    try {
      emailAddressInput = exportedMethods.checkString(emailAddressInput);
      emailAddressInput = emailAddressInput.trim();
      emailAddressInput = emailAddressInput.toLowerCase();

      if (!/\S+@\S+\.\S+/.test(emailAddressInput)) {
        return res
          .status(400)
          .render("login", { errorMessage: "Email or password is not  correct" });
      }
    } catch (e) {
      return res
        .status(400)
        .render("login", { errorMessage: "Email or password is not  correct" });
    }

    //Password Check
    try {
      passwordInput = exportedMethods.checkString(passwordInput);
      passwordInput = passwordInput.trim();
      if (
        !/^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/gm.test(
          passwordInput
        )
      ) {
        return res
          .status(400)
          .render("login", { errorMessage: "Email or Password is not  correct" });
      }
    } catch (e) {
      return res
        .status(400)
        .render("login", { errorMessage: "Email or Password is not  correct " });
    }

    // Make email address case-insensitive
    const emailAddress = emailAddressInput.toLowerCase();
    try {
      const user = await checkUser(emailAddress, passwordInput);
      if (user.isUserFound) {
        // Set AuthCookie and session.user
        res.cookie("AuthCookie");
        req.session.user = {
          firstName: user.user.firstName,
          lastName: user.user.lastName,
          emailAddress: user.user.emailAddress,
          role: user.user.role,
        };
        // Redirect based on user role
        if (user.user.role === "admin") {
          return res.redirect("/admin");
        } else {
          return res.redirect("/protected");
        }
      } else {
        // Invalid login
        return res.status(400).render("login", {
          errorMessage: "Invalid username and/or password",
        });
      }
    } catch (error) {

      // DB function error
      return res.status(500).render("login", {
        errorMessage: "An error occurred. Please try again later.",
      });
    }
  });

router.route("/protected").get(async (req, res) => {
  //code here for GET
  const { firstName, role } = req.session.user;


  //New Code
  return res.render("protected", {
    firstName: firstName,
    currentTime: new Date().toUTCString(),
    role: role,
    admin: false,
  });
});

router.route("/admin").get(async (req, res) => {
  //code here for GET

  if (req.session.user.role !== "admin") {
    res.status(403).send("Forbidden"); // User is not an admin, send 403 Forbidden error
    return;
  }



  res.render("admin", {
    firstName: req.session.user.firstName,
    currentTime: new Date().toLocaleTimeString(),
  });
});

router.route("/error").get(async (req, res) => {
  //code here for GET
  res.status(500).render("error", { errorMessage: "An error occurred." });
});

router.route("/logout").get(async (req, res) => {
  //code here for GET
  // res.clearCookie("AuthCookie");
  req.session.destroy();

  // Redirect the user to the home page and inform them that they have been logged out
  res.render("logout");
});

export default router;
