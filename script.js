const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx3pruvjjaeti9A_0WJlqCMsNJ33lOK_3MMUMQQkDT2Sy5CYH_C2pbUPtuRAlGAx7Np1A/exec';
const etapa1 = document.getElementById('etapa1');
const etapa2 = document.getElementById('etapa2');
const etapa3 = document.getElementById('etapa3'); // Agora pegamos a etapa 3 do HTML
const sim1 = document.getElementById('sim1');
const sim2 = document.getElementById('sim2');
const nao2 = document.getElementById('nao2');
const noBtn = document.getElementById('noBtn');
const formConfirmacao = document.getElementById('formConfirmacao');
const nomeInput = document.getElementById('nome');

async function getFrases() {
    const response = await fetch('frases.csv');
    const data = await response.text();
    const linhas = data.split('\n').slice(1); // Ignora o cabeçalho
    const frases = linhas.map(linha => linha.split(',')[1].replace(/"/g, '').trim());
    return frases;
}

// Primeiro Sim
sim1.addEventListener('click', () => {
    etapa1.classList.add('hidden');
    etapa2.classList.remove('hidden');
});

// Segundo Sim (vai para o formulário)
sim2.addEventListener('click', () => {
    etapa2.classList.add('hidden'); // Esconde a etapa 2
    etapa3.classList.remove('hidden'); // Exibe a etapa 3
});

// Gerenciar o envio do formulário
formConfirmacao.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar o comportamento padrão do formulário

    const nome = nomeInput.value.trim(); // Obter o nome do usuário

    if (!nome) {
        alert('Por favor, insira seu nome!');
        return;
    }

    const frases = await getFrases();
    const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];

    // Exibir uma mensagem de carregamento
    document.body.innerHTML = `
        <div class="wrapper">
            <h2>${fraseAleatoria.replace(/\n/g, '<br>')}</h2>
        </div>
    `;

    try {
        // Enviar os dados para o Google Apps Script
        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: new URLSearchParams({
                nome: nome, // Nome do usuário
                presenca: 'confirmado' // Atualiza a coluna "presença" com "confirmado"
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Exibir a tela final com o texto adicional e ícone centralizado
        document.body.innerHTML = `
            <div class="wrapper">
                <h2>🎉 Combinado, ${nome}! Te vejo lá!</h2>
                <img class="gif" src="https://media.giphy.com/media/UMon0fuimoAN9ueUNP/giphy.gif"/>
                <h2>entra no zapzap ai</h2>
                <a href="https://chat.whatsapp.com/I4yuoqNgGmN49jhnw77Dow" target="_blank" style="display: flex; justify-content: center; margin-top: 20px;">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" style="width: 50px; height: 50px;">
                </a>
            </div>
        `;
    } catch (error) {
        alert('Erro ao confirmar, tente novamente!');
        // Recarregar a página para permitir nova tentativa
        location.reload();
    }
});

// Botão Não da primeira tela
noBtn.addEventListener('mouseover', () => {
    const maxX = window.innerWidth - 150;
    const maxY = window.innerHeight - 50;

    noBtn.style.position = 'absolute';
    noBtn.style.left = Math.random() * maxX + 'px';
    noBtn.style.top = Math.random() * maxY + 'px';
});

// Botão Não da segunda tela
nao2.addEventListener('click', () => {
    etapa2.classList.add('hidden');
    etapa1.classList.remove('hidden');
});