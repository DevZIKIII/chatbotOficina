// --- CONFIGURAÇÕES E VARIÁVEIS GLOBAIS ---
let config = {
    apiKey: '',
    systemPrompt: 'Você é um assistente de IA inteligente e prestativo. Responda de forma clara, objetiva e amigável, sempre tentando ajudar o usuário da melhor forma possível.',
    temperature: 0.7,
    maxTokens: 2048,
    model: 'gemini-2.0-flash'
};

let allConversations = [];
let currentConversationId = null;

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    loadConversationsFromStorage();
    updateHistoryUI();

    if (allConversations.length > 0) {
        loadConversation(allConversations[0].id);
    } else {
        newChat();
    }

    if (!config.apiKey) {
        setTimeout(() => {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: 'Configure sua API Key do Gemini para começar!',
                customClass: { popup: 'swal-custom-style' }
            });
            toggleConfig();
        }, 1000);
    }
});

// --- GERENCIAMENTO DE CONVERSAS (localStorage) ---

function saveConversationsToStorage() {
    localStorage.setItem('aiLabConversations', JSON.stringify(allConversations));
}

function loadConversationsFromStorage() {
    const saved = localStorage.getItem('aiLabConversations');
    if (saved) {
        allConversations = JSON.parse(saved);
        allConversations.sort((a, b) => b.lastUpdated - a.lastUpdated);
    }
}

function newChat() {
    currentConversationId = null;
    document.getElementById('chatMessages').innerHTML = '';
    showWelcomeScreen();
    updateHistoryUI();
}

function loadConversation(id) {
    const conversation = allConversations.find(c => c.id === id);
    if (!conversation) return;

    currentConversationId = id;
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = '';

    // Carrega mensagens sem o efeito de digitação (isTyping = false)
    conversation.messages.forEach(msg => {
        addMessage(msg.content, msg.role === 'user', false);
    });

    updateHistoryUI();
}

function deleteConversation(id, event) {
    event.stopPropagation();
    Swal.fire({
        title: 'Você tem certeza?',
        text: "Esta ação não pode ser desfeita!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: 'rgba(255, 0, 0, 1)',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar',
        customClass: { popup: 'swal-custom-style' } // Adicione esta linha
    }).then((result) => {
        if (result.isConfirmed) {
            allConversations = allConversations.filter(c => c.id !== id);
            saveConversationsToStorage();
            if (currentConversationId === id) {
                newChat();
            }
            updateHistoryUI();
        }
    });
}

// --- ATUALIZAÇÃO DA INTERFACE (UI) ---

function updateHistoryUI() {
    const historyContainer = document.getElementById('chatHistory');
    if (allConversations.length === 0) {
        historyContainer.innerHTML = '<div class="history-item">Nenhuma conversa</div>';
        return;
    }
    historyContainer.innerHTML = allConversations.map(conv => `
        <div class="history-item ${conv.id === currentConversationId ? 'active' : ''}" onclick="loadConversation(${conv.id})">
            <span>💬 ${conv.title}</span>
            <button class="delete-history-btn" onclick="deleteConversation(${conv.id}, event)" title="Excluir conversa">
                <span class="delete-icon">🗑️</span>
            </button>
        </div>
    `).join('');
}

function showWelcomeScreen() {
    document.getElementById('chatMessages').innerHTML = `
        <div class="welcome-screen">
            <h1 class="welcome-title">Bem-vindo ao futuro da programação! 🚀</h1>
            <p class="welcome-subtitle">Sou sua IA pessoal para explorar o mundo da tecnologia. Clique em uma sugestão ou comece uma nova conversa!</p>
            <div class="suggestion-chips">
                <div class="chip" onclick="sendSuggestion('Explique o que é uma API')">🔌 O que é uma API?</div>
                <div class="chip" onclick="sendSuggestion('Me mostre um código Python para Hello World')">🐍 Meu primeiro Python</div>
                <div class="chip" onclick="sendSuggestion('Crie um nome criativo para um app de jogos')">🎮 Nome para meu app</div>
            </div>
        </div>
    `;
}

