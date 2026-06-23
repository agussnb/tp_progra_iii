import puppeteer from 'puppeteer';

export const generarTicketPDF = async (req, res) => {
  try {
    const { cliente, items, total, fecha } = req.body;

const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Ticket</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Courier New', monospace; background: #fff; padding: 40px; }
      .ticket { max-width: 500px; margin: 0 auto; border: 2px dashed #333; padding: 30px; border-radius: 8px; }
      .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
      .header h1 { font-size: 24px; color: #000000; }
      .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
      .total { display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; margin-top: 20px; padding-top: 15px; border-top: 3px solid #333; }
      .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #222222; border-top: 1px solid #ddd; padding-top: 15px; }
      .footer p { margin: 4px 0; }
    </style>
  </head>
  <body>
    <div class="ticket">
      <div class="header">
        <h1>COMICMUNDO</h1>
        <p>Fecha: ${fecha}</p>
        <p>Cliente: ${cliente}</p>
      </div>
      ${items.map(item => `
        <div class="item">
          <span>${item.cantidad}x ${item.nombre}</span>
          <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
        </div>
      `).join('')}
      <div class="total">
        <span>TOTAL</span>
        <span>$${total.toFixed(2)}</span>
      </div>
      <div class="footer">
        <p>contacto@comicmundo.com</p>
        <p>11-1234-5678</p>
        <p>UTN Sede Mitre, Buenos Aires, Argentina</p>
        <p>¡Gracias por tu compra!</p>
      </div>
    </div>
  </body>
  </html>
`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=ticket-${Date.now()}.pdf`
    });
    res.status(200).send(pdfBuffer);

  } catch (error) {
    console.error('Error al generar PDF:', error);
    res.status(500).json({ error: 'Error al generar el ticket PDF' });
  }
};