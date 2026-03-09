import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure folders exist (Agar uploads/products folder nahi hai to ye code bana dega)
const uploadDir = "uploads/products/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Sabhi product images is folder mein jayengi
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Unique filename banana: Timestamp + Original Name
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter (Optional: Sirf images allow karne ke liye)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed!"), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export default upload;