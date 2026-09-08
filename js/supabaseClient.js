/**
 * Supabase Client & Sincronización de Base de Datos
 * Maneja la conexión con Supabase o modo local con localStorage automático.
 */

class SupabaseService {
  constructor() {
    this.storageKeyConfig = "pokemon_tcg_supabase_config";
    this.userId = this.getOrCreateUserId();
    this.client = null;
    this.isConnected = false;
    this.statusListeners = [];
    
    // Cargar configuración guardada
    this.config = this.loadConfig();
    this.initClient();
  }

  getStorageKeyForUser(userId) {
    return `pokemon_tcg_collection_${userId || this.userId}`;
  }

  getOrCreateUserId() {
    let id = localStorage.getItem("pokemon_tcg_user_id");
    if (!id) {
      id = "trainer_ash_" + Date.now();
      localStorage.setItem("pokemon_tcg_user_id", id);
    }
    return id;
  }

  setUserId(userId) {
    if (userId && this.userId !== userId) {
      this.userId = userId;
      localStorage.setItem("pokemon_tcg_user_id", userId);
    }
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem(this.storageKeyConfig);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.supabaseUrl && parsed.supabaseKey) {
          return {
            ...parsed,
            supabaseUrl: this.sanitizeUrl(parsed.supabaseUrl)
          };
        }
      }
    } catch (e) {
      console.error("Error al cargar config de Supabase:", e);
    }
    return {
      supabaseUrl: "https://juobgzfvlwgxxxcghsmt.supabase.co",
      supabaseKey: "sb_publishable_T_4IoABaZpr5uIhImByXfA_NY25rHtu",
      tableName: "user_cards"
    };
  }

  sanitizeUrl(url) {
    if (!url) return "";
    return url.trim().replace(/\/rest\/v1\/?$/i, "").replace(/\/+$/, "");
  }

  saveConfig(url, key) {
    this.config.supabaseUrl = this.sanitizeUrl(url);
    this.config.supabaseKey = (key || "").trim();
    localStorage.setItem(this.storageKeyConfig, JSON.stringify(this.config));
    return this.initClient();
  }

  async initClient() {
    if (this.config.supabaseUrl && this.config.supabaseKey && window.supabase) {
      try {
        this.client = window.supabase.createClient(this.config.supabaseUrl, this.config.supabaseKey);
        
        // Probar conexión rápida
        const { error } = await this.client.from("cards").select("id").limit(1);
        if (error && error.code !== "PGRST116" && !error.message.includes("does not exist")) {
          console.warn("Supabase respondió con aviso:", error.message);
        }
        this.isConnected = true;
        this.notifyStatus("connected", "Conectado a Supabase en la nube");
        return { success: true, message: "Conectado a Supabase correctamente" };
      } catch (err) {
        console.error("Fallo al conectar con Supabase:", err);
        this.isConnected = false;
        this.notifyStatus("error", "Error al conectar: " + err.message);
        return { success: false, message: err.message };
      }
    } else {
      this.client = null;
      this.isConnected = false;
      this.notifyStatus("local", "Modo Local (LocalStorage activo)");
      return { success: true, mode: "local", message: "Usando almacenamiento local" };
    }
  }

  onStatusChange(callback) {
    this.statusListeners.push(callback);
    // Notificar estado actual de inmediato
    callback(this.isConnected ? "connected" : "local", this.getStatusMessage());
  }

  notifyStatus(status, message) {
    this.statusListeners.forEach(cb => cb(status, message));
  }

  getStatusMessage() {
    if (this.isConnected) {
      return `Conectado a Supabase (${this.config.supabaseUrl.split("//")[1]?.split(".")[0] || "Cloud"})`;
    }
    return "Modo Local Activo (Sin Supabase configurado)";
  }

  // --- MÉTODOS DE COLECCIÓN AISLADA POR USUARIO ---

  // Obtener toda la colección del usuario activo (Supabase con fallback a Local)
  async getUserCollection(specificUserId = null) {
    const targetUserId = specificUserId || this.userId;
    const userStorageKey = this.getStorageKeyForUser(targetUserId);

    // 1. Si está conectado a Supabase, intentar leer de la nube
    if (this.isConnected && this.client) {
      try {
        const { data, error } = await this.client
          .from("user_cards")
          .select("*")
          .eq("user_id", targetUserId);

        if (!error && data) {
          const map = {};
          data.forEach(row => {
            map[row.card_id] = {
              cardId: row.card_id,
              isOwned: row.is_owned,
              quantity: row.quantity || (row.is_owned ? 1 : 0),
              isWishlist: row.is_wishlist || false,
              isFavorite: row.is_favorite || false,
              notes: row.notes || "",
              updatedAt: row.updated_at
            };
          });
          // Actualizar caché local de respaldo para este usuario
          localStorage.setItem(userStorageKey, JSON.stringify(map));
          return map;
        }
      } catch (e) {
        console.warn("Fallo lectura de Supabase, usando respaldo local:", e);
      }
    }

    // 2. Modo LocalStorage por usuario
    try {
      const saved = localStorage.getItem(userStorageKey);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Error al leer colección local:", e);
      return {};
    }
  }

  // Guardar cambio de estado de una carta para el usuario activo
  async saveCardState(cardId, state, specificUserId = null) {
    const targetUserId = specificUserId || this.userId;
    const userStorageKey = this.getStorageKeyForUser(targetUserId);

    // 1. Guardar siempre en local de forma inmediata
    let localData = {};
    try {
      const saved = localStorage.getItem(userStorageKey);
      localData = saved ? JSON.parse(saved) : {};
    } catch (e) {
      localData = {};
    }

    localData[cardId] = {
      cardId: cardId,
      isOwned: !!state.isOwned,
      quantity: typeof state.quantity === "number" ? state.quantity : (state.isOwned ? 1 : 0),
      isWishlist: !!state.isWishlist,
      isFavorite: !!state.isFavorite,
      notes: state.notes || "",
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(userStorageKey, JSON.stringify(localData));

    // 2. Si hay conexión con Supabase, sincronizar en la nube
    if (this.isConnected && this.client) {
      try {
        const payload = {
          user_id: targetUserId,
          card_id: cardId,
          is_owned: localData[cardId].isOwned,
          quantity: localData[cardId].quantity,
          is_wishlist: localData[cardId].isWishlist,
          is_favorite: localData[cardId].isFavorite,
          notes: localData[cardId].notes,
          updated_at: new Date().toISOString()
        };

        const { error } = await this.client
          .from("user_cards")
          .upsert(payload, { onConflict: "user_id,card_id" });

        if (error) {
          console.error("Error al guardar en Supabase:", error.message);
        }
      } catch (err) {
        console.error("Excepción al guardar en Supabase:", err);
      }
    }

    return localData[cardId];
  }

  // Sincronizar todo el catálogo de cartas a la tabla `cards` en Supabase
  async seedCardsCatalogToSupabase(cardsList, expansionId = "cri") {
    if (!this.isConnected || !this.client) {
      throw new Error("Primero debes conectar tu proyecto de Supabase.");
    }

    const formattedCards = cardsList.map(c => ({
      id: c.id,
      expansion_id: c.expansionId || expansionId,
      card_number: c.cardNumber,
      name_es: c.nameEs,
      name_en: c.nameEn,
      element_type: c.elementType,
      sub_type: c.subType,
      hp: c.hp || null,
      rarity: c.rarity,
      artist: c.artist || "The Pokémon Company TCG",
      image_url: c.image,
      attacks: c.attacks || [],
      weakness: c.weakness || null,
      resistance: c.resistance || null,
      retreat_cost: c.retreatCost || 0,
      flavor_text: c.flavorText || "",
      is_secret: !!c.isSecret
    }));

    const { data, error } = await this.client
      .from("cards")
      .upsert(formattedCards, { onConflict: "id" });

    if (error) {
      throw error;
    }

    return { success: true, count: formattedCards.length };
  }

  // Exportar datos a JSON
  exportDataJson(collectionMap, cardsList, expansionName = "Caos Creciente") {
    const exportObj = {
      version: "2.0",
      expansion: expansionName,
      exportDate: new Date().toISOString(),
      userId: this.userId,
      collection: collectionMap,
      summary: {
        totalCardsInSet: cardsList.length,
        ownedCount: Object.values(collectionMap).filter(c => c.isOwned).length
      }
    };
    return JSON.stringify(exportObj, null, 2);
  }

  // Importar datos desde JSON
  async importDataJson(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.collection && typeof data.collection === "object") {
        const userStorageKey = this.getStorageKeyForUser(this.userId);
        localStorage.setItem(userStorageKey, JSON.stringify(data.collection));
        
        // Sincronizar en Supabase si está conectado
        if (this.isConnected && this.client) {
          const updates = Object.values(data.collection).map(c => ({
            user_id: this.userId,
            card_id: c.cardId,
            is_owned: !!c.isOwned,
            quantity: c.quantity || 1,
            is_wishlist: !!c.isWishlist,
            is_favorite: !!c.isFavorite,
            notes: c.notes || "",
            updated_at: new Date().toISOString()
          }));

          await this.client.from("user_cards").upsert(updates, { onConflict: "user_id,card_id" });
        }
        return { success: true, count: Object.keys(data.collection).length };
      }
      throw new Error("Formato de archivo inválido.");
    } catch (e) {
      return { success: false, message: e.message };
    }
  }
}

// Exportar instancia global
window.supabaseService = new SupabaseService();
