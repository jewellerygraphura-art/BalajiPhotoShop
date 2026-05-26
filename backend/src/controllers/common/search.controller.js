import Product from "../../models/common/product.models.js";


export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    }).limit(20);

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Search Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while searching products",
    });
  }
};

export const searchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const query = q.trim();

    const products = await Product.find({
      status: true,
      deleted: false,
      $or: [
        { name: { $regex: query } },
        { category: { $regex: query } },
        { productCollection: { $regex: query } },
        { "attributes.material": { $regex: query } },
        { "attributes.color": { $regex: query } },
      ],
    })
      .collation({ locale: "en", strength: 2 }) // 🔥 Case insensitive
      .select("_id name productImage price.sale category productCollection attributes.material attributes.color")
      .limit(6);

    return res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {
    console.error("Suggestion Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching suggestions",
    });
  }
};
