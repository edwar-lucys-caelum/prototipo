/**
 * Auth & Profile Manager
 * Gestiona el registro de nuevos usuarios / entrenadores, inicio de sesión,
 * cambio de perfil, avatares y sincronización con Supabase (tabla `profiles`) y respaldo local.
 */

class AuthManager {
  constructor(supabaseService) {
    this.supabaseService = supabaseService;
    this.storageKeyActiveUser = "pokemon_tcg_active_user";
    this.storageKeyProfiles = "pokemon_tcg_local_profiles";
    
    // Lista de avatares oficiales disponibles para los entrenadores
    this.availableAvatars = [
      { id: "trainer_red", name: "Red", icon: "🧢", color: "#ef4444", bg: "rgba(239, 68, 68, 0.2)" },
      { id: "trainer_ash", name: "Ash Ketchum", icon: "⚡", color: "#eab308", bg: "rgba(234, 179, 8, 0.2)" },
      { id: "trainer_serena", name: "Serena", icon: "🎀", color: "#ec4899", bg: "rgba(236, 72, 153, 0.2)" },
      { id: "trainer_cynthia", name: "Cynthia", icon: "👑", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.2)" },
      { id: "trainer_pikachu", name: "Pikachu Fan", icon: "🐭", color: "#fbbf24", bg: "rgba(251, 191, 36, 0.2)" },
      { id: "trainer_charizard", name: "Charizard Club", icon: "🔥", color: "#f97316", bg: "rgba(249, 115, 22, 0.2)" },
      { id: "trainer_greninja", name: "Ninja Master", icon: "🥷", color: "#38bdf8", bg: "rgba(56, 189, 248, 0.2)" },
      { id: "trainer_mewtwo", name: "Psíquico Elite", icon: "🔮", color: "#c084fc", bg: "rgba(192, 132, 252, 0.2)" },
      { id: "trainer_gengar", name: "Fantasma Fan", icon: "👻", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.2)" },
      { id: "trainer_lucario", name: "Aura Knight", icon: "🥊", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.2)" },
      { id: "trainer_rayquaza", name: "Dragon Lord", icon: "🐉", color: "#10b981", bg: "rgba(16, 185, 129, 0.2)" },
      { id: "trainer_eevee", name: "Eevee Squad", icon: "🦊", color: "#d97706", bg: "rgba(217, 119, 6, 0.2)" }
    ];

    this.currentUser = null;
    this.userChangeListeners = [];
  }

  async init() {
    const savedUser = this.getActiveUserFromStorage();
    if (savedUser) {
      this.currentUser = savedUser;
      // Actualizar el userId en supabaseService
      if (this.supabaseService) {
        this.supabaseService.setUserId(savedUser.id);
      }
    }
    return this.currentUser;
  }

  onUserChange(callback) {
    this.userChangeListeners.push(callback);
  }

  notifyUserChange() {
    this.userChangeListeners.forEach(cb => cb(this.currentUser));
  }

  getActiveUser() {
    return this.currentUser;
  }

  isLoggedIn() {
    return !!this.currentUser;
  }

