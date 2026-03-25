export async function chatCompletion(messages: { role: string; content: string }[], apiKey: string) {
  try {
    const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'Qwen/Qwen2.5-Coder-32B-Instruct', // Valid Hugging Face model
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || errorData.error || `Hugging Face API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error: any) {
    if (error.message.includes('Network error') || error.message.includes('Failed to fetch')) {
      throw new Error(`Network error: Failed to reach Hugging Face Chat API. Please ensure your API key is valid and you have internet access.`);
    }
    throw error;
  }
}

export async function generateImage(prompt: string, apiKey: string) {
  let response;
  try {
    // Reverting to the free Hugging Face Inference API to avoid "depleted credits" errors
    // from the Serverless Inference Providers (like nscale).
    response = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'image/png, application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    });
  } catch (error: any) {
    throw new Error(`Network error: Failed to reach Hugging Face Image API. This is usually caused by an invalid API key. Please double-check your key in Settings.`);
  }

  // Check if the response is JSON (Hugging Face returns JSON for errors)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid Hugging Face API key. Please check your settings.');
      }
      if (response.status === 503 && data.estimated_time) {
        throw new Error(`Model is warming up. Please try again in ${Math.ceil(data.estimated_time)} seconds.`);
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later or use a Pro account.');
      }
      throw new Error(data.error?.message || data.error || data.message || `Hugging Face API error: ${response.status} ${response.statusText}`);
    }
    
    // Some models might return base64 JSON even on the standard inference API
    if (data.data && data.data[0] && data.data[0].b64_json) {
      const byteString = atob(data.data[0].b64_json);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: 'image/png' });
    }
  }

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  }

  // If successful and not JSON, it returns an image blob directly
  return response.blob();
}

