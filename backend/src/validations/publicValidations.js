import { body } from "express-validator";

export const publicValidation = [
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("The title must not be empty"),
  body("description")
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("The description must not be empty"), // Cambiado "title" por "description"
  body("type")
    .isString()
    .withMessage("The type must be a string") // Cambiado "String" por "a string"
    .notEmpty()
    .withMessage("The type must not be empty"),
  body("price")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("The price must be numeric")
    .notEmpty()
    .withMessage("The price must not be empty"),
  body("phone")
    .isNumeric()
    .withMessage("The phone must be numeric")
    .notEmpty()
    .withMessage("The phone must not be empty"),
  body("imagen").notEmpty().withMessage("Image must not be empty"),
];

export const updateValidation = [
  body("title")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("The title must not be empty"),
  body("description")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("Description must be a string")
    .notEmpty()
    .withMessage("The description must not be empty"),
  body("type")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("The type must be a string")
    .notEmpty()
    .withMessage("The type must not be empty"),
  body("price")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("The price must be numeric")
    .notEmpty()
    .withMessage("The price must not be empty"),
  body("imagen")
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage("Image must not be empty"),
];
