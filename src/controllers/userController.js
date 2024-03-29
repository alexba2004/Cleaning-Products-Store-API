import User from "../models/user.js";
import ShoppingCart from "../models/shoppingCart.js";
import UserPurchase from "../models/userPurchase.js";
import { check, validationResult } from "express-validator";
import { generateToken, generateJwt } from "../lib/tokens.js";
import bcrypt from "bcrypt";
import jsonWebToken from "jsonwebtoken";
import { emailRegister, emailPasswordRecovery } from "../lib/emails.js";
import { Sequelize } from "sequelize";
import { Op } from "sequelize";

const formLogin = (request, response) => {
  response.render("../views/auth/login.pug", {
    isLogged: false,
    page: "Login",
  });
};

const formPasswordUpdate = async (request, response) => {
  const { token } = request.params;
  const user = await User.findOne({ where: { token } });
  console.log(user);
  if (!user) {
    response.render("auth/confirm-account", {
      page: "Cambiar Contraseña",
      error: true,
      msg: "Encontramos algunos problemas y no pudimos verificar su cuenta.",
      button: "Access denied",
    });
  }

  response.render("auth/password-update", {
    isLogged: false,
    page: "Actualizar Contraseña",
  });
};

const formRegister = (request, response) => {
  response.render("auth/register.pug", {
    page: "Nueva Cuenta",
  });
};

const formPasswordRecovery = (request, response) => {
  response.render("auth/recovery.pug", {
    page: "Cambiar Contraseña",
  });
};

const insertUser = async (req, res) => {
  console.log("Intentando registrar los datos del nuevo usuario en la Base de Datos");
  console.log(`Nombre: ${req.body.name}`);
  // Validaciones
  await check("name").notEmpty().withMessage("YOUR NAME IS REQUIRED").run(req); //* Express checa el nombre que no venga vacio AHORA MISMO
  await check("email").notEmpty().withMessage("YOUR EMAIL IS REQUIRED").isEmail().withMessage("THIS ISN'T EMAIL FORMAT").run(req);
  await check("address").notEmpty().withMessage("YOUR ADDRESS IS REQUIRED").run(req);
  await check("password").notEmpty().withMessage("YOUR PASSWORD IS REQUIRED").isLength({ min: 8, max: 20 }).withMessage("YOUR PASSWORD MUST HAVE 8 CHARACTERS AT LEAST").run(req);
  await check("confirmPassword").notEmpty().withMessage("YOUR PASSWORD IS REQUIRED").isLength({ min: 8, max: 20 }).withMessage("YOUR PASSWORD MUST HAVE 8 CHARACTERS AT LEAST").equals(req.body.password).withMessage("BOTH PASSWORDS FIELDS MUST BE THE SAME").run(req);

  console.log(`El total de errores fueron de: ${validationResult.length} errores de validación`);

  let resultValidate = validationResult(req);
  const userExists = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  const { name, address, email, password } = req.body;

  if (userExists) {
    res.render("auth/register.pug", {
      page: "Nueva Cuenta",
      errors: [{ msg: `El ${req.body.email} ya existe` }],
      user: {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
      },
    });
  } else if (resultValidate.isEmpty()) {
    const token = generateToken();
    // Creación del usuario
    let newUser = await User.create({
      name,
      email,
      address,
      password,
      token,
    });
    res.render("templates/message.pug", {
      page: "¡Cuenta Creada Exitosamente!",
      message: email,
      type: "success",
    });

    emailRegister({ email, name, token });
  } else {
    res.render("auth/register.pug", {
      page: "Nueva Cuenta",
      errors: resultValidate.array(),
      user: {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
      },
    });
  }
};

const confirmAccount = async (req, res) => {
  const tokenRecived = req.params.token;
  const userOwner = await User.findOne({
    where: {
      token: tokenRecived,
    },
  });
  if (!userOwner) {
    console.log("El token no existe");
    res.render("auth/confirm-account", {
      page: "Verificacion de Estatus",
      error: true,
      msg: "Encontramos algunos problemas y no pudimos verificar su cuenta.",
      button: "Access denied",
    });
  } else {
    console.log("El token existe");
    userOwner.token = null;
    userOwner.verified = true;
    await userOwner.save();
    // Update de la BD
    res.render("auth/confirm-account", {
      page: "Verificacion de Estatus",
      error: false,
      msg: "Su cuenta ha sido verificada exitosamente.",
      button: "Now you can login",
    });
  }
};

