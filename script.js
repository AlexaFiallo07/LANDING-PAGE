document.addEventListener('DOMContentLoaded', () => {

  // ==================== 1. EFECTO PARALLAX (MOVIMIENTO DEL MOUSE) ====================
  document.addEventListener('mousemove', (e) => {
    const layers = document.querySelectorAll('.parallax-layer');
    const x = (window.innerWidth - e.pageX) / 50;
    const y = (window.innerHeight - e.pageY) / 50;

    layers.forEach(layer => {
      const speed = layer.getAttribute('data-speed') || 1;
      layer.style.transform = `translateX(${x * speed}px) translateY(${y * speed}px)`;
    });
  });

  // ==================== 2. CONTROL DEL MODAL DE LOGIN ====================
  const loginModal = document.getElementById('loginModal');
  const modalCard = document.getElementById('modalCard');
  const btnOpenLogin = document.getElementById('btn-open-login');
  const btnCloseLogin = document.getElementById('btn-close-login');
  const loginForm = document.getElementById('login-form');

  function toggleModal() {
    if (loginModal.classList.contains('hidden')) {
      loginModal.classList.remove('hidden');
      setTimeout(() => {
        loginModal.classList.remove('opacity-0');
        modalCard.classList.remove('scale-95');
      }, 10);
    } else {
      loginModal.classList.add('opacity-0');
      modalCard.classList.add('scale-95');
      setTimeout(() => {
        loginModal.classList.add('hidden');
      }, 300);
    }
  }

  if (btnOpenLogin) btnOpenLogin.addEventListener('click', toggleModal);
  if (btnCloseLogin) btnCloseLogin.addEventListener('click', toggleModal);

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡Inicio de sesión simulado con éxito!');
      toggleModal();
    });
  }

  // ==================== 3. LÓGICA DEL MINIJUEGO INTERACTIVO ====================
  let score = 0;
  let timeLeft = 15;
  let timerId = null;

  const btnStartGame = document.getElementById('btn-start-game');
  const scoreDisplay = document.getElementById('score');
  const timerDisplay = document.getElementById('timer');
  const gameBody = document.getElementById('game-body');

  if (btnStartGame) {
    btnStartGame.addEventListener('click', startGame);
  }

  function startGame() {
    score = 0;
    timeLeft = 15;
    scoreDisplay.innerText = score;
    timerDisplay.innerText = timeLeft + 's';
    
    nextRound();

    if (timerId) clearInterval(timerId);
    
    timerId = setInterval(() => {
      timeLeft--;
      timerDisplay.innerText = timeLeft + 's';
      if (timeLeft <= 0) {
        clearInterval(timerId);
        endGame();
      }
    }, 1000);
  }

  function nextRound() {
    const tasks = [
      { label: "📦 Registrar Venta Nueva", color: "bg-brand-primary" },
      { label: "⚠️ Alerta de Stock Bajo", color: "bg-brand-warning text-brand-dark" },
      { label: "🤖 Ejecutar Predicción IA", color: "bg-brand-success" }
    ];
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];

    gameBody.innerHTML = `
      <p class="text-xs text-gray-300">¡Rápido! Haz clic en la acción correcta:</p>
      <button id="btn-action" class="w-full font-poppins font-bold ${randomTask.color} text-white py-3.5 rounded-xl shadow-lg transform active:scale-95 transition">
        ${randomTask.label}
      </button>
    `;

    document.getElementById('btn-action').addEventListener('click', () => {
      score += 10;
      scoreDisplay.innerText = score;
      nextRound();
    });
  }

  function endGame() {
    gameBody.innerHTML = `
      <div class="py-2">
        <p class="font-poppins font-bold text-lg text-brand-warning">¡Tiempo Agotado!</p>
        <p class="text-xs text-gray-200 mt-1 mb-4">Lograste procesar <strong>${score / 10} operaciones</strong> en tu PYME.</p>
        <button id="btn-restart" class="w-full font-poppins font-bold bg-brand-primary text-white py-3 rounded-xl hover:bg-blue-600 transition">
          Volver a Jugar
        </button>
      </div>
    `;

    document.getElementById('btn-restart').addEventListener('click', startGame);
  }

});