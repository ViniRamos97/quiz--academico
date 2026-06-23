// HEADER COMPARTILHADO
(function() {
  const nome = localStorage.getItem('usuario') || 'Visitante';

  const header = document.createElement('header');
  header.id = 'site-header';
  header.innerHTML = `
    <div class="header-inner">
      <span class="header-user">👤 Olá, ${nome}!</span>
    </div>
  `;

  document.body.prepend(header);
})();