const updatePassword = async (req, res) => {
  console.log(`Guardando password`);

  await check("password").notEmpty().withMessage("YOUR PASSWORD IS REQUIRED").isLength({ min: 8 }).withMessage("YOUR PASSWORD MUST HAVE 8 CHARACTERS AT LEAST").run(req);
  await check("confirmPassword").notEmpty().withMessage("YOUR PASSWORD IS REQUIRED").isLength({ min: 8 }).withMessage("YOUR PASSWORD MUST HAVE 8 CHARACTERS AT LEAST").equals(req.body.password).withMessage("BOTH PASSWORDS FIELDS MUST BE THE SAME").run(req);
  let resultValidate = validationResult(req);
  if (resultValidate.isEmpty()) {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ where: { token } });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.token = null;
    await user.save();
    res.render("auth/confirm-account.pug", {
      page: "Cambiar Contraseña",
      button: "Login",
      msg: "La contraseña ha sido cambiada exitosamente.",
    });
  } else {
    res.render("auth/password-update.pug", {
      page: "Nueva Cuenta",
      errors: resultValidate.array(),
    });
  }
};

const emailChangePassword = async (req, res) => {
  console.log(`El usuario ha solicitado cambiar su contraseña por lo que se le enviara un correo electronico a ${req.body.email} con la liga para actualizar su contraseña.`);
  await check("email").notEmpty().withMessage("YOUR EMAIL IS REQUIRED").isEmail().withMessage("THIS IS NOT EMAIL FORMAT").run(req);
  let resultValidate = validationResult(req);
  const { name, email } = req.body;

  if (resultValidate.isEmpty()) {
    const userExists = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!userExists) {
      //Si no existe
      console.log(`El usuario: ${email} que esta intentando recuperar su contraseña no existe`);
      res.render("templates/message.pug", {
        page: "Usuario No Encontrado",
        part1: `The user associated with: `,
        part2: ` does not exist in database.`,
        message: `${email}`,
        type: "error",
      });
    } else {
      console.log("envio de correo");
      const token = generateToken();
      userExists.token = token;
      userExists.save();

      emailPasswordRecovery({ name: userExists.name, email: userExists.email, token: userExists.token });

      res.render("templates/message", {
        page: "Correo Enviado",
        message: `${email}`,
        type: "success",
      });
    }
  } else {
    res.render("auth/recovery", {
      page: "Verificacion de Estatus",
      error: false,
      msg: "Su cuenta ha sido confirmada exitosamente.",
      button: "Now you can login",
      errors: resultValidate.array(),
      user: {
        name: req.body.name,
        email: req.body.email,
      },
    });
  }
  return 0;
};

const authenticateUser = async (request, response) => {
  // Verificaciones del login
  await check("email").notEmpty().withMessage("Email field is required").isEmail().withMessage("This is not in email format").run(request);
  await check("password").notEmpty().withMessage("Password field is required").isLength({ max: 20, min: 8 }).withMessage("Password must contain between 8 and 20 characters").run(request);

  let resultValidation = validationResult(request);
  if (resultValidation.isEmpty()) {
    const { email, password } = request.body;
    console.log(`El usuario: ${email} esta intentando acceder a la plataforma`);

    const userExists = await User.findOne({ where: { email } });

    if (!userExists) {
      console.log("El ususario no existe");
      response.render("auth/login.pug", {
        page: "Login",
        errors: [{ msg: `El usuario asociado a: ${email} no fue encontrado.` }],
        user: {
          email,
        },
      });
    } else {
      console.log("El usuario existe");
      if (!userExists.verified) {
        console.log("Existe, pero no esta verificado");

        response.render("auth/login.pug", {
          page: "Login",
          errors: [{ msg: `El usuario asociado a: ${email} fue encontrado pero no está verificado.` }],
          user: {
            email,
          },
        });
      } else {
        if (!userExists.verifyPassword(password)) {
          response.render("auth/login.pug", {
            page: "Login",
            errors: [{ msg: `El usuario y la contraseña no coinciden.` }],
            user: {
              email,
            },
          });
        } else {
          console.log(`El usuario: ${email} Existe y esta autenticado`);

          if (userExists.email === "admin.as.limpieza@gmail.com") {
            // Si es el administrador, redirige al dashboard del administrador
            return response.redirect("/admin/dashboard");
          }

          //Generar el token de accesso
          const token = generateJwt(userExists.id);
          response
            .cookie("_token", token, {
              httpOnly: true,
            })
            .redirect("/products/home");
        }
      }
    }
  } else {
    response.render("../views/auth/login.pug", {
      page: "Login",
      errors: resultValidation.array(),
      user: {
        email: request.body.email,
      },
    });
  }

  return 0;
};

const userHome = async (req, res) => {
  const token = req.cookies._token;
  const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET_HASH_STRING);
  const loggedUser = await User.findByPk(decoded.userID);
  console.log(token);
  res.render("products/shopping-cart", {
    showHeader: true,
    page: "Carrito",
    loggedUser,
  });
};

