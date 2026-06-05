import { Router } from 'express';
import { 
    getProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../controllers/productController.js';

import upload from '../middlewares/multerConfig.js'; 

const router = Router();


// URL: GET /api/productos?page=1
router.get('/', getProducts);

// URL: POST /api/productos
// 'image' es el nombre del campo que debe enviar el frontend en su FormData
router.post('/', upload.single('image'), createProduct);

// URL: PUT /api/productos/:id
router.put('/:id', upload.single('image'), updateProduct);

// URL: DELETE /api/productos/:id
router.delete('/:id', deleteProduct);

export default router;