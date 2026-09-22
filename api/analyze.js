export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { mensaje, imageBase64, historial } = req.body;

    if (!mensaje && !imageBase64) {
      return res.status(400).json({ error: 'No se recibió nada' });
    }

    // ===== CONSTRUIR EL MENSAJE =====
    let textoCompleto = `Eres "Alpha IA", el asesor de estilo de Distrito Alpha, una barbería en Ibagué, Colombia.

INFO DE DISTRITO ALPHA:
- Dirección: Cra. 9 #31-11, Ibagué, Tolima (Simon parte baja)
- WhatsApp: +57 317 588 3432
- Horario: Lunes a sábado, 9am - 7pm. Domingos y festivos cerrado.
- Servicios: Corte $20.000 (45min), Corte + Barba $28.000 (70min), Servicio Completo $40.000 (90min)
- Barberos: Kevin, JuanPa, Juan

PERSONALIDAD:
- Profesional pero cercano, elegante y directo.
- Español colombiano.
- Respuestas cortas (máx 100 palabras) cuando es texto.
- Si hay foto: analiza forma del rostro, recomienda 3 cortes, 1 producto.
- Si quieren reservar, dirígelos al botón "Reservar" o al WhatsApp.

`;

    if (historial && Array.isArray(historial)) {
      historial.forEach(h => {
        textoCompleto += `${h.role === 'user' ? 'Cliente' : 'Alpha IA'}: ${h.text}\n`;
      });
    }

    if (mensaje) {
      textoCompleto += `\nCliente: ${mensaje}`;
    }

    // ===== LLAMAR A POE =====
    // Poe usa el endpoint de OpenAI pero con su propia API key y formato especial
    const body = {
      model: 'GPT-4o-mini',  // Modelo económico y compatible con imágenes
      messages: [
        {
          role: 'user',
          content: imageBase64
            ? [
                { type: 'text', text: textoCompleto },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            : textoCompleto
        }
      ],
      max_tokens: 800
    };

    const response = await fetch('https://api.poe.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.POE_API_KEY}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log('Poe status:', response.status);
    console.log('Poe response:', JSON.stringify(data).slice(0, 500));

    if (!response.ok) {
      return res.status(500).json({
        error: `Error de Poe (${response.status}): ${data.error?.message || data.message || 'desconocido'}`
      });
    }

    const respuesta = data.choices?.[0]?.message?.content || 'No obtuve respuesta.';
    return res.status(200).json({ respuesta });

  } catch (error) {
    console.error('Error completo:', error);
    return res.status(500).json({ error: 'Error: ' + error.message });
  }
}