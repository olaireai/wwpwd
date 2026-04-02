// ElevenLabs TTS — uses "George" (deep British male voice)
// Set ELEVENLABS_API_KEY in Railway env vars (free tier: elevenlabs.io)
// Returns 503 with no body if key not set → frontend falls back to Web Speech API

const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // George — deep, British, authoritative

export async function POST(request: Request) {
  const { text } = await request.json();

  if (!text || typeof text !== "string") {
    return new Response(JSON.stringify({ error: "No text provided" }), { status: 400 });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    // No key configured — tell the frontend to use Web Speech fallback
    return new Response(null, { status: 503 });
  }

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: text.slice(0, 1000), // cap to keep within free tier
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.75,
            style: 0.25,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!res.ok) {
      return new Response(null, { status: 503 });
    }

    const audio = await res.arrayBuffer();
    return new Response(audio, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch {
    return new Response(null, { status: 503 });
  }
}
