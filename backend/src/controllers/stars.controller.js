import productos from "../models/productos.model.js";

//add start of the product

export const addStar = async (req, res) => {
  const { idProduct, rating, userId } = req.body;

  // Validación del valor de rating
  if (![1, 2, 3, 4, 5].includes(rating)) {
    return res
      .status(400)
      .json({ message: "La puntuación debe estar entre 1 y 5" });
  }

  try {
    const product = await productos.findById(idProduct);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Encontrar la calificación previa del usuario, si existe
    const existingRating = product.ratings.find(
      (r) => r.userId.toString() === userId
    );

    if (existingRating) {
      // Reducir la puntuación anterior en el contador de estrellas
      product.stars[existingRating.rating]--;

      // Actualizar la puntuación del usuario
      existingRating.rating = rating;
    } else {
      // Agregar nueva puntuación del usuario
      product.ratings.push({ userId, rating });
    }

    // Incrementar el contador de estrellas en la nueva puntuación
    product.stars[rating]++;

    await product.save();
    res
      .status(200)
      .json({ message: "Puntuación actualizada correctamente", product });
  } catch (error) {
    res.status(500).json({ message: "Error al puntuar el producto", error });
  }
};
//p
export const getAveProd = async (req, res) => {
  try {
    const { productId } = req.body; // Obtén el ID del producto de los parámetros de la solicitud
    const product = await productos.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calcular el promedio
    const totalRatings = product.ratings.length;
    const totalStars = product.ratings.reduce(
      (acc, rating) => acc + rating.rating,
      0
    );
    const averageRating =
      totalRatings > 0 ? (totalStars / totalRatings).toFixed(2) : 0;

    // Enviar el producto y el promedio al front-end
    res.json({
      product,
      averageRating: Number(averageRating), // Enviar el promedio como un número
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
