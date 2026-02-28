// Basic AI Chat Controller for GreenCycle
// @desc    Handle chatbot queries
// @route   POST /api/ai/chat
// @access  Public
export const handleChat = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ reply: 'Please send a message.' });

        // Basic Rules Engine (Replacement for full LLM to save latency/cost initially)
        const msg = message.toLowerCase();
        let reply = "I'm sorry, I couldn't understand that. You can ask me about scrap prices, how to book a pickup, or serviceable areas.";

        if (msg.includes('price') || msg.includes('rate') || msg.includes('cost')) {
            reply = "Our prices vary by category. Typical rates: Paper is ₹15/kg, Iron is ₹25/kg, Plastic is ₹10/kg. Please check our Dashboard for live scrap prices.";
        } else if (msg.includes('book') || msg.includes('pickup') || msg.includes('schedule')) {
            reply = "To book a pickup, go to the Dashboard, select your scrap categories, provide your address in Nizampet or Miyapur, and choose a time slot.";
        } else if (msg.includes('area') || msg.includes('location') || msg.includes('hyderabad') || msg.includes('nizampet') || msg.includes('miyapur')) {
            reply = "Currently, we only serve Nizampet and Miyapur in Hyderabad. We are expanding soon!";
        } else if (msg.includes('hello') || msg.includes('hi')) {
            reply = "Hello! I am the GreenCycle Assistant. How can I help you today regarding scrap pickups and pricing?";
        }

        // If you had OpenAI/Gemini configured, you could call it here:
        // const response = await openai.createChatCompletion({...});
        // reply = response.data.choices[0].message.content;

        res.json({ reply });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
