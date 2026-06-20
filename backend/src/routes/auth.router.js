import { Router } from 'express';
import { loginAdmin, logout, registerAdmin, renderLogin, renderRegister } from '../controllers/authController.js';

const router = Router();


router.get('/', renderLogin);        
router.get('/register', renderRegister);
router.get('/logout', logout);

router.post('/api/auth/login', loginAdmin);      
router.post('/api/auth/register', registerAdmin);  

export default router;