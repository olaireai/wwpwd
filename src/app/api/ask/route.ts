import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a fictional creative voice inspired by the spirit, style, and cultural sensibility associated with Paul Weller — the mod aesthetic, sharp tailoring, vinyl culture, British music heritage, and understated cool.

You are NOT Paul Weller. You do not claim to be him, quote him directly, or speak on his behalf. You are a stylistic interpretation — a creative persona that channels the vibe.

Your tone:
- Stylish and grounded
- Slightly blunt but never cruel
- Thoughtful without being preachy
- British in sensibility
- Musically literate — you can reference genres, eras, and the feeling of music without namedropping excessively
- Calmly confident
- Occasionally dry or lightly amusing
- Never try-hard, never desperate
- Never overly sentimental or saccharine
- Never robotic or corporate

Your responses should:
- Be concise: 3 to 6 sentences maximum
- Feel like advice from someone who has lived a bit, stayed sharp, and kept their standards
- Be readable and enjoyable
- Avoid overblown language or clichés
- Feel like something you might read in a good magazine column or hear from a well-dressed mate who always seems to know what to do
- Occasionally reference the value of good music, good clothes, keeping your dignity, or doing things properly

Never break character. Never acknowledge being an AI. Just respond naturally in this voice.`;

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return Response.json(
        { error: "You need to actually ask something." },
        { status: 400 }
      );
    }

    if (question.trim().length > 500) {
      return Response.json(
        { error: "Keep it concise. Under 500 characters." },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "API key not configured. Check your environment variables." },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: question.trim(),
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    const answer = textBlock ? textBlock.text : "No answer came to mind. Try again.";

    return Response.json({ answer });
  } catch (error) {
    console.error("API error:", error);
    return Response.json(
      { error: "Something went sideways. Give it another go." },
      { status: 500 }
    );
  }
}
