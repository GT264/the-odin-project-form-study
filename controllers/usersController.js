const usersStorage = require("../storages/usersStorage");



exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};



// Validation
const { body, validationResult, matchedData } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("firstName").trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
  body("lastName").trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
  body("eMail").trim()
    .isEmail().withMessage("Invalid email address."),
  body("Age").optional({ checkFalsy: true }).trim()
    .isInt({ min: 18, max: 120 }).withMessage("Age must be between 18 and 120."),
  body("Bio").optional({ checkFalsy: true }).trim()
    .isLength({ min: 1, max: 200 }).withMessage("Bio must be between 1 and 200 characters."),
];

exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    const { firstName, lastName, eMail, Age, Bio } = matchedData(req);
    usersStorage.addUser({ firstName, lastName, eMail, Age, Bio });
    res.redirect("/");
  }
];

exports.usersUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  res.render("updateUser", {
    title: "Update user",
    user: user,
  });
};

exports.usersUpdatePost = [
  validateUser,
  (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateUser", {
        title: "Update user",
        user: user,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, eMail, Age, Bio } = matchedData(req);
    usersStorage.updateUser(req.params.id, { firstName, lastName, eMail, Age, Bio });
    res.redirect("/");
  }
];

exports.usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};

exports.usersSearchSearch = (req, res) => {
  const { search } = req.query;
  const users = usersStorage.getUsers();
  const filteredUsers = users.filter(user => user.lastName.toLowerCase().includes(search.toLowerCase()));
  res.render("search", {
    title: "Results",
    users: filteredUsers,
  });
};
  