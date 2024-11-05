import { Mongoose } from "mongoose";
import supplier from "../models/supplier.model.js";

//create supplier
export const createSupplier = async (req, res) => {
  const { name, company, email, address, phone } = req.body;
  try {
    if (!name || !company || !email || !address || !phone) {
      res.status(401).json({ msg: "insufficient data" });
    }
    const newProveedor = new supplier({
      name,
      company,
      email,
      address,
      phone,
    });
    const result = await newProveedor.save();

    if (!result) {
      res.status(401).json({ msg: "error " });
    } else {
      res.status(201).json({ msg: "proveedor creado correctamente " });
    }
  } catch (error) {
    res.status(500).json({ msg: "ocurrio un error", error });
  }
};

//update supplier
export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, company, email, address, phone } = req.body;
    if (!name || !company || !email || !address || !phone) {
      res.status(401).json({ msg: " insufficient data" });
    }
    const updtSupplier = { name, company, email, address, phone };

    const result = await supplier.findByIdAndUpdate(id, updtSupplier, {
      new: true,
    });

    return !result
      ? res.status(404).json({ msg: "Supplier not found" })
      : res.status(200).json({ msg: "Supplier updated", supplier: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "interval server error" });
  }
};

//delete supplier
export const deleSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await supplier.findByIdAndDelete(id);
    !result
      ? res.status(301).json({ msg: "error deleting supplier" })
      : res.status(200).json({ msg: "supplier delete " });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "interval server error" });
  }
};

//get all supplier
export const getAllSupplier = async (req, res) => {
  try {
    const result = supplier.find();
    !result
      ? res.status(404).json({ msg: "supplier not find" })
      : res.status(200).json({ msg: "suppliers", result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "interval server error" });
  }
};
