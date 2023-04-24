import express from "express";
const app = express();
import session from "express-session";
import configRoutes from "./routes/index.js";
import exphbs from "express-handlebars";
import path from "path";
import cookieParser from "cookie-parser";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "./public");

app.use(express.static(publicDir));
app.use(express.json());
app.use(express.urlencoded({ extended: "false" }));
app.use(cookieParser());

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/login", (req, res, next) => {
  if (req.session && req.session.user) {
    // Check user role

    if (req.session.user.role === "admin") {
      // Redirect to admin route
      return res.redirect("/admin");
    } else if (req.session.user.role === "user") {
      // Redirect to protected route
      return res.redirect("/protected");
    }
  }
  next();
});

app.use("/register", (req, res, next) => {
  if (req.session && req.session.user) {
    // Check user role

    if (req.session.user.role === "admin") {
      // Redirect to admin route
      return res.redirect("/admin");
    } else if (req.session.user.role === "user") {
      // Redirect to protected route
      return res.redirect("/protected");
    }
  }
  next();
});

app.use("/protected", (req, res, next) => {
  if (!(req.session && req.session.user)) {
    return res.redirect("/login");
  }
  next();
});
app.use("/admin", (req, res, next) => {
  if (!(req.session && req.session.user)) {
    return res.redirect("/login");
  }
  if (req.session.user.role === "user") {
    return res.status(403).render("error", {
      errorMessage: "user does not have permission to view the page",
    });
  }
  next();
});
app.use("/logout", (req, res, next) => {
  if (!(req.session && req.session.user)) {
    return res.redirect("/login");
  }

  next();
});
app.all("/", (req, res, next) => {
  if (req.session && req.session.user) {
    // Check user role

    if (req.session.user.role === "admin") {
      // Redirect to admin route
      return res.redirect("/admin");
    } else if (req.session.user.role === "user") {
      // Redirect to protected route
      return res.redirect("/protected");
    }
  } else {
    return res.redirect("/login");
  }
});
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
//app.set('view engine', 'handlebars');
app.set("view engine", "handlebars");
const customLogger = function (req, res, next) {
  console.log(
    new Date().toUTCString(),
    ": ",
    req.method,
    " ",
    req.originalUrl,
    "Is user Logged in:",
    req.session && req.session.user
  );
  next();
};
app.use(customLogger);
configRoutes(app);

app.listen(3000, () => {
  console.log("Your routes will be running on http://localhost:3000");
});