// ATUALIZADO: Função addMessage agora suporta o parâmetro 'isTyping'
function addMessage(content, isUser = false, isTyping = false) {
    const welcomeScreen = document.querySelector('.welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.parentElement.innerHTML = '';
    }

    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    const avatar = isUser ? '👤' : '🤖';

    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-text"></div>
        </div>
    `;

    const messageTextElement = messageDiv.querySelector('.message-text');

    if (isUser) {
        messageTextElement.innerHTML = formatMessage(content);
    } else {
        if (isTyping) {
            // Inicia o efeito de digitação
            typeMessage(messageTextElement, content);
        } else {
            // Mostra o texto de uma vez (para histórico)
            messageTextElement.innerHTML = formatMessage(content);
        }
    }

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// NOVO: Função que cria o efeito de digitação
function typeMessage(element, text) {
    let i = 0;
    element.innerHTML = ""; // Limpa o conteúdo inicial
    element.classList.add('typewriter'); // Adiciona a classe para o cursor

    const interval = setInterval(() => {
        if (i < text.length) {
            // Atualiza o HTML a cada caractere para renderizar markdown em tempo real
            element.innerHTML = formatMessage(text.substring(0, i + 1));
            element.parentElement.parentElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
            i++;
        } else {
            clearInterval(interval);
            element.classList.remove('typewriter'); // Remove o cursor ao final
        }
    }, 20); // Velocidade da digitação (em milissegundos)
}


// --- LÓGICA DE ENVIO DE MENSAGEM E API ---

// ATUALIZADO: sendMessage agora chama addMessage com isTyping = true
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const message = input.value.trim();

    if (!message) return;

    if (!currentConversationId) {
        currentConversationId = Date.now();
        const title = message.length > 30 ? message.substring(0, 27) + '...' : message;
        const newConv = {
            id: currentConversationId,
            title: title,
            messages: [],
            lastUpdated: Date.now()
        };
        allConversations.unshift(newConv);
    }

    const currentConv = allConversations.find(c => c.id === currentConversationId);
    currentConv.messages.push({ role: 'user', content: message });
    currentConv.lastUpdated = Date.now();

    addMessage(message, true, false); // Mensagem do usuário aparece instantaneamente
    input.value = '';
    autoResize(input);
    sendButton.disabled = true;

    showThinkingIndicator(true);

    try {
        const response = await callGeminiAPI(currentConv.messages);
        currentConv.messages.push({ role: 'model', content: response });
        // Chama addMessage com isTyping = true para a resposta do bot
        addMessage(response, false, true);
    } catch (error) {
        addMessage(`❌ Ops! ${error.message}`, false, false);
    } finally {
        showThinkingIndicator(false);
        sendButton.disabled = false;
        input.focus();
        allConversations.sort((a, b) => b.lastUpdated - a.lastUpdated);
        saveConversationsToStorage();
        updateHistoryUI();
    }
}


async function callGeminiAPI(conversationMessages) {
    if (!config.apiKey) {
        throw new Error('API Key não configurada!');
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`;

    const history = conversationMessages.slice(0, -1).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
    }));
    const userMessage = conversationMessages[conversationMessages.length - 1].content;

    const requestBody = {
        contents: [...history, { role: 'user', parts: [{ text: userMessage }] }],
        systemInstruction: { parts: [{ text: config.systemPrompt }] },
        generationConfig: {
            temperature: config.temperature,
            maxOutputTokens: config.maxTokens,
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });
    const data = await response.json();

    if (!response.ok || !data.candidates) {
        throw new Error(data.error?.message || 'Erro ao receber resposta da API.');
    }
    return data.candidates[0].content.parts[0].text;
}

// --- FUNÇÕES AUXILIARES ---

function showThinkingIndicator(show) {
    document.getElementById('thinkingIndicator').classList.toggle('active', show);
    const messagesContainer = document.getElementById('chatMessages');
    if (show) {
       messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function formatMessage(content) {
    let html = content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'text';
        const escapedCode = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<div class="code-block"><div class="code-header"><span class="code-language">${language.toUpperCase()}</span><button class="copy-code-btn" onclick="copyCode(this)"><span class="copy-icon">📋</span><span class="copy-text">Copiar</span></button></div><pre class="code-content"><code>${escapedCode}</code></pre></div>`;
    });
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return html.replace(/\n/g, '<br>');
}

function copyCode(button) {
    const code = button.closest('.code-block').querySelector('code').innerText;
    navigator.clipboard.writeText(code).then(() => {
        const textSpan = button.querySelector('.copy-text');
        const originalText = textSpan.textContent;
        textSpan.textContent = 'Copiado!';
        button.classList.add('copied');
        setTimeout(() => { 
            textSpan.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    });
}

function sendSuggestion(message) {
    document.getElementById('messageInput').value = message;
    sendMessage();
}

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function toggleConfig() {
    document.getElementById('configPanel').classList.toggle('active');
}

function saveConfig() {
    config.apiKey = document.getElementById('apiKey').value.trim();
    config.temperature = parseFloat(document.getElementById('temperature').value);

    localStorage.setItem('aiLabConfig', JSON.stringify(config));
    Swal.fire({
        icon: 'success',
        title: 'Salvo!',
        text: 'Configurações atualizadas com sucesso.',
        customClass: { popup: 'swal-custom-style' }
    });
    toggleConfig();
}

function loadConfig() {
    const saved = localStorage.getItem('aiLabConfig');
    if (saved) {
        const savedConfig = JSON.parse(saved);
        config.apiKey = savedConfig.apiKey || '';
        config.temperature = savedConfig.temperature || 0.7;
        
        // Atualiza os inputs se existirem
        const apiKeyInput = document.getElementById('apiKey');
        const tempInput = document.getElementById('temperature');
        const tempValue = document.getElementById('tempValue');
        
        if (apiKeyInput) apiKeyInput.value = config.apiKey;
        if (tempInput) tempInput.value = config.temperature;
        if (tempValue) tempValue.textContent = config.temperature;
    }
}

document.getElementById('temperature').addEventListener('input', (e) => {
    document.getElementById('tempValue').textContent = e.target.value;

});
