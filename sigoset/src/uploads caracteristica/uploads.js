const multer = require('multer');
const path = require('path');

// Define el tamaño máximo del archivo (por ejemplo, 5MB)
const MAX_SIZE = 15 * 1024 * 1024;  // 5MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads_caracteriticas')); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

// Configuración de multer
const upload = multer({ 
  storage,
  limits: { fileSize: MAX_SIZE }, // Limitar el tamaño del archivo
  fileFilter: (req, file, cb) => {
    // Verificar si el archivo es una imagen
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif','image/jpg']; // Puedes agregar más tipos de imágenes si es necesario
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes JPG, PNG o GIF'), false);
    }
  },
});

module.exports = upload;
