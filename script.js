const mensagens = {
  destino: [ "A mesma poeira de estrela que criou galáxias existe dentro de si. Desperte o seu poder.", "A sua bravura é um cometa em ascensão. Deixe um rastro de luz por onde passar.", "Não tema as sombras. Elas só existem porque há uma luz poderosa a brilhar: a sua.", "A gravidade dos seus sonhos é a força mais poderosa do universo. Acredite nela." ],
  sabedoria: [ "No silêncio do cosmos, encontre a sua paz. A sua alma é uma nebulosa serena e infinita.", "Respire o universo, expire a desordem. Você é o centro da sua própria galáxia.", "Permita que as suas preocupações se tornem estrelas distantes: belas, mas que não ofuscam o seu brilho.", "A sua calma é um oceano. As ondas de hoje são a calmaria de amanhã." ],
  sonhos: [ "A sua mente é uma galáxia de ideias. Explore cada constelação.", "Crie a sua própria realidade, pintando o vazio com as cores da sua imaginação.", "Não espere pela inspiração. Dance com a sua curiosidade e ela aparecerá.", "Cada ideia sua é uma supernova. Deixe-a explodir em algo maravilhoso." ]
};

const body = document.body;
const telaInicio = document.getElementById('tela-inicio');
const telaSelecao = document.getElementById('tela-selecao');
const mainContainer = document.getElementById('main-container');

const baus = document.querySelectorAll('.bau-selecao');
const textoMensagem = document.getElementById('texto-mensagem');
const cardIcon = document.getElementById('card-icon');
const cardContainer = document.getElementById('card-container');
const cardVerso = document.getElementById('card-verso');
const versoParticles = document.getElementById('verso-particles');
const btnReset = document.getElementById('btn-reset');
const magicParticles = document.querySelectorAll('.particula-magica');
const actionButtonsContainer = document.getElementById('botoes-acao');

let isAnimating = false;
let sfx;

const icons = {
  destino: '<svg><use xlink:href="#icon-destino"></use></svg>',
  sabedoria: '<svg><use xlink:href="#icon-sabedoria"></use></svg>',
  sonhos: '<svg><use xlink:href="#icon-sonhos"></use></svg>'
};

// --- LÓGICA DE SOM ---
const setupAudio = async () => {
    try {
        await Tone.start();
        const lockSfx = new Tone.FMSynth({ harmonicity: 3, modulationIndex: 10, envelope: { attack: 0.001, decay: 0.1, sustain: 0.01, release: 0.1 }, modulationEnvelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 } }).toDestination();
        const particleSfx = new Tone.NoiseSynth({ noise: { type: 'pink' }, envelope: { attack: 0.1, decay: 1.5, sustain: 0, release: 0.2 } }).toDestination();
        const chimeSfx = new Tone.PluckSynth({ attackNoise: 0.5, dampening: 4000, resonance: 0.9 }).toDestination();
        const flipSfx = new Tone.NoiseSynth({ noise: { type: 'white' }, envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 } }).toDestination();
        sfx = { lockSfx, particleSfx, chimeSfx, flipSfx };
        console.log("Áudio pronto.");
    } catch (e) {
        console.error("Erro ao iniciar o áudio:", e);
    }
};

// --- LÓGICA DE ESTADO E ANIMAÇÃO ---
const changeScreen = (screenToShow) => {
    [telaInicio, telaSelecao, mainContainer].forEach(s => s.classList.add('hidden'));
    screenToShow.classList.remove('hidden');
};

const startAnimation = (theme) => {
    if (isAnimating) return;
    isAnimating = true;

    actionButtonsContainer.classList.remove('visivel'); // Esconde o botão
    body.className = `theme-${theme}`;
    
    const messagesForTheme = mensagens[theme];
    const randomIndex = Math.floor(Math.random() * messagesForTheme.length);
    textoMensagem.textContent = messagesForTheme[randomIndex];
    cardIcon.innerHTML = icons[theme];
    
    changeScreen(mainContainer);

    setTimeout(() => {
        magicParticles.forEach(p => {
            const x = (Math.random() - 0.5) * window.innerWidth * 0.8;
            const y = (Math.random() - 0.5) * window.innerHeight * 0.8;
            p.style.setProperty('--x', `${x}px`);
            p.style.setProperty('--y', `${y}px`);
        });

        mainContainer.classList.add('aberto');
        if (sfx) sfx.lockSfx.triggerAttackRelease("C5", "8n", Tone.now());
        if (sfx) sfx.particleSfx.triggerAttackRelease("2n", Tone.now() + 0.2);

        setTimeout(() => {
          cardContainer.classList.add('virado');
          if (sfx) sfx.flipSfx.triggerAttack(Tone.now());
          if (sfx) sfx.chimeSfx.triggerAttackRelease("G5", "2n", Tone.now() + 0.2);
        }, 1800);
        
        // CORREÇÃO: Mostra o botão com um delay seguro, adicionando a classe
        setTimeout(() => {
            actionButtonsContainer.classList.add('visivel');
        }, 3000);

    }, 100);

    setTimeout(() => isAnimating = false, 3500);
};

const resetAnimation = () => {
    actionButtonsContainer.classList.remove('visivel'); // Esconde o botão ao reiniciar
    cardContainer.classList.remove('virado');
    mainContainer.classList.remove('aberto');
    setTimeout(() => changeScreen(telaSelecao), 800);
};

// --- PARTÍCULAS INTERATIVAS ---
const createParticles = () => {
    for(let i = 0; i < 30; i++){
        let p = document.createElement('div');
        p.classList.add('particle');
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        p.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
        versoParticles.appendChild(p);
    }
};

const handleMouseMove = (e) => {
    const rect = cardVerso.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const moveX = x / -15;
    const moveY = y / -15;

    versoParticles.style.transform = `translate(${moveX}px, ${moveY}px)`;
};

// --- EVENT LISTENERS ---
telaInicio.addEventListener('click', () => {
    setupAudio();
    changeScreen(telaSelecao);
}, { once: true });

baus.forEach(bau => {
    bau.addEventListener('click', () => {
        const theme = bau.dataset.theme;
        startAnimation(theme);
    });
});

btnReset.addEventListener('click', resetAnimation);

cardVerso.addEventListener('mousemove', handleMouseMove);
cardVerso.addEventListener('mouseleave', () => {
    versoParticles.style.transform = 'translate(0, 0)';
});

// --- INICIALIZAÇÃO ---
createParticles();