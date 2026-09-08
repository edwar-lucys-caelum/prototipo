/**
 * Controlador Principal de la Aplicación Pokémon TCG Multiexpansión
 * Coordina el Catálogo de Expansiones, Autenticación y Registro de Usuarios,
 * Galería Interactiva con escaneos oficiales en alta resolución y sincronización con Supabase.
 */

document.addEventListener("DOMContentLoaded", async () => {
  // ============================================================================
  // ESTADO GLOBAL DE LA APLICACIÓN
  // ============================================================================
  const state = {
    currentView: "expansions", // 'expansions' | 'gallery'
    currentExpansionId: "cri",
    selectedSeries: "all",
    searchQuery: "",
    selectedElement: "all",
    selectedRarity: "Todas",
    collectionFilter: "all", // 'all' | 'owned' | 'missing' | 'favorites' | 'wishlist'
    sortBy: "number_asc",
    viewMode: "grid", // 'grid' | 'list'
    currentModalCard: null,
    selectedAvatarForReg: "🧢"
  };

  // Instancias de servicios globales
  const supabaseService = window.supabaseService;
  const authManager = new window.AuthManager(supabaseService);
  const collectionManager = new window.CollectionManager([], supabaseService);

  // ============================================================================
  // ELEMENTOS DEL DOM
  // ============================================================================

  // Vistas
  const expansionsSection = document.getElementById("expansionsSection");
  const cardsGallerySection = document.getElementById("cardsGallerySection");
  const expansionsGridContainer = document.getElementById("expansionsGridContainer");
  const btnNavExpansions = document.getElementById("btnNavExpansions");
  const btnBackToExpansions = document.getElementById("btnBackToExpansions");
  const navBrandHome = document.getElementById("navBrandHome");
  const seriesTabButtons = document.querySelectorAll(".series-tab-btn");

  // Perfil de Usuario en Header
  const btnTrainerProfile = document.getElementById("btnTrainerProfile");
  const headerUserAvatar = document.getElementById("headerUserAvatar");
  const headerUsername = document.getElementById("headerUsername");
  const headerUserStats = document.getElementById("headerUserStats");

  // Hero Banner de la Expansión
  const heroSetCode = document.getElementById("heroSetCode");
  const heroReleaseDate = document.getElementById("heroReleaseDate");
  const heroOfficialLink = document.getElementById("heroOfficialLink");
  const heroPokedexiaLink = document.getElementById("heroPokedexiaLink");
  const heroExpansionTitle = document.getElementById("heroExpansionTitle");
  const heroExpansionDesc = document.getElementById("heroExpansionDesc");

  // Estadísticas de Colección
  const statProgressPercentEl = document.getElementById("statProgressPercent");
  const statProgressBarFillEl = document.getElementById("statProgressBarFill");
  const statOwnedCountEl = document.getElementById("statOwnedCount");
  const statMissingCountEl = document.getElementById("statMissingCount");
  const statTotalCopiesEl = document.getElementById("statTotalCopies");
  const statFavoritesCountEl = document.getElementById("statFavoritesCount");

  // Controles de Búsqueda y Filtros de la Galería
  const cardsGridEl = document.getElementById("cardsGrid");
  const searchInputEl = document.getElementById("searchInput");
  const elementChipsContainerEl = document.getElementById("elementChipsContainer");
  const rarityChipsContainerEl = document.getElementById("rarityChipsContainer");
  const raritySelectEl = document.getElementById("raritySelect");
  const sortSelectEl = document.getElementById("sortSelect");
  const tabButtons = document.querySelectorAll(".quick-filter-tabs .tab-btn");
  const viewGridBtn = document.getElementById("viewGridBtn");
  const viewListBtn = document.getElementById("viewListBtn");
  const resultsCountEl = document.getElementById("resultsCount");
  const markAllBtn = document.getElementById("markAllBtn");
  const clearAllBtn = document.getElementById("clearAllBtn");

  // Modales y Acceso de Usuario
  const userAuthModal = document.getElementById("userAuthModal");
  const closeUserAuthModal = document.getElementById("closeUserAuthModal");
  const authLoginForm = document.getElementById("authLoginForm");
  const authUsernameInput = document.getElementById("authUsernameInput");
  const btnActionLogin = document.getElementById("btnActionLogin");
  const btnActionRegister = document.getElementById("btnActionRegister");
  const authStatusMessage = document.getElementById("authStatusMessage");
  const profilesListContainer = document.getElementById("profilesListContainer");

  const cardInspectorModal = document.getElementById("cardInspectorModal");
  const closeCardModal = document.getElementById("closeCardModal");
  const inspectorContent = document.getElementById("inspectorContent");

  const supabaseModal = document.getElementById("supabaseModal");
  const btnOpenSupabase = document.getElementById("btnOpenSupabase");
  const closeSupabaseModal = document.getElementById("closeSupabaseModal");
  const supabaseStatusBadge = document.getElementById("supabaseStatusBadge");
  const supabaseUrlInput = document.getElementById("supabaseUrlInput");
  const supabaseKeyInput = document.getElementById("supabaseKeyInput");
  const btnSaveSupabase = document.getElementById("btnSaveSupabase");
  const btnSeedSupabase = document.getElementById("btnSeedSupabase");
  const btnCopySql = document.getElementById("btnCopySql");
  const supabaseTestResult = document.getElementById("supabaseTestResult");

  const btnExportData = document.getElementById("btnExportData");
  const fileImportInput = document.getElementById("fileImportInput");
  const btnLogoutUser = document.getElementById("btnLogoutUser");

  // ============================================================================
  // 1. INICIALIZACIÓN DE LA APLICACIÓN
  // ============================================================================

  async function initializeApp() {
    // A. Inicializar Auth Manager
    await authManager.init();
    const activeUser = authManager.getActiveUser();

    // B. Renderizar Filtros
    renderElementChips();
    renderRarityChips();

    // C. Suscribirse a cambios de Colección
    collectionManager.onChange((collection, stats) => {
      updateStatsUI(stats);
      updateUserProfileUI();
      if (state.currentView === "expansions") {
        renderExpansionsHub();
      } else {
        renderCards();
      }
    });

    // D. Suscribirse a cambios de Usuario
    authManager.onUserChange(async (user) => {
      updateUserProfileUI();
      if (user) {
        await collectionManager.switchUser(user.id);
      }
      renderExpansionsHub();
      if (state.currentView === "gallery") {
        renderCards();
      }
    });

    supabaseService.onStatusChange((status, message) => {
      updateSupabaseStatusUI(status, message);
    });

    // E. Control de Acceso: Si NO hay usuario activo, abrir modal de inicio de sesión
    if (!activeUser) {
      openAuthModal(true);
      renderExpansionsHub();
    } else {
      const currentCards = window.getCardsForExpansion(state.currentExpansionId);
      collectionManager.setCards(currentCards);
      await collectionManager.init(activeUser.id);
      updateUserProfileUI();
      showExpansionsView();
    }
  }

  // ============================================================================
  // 2. NAVEGACIÓN ENTRE VISTAS (EXPANSIONES HUB vs GALERÍA)
  // ============================================================================

  function showExpansionsView() {
    state.currentView = "expansions";
    expansionsSection.style.display = "block";
    cardsGallerySection.style.display = "none";
    if (btnNavExpansions) btnNavExpansions.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
    renderExpansionsHub();
  }

  function showGalleryView(expansionId) {
    state.currentView = "gallery";
    state.currentExpansionId = expansionId;
    expansionsSection.style.display = "none";
    cardsGallerySection.style.display = "block";
    if (btnNavExpansions) btnNavExpansions.classList.remove("active");

    const expansion = window.getExpansionById(expansionId);
    const cards = window.getCardsForExpansion(expansionId);

    // Actualizar Hero Banner
    if (heroSetCode) heroSetCode.textContent = `${expansion.code} / ${expansion.seriesCode || expansion.code}`;
    if (heroReleaseDate) heroReleaseDate.textContent = `Lanzamiento ${expansion.releaseDate}`;
    if (heroOfficialLink) heroOfficialLink.href = expansion.officialUrl || "#";
    if (heroPokedexiaLink) heroPokedexiaLink.href = expansion.pokedexiaUrl || "#";
    if (heroExpansionTitle) heroExpansionTitle.textContent = expansion.nameEs;
    if (heroExpansionDesc) heroExpansionDesc.textContent = expansion.description;

    // Actualizar colección
    collectionManager.setCards(cards);
    window.scrollTo({ top: 0, behavior: "smooth" });

    renderElementChips();
    renderRarityChips();
    renderCards();
  }

  // ============================================================================
  // 3. RENDERIZAR EXPANSIONES HUB (CATÁLOGO MULTI-SERIE OFICIAL)
  // ============================================================================

  function renderExpansionsHub() {
    if (!expansionsGridContainer) return;

    let expansions = window.POKEMON_EXPANSIONS_DATA || [];
    if (state.selectedSeries !== "all") {
      expansions = expansions.filter(e => e.series.toLowerCase() === state.selectedSeries.toLowerCase());
    }

    expansionsGridContainer.innerHTML = expansions.map(exp => {
      const expCards = window.getCardsForExpansion(exp.id);
      const stats = collectionManager.getExpansionStats(expCards);
      const badgeClass = exp.badgeType === "date" ? "date" : "code";

      return `
        <article class="expansion-card" data-expansion-id="${exp.id}" title="Abrir ${exp.nameEs}">
          <div class="expansion-card-top-bar">
            <span class="expansion-pill-badge ${badgeClass}">${exp.badgeText || exp.code}</span>
          </div>

          <div class="expansion-card-logo-container">
            ${exp.logoSvg || `<h3 style="color:#0f172a; font-size:1.25rem; font-weight:900; text-align:center;">${exp.nameEs}</h3>`}
          </div>

          <div class="expansion-card-footer-info">
            <div class="expansion-card-name-label" title="${exp.nameEs}">${exp.nameEs}</div>
            <div class="expansion-progress-row">
              <span>Colección: <strong>${stats.owned}/${exp.totalCards}</strong></span>
              <span style="color: #0284c7;">${stats.percentage}%</span>
            </div>
            <div class="expansion-mini-progress-bar">
              <div class="expansion-mini-progress-fill" style="width: ${stats.percentage}%;"></div>
            </div>
          </div>
        </article>
      `;
    }).join("");

    // Event listeners para abrir expansión
    expansionsGridContainer.querySelectorAll(".expansion-card").forEach(el => {
      el.addEventListener("click", () => {
        const expId = el.getAttribute("data-expansion-id");
        if (expId) {
          showGalleryView(expId);
        }
      });
    });
  }

  // ============================================================================
  // 4. GESTIÓN DE PERFILES DE ENTRENADOR & MODAL DE INICIO DE SESIÓN
  // ============================================================================

  function updateUserProfileUI() {
    const user = authManager.getActiveUser();
    if (!user) {
      headerUserAvatar.textContent = "👤";
      headerUsername.textContent = "Sin Iniciar";
      headerUserStats.textContent = "0 cartas";
      return;
    }

    headerUserAvatar.textContent = user.avatar || "🧢";
    headerUsername.textContent = user.username;

    // Calcular total de cartas coleccionadas por este usuario en todas las expansiones
    const allCards = window.getAllRegisteredCards();
    const stats = collectionManager.getExpansionStats(allCards);
    headerUserStats.textContent = `${stats.owned} cartas`;
  }

  async function openAuthModal(isForced = false) {
    userAuthModal.classList.add("active");
    authStatusMessage.textContent = "";
    
    // Si no hay usuario activo, ocultar botón cerrar para obligar a autenticarse
    if (isForced || !authManager.getActiveUser()) {
      closeUserAuthModal.style.display = "none";
    } else {
      closeUserAuthModal.style.display = "flex";
    }

    await renderProfilesList();
    setTimeout(() => authUsernameInput && authUsernameInput.focus(), 150);
  }

  function closeAuthModal() {
    // No permitir cerrar si no hay ningún usuario activo
    if (!authManager.getActiveUser()) {
      showToast("Por favor ingresa tu nombre de usuario para comenzar.", "info");
      return;
    }
    userAuthModal.classList.remove("active");
    authStatusMessage.textContent = "";
  }

  async function renderProfilesList() {
    if (!profilesListContainer) return;
    profilesListContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.8rem;">Cargando perfiles...</p>';
    const profiles = await authManager.getAllProfiles();
    const activeUser = authManager.getActiveUser();

    if (profiles.length === 0) {
      profilesListContainer.innerHTML = `
        <p style="color: var(--text-muted); font-size: 0.8rem; text-align: center; margin: 0.5rem 0;">
          No hay usuarios registrados aún. ¡Escribe tu nombre arriba para comenzar!
        </p>
      `;
      return;
    }

    profilesListContainer.innerHTML = profiles.map(p => {
      const isActive = activeUser && activeUser.id === p.id;
      return `
        <div class="profile-card-item ${isActive ? 'active' : ''}" data-user-id="${p.id}" data-username="${p.username}" style="padding: 0.5rem 0.75rem; margin-bottom: 0.4rem; display: flex; justify-content: space-between; align-items: center;">
          <div class="profile-card-left" data-user-id="${p.id}" style="cursor: pointer; display: flex; align-items: center; gap: 0.6rem; flex: 1;">
            <div class="profile-card-avatar" style="width: 32px; height: 32px; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.08); border-radius: 50%;">${p.avatar || '🧢'}</div>
            <div class="profile-card-info">
              <h4 style="font-size: 0.85rem; margin-bottom: 0; color: #fff;">${p.username} ${isActive ? '<span style="color: #38bdf8; font-size: 0.7rem; font-weight: bold;">(Activo)</span>' : ''}</h4>
            </div>
          </div>
          <div style="display: flex; gap: 0.35rem; align-items: center;">
            <button type="button" class="btn-sm btn-select-user" data-user-id="${p.id}" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; background: ${isActive ? '#10b981' : 'var(--type-agua)'}; color: #fff; border: none; border-radius: 4px; cursor: pointer;">
              ${isActive ? '✓ En Uso' : 'Entrar'}
            </button>
            <button type="button" class="btn-sm btn-delete-user" data-user-id="${p.id}" data-username="${p.username}" title="Eliminar perfil definitivamente" style="padding: 0.3rem 0.5rem; font-size: 0.75rem; background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 4px; cursor: pointer;">
              🗑️
            </button>
          </div>
        </div>
      `;
    }).join("");

    // Función auxiliar para seleccionar usuario
    const handleSelectUser = async (userId) => {
      if (!userId) return;
      try {
        const user = await authManager.login(userId);
        const currentCards = window.getCardsForExpansion(state.currentExpansionId);
        collectionManager.setCards(currentCards);
        await collectionManager.init(user.id);
        showToast(`¡Sesión iniciada como ${user.username}!`);
        userAuthModal.classList.remove("active");
        if (authUsernameInput) authUsernameInput.value = "";
        updateUserProfileUI();
        if (state.currentView === "expansions") {
          renderExpansionsHub();
        } else {
          renderCards();
        }
      } catch (err) {
        authStatusMessage.style.color = "#ef4444";
        authStatusMessage.textContent = err.message;
      }
    };

    // Event listeners para seleccionar usuario al hacer clic en la tarjeta o botón Entrar
    profilesListContainer.querySelectorAll(".profile-card-item").forEach(item => {
      item.addEventListener("click", async (e) => {
        if (e.target.closest(".btn-delete-user")) return; // No seleccionar si se hace clic en borrar
        e.preventDefault();
        const userId = item.getAttribute("data-user-id");
        await handleSelectUser(userId);
      });
    });

    // Event listeners para eliminar usuario
    profilesListContainer.querySelectorAll(".btn-delete-user").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const userId = btn.getAttribute("data-user-id");
        const username = btn.getAttribute("data-username");
        if (!userId) return;

        const confirmed = confirm(`¿Estás seguro de que deseas eliminar al entrenador "${username}" y su colección?`);
        if (!confirmed) return;

        btn.disabled = true;
        btn.textContent = "⏳";

        const wasActive = activeUser && activeUser.id === userId;
        await authManager.deleteProfile(userId);
        showToast(`Perfil "${username}" eliminado correctamente.`, "info");

        if (wasActive) {
          const currentCards = window.getCardsForExpansion(state.currentExpansionId);
          collectionManager.setCards(currentCards);
          await collectionManager.init(null);
        }

        await renderProfilesList();
        updateUserProfileUI();

        if (state.currentView === "expansions") {
          renderExpansionsHub();
        } else {
          renderCards();
        }

        if (!authManager.getActiveUser()) {
          openAuthModal(true);
        }
      });
    });
  }

  function renderAvatarPicker() {
    if (!avatarPickerContainer) return;
    avatarPickerContainer.innerHTML = authManager.availableAvatars.map(av => `
      <button type="button" class="avatar-option-btn ${state.selectedAvatarForReg === av.icon ? 'selected' : ''}" data-avatar="${av.icon}">
        <span class="avatar-option-icon">${av.icon}</span>
        <span class="avatar-option-name">${av.name}</span>
      </button>
    `).join("");

    avatarPickerContainer.querySelectorAll(".avatar-option-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        avatarPickerContainer.querySelectorAll(".avatar-option-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.selectedAvatarForReg = btn.getAttribute("data-avatar") || "🧢";
      });
    });
  }

  // ============================================================================
  // 5. FILTRADO Y RENDERIZADO DE CARTAS
  // ============================================================================

  function getFilteredAndSortedCards() {
    const currentCards = window.getCardsForExpansion(state.currentExpansionId);

    return currentCards.filter(card => {
      // 1. Búsqueda por texto
      if (state.searchQuery.trim() !== "") {
        const q = state.searchQuery.toLowerCase().trim();
        const matchNameEs = card.nameEs.toLowerCase().includes(q);
        const matchNameEn = card.nameEn.toLowerCase().includes(q);
        const matchNumber = card.cardNumber.toLowerCase().includes(q);
        const matchAttacks = card.attacks && card.attacks.some(a => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
        if (!matchNameEs && !matchNameEn && !matchNumber && !matchAttacks) {
          return false;
        }
      }

      // 2. Filtro por Elemento
      if (state.selectedElement !== "all") {
        if (card.elementType !== state.selectedElement) {
          return false;
        }
      }

      // 3. Filtro por Rareza
      if (state.selectedRarity !== "Todas" && state.selectedRarity !== "all") {
        if (card.rarity !== state.selectedRarity) {
          return false;
        }
      }

      // 4. Filtro por Colección
      const cardState = collectionManager.getCardState(card.id);
      if (state.collectionFilter === "owned" && !cardState.isOwned) return false;
      if (state.collectionFilter === "missing" && cardState.isOwned) return false;
      if (state.collectionFilter === "favorites" && !cardState.isFavorite) return false;
      if (state.collectionFilter === "wishlist" && !cardState.isWishlist) return false;

      return true;
    }).sort((a, b) => {
      const numA = parseInt(a.cardNumber.split("/")[0]) || 0;
      const numB = parseInt(b.cardNumber.split("/")[0]) || 0;

      switch (state.sortBy) {
        case "number_asc": return numA - numB;
        case "number_desc": return numB - numA;
        case "name_asc": return a.nameEs.localeCompare(b.nameEs);
        case "name_desc": return b.nameEs.localeCompare(a.nameEs);
        case "hp_desc": return (b.hp || 0) - (a.hp || 0);
        case "hp_asc": return (a.hp || 0) - (b.hp || 0);
        default: return numA - numB;
      }
    });
  }

  function renderCards() {
    if (!cardsGridEl) return;

    const filteredCards = getFilteredAndSortedCards();
    const currentCards = window.getCardsForExpansion(state.currentExpansionId);

    // Actualizar contador
    resultsCountEl.innerHTML = `Mostrando <strong>${filteredCards.length}</strong> de <strong>${currentCards.length}</strong> cartas oficiales`;

    if (filteredCards.length === 0) {
      cardsGridEl.innerHTML = `
        <div class="empty-results-box" style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; background: var(--bg-glass); border-radius: var(--radius-lg); border: 1px dashed var(--border-glass);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3 style="font-size: 1.3rem; margin-bottom: 0.5rem; color: #fff;">No se encontraron cartas</h3>
          <p style="color: var(--text-muted); max-width: 450px; margin: 0 auto 1.5rem;">Intenta cambiar el término de búsqueda, elemento o filtro de rareza seleccionado.</p>
          <button id="btnResetFilters" class="btn btn-secondary">Limpiar Filtros</button>
        </div>
      `;
      const btnReset = document.getElementById("btnResetFilters");
      if (btnReset) {
        btnReset.addEventListener("click", () => {
          state.searchQuery = "";
          state.selectedElement = "all";
          state.selectedRarity = "Todas";
          state.collectionFilter = "all";
          searchInputEl.value = "";
          raritySelectEl.value = "Todas";
          updateChipActiveStates();
          renderCards();
        });
      }
      return;
    }

    // Modo Cuadrícula vs Lista
    if (state.viewMode === "list") {
      cardsGridEl.className = "cards-grid list-mode";
    } else {
      cardsGridEl.className = "cards-grid";
    }

    cardsGridEl.innerHTML = filteredCards.map(card => {
      const userState = collectionManager.getCardState(card.id);
      const isOwned = userState.isOwned;
      const qty = userState.quantity || (isOwned ? 1 : 0);
      const isFav = userState.isFavorite;
      const isWish = userState.isWishlist;

      const rarityTier = window.RARITY_TIERS.find(r => r.id === card.rarity) || { symbol: "★", color: "#818cf8", bg: "rgba(129, 140, 248, 0.15)" };

      return `
        <div class="card-item-wrapper ${isOwned ? 'owned' : 'missing'}" data-card-id="${card.id}">
          <div class="pokemon-card-container">
            <div class="card-image-wrap" data-card-id="${card.id}">
              <img 
                src="${card.image}" 
                alt="${card.nameEs} - ${card.cardNumber}" 
                class="pokemon-card-scan"
                loading="lazy"
                onerror="this.onerror=null; this.src='https://limitlesstcg.nyc3.cdn.digitaloceanspaces.com/tpci/CRI/CRI_001_R_ES_MD.png';"
              >
              <div class="card-foil-overlay"></div>
              
              <!-- Badges Superiores -->
              <div class="card-top-badges">
                <span class="card-number-badge">${card.cardNumber}</span>
                <span class="card-rarity-symbol-badge" style="color: ${rarityTier.color}; background: ${rarityTier.bg};" title="${card.rarity}">
                  ${rarityTier.symbol} ${card.rarity}
                </span>
              </div>

              <!-- Badges de Estado -->
              <div class="card-status-indicators">
                ${isFav ? '<span class="status-icon fav" title="Favorita">❤️</span>' : ''}
                ${isWish ? '<span class="status-icon wish" title="Lista de Deseos">⭐</span>' : ''}
                ${isOwned ? `<span class="status-icon qty" title="Copias en Colección">x${qty}</span>` : ''}
              </div>
            </div>

            <!-- Panel de Información y Acciones Rápidas -->
            <div class="card-meta-bar">
              <div class="card-name-row">
                <div class="card-title-text">
                  <span class="card-name-main">${card.nameEs}</span>
                  ${card.hp ? `<span class="card-hp-badge">${card.hp} PS</span>` : ''}
                </div>
                <span class="card-element-pill type-${card.elementType.toLowerCase()}">${card.elementType}</span>
              </div>

              <div class="card-actions-toolbar">
                <button class="action-btn toggle-owned-btn ${isOwned ? 'active' : ''}" data-card-id="${card.id}" title="${isOwned ? 'Marcar como no poseída' : 'Marcar como en colección'}">
                  ${isOwned ? '✓ En Colección' : '+ Coleccionar'}
                </button>

                <div class="qty-control-group">
                  <button class="qty-btn btn-minus" data-card-id="${card.id}" title="Restar copia">-</button>
                  <span class="qty-value">${qty}</span>
                  <button class="qty-btn btn-plus" data-card-id="${card.id}" title="Sumar copia">+</button>
                </div>

                <button class="icon-toggle-btn fav-btn ${isFav ? 'active' : ''}" data-card-id="${card.id}" title="Favorito">
                  ${isFav ? '❤️' : '🤍'}
                </button>

                <button class="icon-toggle-btn wish-btn ${isWish ? 'active' : ''}" data-card-id="${card.id}" title="Lista de Deseos">
                  ${isWish ? '⭐' : '☆'}
                </button>

                <button class="action-btn inspect-btn" data-card-id="${card.id}" title="Ver detalles y ataques">
                  🔍
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    attachCardEventListeners();
  }

  // ============================================================================
  // 6. EVENT LISTENERS DE LAS CARTAS (MARCAR, CANTIDAD, FAVORITOS, 3D TILT)
  // ============================================================================

  function attachCardEventListeners() {
    // 1. Alternar estado En Colección (+ / ✓)
    cardsGridEl.querySelectorAll(".toggle-owned-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const cardId = btn.getAttribute("data-card-id");
        await collectionManager.toggleOwned(cardId);
      });
    });

    // 2. Incrementar / Disminuir Cantidad
    cardsGridEl.querySelectorAll(".btn-plus").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const cardId = btn.getAttribute("data-card-id");
        const current = collectionManager.getCardState(cardId);
        await collectionManager.setQuantity(cardId, (current.quantity || 0) + 1);
      });
    });

    cardsGridEl.querySelectorAll(".btn-minus").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const cardId = btn.getAttribute("data-card-id");
        const current = collectionManager.getCardState(cardId);
        await collectionManager.setQuantity(cardId, Math.max(0, (current.quantity || 1) - 1));
      });
    });

    // 3. Favorito y Wishlist
    cardsGridEl.querySelectorAll(".fav-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const cardId = btn.getAttribute("data-card-id");
        await collectionManager.toggleFavorite(cardId);
      });
    });

    cardsGridEl.querySelectorAll(".wish-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const cardId = btn.getAttribute("data-card-id");
        await collectionManager.toggleWishlist(cardId);
      });
    });

    // 4. Modal de Inspección
    cardsGridEl.querySelectorAll(".inspect-btn, .card-image-wrap").forEach(el => {
      el.addEventListener("click", (e) => {
        const cardId = el.getAttribute("data-card-id");
        openCardModal(cardId);
      });
    });

    // 5. Efecto 3D Tilt y Shaders Holográficos
    cardsGridEl.querySelectorAll(".pokemon-card-container").forEach(cardContainer => {
      cardContainer.addEventListener("mousemove", handleCardTilt);
      cardContainer.addEventListener("mouseleave", handleCardTiltReset);
    });
  }

  function handleCardTilt(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    this.style.zIndex = "10";
    this.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

    const foil = this.querySelector(".card-foil-overlay");
    if (foil) {
      const posX = (x / rect.width) * 100;
      const posY = (y / rect.height) * 100;
      foil.style.backgroundPosition = `${posX}% ${posY}%`;
      foil.style.opacity = "0.6";
    }
  }

  function handleCardTiltReset() {
    this.style.zIndex = "1";
    this.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)";
    const foil = this.querySelector(".card-foil-overlay");
    if (foil) {
      foil.style.opacity = "0";
    }
  }

  // ============================================================================
  // 7. RENDERIZADO DE CHIPS DE ELEMENTO Y RAREZA
  // ============================================================================

  function renderElementChips() {
    if (!elementChipsContainerEl) return;
    elementChipsContainerEl.innerHTML = window.ELEMENT_TYPES.map(elem => `
      <button class="element-chip ${state.selectedElement === elem.id ? 'active' : ''}" data-element="${elem.id}">
        <span>${elem.icon}</span>
        <span>${elem.name}</span>
      </button>
    `).join("");

    elementChipsContainerEl.querySelectorAll(".element-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        state.selectedElement = chip.getAttribute("data-element") || "all";
        updateChipActiveStates();
        renderCards();
      });
    });
  }

  function renderRarityChips() {
    if (!rarityChipsContainerEl) return;
    rarityChipsContainerEl.innerHTML = window.RARITY_TIERS.map(rar => `
      <button class="element-chip rarity-chip ${state.selectedRarity === rar.id ? 'active' : ''}" data-rarity="${rar.id}" style="border-color: ${rar.color};">
        <span style="color: ${rar.color};">${rar.symbol}</span>
        <span>${rar.name}</span>
      </button>
    `).join("");

    rarityChipsContainerEl.querySelectorAll(".rarity-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        state.selectedRarity = chip.getAttribute("data-rarity") || "all";
        if (raritySelectEl) {
          raritySelectEl.value = state.selectedRarity === "all" ? "Todas" : state.selectedRarity;
        }
        updateChipActiveStates();
        renderCards();
      });
    });
  }

  function updateChipActiveStates() {
    if (elementChipsContainerEl) {
      elementChipsContainerEl.querySelectorAll(".element-chip").forEach(chip => {
        chip.classList.toggle("active", chip.getAttribute("data-element") === state.selectedElement);
      });
    }

    if (rarityChipsContainerEl) {
      rarityChipsContainerEl.querySelectorAll(".rarity-chip").forEach(chip => {
        chip.classList.toggle("active", chip.getAttribute("data-rarity") === state.selectedRarity);
      });
    }
  }

  // ============================================================================
  // 8. INSPECTOR DE CARTA (MODAL)
  // ============================================================================

  function openCardModal(cardId) {
    const allCards = window.getAllRegisteredCards();
    const card = allCards.find(c => c.id === cardId);
    if (!card) return;

    state.currentModalCard = card;
    const userState = collectionManager.getCardState(card.id);
    const rarityTier = window.RARITY_TIERS.find(r => r.id === card.rarity) || { symbol: "★", color: "#818cf8" };

    inspectorContent.innerHTML = `
      <div class="card-inspector-layout">
        <div class="inspector-visual-column">
          <div class="inspector-card-frame">
            <img src="${card.image}" alt="${card.nameEs}" class="inspector-card-image">
            <div class="card-foil-overlay" style="opacity: 0.4;"></div>
          </div>
        </div>

        <div class="inspector-info-column">
          <div class="inspector-header">
            <div>
              <span class="badge-tag set-code">${card.expansionCode} • ${card.cardNumber}</span>
              <h2 style="font-size: 1.6rem; font-weight: 900; color: #fff; margin-top: 0.35rem;">${card.nameEs}</h2>
              <p style="color: var(--text-muted); font-size: 0.85rem;">${card.nameEn} • ${card.subType || 'Pokémon'}</p>
            </div>
            ${card.hp ? `<div class="inspector-hp">${card.hp} <span style="font-size: 0.8rem;">PS</span></div>` : ''}
          </div>

          <div class="inspector-tags-row" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
            <span class="card-element-pill type-${card.elementType.toLowerCase()}">${card.elementType}</span>
            <span class="badge-tag" style="border-color: ${rarityTier.color}; color: ${rarityTier.color};">${rarityTier.symbol} ${card.rarity}</span>
            ${card.marketPrice ? `<span class="badge-tag" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">💶 Mercado: ${card.marketPrice}</span>` : ''}
          </div>

          <!-- Ataques y Habilidades -->
          <div class="inspector-attacks-list">
            <h4 style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.6rem; text-transform: uppercase; letter-spacing: 0.05em;">Ataques y Efectos</h4>
            ${card.attacks && card.attacks.length > 0 ? card.attacks.map(atk => `
              <div class="attack-item-card" style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); border-radius: var(--radius-md); padding: 0.85rem 1rem; margin-bottom: 0.6rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                  <span style="font-weight: 800; color: #fff; font-size: 0.95rem;">${atk.name}</span>
                  <span style="font-weight: 900; color: var(--text-accent); font-size: 1.1rem;">${atk.damage || ''}</span>
                </div>
                <p style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.4;">${atk.description || 'Sin efectos adicionales.'}</p>
              </div>
            `).join("") : '<p style="color: var(--text-muted); font-size: 0.85rem;">Carta de soporte / entrenador.</p>'}
          </div>

          <!-- Controles de Colección en Modal -->
          <div class="inspector-controls-box" style="margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-glass); display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button id="modalToggleOwnedBtn" class="btn ${userState.isOwned ? 'btn-secondary' : 'btn-supabase'}" style="flex: 1;">
              <span>${userState.isOwned ? '✓ En Colección (Marcar No Poseída)' : '+ Agregar a Colección'}</span>
            </button>
            <button id="modalToggleFavBtn" class="btn btn-secondary">
              <span>${userState.isFavorite ? '❤️ Favorita' : '🤍 Favorito'}</span>
            </button>
            <button id="modalToggleWishBtn" class="btn btn-secondary">
              <span>${userState.isWishlist ? '⭐ En Deseos' : '☆ Deseos'}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Event listeners dentro del modal
    document.getElementById("modalToggleOwnedBtn").addEventListener("click", async () => {
      await collectionManager.toggleOwned(card.id);
      openCardModal(card.id);
    });

    document.getElementById("modalToggleFavBtn").addEventListener("click", async () => {
      await collectionManager.toggleFavorite(card.id);
      openCardModal(card.id);
    });

    document.getElementById("modalToggleWishBtn").addEventListener("click", async () => {
      await collectionManager.toggleWishlist(card.id);
      openCardModal(card.id);
    });

    cardInspectorModal.classList.add("active");
  }

  function closeCardInspectorModal() {
    cardInspectorModal.classList.remove("active");
    state.currentModalCard = null;
  }

  // ============================================================================
  // 9. ACTUALIZACIÓN DE ESTADÍSTICAS UI
  // ============================================================================

  function updateStatsUI(stats) {
    if (!statProgressPercentEl) return;
    statProgressPercentEl.textContent = `${stats.completionPercentage}%`;
    statProgressBarFillEl.style.width = `${stats.completionPercentage}%`;
    statOwnedCountEl.textContent = `${stats.ownedCount} / ${stats.totalCards}`;
    statMissingCountEl.textContent = `${stats.missingCount}`;
    statTotalCopiesEl.textContent = `${stats.totalCopies}`;
    statFavoritesCountEl.textContent = `${stats.favoritesCount}`;
  }

  function updateSupabaseStatusUI(status, message) {
    if (!supabaseStatusBadge) return;
    if (status === "connected") {
      supabaseStatusBadge.innerHTML = `<span class="status-dot connected" title="Conexión en la Nube Activa"></span>`;
    } else if (status === "error") {
      supabaseStatusBadge.innerHTML = `<span class="status-dot error" title="Error de Conexión"></span>`;
    } else {
      supabaseStatusBadge.innerHTML = `<span class="status-dot connected" title="Sistema Activo"></span>`;
    }
  }

  // ============================================================================
  // 10. NOTIFICACIONES TOAST
  // ============================================================================

  function showToast(message, type = "success") {
    const existing = document.querySelector(".toast-notification");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }

  // ============================================================================
  // 11. EVENT LISTENERS GENERALES
  // ============================================================================

  // Navegación
  if (btnNavExpansions) btnNavExpansions.addEventListener("click", showExpansionsView);
  if (btnBackToExpansions) btnBackToExpansions.addEventListener("click", showExpansionsView);
  if (navBrandHome) navBrandHome.addEventListener("click", showExpansionsView);

  // Filtros de Serie en Expansions Hub
  seriesTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      seriesTabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.selectedSeries = btn.getAttribute("data-series") || "all";
      renderExpansionsHub();
    });
  });

  // Modal de Acceso de Entrenador (Solo Nombre de Usuario)
  btnTrainerProfile.addEventListener("click", () => openAuthModal(false));
  if (btnLogoutUser) {
    btnLogoutUser.addEventListener("click", () => openAuthModal(false));
  }
  closeUserAuthModal.addEventListener("click", closeAuthModal);
  userAuthModal.addEventListener("click", (e) => {
    if (e.target === userAuthModal) closeAuthModal();
  });

  async function handleLoginAction() {
    const username = authUsernameInput.value.trim();
    if (!username) {
      authStatusMessage.style.color = "#ef4444";
      authStatusMessage.textContent = "Por favor escribe tu nombre de usuario.";
      authUsernameInput.focus();
      return;
    }

    try {
      btnActionLogin.disabled = true;
      btnActionLogin.innerHTML = "<span>Iniciando...</span>";
      authStatusMessage.textContent = "";

      const user = await authManager.login(username);
      const currentCards = window.getCardsForExpansion(state.currentExpansionId);
      collectionManager.setCards(currentCards);
      await collectionManager.init(user.id);

      showToast(`¡Bienvenido de nuevo, Entrenador ${user.username}!`);
      authUsernameInput.value = "";
      userAuthModal.classList.remove("active");
      authStatusMessage.textContent = "";
      updateUserProfileUI();
      showExpansionsView();
    } catch (err) {
      authStatusMessage.style.color = "#f59e0b";
      authStatusMessage.textContent = err.message;
    } finally {
      btnActionLogin.disabled = false;
      btnActionLogin.innerHTML = "<span>▶ Iniciar Sesión</span>";
    }
  }

  async function handleRegisterAction() {
    const username = authUsernameInput.value.trim();
    if (!username) {
      authStatusMessage.style.color = "#ef4444";
      authStatusMessage.textContent = "Por favor escribe el nombre para tu nuevo usuario.";
      authUsernameInput.focus();
      return;
    }

    try {
      btnActionRegister.disabled = true;
      btnActionRegister.innerHTML = "<span>Registrando...</span>";
      authStatusMessage.textContent = "";

      const user = await authManager.register(username);
      const currentCards = window.getCardsForExpansion(state.currentExpansionId);
      collectionManager.setCards(currentCards);
      await collectionManager.init(user.id);

      showToast(`¡Entrenador ${user.username} registrado con éxito!`);
      authUsernameInput.value = "";
      userAuthModal.classList.remove("active");
      authStatusMessage.textContent = "";
      updateUserProfileUI();
      showExpansionsView();
    } catch (err) {
      authStatusMessage.style.color = "#ef4444";
      authStatusMessage.textContent = err.message;
    } finally {
      btnActionRegister.disabled = false;
      btnActionRegister.innerHTML = "<span>✨ Registrar</span>";
    }
  }

  if (authLoginForm) {
    authLoginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleLoginAction();
    });
  }

  if (btnActionLogin) {
    btnActionLogin.addEventListener("click", handleLoginAction);
  }

  if (btnActionRegister) {
    btnActionRegister.addEventListener("click", handleRegisterAction);
  }

  // Buscador y Filtros Rápidos
  searchInputEl.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderCards();
  });

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.collectionFilter = btn.getAttribute("data-filter");
      renderCards();
    });
  });

  raritySelectEl.addEventListener("change", (e) => {
    state.selectedRarity = e.target.value;
    updateChipActiveStates();
    renderCards();
  });

  sortSelectEl.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    renderCards();
  });

  viewGridBtn.addEventListener("click", () => {
    state.viewMode = "grid";
    viewGridBtn.classList.add("active");
    viewListBtn.classList.remove("active");
    renderCards();
  });

  viewListBtn.addEventListener("click", () => {
    state.viewMode = "list";
    viewListBtn.classList.add("active");
    viewGridBtn.classList.remove("active");
    renderCards();
  });

  markAllBtn.addEventListener("click", async () => {
    if (confirm("¿Deseas marcar todas las cartas de esta expansión como coleccionadas?")) {
      await collectionManager.markAll(true);
      showToast("¡Todas las cartas marcadas en tu colección!");
    }
  });

  clearAllBtn.addEventListener("click", async () => {
    if (confirm("¿Deseas desmarcar todas las cartas de esta expansión?")) {
      await collectionManager.clearCollection();
      showToast("Colección de esta expansión desmarcada.");
    }
  });

  // Modal de Carta
  closeCardModal.addEventListener("click", closeCardInspectorModal);
  cardInspectorModal.addEventListener("click", (e) => {
    if (e.target === cardInspectorModal) closeCardInspectorModal();
  });

  // Modal Supabase
  if (btnOpenSupabase) {
    btnOpenSupabase.addEventListener("click", () => {
      supabaseUrlInput.value = supabaseService.config.supabaseUrl || "";
      supabaseKeyInput.value = supabaseService.config.supabaseKey || "";
      supabaseModal.classList.add("active");
    });
  }

  closeSupabaseModal.addEventListener("click", () => {
    supabaseModal.classList.remove("active");
  });

  supabaseModal.addEventListener("click", (e) => {
    if (e.target === supabaseModal) supabaseModal.classList.remove("active");
  });

  btnSaveSupabase.addEventListener("click", async () => {
    const url = supabaseUrlInput.value.trim();
    const key = supabaseKeyInput.value.trim();

    supabaseTestResult.innerHTML = '<span style="color: #38bdf8;">Conectando con Supabase...</span>';
    const res = await supabaseService.saveConfig(url, key);

    if (res.success) {
      supabaseTestResult.innerHTML = '<span style="color: #10b981;">✓ ' + res.message + '</span>';
      showToast("Conexión con Supabase guardada correctamente.");
      // Recargar colección desde Supabase
      await collectionManager.init(authManager.getActiveUser()?.id);
    } else {
      supabaseTestResult.innerHTML = '<span style="color: #ef4444;">❌ ' + res.message + '</span>';
    }
  });

  btnSeedSupabase.addEventListener("click", async () => {
    try {
      btnSeedSupabase.disabled = true;
      btnSeedSupabase.textContent = "Sincronizando...";
      const cards = window.getCardsForExpansion(state.currentExpansionId);
      const res = await supabaseService.seedCardsCatalogToSupabase(cards, state.currentExpansionId);
      showToast(`¡${res.count} cartas de ${state.currentExpansionId.toUpperCase()} sincronizadas en Supabase!`);
    } catch (err) {
      alert("Error al sincronizar: " + err.message);
    } finally {
      btnSeedSupabase.disabled = false;
      btnSeedSupabase.textContent = "Sincronizar Catálogo a Supabase";
    }
  });

  btnCopySql.addEventListener("click", () => {
    const sqlText = document.getElementById("sqlSchemaPreview").textContent;
    navigator.clipboard.writeText(sqlText).then(() => {
      btnCopySql.textContent = "✓ ¡Copiado!";
      setTimeout(() => { btnCopySql.textContent = "📋 Copiar SQL"; }, 2000);
      showToast("Código SQL copiado al portapapeles.");
    });
  });

  // Exportar / Importar (si existen en el DOM)
  if (btnExportData) {
    btnExportData.addEventListener("click", () => {
      const user = authManager.getActiveUser();
      const currentCards = window.getCardsForExpansion(state.currentExpansionId);
      const exp = window.getExpansionById(state.currentExpansionId);
      const jsonStr = supabaseService.exportDataJson(collectionManager.collection, currentCards, exp.nameEs);
      
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pokemon_tcg_coleccion_${user ? user.username : 'entrenador'}_${state.currentExpansionId}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Colección exportada con éxito.");
    });
  }

  if (fileImportInput) {
    fileImportInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (evt) => {
        const content = evt.target.result;
        const res = await supabaseService.importDataJson(content);
        if (res.success) {
          await collectionManager.init(authManager.getActiveUser()?.id);
          showToast(`¡Colección importada con éxito (${res.count} registros)!`);
        } else {
          alert("Error al importar: " + res.message);
        }
        fileImportInput.value = "";
      };
      reader.readAsText(file);
    });
  }

  // Teclado (Escape para cerrar modales)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCardInspectorModal();
      closeAuthModal();
      supabaseModal.classList.remove("active");
    }
  });

  // Iniciar Aplicación
  await initializeApp();
});