const renderUserProfile = async (req, res) => {
  try {
    const token = req.cookies._token;
    const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET_HASH_STRING);
    const loggedUser = await User.findByPk(decoded.userID);

    // Obtén el ID del usuario desde la sesión
    const userId = loggedUser.id;

    // Busca al usuario en la base de datos
    const user = await User.findByPk(userId);

    // Busca las compras del usuario en la base de datos
    const userPurchases = await UserPurchase.findAll({ where: { UserId: userId } });

    // Renderiza la página de perfil con la información del usuario y sus compras
    res.render("auth/edit", {
      page: "Perfil",
      showHeader: true,
      showFooter: true,
      user,
      userPurchases, // Pasa las compras del usuario a la vista
    });
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    res.status(500).send("Error interno del servidor");
  }
};

// Controlador para manejar la actualización de datos del usuario
const updateUserProfile = async (req, res) => {
  try {
    const token = req.cookies._token;
    const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET_HASH_STRING);
    const loggedUser = await User.findByPk(decoded.userID);
    // Obtén el ID del usuario desde la sesión
    const userId = loggedUser.id;
    // Busca las compras del usuario en la base de datos
    const userPurchases = await UserPurchase.findAll({ where: { UserId: userId } });

    const { name, address, email } = req.body;
    // Obtén los datos del formulario
    await check("name").notEmpty().withMessage("YOUR NAME IS REQUIRED").run(req); //* Express checa el nombre que no venga vacio AHORA MISMO
    await check("email").notEmpty().withMessage("YOUR EMAIL IS REQUIRED").isEmail().withMessage("THIS ISN'T EMAIL FORMAT").run(req);
    await check("address").notEmpty().withMessage("YOUR ADDRESS IS REQUIRED").run(req);

    console.log(`El total de errores fueron de: ${validationResult.length} errores de validación`);

    let resultValidate = validationResult(req);
    const userExists = await User.findOne({
      where: {
        email: req.body.email,
        id: { [Op.not]: userId },
      },
    });

    if (userExists) {
      res.render("auth/edit.pug", {
        page: "Perfil",
        showHeader: true,
        showFooter: true,
        userPurchases,
        errors: [{ msg: `El ${req.body.email} ya existe` }],
        user: {
          name: req.body.name,
          email: req.body.email,
          address: req.body.address,
        },
      });
    } else if (resultValidate.isEmpty()) {
      // Actualiza los datos del usuario en la base de datos
      await User.update({ name, email, address }, { where: { id: userId } });
      // Redirige a la página de perfil con un mensaje de éxito
      res.redirect("/profile?successMsg=Profile updated successfully");
    } else {
      res.render("auth/edit.pug", {
        page: "Perfil",
        showHeader: true,
        showFooter: true,
        userPurchases,
        errors: resultValidate.array(),
        user: {
          name: req.body.name,
          email: req.body.email,
          address: req.body.address,
        },
      });
    }
  } catch (error) {
    console.error("Error al actualizar el perfil del usuario:", error);
    res.redirect("/profile?errorMsg=Error updating profile");
  }
};

// Controlador para manejar la eliminación de la cuenta del usuario
const deleteUser = async (req, res) => {
  try {
    const token = req.cookies._token;
    const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET_HASH_STRING);
    const loggedUser = await User.findByPk(decoded.userID);

    // Obtén el ID del usuario desde la sesión
    const userId = loggedUser.id;

    // Elimina el usuario y sus relaciones en cascada
    await User.destroy({
      where: { id: userId },
      include: [
        { model: ShoppingCart, onDelete: "CASCADE" },
        { model: UserPurchase, onDelete: "CASCADE" },
      ],
    });

    // Redirige a la página de inicio o a donde desees después de eliminar el usuario
    res.redirect("/login");
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.redirect("/profile?errorMsg=Error deleting user");
  }
};

const logoutController = async (req, res) => {
  try {
    res.redirect("/login"); // Redirige a la página principal u otra página después del logout
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during logout" });
  }
};

const adminDashboard = async (req, res) => {
  try {
    // Obtener todas las compras
    const allPurchases = await UserPurchase.findAll({
      include: [{ model: User, attributes: ["name", "email", "address"] }],
    });

    // Obtener todos los usuarios que tienen compras
    const usersWithPurchases = await User.findAll({
      include: [{ model: UserPurchase }],
    });

    console.log(allPurchases);
    console.log(usersWithPurchases);

    res.render("admin/dashboard", {
      page: "Admin Dashboard",
      purchases: allPurchases,
      usersWithPurchases: usersWithPurchases,
    });
  } catch (error) {
    console.error("Error al obtener las compras:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export { formLogin, formRegister, formPasswordRecovery, formPasswordUpdate, insertUser, authenticateUser, confirmAccount, updatePassword, emailChangePassword, userHome, renderUserProfile, updateUserProfile, deleteUser, logoutController, adminDashboard };
