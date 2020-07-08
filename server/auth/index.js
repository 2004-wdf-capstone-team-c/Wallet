const router = require("express").Router();
const { User, Budget, Transaction, Account } = require("../db/models/index");

module.exports = router;

router.post("/login", (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        console.log("No such user found:", req.body.email);
        res.status(401).send("Wrong username and/or password");
      } else if (!user.correctPassword(req.body.password)) {
        console.log("Incorrect password for user:", req.body.email);
        res.status(401).send("Wrong username and/or password");
      } else {
        req.session.email = user.email;
        req.session.userId = user.dataValues.id;
        req.login(user, (err) => (err ? next(err) : res.json(user)));
        let currentDate = new Date();
        let userId = user.id;
        user.update({ pushToken: req.body.pushToken, lastLogin: currentDate });
      }
    })
    .catch(next);
});

router.post("/signup", async (req, res, next) => {
  try {
    let user = await User.create(req.body);
    user.budget = await user.createBudget();
    req.login(user, (err) => (err ? next(err) : res.json(user)));
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists");
    } else {
      next(err);
    }
  }
});

router.delete("/logout", (req, res) => {
  req.logout();
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.status(200).end();
    }
  });
  res.redirect("/");
});

router.get("/me", async (req, res) => {
  const user = await User.findOne(
    {
      where: { id: req.user.id },
    },
    {
      include: {
        model: Account,
        include: {
          model: Transaction,
          include: {
            model: Budget,
          },
        },
      },
    }
  );
  res.json(user);
});

// router.use("/faceID", require("./faceid"));
// router.use('/google', require('./google'));
