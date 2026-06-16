export async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VOYAGE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'voyage-3-lite',
      input: text
    })
  })

  const data = await response.json()
  console.log('Voyage response:', JSON.stringify(data).slice(0, 200))

  if (!data.data?.[0]?.embedding) {
    throw new Error(`Voyage error: ${JSON.stringify(data)}`)
  }

  return data.data[0].embedding
}