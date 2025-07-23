// Funcții pentru particule moleculare
function createMolecules() {
  const container = document.getElementById('molecules');
  const particleCount = 60;
  const particles = [];
  
  container.innerHTML = '';
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('molecule');
    
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 150;
    particle.style.setProperty('--random-x', Math.cos(angle) * distance / 100);
    particle.style.setProperty('--random-y', Math.sin(angle) * distance / 100);
    
    const duration = 15 + Math.random() * 30;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    
    const size = 4 + Math.random() * 8;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    const opacity = 0.4 + Math.random() * 0.4;
    particle.style.opacity = opacity;
    
    container.appendChild(particle);
    particles.push({ element: particle, x, y });
  }
  
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i];
      const p2 = particles[j];
      
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 25) {
        const connector = document.createElement('div');
        connector.classList.add('molecule-connector');
        
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const length = distance * 0.9;
        
        connector.style.width = `${length}%`;
        connector.style.left = `${p2.x}%`;
        connector.style.top = `${p2.y}%`;
        connector.style.transform = `rotate(${angle}deg)`;
        connector.style.opacity = 0.5 - (distance / 50);
        
        container.appendChild(connector);
      }
    }
  }
  
  setTimeout(createMolecules, 20000);
}

// Funcție pentru trimiterea reclamațiilor pe Discord
async function sendToDiscord(data) {
  const webhookURL = 'https://discord.com/api/webhooks/1388484948423610409/jilZICMdhhHfqe-jcnLSqzaeiq7OHQLY2k0oXtjERY8oQZURU3DXggVYDyuuYllbKXZx';
  
  const embed = {
    title: "🚨 Nouă Reclamație Primita",
    color: 0xFF0000,
    fields: [
      { name: "👤 Nume", value: data.nume || "Nespecificat" },
      { name: "📧 Email", value: data.email || "Nespecificat" },
      { name: "📝 Mesaj", value: data.mesaj || "Nespecificat" }
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: "SkySMP Panel | " + new Date().toLocaleString()
    }
  };
  
  try {
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: "SkySMP Reclamatii",
        avatar_url: "https://i.imgur.com/JjQqQYq.png",
        embeds: [embed] 
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Eroare la trimitere:', error);
    return false;
  }
}

// Funcție pentru afișarea/ascunderea detaliilor actualizărilor
function showUpdateDetails(id) {
  const details = document.getElementById(`${id}-details`);
  const isVisible = details.style.display === 'block';
  
  // Ascunde toate detaliile mai întâi
  document.querySelectorAll('.update-details').forEach(el => {
    el.style.display = 'none';
  });
  
  // Arată doar elementul pe care s-a dat click dacă nu era vizibil
  if (!isVisible) {
    details.style.display = 'block';
    details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Funcție pentru deschiderea canalului de ticket pe Discord
function openTicketChannel() {
  const SERVER_ID = '1244692175715827874';
  const CHANNEL_ID = '1328774273690763328';
  
  window.open(`discord://discord.com/channels/${SERVER_ID}/${CHANNEL_ID}`, '_blank');
  
  setTimeout(() => {
    window.open(`https://discord.com/channels/${SERVER_ID}/${CHANNEL_ID}`, '_blank');
  }, 500);
}

// API pentru jucători online
async function fetchPlayersOnline() {
  const playersCountElem = document.getElementById("players-count");
  const playersListElem = document.getElementById("players-list");
  const serverStatusElem = document.getElementById("server-status-value");

  try {
    const response = await fetch("https://api.mcsrvstat.us/2/summer-smp3.aternos.me");
    if (!response.ok) throw new Error("Eroare API");
    const data = await response.json();
    
    if (data.online) {
      const online = data.players.online;
      playersCountElem.textContent = online;
      serverStatusElem.textContent = "Online";
      serverStatusElem.className = "server-status-value status-online";
      
      if (data.players.list && data.players.list.length > 0) {
        playersListElem.innerHTML = '';
        data.players.list.forEach(player => {
          const playerItem = document.createElement('div');
          playerItem.className = 'player-item';
          playerItem.innerHTML = `<i class="fas fa-user"></i> ${player}`;
          playersListElem.appendChild(playerItem);
        });
      } else {
        playersListElem.innerHTML = '<div class="player-item"><i class="fas fa-user"></i> Niciun jucător online</div>';
      }
    } else {
      playersCountElem.textContent = "0";
      serverStatusElem.textContent = "Offline";
      serverStatusElem.className = "server-status-value status-offline";
      playersListElem.innerHTML = '<div class="player-item"><i class="fas fa-user"></i> Server offline</div>';
    }
  } catch (err) {
    playersCountElem.textContent = "0";
    serverStatusElem.textContent = "Eroare";
    serverStatusElem.className = "server-status-value";
    playersListElem.innerHTML = '<div class="player-item"><i class="fas fa-exclamation-triangle"></i> Eroare la conexiune</div>';
  }
}

// Inițializare la încărcarea paginii
document.addEventListener('DOMContentLoaded', function() {
  // Particule și efecte
  createMolecules();
  
  // Verificare jucători online
  fetchPlayersOnline();
  setInterval(fetchPlayersOnline, 30000);
  
  // Ascunde detaliile actualizărilor inițial
  document.querySelectorAll('.update-details').forEach(el => {
    el.style.display = 'none';
  });
  
  // Evenimente click pentru știri
  document.querySelectorAll('.news-item').forEach(item => {
    item.addEventListener('click', function(e) {
      if (e.target.tagName !== 'A' && !e.target.classList.contains('no-toggle')) {
        const id = this.getAttribute('onclick').match(/showUpdateDetails\('(.*?)'\)/)[1];
        showUpdateDetails(id);
      }
    });
  });
  
  // Formular reclamații
  const form = document.getElementById("reclamatii-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const feedback = document.getElementById("reclamatii-feedback");
      feedback.textContent = "";
      feedback.className = "";
      
      const nume = form.nume.value.trim();
      const email = form.email.value.trim();
      const mesaj = form.mesaj.value.trim();
      
      if (!nume || !email || !mesaj) {
        feedback.textContent = "Te rugăm să completezi toate câmpurile.";
        feedback.className = "feedback error";
        return;
      }
      
      feedback.textContent = "Se trimite reclamația...";
      feedback.className = "feedback info";
      
      try {
        const success = await sendToDiscord({ nume, email, mesaj });
        
        if (success) {
          feedback.textContent = "Reclamația a fost trimisă cu succes!";
          feedback.className = "feedback success";
          form.reset();
        } else {
          feedback.textContent = "Eroare la trimitere. Încearcă din nou.";
          feedback.className = "feedback error";
        }
      } catch (error) {
        feedback.textContent = "Eroare de conexiune. Încearcă mai târziu.";
        feedback.className = "feedback error";
      }
    });
  }
  
  // Navigare între secțiuni
  const navLinks = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll("main section");

  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = link.dataset.target;
      
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
      
      sections.forEach(sec => {
        sec.classList.remove("active");
        if (sec.id === target) {
          setTimeout(() => sec.classList.add("active"), 10);
        }
      });
      
      document.getElementById(target).scrollIntoView({ behavior: 'smooth' });
    });
  });
});