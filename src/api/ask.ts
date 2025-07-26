export async function askGemini(
    prompt: string,
    sessionId: string,
    phone: string
  ): Promise<string> {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
      const res = await fetch(`${backendUrl}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          session_id: sessionId,
          phone_number: phone,
        }),
      });
  
      if (!res.ok) {
        throw new Error("Backend call failed");
      }
  
      const data = await res.json();
      return data.response;
    } catch (err) {
      throw new Error("Network or backend error: " + (err as Error).message);
    }
  }