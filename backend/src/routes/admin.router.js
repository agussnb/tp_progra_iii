import {Router} from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import {
    getProducts, 
    createProduct, 
    getLogs,
    updateProduct, 
    deleteProduct } from '../controllers/adminController.js';
import { getDashboard } from '../controllers/dashboardController.js';

const router = Router();
router.use(isAuthenticated); 
router.get('/dashboard', getDashboard);
router.get('/logs', getLogs);
router.get('/productos', getProducts);
//POSTS
router.post('/productos', createProduct);
//PUTS
router.put('/productos/:id', updateProduct);
//DELETES
router.delete('/productos/:id', deleteProduct);

export default router;