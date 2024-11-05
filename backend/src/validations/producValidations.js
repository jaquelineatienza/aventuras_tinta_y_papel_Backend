import { body } from "express-validator";

export const producValidation = [
  body("titulo")
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("The title must not be empty"),
  body("autor")
    .isString()
    .withMessage("Author must be a string")
    .notEmpty()
    .withMessage("Author must not be empty"),
  body("descripcion")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("The description must not be empty"),
  body("tipo")
    .isString()
    .withMessage("The type must be a string")
    .notEmpty()
    .withMessage("The type must not be empty"),
  body("idioma")
    .isString()
    .withMessage("Language must be a string")
    .notEmpty()
    .withMessage("Language must not be empty"),
  body("categoria")
    .isString()
    .withMessage("The category must be a string")
    .notEmpty()
    .withMessage("The category must not be empty"),
  body("numeroEdicion")
    .isNumeric()
    .withMessage("The edition number must be numeric")
    .notEmpty()
    .withMessage("The edition number must not be empty"),
  body("precio")
    .isNumeric()
    .withMessage("The price must be numeric")
    .notEmpty()
    .withMessage("The price must not be empty"),
  body("cantidad")
    .isNumeric()
    .withMessage("Quantity must be numeric")
    .notEmpty()
    .withMessage("Quantity must not be empty"),
  body("imagen").notEmpty().withMessage("Image must not be empty"),
];

export const producValidUpdate = [
  body("titulo")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("The title must not be empty"),
  body("autor")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Author must be a string")
    .notEmpty()
    .withMessage("Author must not be empty"),
  body("descripcion")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("The description must not be empty"),
  body("idioma")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Language must be a string")
    .notEmpty()
    .withMessage("Language must not be empty"),
  body("categoria")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("The category must be a string")
    .notEmpty()
    .withMessage("The category must not be empty"),
  body("numeroEdicion")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("The edition number must be numeric")
    .notEmpty()
    .withMessage("The edition number must not be empty"),
  body("precio")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("The price must be numeric")
    .notEmpty()
    .withMessage("The price must not be empty"),
  body("cantidad")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("Quantity must be numeric")
    .notEmpty()
    .withMessage("Quantity must not be empty"),
  body("imagen")
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage("Image must not be empty"),
];
