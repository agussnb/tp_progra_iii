import {Router} from 'express';
import {generarTicketPDF} from '../controllers/ticketController.js';

const router = Router();

router.post('/generar-pdf', generarTicketPDF);

export default router;