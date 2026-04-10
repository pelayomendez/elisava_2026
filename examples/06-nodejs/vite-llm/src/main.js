import './style.css'

const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY

document.querySelector('#poem-btn').addEventListener('click', async () => {
  const topic = document.querySelector('#poem-input').value.trim()
  const output = document.querySelector('#poem-output')

  if (!topic) {
    output.textContent = 'Please enter a topic.'
    return
  }

  output.textContent = 'Generating...'

  try {
    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          { role: 'user', content: `Write a short poem about: ${topic}` },
        ],
      }),
    })

    const data = await res.json()
    const poem = data.choices?.[0]?.message?.content
    output.textContent = poem || 'No poem generated.'
  } catch (err) {
    output.textContent = 'Error: ' + err.message
  }
})
