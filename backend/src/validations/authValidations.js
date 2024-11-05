import { body } from "express-validator";

export const regisValidation = [
  body("nombre")
    .isString()
    .withMessage("El nombre debe ser un String")
    .notEmpty()
    .withMessage("El nombre no puede estar vacio"),
  body("apellido")
    .isString()
    .withMessage("El apellido debe ser un String")
    .notEmpty()
    .withMessage("El apellido no debe estar vacio"),
  body("nombreUsuario")
    .isString()
    .withMessage("El apellido debe ser un String")
    .notEmpty()
    .withMessage("El apellido no debe estar vacio"),
  body("fechaNacimiento")
    .notEmpty()
    .withMessage("La fecha de nacimiento no debe estar vacio"),
  // .isDate().withMessage('Debe ser una fecha valida'),
  body("email")
    // .isEmpty().withMessage('El correo electronico es obligatorio')
    .isEmail()
    .withMessage("Debe ingresar un correo electronico valido"),
  body("password")
    .notEmpty()
    .withMessage("la contraseña es obligatoria")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener como minimo 8 caracteres"),
];

export const loginValidation = [
  body("password")
    .notEmpty()
    .withMessage("la contraseña es obligatoria")
  
];
