/**
 * Base de Datos Oficial de 10 Expansiones Pokémon TCG Seleccionadas
 * Fuente Canónica: Pokedexia (https://pokedexia.com/es/cartas-pokemon/expansiones)
 * 1. Celebración 30.º Aniversario (30th)
 * 2. Oscuridad Absoluta (pbl)
 * 3. Caos Creciente (cri)
 * 4. Equilibrio Perfecto (por)
 * 5. Héroes Ascendentes (asc)
 * 6. Fuegos Fantasmales (pfl)
 * 7. Megaevolución Base (meg)
 * 8. Evoluciones Prismáticas (pre)
 * 9. Chispas Fulgurantes (ssp)
 * 10. Llamas Obsidianas (obf)
 */

const POKEMON_EXPANSIONS_DATA = [
  {
    "id": "30th",
    "code": "30TH",
    "seriesCode": "ME30",
    "badgeText": "15/09/2026",
    "badgeType": "date",
    "nameEs": "Celebración 30.º Aniversario",
    "nameEn": "30th Anniversary Celebration",
    "series": "Megaevolución",
    "generation": "Especial",
    "releaseDate": "15 de Septiembre de 2026",
    "totalCards": 150,
    "baseSetCards": 100,
    "secretCards": 50,
    "pokedexiaUrl": "https://pokedexia.com/es/cartas-pokemon/expansiones/megaevolucion-celebracion-30-o-aniversario",
    "officialUrl": "https://tcg.pokemon.com/es-es/galleries/30th-anniversary/",
    "themeGradient": "linear-gradient(135deg, #78350f 0%, #b45309 50%, #f59e0b 100%)",
    "accentColor": "#f59e0b",
    "description": "Edición conmemorativa oficial de las tres décadas de Pokémon TCG. Remasterización de cartas históricas, holo foils dorados y artes legendarios.",
    "featuredCards": [
      "Charizard Base Set 30th",
      "Pikachu Dorado 30th",
      "Mewtwo ex 30th",
      "Lugia Legend 30th"
    ],
    "logoSvg": "\n      <svg viewBox=\"0 0 340 140\" class=\"expansion-svg-logo\" xmlns=\"http://www.w3.org/2000/svg\">\n        <defs>\n          <linearGradient id=\"gradGoldMetallic\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n            <stop offset=\"0%\" stop-color=\"#fffbeb\" />\n            <stop offset=\"30%\" stop-color=\"#fef08a\" />\n            <stop offset=\"60%\" stop-color=\"#eab308\" />\n            <stop offset=\"85%\" stop-color=\"#ca8a04\" />\n            <stop offset=\"100%\" stop-color=\"#854d0e\" />\n          </linearGradient>\n          <linearGradient id=\"gradGoldBorder\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">\n            <stop offset=\"0%\" stop-color=\"#ca8a04\" />\n            <stop offset=\"50%\" stop-color=\"#78350f\" />\n            <stop offset=\"100%\" stop-color=\"#451a03\" />\n          </linearGradient>\n          <filter id=\"shadowGold\">\n            <feDropShadow dx=\"0\" dy=\"3\" stdDeviation=\"3\" flood-color=\"#000\" flood-opacity=\"0.6\"/>\n          </filter>\n        </defs>\n        <g filter=\"url(#shadowGold)\">\n          <rect x=\"55\" y=\"16\" width=\"230\" height=\"108\" rx=\"14\" fill=\"#1c1917\" stroke=\"url(#gradGoldMetallic)\" stroke-width=\"4.5\" />\n          <rect x=\"75\" y=\"24\" width=\"190\" height=\"24\" rx=\"4\" fill=\"url(#gradGoldBorder)\" />\n          <text x=\"170\" y=\"41\" text-anchor=\"middle\" font-family=\"'Cinzel', sans-serif\" font-size=\"14\" font-weight=\"900\" fill=\"url(#gradGoldMetallic)\" letter-spacing=\"3.5\">CELEBRACIÓN</text>\n          \n          <text x=\"170\" y=\"94\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"52\" font-weight=\"900\" fill=\"#451a03\" stroke=\"#451a03\" stroke-width=\"6\">30°</text>\n          <text x=\"170\" y=\"94\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"52\" font-weight=\"900\" fill=\"url(#gradGoldMetallic)\">30°</text>\n          \n          <rect x=\"80\" y=\"100\" width=\"180\" height=\"18\" rx=\"4\" fill=\"#292524\" stroke=\"url(#gradGoldMetallic)\" stroke-width=\"1\" />\n          <text x=\"170\" y=\"114\" text-anchor=\"middle\" font-family=\"'Cinzel', sans-serif\" font-size=\"11\" font-weight=\"900\" fill=\"url(#gradGoldMetallic)\" letter-spacing=\"3\">ANIVERSARIO</text>\n        </g>\n      </svg>\n    "
  },
  {
    "id": "pbl",
    "code": "PBL",
    "seriesCode": "ME05",
    "badgeText": "16/07/2026",
    "badgeType": "date",
    "nameEs": "Oscuridad Absoluta",
    "nameEn": "Mega Evolution: Pitch Black",
    "series": "Megaevolución",
    "generation": "Gen IX / Mega",
    "releaseDate": "17 de Julio de 2026",
    "totalCards": 120,
    "baseSetCards": 84,
    "secretCards": 36,
    "pokedexiaUrl": "https://pokedexia.com/es/cartas-pokemon/expansiones/megaevolucion-oscuridad-absoluta",
    "officialUrl": "https://tcg.pokemon.com/es-es/galleries/pitch-black/",
    "themeGradient": "linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #4a044e 100%)",
    "accentColor": "#a855f7",
    "description": "Mega-Darkrai ex sumerge los campos en una penumbra abismal junto a poderosos Pokémon Tipo Oscuridad y Psíquico de élite.",
    "featuredCards": [
      "Mega-Darkrai ex",
      "Mega-Tyranitar ex",
      "Mega-Houndoom ex",
      "Mega-Gengar ex"
    ],
    "logoSvg": "\n      <svg viewBox=\"0 0 340 140\" class=\"expansion-svg-logo\" xmlns=\"http://www.w3.org/2000/svg\">\n        <defs>\n          <linearGradient id=\"gradPblRibbon\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\">\n            <stop offset=\"0%\" stop-color=\"#ca8a04\" />\n            <stop offset=\"50%\" stop-color=\"#fde047\" />\n            <stop offset=\"100%\" stop-color=\"#ca8a04\" />\n          </linearGradient>\n          <linearGradient id=\"gradPblText\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">\n            <stop offset=\"0%\" stop-color=\"#fdf4ff\" />\n            <stop offset=\"40%\" stop-color=\"#d946ef\" />\n            <stop offset=\"100%\" stop-color=\"#701a75\" />\n          </linearGradient>\n          <filter id=\"shadowPbl\">\n            <feDropShadow dx=\"0\" dy=\"3\" stdDeviation=\"3\" flood-color=\"#000\" flood-opacity=\"0.8\"/>\n          </filter>\n        </defs>\n        <g filter=\"url(#shadowPbl)\">\n          <path d=\"M 50 30 L 290 30 L 280 12 L 60 12 Z\" fill=\"#0f172a\" stroke=\"url(#gradPblRibbon)\" stroke-width=\"2.5\" />\n          <text x=\"170\" y=\"25\" text-anchor=\"middle\" font-family=\"'Cinzel', sans-serif\" font-size=\"12\" font-weight=\"900\" fill=\"url(#gradPblRibbon)\" letter-spacing=\"3\">MEGAEVOLUCIÓN</text>\n        </g>\n        <g filter=\"url(#shadowPbl)\">\n          <text x=\"170\" y=\"74\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"33\" font-weight=\"900\" fill=\"#1e1b4b\" stroke=\"#09090b\" stroke-width=\"11\" stroke-linejoin=\"round\" letter-spacing=\"2\">OSCURIDAD</text>\n          <text x=\"170\" y=\"74\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"33\" font-weight=\"900\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"5\" stroke-linejoin=\"round\" letter-spacing=\"2\">OSCURIDAD</text>\n          <text x=\"170\" y=\"74\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"33\" font-weight=\"900\" fill=\"url(#gradPblText)\" letter-spacing=\"2\">OSCURIDAD</text>\n\n          <text x=\"170\" y=\"118\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"35\" font-weight=\"900\" fill=\"#1e1b4b\" stroke=\"#09090b\" stroke-width=\"11\" stroke-linejoin=\"round\" letter-spacing=\"2\">ABSOLUTA</text>\n          <text x=\"170\" y=\"118\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"35\" font-weight=\"900\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"5\" stroke-linejoin=\"round\" letter-spacing=\"2\">ABSOLUTA</text>\n          <text x=\"170\" y=\"118\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"35\" font-weight=\"900\" fill=\"url(#gradPblText)\" letter-spacing=\"2\">ABSOLUTA</text>\n        </g>\n      </svg>\n    "
  },
  {
    "id": "cri",
    "code": "CRI",
    "seriesCode": "ME04",
    "badgeText": "21/05/2026",
    "badgeType": "date",
    "nameEs": "Caos Creciente",
    "nameEn": "Mega Evolution: Chaos Rising",
    "series": "Megaevolución",
    "generation": "Gen IX / Mega",
    "releaseDate": "21 de Mayo de 2026",
    "totalCards": 156,
    "baseSetCards": 122,
    "secretCards": 34,
    "pokedexiaUrl": "https://pokedexia.com/es/cartas-pokemon/expansiones/megaevolucion-caos-creciente",
    "officialUrl": "https://tcg.pokemon.com/es-es/galleries/chaos-rising/",
    "themeGradient": "linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%)",
    "accentColor": "#38bdf8",
    "description": "Una amenaza sin precedentes asola Ciudad Luminalia tras la aparición de la Flor Eterna y Mega-Floette ex. Los defensores de Kalos con Mega-Greninja ex y Mega-Pyroar ex se alzan en batalla.",
    "featuredCards": [
      "Mega-Greninja ex",
      "Mega-Pyroar ex",
      "Mega-Floette ex",
      "Beedrill ex",
      "Hoopa ex"
    ],
    "logoSvg": "\n      <svg viewBox=\"0 0 340 140\" class=\"expansion-svg-logo\" xmlns=\"http://www.w3.org/2000/svg\">\n        <defs>\n          <linearGradient id=\"gradCriRibbon\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\">\n            <stop offset=\"0%\" stop-color=\"#d97706\" />\n            <stop offset=\"50%\" stop-color=\"#fde047\" />\n            <stop offset=\"100%\" stop-color=\"#d97706\" />\n          </linearGradient>\n          <linearGradient id=\"gradCriText\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">\n            <stop offset=\"0%\" stop-color=\"#e0f2fe\" />\n            <stop offset=\"40%\" stop-color=\"#38bdf8\" />\n            <stop offset=\"100%\" stop-color=\"#0284c7\" />\n          </linearGradient>\n          <filter id=\"shadowCri\">\n            <feDropShadow dx=\"0\" dy=\"3\" stdDeviation=\"3\" flood-color=\"#000\" flood-opacity=\"0.8\"/>\n          </filter>\n        </defs>\n        <g filter=\"url(#shadowCri)\">\n          <path d=\"M 50 32 L 290 32 L 280 14 L 60 14 Z\" fill=\"#0f172a\" stroke=\"url(#gradCriRibbon)\" stroke-width=\"2.5\" />\n          <text x=\"170\" y=\"27\" text-anchor=\"middle\" font-family=\"'Cinzel', sans-serif\" font-size=\"12\" font-weight=\"900\" fill=\"url(#gradCriRibbon)\" letter-spacing=\"3\">MEGAEVOLUCIÓN</text>\n        </g>\n        <g filter=\"url(#shadowCri)\">\n          <circle cx=\"65\" cy=\"65\" r=\"8\" fill=\"#38bdf8\" opacity=\"0.6\"/>\n          <circle cx=\"280\" cy=\"65\" r=\"8\" fill=\"#38bdf8\" opacity=\"0.6\"/>\n          <circle cx=\"75\" cy=\"108\" r=\"6\" fill=\"#38bdf8\" opacity=\"0.6\"/>\n          <circle cx=\"270\" cy=\"108\" r=\"6\" fill=\"#38bdf8\" opacity=\"0.6\"/>\n\n          <text x=\"170\" y=\"74\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"38\" font-weight=\"900\" font-style=\"italic\" fill=\"#082f49\" stroke=\"#082f49\" stroke-width=\"11\" stroke-linejoin=\"round\" letter-spacing=\"2\">CAOS</text>\n          <text x=\"170\" y=\"74\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"38\" font-weight=\"900\" font-style=\"italic\" fill=\"#38bdf8\" stroke=\"#38bdf8\" stroke-width=\"5\" stroke-linejoin=\"round\" letter-spacing=\"2\">CAOS</text>\n          <text x=\"170\" y=\"74\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"38\" font-weight=\"900\" font-style=\"italic\" fill=\"url(#gradCriText)\" letter-spacing=\"2\">CAOS</text>\n\n          <text x=\"170\" y=\"118\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"36\" font-weight=\"900\" font-style=\"italic\" fill=\"#082f49\" stroke=\"#082f49\" stroke-width=\"11\" stroke-linejoin=\"round\" letter-spacing=\"2\">CRECIENTE</text>\n          <text x=\"170\" y=\"118\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"36\" font-weight=\"900\" font-style=\"italic\" fill=\"#38bdf8\" stroke=\"#38bdf8\" stroke-width=\"5\" stroke-linejoin=\"round\" letter-spacing=\"2\">CRECIENTE</text>\n          <text x=\"170\" y=\"118\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"36\" font-weight=\"900\" font-style=\"italic\" fill=\"url(#gradCriText)\" letter-spacing=\"2\">CRECIENTE</text>\n        </g>\n      </svg>\n    "
  },
  {
    "id": "por",
    "code": "POR",
    "seriesCode": "ME03",
    "badgeText": "27/03/2026",
    "badgeType": "date",
    "nameEs": "Equilibrio Perfecto",
    "nameEn": "Mega Evolution: Perfect Order",
    "series": "Megaevolución",
    "generation": "Gen IX / Mega",
    "releaseDate": "27 de Marzo de 2026",
    "totalCards": 124,
    "baseSetCards": 85,
    "secretCards": 39,
    "pokedexiaUrl": "https://pokedexia.com/es/cartas-pokemon/expansiones/megaevolucion-equilibrio-perfecto",
    "officialUrl": "https://tcg.pokemon.com/es-es/galleries/perfect-order/",
    "themeGradient": "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #059669 100%)",
    "accentColor": "#10b981",
    "description": "El guardián del ecosistema Mega-Zygarde ex y las deidades de Kalos restauran el orden supremo con ataques de sincronización perfecta.",
    "featuredCards": [
      "Mega-Zygarde ex",
      "Mega-Starmie ex",
      "Mega-Clefable ex",
      "Decidueye ex"
    ],
    "logoSvg": "\n      <svg viewBox=\"0 0 340 140\" class=\"expansion-svg-logo\" xmlns=\"http://www.w3.org/2000/svg\">\n        <defs>\n          <linearGradient id=\"gradPorRibbon\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\">\n            <stop offset=\"0%\" stop-color=\"#d97706\" />\n            <stop offset=\"50%\" stop-color=\"#fde047\" />\n            <stop offset=\"100%\" stop-color=\"#d97706\" />\n          </linearGradient>\n          <linearGradient id=\"gradPorText\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">\n            <stop offset=\"0%\" stop-color=\"#ecfdf5\" />\n            <stop offset=\"40%\" stop-color=\"#10b981\" />\n            <stop offset=\"100%\" stop-color=\"#047857\" />\n          </linearGradient>\n          <filter id=\"shadowPor\">\n            <feDropShadow dx=\"0\" dy=\"3\" stdDeviation=\"3\" flood-color=\"#000\" flood-opacity=\"0.8\"/>\n          </filter>\n        </defs>\n        <g filter=\"url(#shadowPor)\">\n          <path d=\"M 40 70 L 60 20 L 280 20 L 300 70 L 280 120 L 60 120 Z\" fill=\"#022c22\" stroke=\"#10b981\" stroke-width=\"4.5\" />\n          <path d=\"M 70 34 L 270 34 L 260 18 L 80 18 Z\" fill=\"#0f172a\" stroke=\"url(#gradPorRibbon)\" stroke-width=\"2\" />\n          <text x=\"170\" y=\"30\" text-anchor=\"middle\" font-family=\"'Cinzel', sans-serif\" font-size=\"11\" font-weight=\"900\" fill=\"url(#gradPorRibbon)\" letter-spacing=\"3\">MEGAEVOLUCIÓN</text>\n          \n          <text x=\"170\" y=\"68\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"28\" font-weight=\"900\" fill=\"#fff\" letter-spacing=\"2\">EQUILIBRIO</text>\n          <text x=\"170\" y=\"104\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"30\" font-weight=\"900\" fill=\"#22c55e\" letter-spacing=\"2\">PERFECTO</text>\n        </g>\n      </svg>\n    "
  },
  {
    "id": "asc",
    "code": "ASC",
    "seriesCode": "ME02.5",
    "badgeText": "30/01/2026",
    "badgeType": "date",
    "nameEs": "Héroes Ascendentes",
    "nameEn": "Mega Evolution: Ascending Heroes",
    "series": "Megaevolución",
    "generation": "Gen IX / Mega",
    "releaseDate": "30 de Enero de 2026",
    "totalCards": 295,
    "baseSetCards": 180,
    "secretCards": 115,
    "pokedexiaUrl": "https://pokedexia.com/es/cartas-pokemon/expansiones/megaevolucion-heroes-ascendentes",
    "officialUrl": "https://tcg.pokemon.com/es-es/galleries/ascending-heroes/",
    "themeGradient": "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%)",
    "accentColor": "#3b82f6",
    "description": "Mega-Meganium ex, Mega-Charizard Y ex, Mega-Dragonite ex y los Pokémon de Erika, Eco y N despliegan un poder legendario.",
    "featuredCards": [
      "Mega-Meganium ex",
      "Mega-Charizard Y ex",
      "Mega-Dragonite ex",
      "Vileplume ex de Erika"
    ],
    "logoSvg": "\n      <svg viewBox=\"0 0 340 140\" class=\"expansion-svg-logo\" xmlns=\"http://www.w3.org/2000/svg\">\n        <defs>\n          <linearGradient id=\"gradAscRibbon\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\">\n            <stop offset=\"0%\" stop-color=\"#b45309\" />\n            <stop offset=\"50%\" stop-color=\"#fbbf24\" />\n            <stop offset=\"100%\" stop-color=\"#b45309\" />\n          </linearGradient>\n          <linearGradient id=\"gradAscText\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">\n            <stop offset=\"0%\" stop-color=\"#fef08a\" />\n            <stop offset=\"50%\" stop-color=\"#f59e0b\" />\n            <stop offset=\"100%\" stop-color=\"#ea580c\" />\n          </linearGradient>\n          <filter id=\"shadowAsc\">\n            <feDropShadow dx=\"0\" dy=\"3\" stdDeviation=\"3\" flood-color=\"#000\" flood-opacity=\"0.8\"/>\n          </filter>\n        </defs>\n        <g filter=\"url(#shadowAsc)\">\n          <path d=\"M 50 32 L 290 32 L 280 14 L 60 14 Z\" fill=\"#0f172a\" stroke=\"url(#gradAscRibbon)\" stroke-width=\"2.5\" />\n          <text x=\"170\" y=\"27\" text-anchor=\"middle\" font-family=\"'Cinzel', sans-serif\" font-size=\"12\" font-weight=\"900\" fill=\"url(#gradAscRibbon)\" letter-spacing=\"3\">MEGAEVOLUCIÓN</text>\n        </g>\n        <g filter=\"url(#shadowAsc)\">\n          <text x=\"170\" y=\"74\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"38\" font-weight=\"900\" fill=\"#0f172a\" stroke=\"#0f172a\" stroke-width=\"11\" stroke-linejoin=\"round\" letter-spacing=\"2\">HÉROES</text>\n          <text x=\"170\" y=\"74\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"38\" font-weight=\"900\" fill=\"#22d3ee\" stroke=\"#22d3ee\" stroke-width=\"5\" stroke-linejoin=\"round\" letter-spacing=\"2\">HÉROES</text>\n          <text x=\"170\" y=\"74\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"38\" font-weight=\"900\" fill=\"url(#gradAscText)\" letter-spacing=\"2\">HÉROES</text>\n\n          <text x=\"170\" y=\"118\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"31\" font-weight=\"900\" fill=\"#0f172a\" stroke=\"#0f172a\" stroke-width=\"11\" stroke-linejoin=\"round\" letter-spacing=\"2\">ASCENDENTES</text>\n          <text x=\"170\" y=\"118\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"31\" font-weight=\"900\" fill=\"#22d3ee\" stroke=\"#22d3ee\" stroke-width=\"5\" stroke-linejoin=\"round\" letter-spacing=\"2\">ASCENDENTES</text>\n          <text x=\"170\" y=\"118\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"31\" font-weight=\"900\" fill=\"url(#gradAscText)\" letter-spacing=\"2\">ASCENDENTES</text>\n        </g>\n      </svg>\n    "
  },
  {
    "id": "pfl",
    "code": "PFL",
    "seriesCode": "ME01",
    "badgeText": "PFL",
    "badgeType": "code",
    "nameEs": "Fuegos Fantasmales",
    "nameEn": "Mega Evolution: Phantom Flames",
    "series": "Megaevolución",
    "generation": "Gen IX / Mega",
    "releaseDate": "14 de Noviembre de 2025",
    "totalCards": 130,
    "baseSetCards": 94,
    "secretCards": 36,
    "pokedexiaUrl": "https://pokedexia.com/es/cartas-pokemon/expansiones/megaevolucion-fuegos-fantasmales",
    "officialUrl": "https://tcg.pokemon.com/es-es/galleries/phantom-flames/",
    "themeGradient": "linear-gradient(135deg, #3b0764 0%, #6b21a8 50%, #c026d3 100%)",
    "accentColor": "#c026d3",
    "description": "Llamaradas espectrales y poder destructivo desatados por Mega-Charizard X ex, Mega-Heracross ex, Mega-Sharpedo ex y Rotom ex.",
    "featuredCards": [
      "Mega-Charizard X ex",
      "Mega-Heracross ex",
      "Mega-Sharpedo ex",
      "Mega-Lopunny ex",
      "Rotom ex",
      "Maya"
    ],
    "logoSvg": "\n      <svg viewBox=\"0 0 340 140\" class=\"expansion-svg-logo\" xmlns=\"http://www.w3.org/2000/svg\">\n        <defs>\n          <linearGradient id=\"gradPflRibbon\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"0%\">\n            <stop offset=\"0%\" stop-color=\"#b45309\" />\n            <stop offset=\"50%\" stop-color=\"#fbbf24\" />\n            <stop offset=\"100%\" stop-color=\"#b45309\" />\n          </linearGradient>\n          <linearGradient id=\"gradPflText\" x1=\"0%\" y1=\"0%\" x2=\"0%\" y2=\"100%\">\n            <stop offset=\"0%\" stop-color=\"#fdf4ff\" />\n            <stop offset=\"50%\" stop-color=\"#c084fc\" />\n            <stop offset=\"100%\" stop-color=\"#6b21a8\" />\n          </linearGradient>\n          <filter id=\"shadowPfl\">\n            <feDropShadow dx=\"0\" dy=\"3\" stdDeviation=\"3\" flood-color=\"#000\" flood-opacity=\"0.8\"/>\n          </filter>\n        </defs>\n        <g filter=\"url(#shadowPfl)\">\n          <path d=\"M 45 70 Q 55 40 70 50 Q 85 20 110 50 Q 140 10 170 45 Q 200 10 230 50 Q 255 20 270 50 Q 285 40 295 70 Q 275 125 170 130 Q 65 125 45 70 Z\" fill=\"none\" stroke=\"#38bdf8\" stroke-width=\"4\" stroke-opacity=\"0.8\"/>\n          <path d=\"M 60 32 L 280 32 L 270 14 L 70 14 Z\" fill=\"#0f172a\" stroke=\"url(#gradPflRibbon)\" stroke-width=\"2.5\" />\n          <text x=\"170\" y=\"27\" text-anchor=\"middle\" font-family=\"'Cinzel', sans-serif\" font-size=\"12\" font-weight=\"900\" fill=\"url(#gradPflRibbon)\" letter-spacing=\"3\">MEGAEVOLUCIÓN</text>\n          \n          <text x=\"170\" y=\"74\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"36\" font-weight=\"900\" font-style=\"italic\" fill=\"#2e1065\" stroke=\"#2e1065\" stroke-width=\"11\" stroke-linejoin=\"round\" letter-spacing=\"2\">FUEGOS</text>\n          <text x=\"170\" y=\"74\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"36\" font-weight=\"900\" font-style=\"italic\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"5\" stroke-linejoin=\"round\" letter-spacing=\"2\">FUEGOS</text>\n          <text x=\"170\" y=\"74\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"36\" font-weight=\"900\" font-style=\"italic\" fill=\"url(#gradPflText)\" letter-spacing=\"2\">FUEGOS</text>\n\n          <text x=\"170\" y=\"118\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"30\" font-weight=\"900\" font-style=\"italic\" fill=\"#2e1065\" stroke=\"#2e1065\" stroke-width=\"11\" stroke-linejoin=\"round\" letter-spacing=\"2\">FANTASMALES</text>\n          <text x=\"170\" y=\"118\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"30\" font-weight=\"900\" font-style=\"italic\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"5\" stroke-linejoin=\"round\" letter-spacing=\"2\">FANTASMALES</text>\n          <text x=\"170\" y=\"118\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"30\" font-weight=\"900\" font-style=\"italic\" fill=\"url(#gradPflText)\" letter-spacing=\"2\">FANTASMALES</text>\n        </g>\n      </svg>\n    "
  },
  {
    "id": "meg",
    "code": "MEG",
    "seriesCode": "ME00",
    "badgeText": "MEG",
    "badgeType": "code",
    "nameEs": "Megaevolución (Base Set)",
    "nameEn": "Mega Evolution Base Set",
    "series": "Megaevolución",
    "generation": "Gen IX / Mega",
    "releaseDate": "19 de Septiembre de 2025",
    "totalCards": 188,
    "baseSetCards": 132,
    "secretCards": 56,
    "pokedexiaUrl": "https://pokedexia.com/es/cartas-pokemon/expansiones/megaevolucion-base",
    "officialUrl": "https://tcg.pokemon.com/es-es/galleries/mega-evolution/",
    "themeGradient": "linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)",
    "accentColor": "#22c55e",
    "description": "El punto de partida de la era Megaevolución. El regreso legendario de Mega-Venusaur ex, Mega-Gardevoir ex, Mega-Lucario ex y Mega-Absol ex.",
    "featuredCards": [
      "Bulbasaur",
      "Mega-Venusaur ex",
      "Mega-Gardevoir ex",
      "Mega-Lucario ex",
      "Mega-Absol ex",
      "Celebi"
    ],
    "logoSvg": "\n      <svg viewBox=\"0 0 340 140\" class=\"expansion-svg-logo\" xmlns=\"http://www.w3.org/2000/svg\">\n        <g filter=\"url(#shadowMeg)\">\n          <path d=\"M 30 75 L 50 35 L 290 35 L 310 75 L 290 115 L 50 115 Z\" fill=\"#09090b\" stroke=\"#ea580c\" stroke-width=\"4.5\" />\n          <text x=\"170\" y=\"86\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"34\" font-weight=\"900\" font-style=\"italic\" fill=\"#15803d\" stroke=\"#15803d\" stroke-width=\"8\" stroke-linejoin=\"round\" letter-spacing=\"3\">MEGAEVOLUCIÓN</text>\n          <text x=\"170\" y=\"86\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"34\" font-weight=\"900\" font-style=\"italic\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"3\" stroke-linejoin=\"round\" letter-spacing=\"3\">MEGAEVOLUCIÓN</text>\n          <text x=\"170\" y=\"86\" text-anchor=\"middle\" font-family=\"'Outfit', sans-serif\" font-size=\"34\" font-weight=\"900\" font-style=\"italic\" fill=\"#fef08a\" letter-spacing=\"3\">MEGAEVOLUCIÓN</text>\n        </g>\n      </svg>\n    "
  },
  {
    "id": "pre",
    "code": "PRE",
    "seriesCode": "SV08.5",
    "badgeText": "PRE",
    "badgeType": "code",
    "nameEs": "Evoluciones Prismáticas",
    "nameEn": "Prismatic Evolutions",
    "series": "Escarlata y Púrpura",
    "generation": "Gen IX",
    "releaseDate": "17 de Enero de 2025",
    "totalCards": 180,
    "baseSetCards": 131,
    "secretCards": 49,
    "pokedexiaUrl": "https://pokedexia.com/es/cartas-pokemon/expansiones/escarlata-y-purpura-evoluciones-prismaticas",
    "officialUrl": "https://tcg.pokemon.com/es-es/galleries/prismatic-evolutions/",
    "themeGradient": "linear-gradient(135deg, #4c0519 0%, #831843 50%, #db2777 100%)",
    "accentColor": "#ec4899",
    "description": "Exeggcute, Leafeon ex, Hydrapple ex, Ogerpon Máscara Turquesa ex y las evoluciones de Eevee brillan como Pokémon Teracristal Astrales.",
    "featuredCards": [
      "Exeggcute",
      "Leafeon ex",
      "Hydrapple ex",
      "Ogerpon Máscara Turquesa ex",
      "Eevee ex",
      "Umbreon ex",
      "Terapagos ex"
    ]
  },
  {
    "id": "ssp",
    "code": "SSP",
    "seriesCode": "SV08",
    "badgeText": "SSP",
    "badgeType": "code",
    "nameEs": "Chispas Fulgurantes",
    "nameEn": "Surging Sparks",
    "series": "Escarlata y Púrpura",
    "generation": "Gen IX",
    "releaseDate": "8 de Noviembre de 2024",
    "totalCards": 252,
    "baseSetCards": 191,
    "secretCards": 61,
    "pokedexiaUrl": "https://pokedexia.com/es/cartas-pokemon/expansiones/escarlata-y-purpura-chispas-fulgurantes",
    "officialUrl": "https://tcg.pokemon.com/es-es/galleries/surging-sparks/",
    "themeGradient": "linear-gradient(135deg, #422006 0%, #713f12 50%, #eab308 100%)",
    "accentColor": "#eab308",
    "description": "Desata un torbellino electrizante con Pikachu ex Teracristal Astral, Archaludon ex y las fuerzas de dragones legendarios.",
    "featuredCards": [
      "Pikachu ex",
      "Archaludon ex",
      "Latias ex",
      "Hydreigon ex",
      "Milotic ex"
    ]
  },
  {
    "id": "obf",
    "code": "OBF",
    "seriesCode": "SV03",
    "badgeText": "OBF",
    "badgeType": "code",
    "nameEs": "Llamas Obsidianas",
    "nameEn": "Obsidian Flames",
    "series": "Escarlata y Púrpura",
    "generation": "Gen IX",
    "releaseDate": "11 de Agosto de 2023",
    "totalCards": 230,
    "baseSetCards": 197,
    "secretCards": 33,
    "pokedexiaUrl": "https://pokedexia.com/es/cartas-pokemon/expansiones/escarlata-y-purpura-llamas-obsidianas",
    "officialUrl": "https://tcg.pokemon.com/es-es/galleries/obsidian-flames/",
    "themeGradient": "linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #f97316 100%)",
    "accentColor": "#f97316",
    "description": "Charizard ex Teracristal de Tipo Oscuridad hace arder el campo de batalla con llamaradas implacables.",
    "featuredCards": [
      "Charizard ex Oscuro",
      "Tyranitar ex",
      "Dragonite ex",
      "Pidgeot ex"
    ]
  }
];

// Funciones Auxiliares de Consulta
function getExpansionById(id) {
  return POKEMON_EXPANSIONS_DATA.find(e => e.id === id) || POKEMON_EXPANSIONS_DATA[0];
}

function getExpansionsBySeries(series) {
  if (!series || series === "all") return POKEMON_EXPANSIONS_DATA;
  return POKEMON_EXPANSIONS_DATA.filter(e => e.series.toLowerCase() === series.toLowerCase());
}

// Exportar globalmente
window.POKEMON_EXPANSIONS_DATA = POKEMON_EXPANSIONS_DATA;
window.getExpansionById = getExpansionById;
window.getExpansionsBySeries = getExpansionsBySeries;
