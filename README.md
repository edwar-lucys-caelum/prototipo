# 🎴 Pokémon TCG: Colección Megaevolución - Caos Creciente (Chaos Rising)

Aplicación web interactiva y moderna para explorar, filtrar y coleccionar las cartas de la expansión oficial **Megaevolución: Caos Creciente** (*Mega Evolution: Chaos Rising* - CRI), basada en la galería de [Pokémon TCG](https://tcg.pokemon.com/es-es/galleries/chaos-rising/).

---

## ✨ Características Principales

- **Catálogo Completo de Caos Creciente**:
  - Cartas destacadas como *Mega-Greninja ex*, *Mega-Pyroar ex*, *Mega-Floette ex*, *Mega-Dragalge ex*, *Mega-Gallade ex*, *Beedrill ex*, *Froakie (IR)*, *Mega-Greninja ex (SIR)*, entre otras.
  - Estadísticas completas: Tipo elemental, PS/HP, ataques con costo de energía y daño, debilidades, resistencias, coste de retirada, artista y texto de ambientación.

- **Búsqueda y Filtros en Tiempo Real**:
  - 🔍 **Búsqueda por texto**: Busca instantáneamente por nombre en español, inglés o ataques.
  - 💧🔥🌿 **Filtro por Elemento / Energía**: Agua, Fuego, Planta, Rayo, Psíquico, Lucha, Oscuridad, Metal, Dragón, Incoloro y Entrenadores.
  - 👑 **Filtro por Rareza**: Común, Infrecuente, Rara Holo, Doble Rara ex, Megaevolución ex, Ilustración Rara (IR), Ilustración Especial (SIR) y Ultra Rara Dorada.
  - 📊 **Filtros de Colección**: Todas las cartas, Poseídas/Coleccionadas, Faltantes, Favoritas (❤️) y Lista de Deseos (⭐).

- **Gestión de Colección**:
  - Botón táctil para marcar / desmarcar si posees la carta.
  - Contador de copias (x1, x2, x3...).
  - Dashboard interactivo con porcentaje de completitud y recuento de cartas únicas vs repetidas.
  - Exportación e importación de la colección en formato **JSON**.

- **Efectos Visuales y 3D**:
  - Física 3D Parallax Tilt al mover el puntero sobre cada carta.
  - Brillo holográfico Foil e iridiscente (Rainbow Glare) para cartas ex, Mega y Secretas.
  - Modal de inspección a pantalla completa para ver la carta en detalle.
  - Cambio de modo de visualización entre **Cuadrícula (Grid)** y **Lista compacta**.

---

## ⚡ Conexión con Base de Datos en Supabase

La aplicación cuenta con sincronización en la nube con **Supabase** y soporte **Local-First (Offline con LocalStorage)** para que funcione de inmediato.

### Pasos para conectar tu proyecto Supabase:

1. **Crea un proyecto en Supabase**:
   - Ingresa a [https://supabase.com](https://supabase.com) e inicia sesión o crea un nuevo proyecto.

2. **Ejecuta el script SQL**:
   - Ve a la sección **SQL Editor** en tu panel de Supabase.
   - Copia el contenido del archivo [`supabase_schema.sql`](file:///c:/Users/godof/Desktop/cartas/supabase_schema.sql) o dale clic a **Copiar SQL** dentro del modal de Supabase de la aplicación.
   - Pégalo y presiona **RUN**. Esto creará automáticamente las tablas `cards` y `user_cards` con las políticas de seguridad (RLS) e índices.

3. **Conecta la aplicación**:
   - En la aplicación, haz clic en el botón superior **Supabase Cloud**.
   - Ingresa tu **Project URL** y tu **Anon Public Key** (disponibles en *Project Settings > API* en Supabase).
   - Haz clic en **Conectar y Guardar**.
   - Haz clic en **Sincronizar Catálogo a Supabase** para poblar la base de datos con las cartas de la expansión.

---

## 🚀 Cómo Ejecutar la Aplicación

Puedes abrir directamente el archivo `index.html` en tu navegador favorito, o servirlo con cualquier servidor HTTP local:

### Opción 1: Abrir directamente
- Haz doble clic en [`index.html`](file:///c:/Users/godof/Desktop/cartas/index.html).

### Opción 2: Usar un servidor local ligero
```bash
# Con Node.js / npx
npx -y serve .

# O con Python
python -m http.server 8080
```

---

## 📁 Estructura del Proyecto

```
cartas/
├── index.html                  # Interfaz principal de usuario
├── css/
│   ├── styles.css              # Sistema de diseño global y filtros
│   ├── cards.css               # Marcos TCG y elementos de carta
│   ├── holo.css                # Efectos holográficos y rotación 3D
│   └── modal.css               # Modales de detalle e integración Supabase
├── js/
│   ├── cardsData.js            # Base de datos de cartas (Caos Creciente CRI)
│   ├── supabaseClient.js       # Capa de sincronización Supabase / LocalStorage
│   ├── collectionManager.js    # Gestor de colección, marcas y estadísticas
│   └── app.js                  # Lógica de renderizado y eventos
├── supabase_schema.sql         # Script SQL de inicialización para Supabase
└── README.md                   # Documentación del proyecto
```
