// Captura o botão e as áreas de texto
const improveButton = document.getElementById('improveText');
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');

// Função para chamar a API da OpenAI
async function callOpenAI(text) {
  try {
    // Configure suas opções de API aqui
    const apiOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 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`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: text,
        max_tokens: 100 // ou qualquer outro valor que você queira
      })
    };

    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', apiOptions);
    
    if (response.status === 429) {
      return "Você atingiu o limite de taxa da API.";
    }

    const data = await response.json();

    if (data && data.choices && data.choices[0]) {
      return data.choices[0].text.trim();
    } else {
      return "Não foi possível obter uma resposta da API.";
    }
  } catch (error) {
    return `Ocorreu um erro: ${error.message}`;
  }
}

// Quando o botão for clicado, melhora o texto
improveButton.addEventListener('click', async () => {
  const originalText = inputText.value;
  const improvedText = await callOpenAI(originalText);
  outputText.value = improvedText;
});