  getActiveUserFromStorage() {
    try {
      const saved = localStorage.getItem(this.storageKeyActiveUser);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  getLocalProfiles() {
    try {
      const saved = localStorage.getItem(this.storageKeyProfiles);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveLocalProfiles(profiles) {
    localStorage.setItem(this.storageKeyProfiles, JSON.stringify(profiles));
  }

  // Obtener lista completa de perfiles (Local inmediata + Supabase en segundo plano)
  async getAllProfiles() {
    let profiles = this.getLocalProfiles();

    if (this.supabaseService && this.supabaseService.isConnected && this.supabaseService.client) {
      try {
        const { data, error } = await this.supabaseService.client
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const map = {};
          profiles.forEach(p => { map[p.id] = p; });
          data.forEach(p => {
            map[p.id] = {
              id: p.id,
              username: p.username,
              avatar: p.avatar_icon || "🧢",
              bio: p.bio || "Entrenador Pokémon TCG",
              createdAt: p.created_at
            };
          });
          profiles = Object.values(map);
          this.saveLocalProfiles(profiles);
        }
      } catch (e) {
        console.warn("No se pudieron cargar perfiles de Supabase, usando locales:", e);
      }
    }

    return profiles;
  }

  // Iniciar sesión con un usuario existente por su ID o Nombre (inmediato)
  async login(userIdOrUsername) {
    if (!userIdOrUsername) {
      throw new Error("Por favor selecciona un usuario o ingresa tu nombre.");
    }
    const cleanQuery = String(userIdOrUsername).trim().toLowerCase();
    let profiles = this.getLocalProfiles();
    let user = profiles.find(p => p.id === userIdOrUsername || p.username.toLowerCase() === cleanQuery);

    if (!user) {
      profiles = await this.getAllProfiles();
      user = profiles.find(p => p.id === userIdOrUsername || p.username.toLowerCase() === cleanQuery);
    }

    if (!user) {
      throw new Error(`El usuario "${userIdOrUsername}" no existe. Escribe su nombre y haz clic en "Registrar" para crearlo.`);
    }

    this.currentUser = user;
    localStorage.setItem(this.storageKeyActiveUser, JSON.stringify(user));
    
    if (this.supabaseService) {
      this.supabaseService.setUserId(user.id);
    }

    this.notifyUserChange();
    return user;
  }

  // Iniciar sesión si existe, o registrar automáticamente si es nuevo
  async loginOrRegister(username) {
    const trimmed = username.trim();
    if (!trimmed) {
      throw new Error("Por favor ingresa un nombre de usuario.");
    }

    const profiles = await this.getAllProfiles();
    const existing = profiles.find(p => p.username.toLowerCase() === trimmed.toLowerCase());

    if (existing) {
      return this.login(existing.id);
    } else {
      return this.register(trimmed);
    }
  }

  // Registrar un nuevo perfil de Entrenador
  async register(username, avatarIcon = "🧢", bio = "") {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      throw new Error("Por favor ingresa un nombre de usuario válido.");
    }

    if (trimmedUsername.length < 2) {
      throw new Error("El nombre de usuario debe tener al menos 2 caracteres.");
    }

    const profiles = await this.getAllProfiles();
    const exists = profiles.some(p => p.username.toLowerCase() === trimmedUsername.toLowerCase());
    if (exists) {
      throw new Error(`El usuario "${trimmedUsername}" ya está registrado. Selecciona iniciar sesión o elige otro nombre.`);
    }

    // Generar ID único amigable para la base de datos
    const userId = "trainer_" + trimmedUsername.toLowerCase().replace(/[^a-z0-9]/g, "_") + "_" + Math.random().toString(36).substring(2, 6);
    
    const newProfile = {
      id: userId,
      username: trimmedUsername,
      avatar: avatarIcon,
      bio: bio.trim() || `Entrenador oficial de Pokémon TCG`,
      createdAt: new Date().toISOString()
    };

    // 1. Guardar en local
    profiles.push(newProfile);
    this.saveLocalProfiles(profiles);

    // 2. Guardar en Supabase si está disponible
    if (this.supabaseService && this.supabaseService.isConnected && this.supabaseService.client) {
      try {
        const { error } = await this.supabaseService.client
          .from("profiles")
          .upsert({
            id: newProfile.id,
            username: newProfile.username,
            avatar_icon: newProfile.avatar,
            bio: newProfile.bio,
            created_at: newProfile.createdAt
          }, { onConflict: "id" });

        if (error) {
          console.warn("Aviso al guardar perfil en Supabase (se guardó en local):", error.message);
        }
      } catch (e) {
        console.warn("Excepción al guardar perfil en Supabase:", e);
      }
    }

    // Establecer como usuario activo
    this.currentUser = newProfile;
    localStorage.setItem(this.storageKeyActiveUser, JSON.stringify(newProfile));
    
    if (this.supabaseService) {
      this.supabaseService.setUserId(newProfile.id);
    }

    this.notifyUserChange();
    return newProfile;
  }

  // Cerrar sesión
  logout() {
    this.currentUser = null;
    localStorage.removeItem(this.storageKeyActiveUser);
    this.notifyUserChange();
  }

  // Eliminar un perfil completamente (Local y Supabase)
  async deleteProfile(userId) {
    if (!userId) return false;

    // 1. Quitar de la lista local
    let profiles = this.getLocalProfiles();
    profiles = profiles.filter(p => p.id !== userId);
    this.saveLocalProfiles(profiles);

    // 2. Limpiar colección local de ese usuario
    try {
      localStorage.removeItem(`pokemon_tcg_collection_${userId}`);
    } catch (e) {
      console.warn("Aviso al remover colección local:", e);
    }

    // 3. Eliminar de Supabase si está disponible
    if (this.supabaseService && this.supabaseService.isConnected && this.supabaseService.client) {
      try {
        await this.supabaseService.client
          .from("user_cards")
          .delete()
          .eq("user_id", userId);

        await this.supabaseService.client
          .from("profiles")
          .delete()
          .eq("id", userId);
      } catch (e) {
        console.warn("Aviso al eliminar perfil en Supabase:", e);
      }
    }

    // 4. Si el usuario eliminado era el activo, cerrar sesión
    if (this.currentUser && this.currentUser.id === userId) {
      this.logout();
    }
    return true;
  }
}

// Instanciar globalmente
window.AuthManager = AuthManager;
