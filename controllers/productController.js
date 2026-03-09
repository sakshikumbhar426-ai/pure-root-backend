import db from "../models/index.js";
import Sequelize from "sequelize";

const { Product, Vendor } = db;
const Op = Sequelize.Op;

/**
 * 🌿 HELPER: Logic-based Eco-Score Calculator
 */
const calculateEcoScore = (material, packaging) => {
    let score = 0;
    
    const materialWeight = {
        "Organic": 50, "Handmade": 45, "Recycled": 45,
        "Natural": 35, "Synthetic": 10, "Plastic": 5
    };

    const packagingWeight = {
        "Zero-Waste": 50, "Biodegradable": 40, 
        "Paper": 30, "Recycled Plastic": 15, "Standard": 5
    };

    score = (materialWeight[material] || 20) + (packagingWeight[packaging] || 10);
    return score;
};

/**
 * Helper: Format Product Data
 */
const formatProduct = (p) => {
    if (!p) return null;
    const productData = p.toJSON ? p.toJSON() : p;
    return {
        ...productData,
        id: productData.product_id, 
    };
};

/**
 * 1. CREATE PRODUCT
 */
export const createProduct = async (req, res) => {
    try {
        const { name, price, category, quantity, location, description, packaging, latitude, longitude } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ message: "Name, Price, and Category are required." });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized! Please login." });
        }

        const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
        if (!vendor) return res.status(403).json({ message: "Vendor profile not found." });

        if (!vendor.verified_status) {
            return res.status(403).json({ 
                message: "Your account is pending admin approval. You cannot list products yet." 
            });
        }

        const imageFileName = req.file ? req.file.filename : null;
        if (!imageFileName) return res.status(400).json({ message: "Product image is required." });

        const finalEcoScore = calculateEcoScore(category, packaging);

        const product = await Product.create({
            product_name: name,
            price: parseFloat(price),
            quantity: parseInt(quantity) || 0, // Fixed: Ensuring Integer
            material_type: category, 
            packaging_type: packaging || "Eco-Friendly",
            description: description || "",
            location_address: location || "", 
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null,
            image: imageFileName, 
            eco_score: finalEcoScore,
            vendorId: vendor.vendor_id,
        });

        res.status(201).json({
            message: "Success! Product is now live. 🌱",
            product: formatProduct(product),
        });

    } catch (error) {
        console.error("CRITICAL ERROR IN CREATE PRODUCT:", error);
        res.status(500).json({ 
            message: "Internal Server Error", 
            error: error.message 
        });
    }
};

/**
 * 2. GET ALL PRODUCTS
 */
export const getAllProducts = async (req, res) => {
  try {
    const { category, search, userLat, userLon, maxDist } = req.query; 
    let whereClause = {};

    if (category && category !== "All") {
      whereClause.material_type = category; 
    }

    if (search) {
      whereClause.product_name = { [Op.iLike]: `%${search}%` }; 
    }

    const products = await Product.findAll({
      where: whereClause,
      include: { model: Vendor, attributes: ["shop_name"] },
      order: [['createdAt', 'DESC']]
    });

    
    if (userLat && userLon && userLat !== "undefined" && userLon !== "undefined") {
        const radius = parseFloat(maxDist) || 100; 
        
        const filteredProducts = products.filter(p => {
            
            if (!p.latitude || !p.longitude) return true; 
            
            const dist = getHaversineDistance(
                parseFloat(userLat), 
                parseFloat(userLon), 
                parseFloat(p.latitude), 
                parseFloat(p.longitude)
            );
            return dist <= radius;
        });
        return res.status(200).json(filteredProducts.map(formatProduct));
    }

    res.status(200).json(products.map(formatProduct));
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};
/**
 * 3. GET MY PRODUCTS
 */
export const getMyProducts = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
        if (!vendor) return res.status(404).json({ message: "Vendor not found" });

        const products = await Product.findAll({
            where: { vendorId: vendor.vendor_id },
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json(products.map(formatProduct));
    } catch (error) {
        res.status(500).json({ message: "Error fetching your inventory" });
    }
};

/**
 * 4. DELETE PRODUCT
 */
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await Vendor.findOne({ where: { userId: req.user.id } });
        if (!vendor) return res.status(403).json({ message: "Unauthorized" });

        const product = await Product.findOne({ 
            where: { product_id: id, vendorId: vendor.vendor_id } 
        });

        if (!product) return res.status(404).json({ message: "Product not found" });

        await product.destroy();
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product" });
    }
};

/**
 * 5. GET FEATURED PRODUCTS
 */
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      limit: 8,
      include: { model: Vendor, attributes: ["shop_name"] },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(products.map(formatProduct));
  } catch (error) {
    res.status(500).json({ message: "Could not fetch featured products" });
  }
};

/**
 * 6. GET PRODUCT BY ID
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: {
        model: Vendor,
        attributes: ["shop_name", "location", "verified_status"],
      }
    });

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(formatProduct(product));
  } catch (error) {
    res.status(500).json({ message: "Server error fetching product details" });
  }
};

// Distance calculation helper
function getHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}