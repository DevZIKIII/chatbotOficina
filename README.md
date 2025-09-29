AI Lab - Chatbot para Desenvolvedores
O AI Lab é uma interface de chatbot moderna e personalizável, projetada para ser um assistente de código virtual para desenvolvedores. Construído com HTML, CSS e JavaScript puros, ele se conecta à API do Google Gemini para fornecer respostas inteligentes e contextuais, com foco em programação e tecnologia.

✨ Funcionalidades
Interface Moderna: Design responsivo com tema escuro e elementos "neon", inspirado na estética cyberpunk.

Histórico de Conversas: As conversas são salvas localmente no seu navegador, permitindo que você as acesse e continue de onde parou.

Renderização de Markdown: As respostas do chatbot suportam Markdown, formatando código embutido, negrito e, mais importante, blocos de código completos.

Blocos de Código com "Copiar": Blocos de código possuem destaque de sintaxe (simulado) e um botão para copiar o conteúdo facilmente.

Efeito de "Digitação": As respostas do assistente são exibidas com um efeito de digitação para uma experiência mais dinâmica.

Configuração Fácil: Um painel de configuração permite que você adicione sua própria API Key do Google Gemini e ajuste a "temperatura" (criatividade) das respostas.

Sugestões de Prompt: A tela inicial oferece sugestões para iniciar a conversa rapidamente.

🚀 Tecnologias Utilizadas
Frontend: HTML5, CSS3, JavaScript (Vanilla)

API: Google Gemini (via Fetch API)

Bibliotecas:

SweetAlert2: Para alertas e confirmações elegantes.

Fontes:

Inter: Para a interface geral.

JetBrains Mono: Para blocos de código.

⚙️ Configuração e Instalação
Este projeto não requer um build step ou dependências complexas. Você pode executá-lo diretamente em seu navegador.

Clone o repositório:

Bash

git clone https://github.com/seu-usuario/chatbotOficina.git
Navegue até o diretório do projeto:

Bash

cd chatbotOficina
Abra o index.html no seu navegador:

Você pode simplesmente arrastar o arquivo index.html para uma nova aba do seu navegador ou usar uma extensão como o "Live Server" no VS Code para uma melhor experiência de desenvolvimento.

🔑 Como Adicionar sua API Key
Para que o chatbot funcione, você precisa de uma API Key do Google Gemini.

Obtenha sua chave: Acesse o Google AI Studio e crie sua chave de API gratuitamente.

Configure no App:

Abra o index.html no navegador.

Clique no botão "Link API KEY" no canto inferior esquerdo.

Cole sua chave de API no campo correspondente, ajuste a temperatura se desejar e clique em "Salvar".

Suas configurações ficarão salvas no localStorage do navegador.

📄 prompt.txt
O arquivo prompt.txt é um modelo que pode ser usado para criar personalidades detalhadas para o assistente de IA, definindo sua área de especialização, tom de conversa e outras características. Para usar um system prompt personalizado, altere o valor da variável systemPrompt no arquivo script.js.
