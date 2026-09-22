// api/analyze.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No se recibió imagen' });
    }

    const response = await fetch('https://api.poe.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.POE_API_KEY}`
      },
      body: JSON.stringify({
        model: 'AiHairStylist',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Eres "Alpha IA", el asesor de estilo de Distrito Alpha, una barbería en Ibagué, Colombia.

Analiza esta foto y responde en español:

1. 📐 Forma del rostro (ovalado, redondo, cuadrado, corazón, alargado, diamante)
2. ✂️ 3 cortes de cabello que le favorezcan
3. 🧔 Recomendación de barba (si aplica)
4. 💈 1 producto de barbería para mantener el estilo

Tono profesional pero cercano, elegante y directo.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 800
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error Poe API:', data);
      return res.status(500).json({ error: 'Error al analizar la imagen' });
    }

    const recomendacion = data.choices?.[0]?.message?.content || 'No se pudo obtener respuesta';
    return res.status(200).json({ recomendacion });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}