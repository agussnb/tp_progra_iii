import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import { createSale, getSales } from '../controllers/saleController.js';

const router = Router();

router.post('/',createSale);

router.get('/', verifyToken, getSales);

export default router;