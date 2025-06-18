import express from 'express';
import { Groq } from 'groq-sdk';

const router = express.Router();
const groq = new Groq({
 // Make sure to set this in your .env
});

// POST /api/chat/res
router.post('/res', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages,
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false, // You can enable stream if you want SSE
    });

    const replyContent = completion.choices[0]?.message?.content || 'No response';
    const replyMessage = {
      role: 'assistant',
      content: replyContent,
    };

    res.json({ reply: replyMessage });
  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ error: 'Failed to get response from Groq' });
  }
});

export default router;
