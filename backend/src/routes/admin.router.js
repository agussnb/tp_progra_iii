import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';

import { 
    getLogs, 
    getLogsView, 
    getProductsView,
    getUpdateView 
} from '../controllers/adminController.js';

import { 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../controllers/productController.js';

import { getDashboard } from '../controllers/dashboardController.js';
import upload from '../middlewares/multerConfig.js'; 

const router = Router();

router.get('/dashboard',getDashboard); 
router.get('/logs', getLogsView); 
router.get('/productos', getProductsView); 
router.get('/productos/:id', getUpdateView); 

router.get('/api/logs', verifyToken, getLogs);

router.post('/productos', verifyToken, upload.single('image'), createProduct); 
router.put('/productos/:id', verifyToken, upload.single('image'), updateProduct); 
router.delete('/productos/:id', verifyToken, deleteProduct); 

export default router;