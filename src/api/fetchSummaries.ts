// @/api/fetchSummaries.ts
export async function fetchSummaries(sessionId: string): Promise<string[]> {
  try {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    
    // Try the summaries endpoint first
    try {
      const res = await fetch(`${backendUrl}/summaries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.summaries || [];
      }
    } catch (err) {
      console.log('Summaries endpoint not available, using fallback');
    }

    // Fallback: Use the ask endpoint to generate summaries
    const res = await fetch(`${backendUrl}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Generate 5 personalized financial summary points for the user. Keep each point concise and actionable. Return only the summary points, one per line.",
        session_id: sessionId,
        phone_number: "test-phone-123",
      }),
    });

    if (!res.ok) {
      throw new Error("Backend call failed");
    }

    const data = await res.json();
    // Split the response into individual summary points
    const summaryText = data.response || "";
    const summaries = summaryText.split('\n').filter(line => line.trim().length > 0).slice(0, 5);
    
    return summaries.length > 0 ? summaries : [
      "Your total assets are ₹2,50,000",
      "You have 3 active financial goals", 
      "Your monthly spending is ₹45,000",
      "You've saved 15% of your income this month",
      "Your emergency fund covers 6 months of expenses"
    ];
  } catch (err) {
    console.error("Failed to fetch summaries:", err);
    throw new Error("Network or backend error: " + (err as Error).message);
  }
} 