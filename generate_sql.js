/**
 * Generador automático del script SQL Completo para Supabase
 * Genera 'supabase_schema.sql' con las 25 expansiones oficiales de Pokedexia
 * y todas las cartas registradas en la base de datos.
 */

const fs = require('fs');
global.window = global;

// Cargar expansiones
const expCode = fs.readFileSync('js/expansionsData.js', 'utf8');
eval(expCode);
const expansions = global.POKEMON_EXPANSIONS_DATA;

// Cargar cartas
const cardsCode = fs.readFileSync('js/cardsData.js', 'utf8');
eval(cardsCode);
const allCards = global.getAllRegisteredCards();

const esc = (s) => (s !== null && s !== undefined ? `'${String(s).replace(/'/g, "''")}'` : 'NULL');

let sql = `-- ==============================================================================
-- POKÉMON TCG DATABASE SCHEMA - SUPABASE POSTGRESQL (ACTUALIZADO / MULTIEXPANSIÓN)
-- Soporte Completo Multiexpansión (Pokedexia Oficial: 25 Expansiones)
-- Perfiles de Entrenador / Inicio de Sesión y Colecciones Aisladas por Usuario
-- ==============================================================================
-- Instrucciones:
-- 1. Ve a tu proyecto de Supabase (https://supabase.com/dashboard)
-- 2. Entra en "SQL Editor" en la barra lateral izquierda
-- 3. Pega este script completo y haz clic en "RUN"
-- ==============================================================================

-- 1. Habilitar extensión UUID para identificadores universales
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Limpieza de tablas previas para migrar a la estructura multiexpansión limpia
DROP TABLE IF EXISTS public.user_cards CASCADE;
DROP TABLE IF EXISTS public.cards CASCADE;
DROP TABLE IF EXISTS public.expansions CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ==============================================================================
-- 3. TABLA: PROFILES (Perfiles de Entrenadores / Usuarios)
-- ==============================================================================
CREATE TABLE public.profiles (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    avatar_icon TEXT DEFAULT '🧢',
    bio TEXT DEFAULT 'Entrenador oficial de Pokémon TCG',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. TABLA: EXPANSIONS (Catálogo Oficial de Expansiones de Pokedexia)
-- ==============================================================================
CREATE TABLE public.expansions (
    id TEXT PRIMARY KEY,                     -- ej. 'dtr', '30th', 'cri', 'pre', 'ssp', 'scr', 'mew'
    code TEXT UNIQUE NOT NULL,               -- ej. 'DELTA', '30TH', 'CRI', 'PRE', 'SSP'
    series_code TEXT,                        -- ej. 'ME06', 'ME30', 'ME04', 'SV08.5', 'SV08'
    name_es TEXT NOT NULL,
    name_en TEXT NOT NULL,
    series TEXT NOT NULL,                    -- ej. 'Megaevolución', 'Escarlata y Púrpura', 'Espada y Escudo'
    total_cards INT NOT NULL,
    base_cards INT,
    secret_cards INT,
    release_date TEXT,
    pokedexia_url TEXT,
    official_url TEXT,
    banner_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 5. TABLA: CARDS (Catálogo Oficial de Cartas Pokémon TCG con expansion_id)
-- ==============================================================================
CREATE TABLE public.cards (
    id TEXT PRIMARY KEY,                     -- ej. 'cri-001', 'dtr-001', '30th-001', 'pre-160'
    expansion_id TEXT NOT NULL REFERENCES public.expansions(id) ON DELETE CASCADE,
    card_number TEXT NOT NULL,               -- ej. '001/086', '001/095', '160/175'
    name_es TEXT NOT NULL,
    name_en TEXT NOT NULL,
    element_type TEXT NOT NULL,              -- ej. 'Planta', 'Fuego', 'Agua', 'Rayo', 'Psíquico', 'Lucha', 'Oscura', 'Metal', 'Dragón', 'Incoloro'
    sub_type TEXT DEFAULT 'Básico',          -- ej. 'Básico', 'Fase 1', 'Fase 2', 'ex', 'Megaevolución ex', 'Partidario'
    hp INT,
    rarity TEXT NOT NULL,                    -- ej. 'Común', 'Infrecuente', 'Rara', 'Doble Rara ex', 'Megaevolución ex', 'Rara Ilustración Especial'
    artist TEXT,
    image_url TEXT NOT NULL,
    market_price TEXT,
    attacks JSONB DEFAULT '[]'::jsonb,
    weakness TEXT,
    resistance TEXT,
    retreat_cost INT DEFAULT 1,
    flavor_text TEXT,
    is_secret BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 6. TABLA: USER_CARDS (Colección Personal Aislada por Entrenador)
-- ==============================================================================
CREATE TABLE public.user_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    card_id TEXT NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
    is_owned BOOLEAN DEFAULT false,
    quantity INT DEFAULT 0,
    is_wishlist BOOLEAN DEFAULT false,
    is_favorite BOOLEAN DEFAULT false,
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, card_id)
);

-- ==============================================================================
-- 7. ÍNDICES PARA CONSULTAS DE ALTO RENDIMIENTO
-- ==============================================================================
CREATE INDEX idx_cards_expansion_id ON public.cards(expansion_id);
CREATE INDEX idx_cards_element_type ON public.cards(element_type);
CREATE INDEX idx_cards_rarity ON public.cards(rarity);
CREATE INDEX idx_cards_number ON public.cards(card_number);
CREATE INDEX idx_user_cards_user_id ON public.user_cards(user_id);
CREATE INDEX idx_user_cards_card_id ON public.user_cards(card_id);
CREATE INDEX idx_user_cards_is_owned ON public.user_cards(user_id, is_owned);

-- ==============================================================================
-- 8. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expansions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cards ENABLE ROW LEVEL SECURITY;

-- Profiles: Acceso lectura y escritura
CREATE POLICY "Public Profiles Select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Profiles Insert" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Profiles Update" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Public Profiles Delete" ON public.profiles FOR DELETE USING (true);

-- Expansions: Acceso catálogo
CREATE POLICY "Public Expansions Select" ON public.expansions FOR SELECT USING (true);
CREATE POLICY "Public Expansions Insert" ON public.expansions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Expansions Update" ON public.expansions FOR UPDATE USING (true);

-- Cards: Acceso cartas
CREATE POLICY "Public Cards Select" ON public.cards FOR SELECT USING (true);
CREATE POLICY "Public Cards Insert" ON public.cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Cards Update" ON public.cards FOR UPDATE USING (true);

-- User Cards: Colección de cada usuario
CREATE POLICY "Public UserCards Select" ON public.user_cards FOR SELECT USING (true);
CREATE POLICY "Public UserCards Insert" ON public.user_cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Public UserCards Update" ON public.user_cards FOR UPDATE USING (true);
CREATE POLICY "Public UserCards Delete" ON public.user_cards FOR DELETE USING (true);

-- ==============================================================================
-- 9. TRIGGERS AUTOMÁTICOS PARA TIMESTAMPS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_user_cards_updated_at
    BEFORE UPDATE ON public.user_cards
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 10. SEED DATA: PERFILES DE ENTRENADOR INICIALES
-- ==============================================================================
INSERT INTO public.profiles (id, username, avatar_icon, bio) VALUES
('trainer_ash', 'Ash Ketchum', '⚡', '¡Maestro Pokémon de Pueblo Paleta!'),
('trainer_red', 'Red', '🧢', 'Entrenador legendario de la cima del Monte Plateado.'),
('trainer_cynthia', 'Cynthia', '👑', 'Campeona de la Liga Pokémon de Sinnoh.'),
('trainer_serena', 'Serena', '🎀', 'Coordinadora y Entrenadora de Kalos.')
ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    avatar_icon = EXCLUDED.avatar_icon;

-- ==============================================================================
-- 11. SEED DATA: LAS 25 EXPANSIONES OFICIALES DE POKEDEXIA
-- ==============================================================================
INSERT INTO public.expansions (id, code, series_code, name_es, name_en, series, total_cards, base_cards, secret_cards, release_date, pokedexia_url, official_url, banner_url) VALUES
`;

