import { Router } from 'express';
import {loginAdmin, logout, registerAdmin, renderLogin, renderRegister } from '../controllers/authController.js';

const router = Router();
//GETS
router.get('/', renderLogin); 
router.get('/register', renderRegister);
router.get('/logout', logout);
//POSTS
router.post('/', loginAdmin);
router.post('/register', registerAdmin);
export default router;