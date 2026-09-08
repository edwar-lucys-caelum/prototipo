/**
 * Collection Manager
 * Gestiona el estado de posesión, favoritos, lista de deseos, cantidades y métricas de colección
 * con soporte multiexpansión y múltiples perfiles de usuario.
 */

class CollectionManager {
  constructor(cardsList, supabaseService) {
    this.cards = cardsList || [];
    this.supabaseService = supabaseService;
    this.collection = {}; // { [cardId]: { cardId, isOwned, quantity, isWishlist, isFavorite, notes } }
    this.listeners = [];
  }

  setCards(newCardsList) {
    this.cards = newCardsList || [];
    this.notifyListeners();
  }

  async init(specificUserId = null) {
    this.collection = await this.supabaseService.getUserCollection(specificUserId);
    this.notifyListeners();
  }

  async switchUser(userId) {
    this.supabaseService.setUserId(userId);
    this.collection = await this.supabaseService.getUserCollection(userId);
    this.notifyListeners();
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    const stats = this.getStats();
    this.listeners.forEach(cb => cb(this.collection, stats));
  }

  getCardState(cardId) {
    return this.collection[cardId] || {
      cardId: cardId,
      isOwned: false,
      quantity: 0,
      isWishlist: false,
      isFavorite: false,
      notes: ""
    };
  }

  isCardOwned(cardId) {
    return !!this.collection[cardId]?.isOwned;
  }

  async toggleOwned(cardId) {
    const current = this.getCardState(cardId);
    const newOwned = !current.isOwned;
    const newQty = newOwned ? Math.max(1, current.quantity || 1) : 0;

    const updatedState = {
      ...current,
      isOwned: newOwned,
      quantity: newQty
    };

    this.collection[cardId] = updatedState;
    this.notifyListeners();

    await this.supabaseService.saveCardState(cardId, updatedState);
    return updatedState;
  }

  async setQuantity(cardId, quantity) {
    const qty = Math.max(0, parseInt(quantity) || 0);
    const current = this.getCardState(cardId);
    const isOwned = qty > 0;

    const updatedState = {
      ...current,
      isOwned: isOwned,
      quantity: qty
    };

    this.collection[cardId] = updatedState;
    this.notifyListeners();

    await this.supabaseService.saveCardState(cardId, updatedState);
    return updatedState;
  }

  async toggleFavorite(cardId) {
    const current = this.getCardState(cardId);
    const updatedState = {
      ...current,
      isFavorite: !current.isFavorite
    };

    this.collection[cardId] = updatedState;
    this.notifyListeners();

    await this.supabaseService.saveCardState(cardId, updatedState);
    return updatedState;
  }

  async toggleWishlist(cardId) {
    const current = this.getCardState(cardId);
    const updatedState = {
      ...current,
      isWishlist: !current.isWishlist
    };

    this.collection[cardId] = updatedState;
    this.notifyListeners();

    await this.supabaseService.saveCardState(cardId, updatedState);
    return updatedState;
  }

  async markAll(owned = true) {
    for (const card of this.cards) {
      const current = this.getCardState(card.id);
      this.collection[card.id] = {
        ...current,
        isOwned: owned,
        quantity: owned ? 1 : 0
      };
      await this.supabaseService.saveCardState(card.id, this.collection[card.id]);
    }
    this.notifyListeners();
  }

  async clearCollection() {
    for (const card of this.cards) {
      this.collection[card.id] = {
        cardId: card.id,
        isOwned: false,
        quantity: 0,
        isWishlist: false,
        isFavorite: false
      };
      await this.supabaseService.saveCardState(card.id, this.collection[card.id]);
    }
    this.notifyListeners();
  }

  // Estadísticas del set actualmente activo
  getStats() {
    const totalCards = this.cards.length;
    let ownedCount = 0;
    let totalCopies = 0;
    let favoritesCount = 0;
    let wishlistCount = 0;

    const byElement = {};
    const byRarity = {};

    this.cards.forEach(card => {
      // Element grouping
      const elem = card.elementType;
      if (!byElement[elem]) {
        byElement[elem] = { total: 0, owned: 0 };
      }
      byElement[elem].total++;

      // Rarity grouping
      const rar = card.rarity;
      if (!byRarity[rar]) {
        byRarity[rar] = { total: 0, owned: 0 };
      }
      byRarity[rar].total++;

      // User state check
      const userState = this.collection[card.id];
      if (userState) {
        if (userState.isOwned) {
          ownedCount++;
          totalCopies += (userState.quantity || 1);
          byElement[elem].owned++;
          byRarity[rar].owned++;
        }
        if (userState.isFavorite) favoritesCount++;
        if (userState.isWishlist) wishlistCount++;
      }
    });

    const completionPercentage = totalCards > 0 ? ((ownedCount / totalCards) * 100).toFixed(1) : "0.0";

    return {
      totalCards,
      ownedCount,
      missingCount: totalCards - ownedCount,
      totalCopies,
      favoritesCount,
      wishlistCount,
      completionPercentage,
      byElement,
      byRarity
    };
  }

  // Progreso para cualquier lista de cartas de una expansión dada
  getExpansionStats(expansionCards) {
    if (!expansionCards || expansionCards.length === 0) {
      return { total: 0, owned: 0, percentage: "0.0" };
    }
    let owned = 0;
    expansionCards.forEach(card => {
      if (this.collection[card.id]?.isOwned) {
        owned++;
      }
    });
    const percentage = ((owned / expansionCards.length) * 100).toFixed(1);
    return {
      total: expansionCards.length,
      owned: owned,
      percentage: percentage
    };
  }
}

// Exportar global
window.CollectionManager = CollectionManager;