const expRows = expansions.map(e => {
  return `(${esc(e.id)}, ${esc(e.code)}, ${esc(e.seriesCode || e.code)}, ${esc(e.nameEs)}, ${esc(e.nameEn)}, ${esc(e.series)}, ${e.totalCards}, ${e.baseSetCards || e.totalCards}, ${e.secretCards || 0}, ${esc(e.releaseDate)}, ${esc(e.pokedexiaUrl)}, ${esc(e.officialUrl)}, ${esc(e.bannerUrl || '')})`;
});

sql += expRows.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET\n    name_es = EXCLUDED.name_es,\n    name_en = EXCLUDED.name_en,\n    series = EXCLUDED.series,\n    total_cards = EXCLUDED.total_cards,\n    release_date = EXCLUDED.release_date,\n    pokedexia_url = EXCLUDED.pokedexia_url;\n\n`;

sql += `-- ==============================================================================
-- 12. SEED DATA: ${allCards.length} CARTAS OFICIALES EN ALTA DEFINICIÓN
-- ==============================================================================
INSERT INTO public.cards (id, expansion_id, card_number, name_es, name_en, element_type, sub_type, hp, rarity, artist, image_url, market_price, attacks, weakness, resistance, retreat_cost, flavor_text, is_secret) VALUES
`;

const cardRows = allCards.map(c => {
  const expId = c.id.split('-')[0].toLowerCase();
  const attacksJson = JSON.stringify(c.attacks || []).replace(/'/g, "''");
  return `(${esc(c.id)}, ${esc(expId)}, ${esc(c.cardNumber)}, ${esc(c.nameEs)}, ${esc(c.nameEn)}, ${esc(c.elementType)}, ${esc(c.subType || 'Básico')}, ${c.hp || 'NULL'}, ${esc(c.rarity)}, ${esc(c.artist || 'Oficial Pokémon')}, ${esc(c.image)}, ${esc(c.marketPrice || '0,50 €')}, '${attacksJson}'::jsonb, ${esc(c.weakness || 'Ninguna')}, ${esc(c.resistance || 'Ninguna')}, ${c.retreatCost || 1}, ${esc(c.flavorText || '')}, ${c.isSecret ? 'true' : 'false'})`;
});

sql += cardRows.join(',\n') + `\nON CONFLICT (id) DO UPDATE SET\n    card_number = EXCLUDED.card_number,\n    name_es = EXCLUDED.name_es,\n    name_en = EXCLUDED.name_en,\n    element_type = EXCLUDED.element_type,\n    sub_type = EXCLUDED.sub_type,\n    hp = EXCLUDED.hp,\n    rarity = EXCLUDED.rarity,\n    artist = EXCLUDED.artist,\n    image_url = EXCLUDED.image_url,\n    market_price = EXCLUDED.market_price,\n    attacks = EXCLUDED.attacks,\n    weakness = EXCLUDED.weakness,\n    resistance = EXCLUDED.resistance,\n    retreat_cost = EXCLUDED.retreat_cost,\n    flavor_text = EXCLUDED.flavor_text,\n    is_secret = EXCLUDED.is_secret;\n`;

fs.writeFileSync('supabase_schema.sql', sql, 'utf8');
console.log(`✅ supabase_schema.sql regenerado con DROP CASCADE para migración limpia.`);
