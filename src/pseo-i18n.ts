export const pseoContent = {
  es: {
    slug: 'seo-programatico',
    altSlug: 'programmatic-seo',
    readingTime: '28 min de lectura',
    seo: {
      title: 'SEO Programático: 4.000+ Páginas desde un ERP | santifer.io',
      description: 'Case study: cómo generé 4.730 landing pages estáticas con Airtable, DataForSEO y crawl budget optimization. 2M+ impresiones, 19K+ clicks, cero IA.',
    },
    nav: {
      breadcrumbHome: 'Inicio',
      breadcrumbCurrent: 'SEO Programático',
    },
    header: {
      kicker: 'Case Study — <a>Santifer iRepair</a>',
      kickerLink: 'https://santiferirepair.es',
      h1: 'SEO Programático: 4.700+ Páginas desde un ERP',
      subtitle: 'Cómo generé 4.730 landing pages únicas con datos reales de producción, un CMS de 14 tablas en Airtable, y DataForSEO como motor de decisiones. 2,26M impresiones, 19K+ clicks, cero contenido generado por IA.',
      date: '25 feb 2026',
    },
    intro: {
      hook: 'En el sector de reparación de dispositivos en España, nadie estaba haciendo SEO programático. Cada combinación de dispositivo, marca, modelo, tipo de reparación y ciudad era una oportunidad long-tail sin explotar.',
      body: 'La idea era simple: si alguien busca "reparar iPhone batería Sevilla", debería existir una página específica para esa búsqueda, con el precio real, el tiempo estimado y fotos de reparaciones reales. Pero crear esas páginas a mano para miles de combinaciones no era viable. Necesitaba un sistema que generase las páginas automáticamente desde el ERP, y que fuera lo suficientemente inteligente para decidir cuáles indexar y cuáles no.',
      context: 'Santifer iRepair fue mi negocio de reparación de dispositivos en Sevilla desde 2009. 16 años, más de 30.000 reparaciones. En 2023 decidí que la web del negocio necesitaba dejar de ser un folleto y empezar a capturar la demanda que ya existía en Google. Construí este sistema de SEO programático como ventaja competitiva y vendí el negocio en septiembre 2025, en su punto más alto.',
    },
    sections: {
      theNumbers: {
        heading: 'Los Números',
        metrics: [
          { value: '2,26M', label: 'Impresiones', detail: 'Total acumulado en Google Search Console' },
          { value: '19K+', label: 'Clicks orgánicos', detail: 'Tráfico real desde búsqueda orgánica' },
          { value: '4.730', label: 'Páginas con tráfico', detail: 'De miles generadas, 4.084 indexables en sitemap, 4.730 recibieron impresiones' },
          { value: '10,8x', label: 'Crecimiento', detail: 'De 202 a 2.193 clicks/mes en 11 meses' },
          { value: '80%', label: 'Clicks desde pSEO', detail: 'El tráfico orgánico del sitio viene de páginas programáticas' },
        ],
        timeline: 'Desarrollo: marzo → octubre 2024 (7 meses). Una persona. CMS, scripts de generación, pipeline de imágenes, integración con DataForSEO y deploy — todo en paralelo. Lanzamiento en producción en octubre 2024.',
      },
      opportunity: {
        heading: 'La Oportunidad',
        body: 'El mercado de reparación de dispositivos en España es altamente local. Los usuarios buscan servicios por ciudad, marca y tipo de reparación. Pero la mayoría de negocios del sector tenían webs genéricas: una landing para toda España, si es que tenían web.',
        points: [
          'Miles de combinaciones long-tail sin competencia real en SERPs',
          'Intención de búsqueda transaccional clara: el usuario quiere reparar, no informarse',
          'Ningún competidor en el sector estaba usando SEO programático en España (2023)',
          'El ERP ya tenía todos los datos necesarios: 867 modelos, precios, tiempos, fotos reales',
          'La taxonomía natural del negocio (dispositivo, marca, modelo, reparación, ciudad) se mapea directamente a URLs',
        ],
        queryExamples: [
          { query: 'reparacion moviles sevilla', clicks: 42, impressions: 1947, ctr: '2,2%', position: '2,5' },
          { query: 'reparar iphone sevilla', clicks: 51, impressions: 3314, ctr: '1,5%', position: '12,9' },
          { query: 'reparacion iphone sevilla', clicks: 46, impressions: 4315, ctr: '1,1%', position: '5,2' },
          { query: 'cambiar bateria pixel 6a', clicks: 51, impressions: 755, ctr: '6,8%', position: '6,4' },
          { query: 'servicio técnico garmin sevilla', clicks: 36, impressions: 534, ctr: '6,7%', position: '6,5' },
          { query: 'cambiar bateria apple watch', clicks: 37, impressions: 3967, ctr: '0,9%', position: '11,7' },
        ],
      },
      twoTypes: {
        heading: 'Dos Estrategias, Un Sistema',
        body: 'El proyecto empezó con ambición nacional, pero Google tiene criterio propio. Las búsquedas de reparación tienen intención local muy fuerte. Google prioriza resultados con proximidad geográfica, así que las páginas nacionales sin ciudad competían peor. La solución: una estrategia dual. Páginas locales para Sevilla (donde está la tienda física) y páginas nacionales de nicho para reparaciones específicas donde la localización importa menos.',
        local: {
          title: 'Páginas Locales (Sevilla)',
          description: 'Combinaciones de dispositivo + marca + reparación con "/sevilla". Google las prioriza por proximidad al negocio físico. Son las que más tráfico generan.',
          examples: [
            { url: '/reparar-smartwatch/sevilla', clicks: 615, ctr: '3,7%' },
            { url: '/reparar-iphone/bateria/sevilla', clicks: 581, ctr: '2,5%' },
            { url: '/reparar-apple-watch/sevilla', clicks: 562, ctr: '2,7%' },
            { url: '/reparar-iphone/sevilla', clicks: 466, ctr: '0,6%' },
            { url: '/reparar-ipad/sevilla', clicks: 370, ctr: '1,2%' },
          ],
        },
        national: {
          title: 'Páginas Nacionales (sin ciudad)',
          description: 'Reparaciones de nicho donde la localización importa menos. El formato "cambiar-{pieza}-{marca}-{modelo}" captura búsquedas informacionales que terminan en conversión.',
          examples: [
            { url: '/cambiar-bateria-google-pixel-6a', clicks: 372, ctr: '5,0%' },
          ],
        },
      },
      architecture: {
        heading: 'La Arquitectura',
        body: 'El sistema tiene cuatro capas. Airtable funciona como CMS headless con 14 tablas y ~60 campos por tabla. El ERP alimenta los datos reales de producción. DataForSEO decide qué se indexa. Astro genera HTML estático con cero JavaScript en el cliente.',
        layers: [
          {
            icon: 'database',
            name: 'Airtable (CMS Headless)',
            desc: '14 tablas, ~60 campos por tabla. Jerarquía de 6 niveles: Tipo de dispositivo, Marca, Familia, Modelo, Reparación + variantes locales. Precios duales (original y compatible), herencia de imágenes, social proof en cascada.',
          },
          {
            icon: 'wrench',
            name: 'ERP (Datos de Producción)',
            desc: 'Alimenta Airtable con datos reales: fotos de antes/después de reparaciones reales, reseñas verificadas de clientes, stock de piezas actualizado. 867 modelos, 20+ marcas, 15+ tipos de reparación.',
          },
          {
            icon: 'bar-chart',
            name: 'DataForSEO (Motor de Decisiones)',
            desc: 'Consulta volúmenes de búsqueda reales para cada combinación. El campo "indexable" en Airtable se alimenta directamente de estos datos. Sin volumen, la página no se indexa.',
          },
          {
            icon: 'zap',
            name: 'Astro (Generación Estática)',
            desc: '21 templates de página. Genera HTML estático con 0 JS en el cliente. 6 tipos de JSON-LD por página. SEO de imágenes con inyección EXIF. Deploy en Cloudflare CDN.',
          },
        ],
      },
      cmsDeepDive: {
        heading: 'El CMS por Dentro',
        body: 'Airtable no es solo una hoja de cálculo con esteroides. En este proyecto funciona como un CMS relacional completo. La clave es la jerarquía de 6 niveles que refleja exactamente cómo funciona el negocio.',
        tables: [
          { name: 'Tipos de Dispositivo', purpose: 'Nivel raíz de la taxonomía', keyFields: 'slug, nombre, descripción SEO, orden de menú' },
          { name: 'Marcas', purpose: 'Marcas vinculadas a tipos de dispositivo', keyFields: 'slug, nombre, logo, tipos compatibles' },
          { name: 'Familias', purpose: 'Agrupación de modelos (ej: iPhone 14 serie)', keyFields: 'slug, imagen principal (heredable), marca' },
          { name: 'Modelos', purpose: 'Dispositivos concretos con precios', keyFields: 'slug, familia, imagen (hereda de familia si no tiene), año' },
          { name: 'Reparaciones', purpose: 'Tipos de reparación por modelo', keyFields: 'slug, precio original, precio compatible, tiempo, indexable' },
          { name: 'Variantes Locales', purpose: 'Páginas con ciudad para SEO local', keyFields: 'modelo + reparación + ciudad, precio ajustado, disponibilidad' },
        ],
        highlights: [
          { title: 'Precios duales', detail: 'Cada reparación tiene precio con pieza original y precio con pieza compatible. El usuario elige en la landing.' },
          { title: 'Herencia de imágenes', detail: 'Si un modelo no tiene imagen propia, hereda la de su familia. Reduce trabajo de mantenimiento sin dejar páginas sin visual.' },
          { title: 'Social proof en cascada', detail: 'Las reseñas se vinculan a nivel de modelo, familia o marca. Una reseña de "iPhone 14 Pro" aparece en todas las reparaciones de ese modelo.' },
          { title: 'Bridge mode', detail: 'Reparaciones descatalogadas no se eliminan: se marcan como "bridge" y redirigen a la alternativa más cercana. Cero 404s, cero pérdida de autoridad.' },
        ],
      },
      pageAnatomy: {
        heading: 'Anatomía de una Página',
        body: 'Cada una de las 4.700+ páginas se genera desde un template, pero el contenido es único porque viene del ERP. No es texto generado por IA ni contenido de relleno: son datos de producción.',
        components: [
          { icon: 'list', name: 'Breadcrumb + Schema', desc: 'Navegación jerárquica que refleja la taxonomía. Genera BreadcrumbList JSON-LD automáticamente.' },
          { icon: 'dollar-sign', name: 'Precios Reales', desc: 'Precio original y compatible, actualizados desde el ERP. El usuario ve exactamente lo que va a pagar.' },
          { icon: 'clock', name: 'Tiempo Estimado', desc: 'Basado en datos históricos reales del taller. No es una estimación genérica.' },
          { icon: 'camera', name: 'Fotos Antes/Después', desc: 'Imágenes reales de reparaciones completadas. EXIF inyectado con geolocalización y metadata SEO.' },
          { icon: 'star', name: 'Reseñas Verificadas', desc: 'Reviews de clientes reales, vinculadas al modelo o familia. Con schema Review y AggregateRating.' },
          { icon: 'code', name: '6 Tipos de JSON-LD', desc: 'LocalBusiness, Product, Service, BreadcrumbList, FAQPage, AggregateRating. Cada página tiene markup completo.' },
        ],
        screenshot: {
          src: '/pseo/ss-repair-page-full.webp',
          alt: 'Anatomía de una página programática de reparación',
          caption: 'Ejemplo real: página de reparación generada desde el ERP. Precios duales, reseñas reales, JSON-LD completo.',
        },
        storytelling: {
          heading: 'Flujo de Conversión por Página',
          body: 'Cada página sigue una estructura de conversión diseñada para llevar al usuario del descubrimiento a la acción:',
          steps: [
            'Hero con precio dual (original/compatible) + CTA de cita directa',
            'Specs del modelo personalizadas: cámara, batería, tecnologías del dispositivo',
            'Galería de fotos reales de reparaciones completadas (antes/después)',
            'Reseñas verificadas de clientes vinculadas al modelo o familia',
            'FAQ generada desde los datos del ERP (preguntas reales de clientes)',
            'CTA final con mapa de la tienda y botón de reserva',
          ],
          example: 'Un usuario busca "reparar pantalla iPhone 14 Pro Sevilla". Llega a una página con precio (189€ original / 89€ compatible), tiempo estimado (45 min), 3 fotos de reparaciones reales de iPhone 14 Pro, y 12 reseñas verificadas. No necesita navegar a otra página — toda la información para decidir está ahí.',
        },
        dynamicCopy: {
          heading: 'Copy Dinámico por Modelo',
          body: 'Cada modelo de dispositivo tiene un microcopy único generado a partir de sus specs de hardware reales. Un campo en Airtable almacena las características técnicas (cámara, batería, procesador, resistencia al agua) y un prompt genera una descripción que varía según el modelo. Un iPhone 14 Pro habla de su cámara de 48MP y su pantalla ProMotion. Un Pixel 7a destaca su chip Tensor y fotografía computacional. No es contenido genérico: es contenido que solo aplica a ESE modelo, basado en datos reales de hardware. Misma plantilla, contenido único en cada página.',
        },
        contextSearch: {
          heading: 'Buscador Contextual',
          body: 'El buscador no es un simple filtro de texto. Es un componente con un algoritmo de scoring propio — sin librerías externas como Fuse.js. El usuario escribe "iphone 12 pro" y el sistema puntúa los 867 modelos: +20 si contiene todas las palabras, +30 si es coincidencia exacta, +10 si el nombre empieza por la búsqueda, y penaliza palabras extra en el nombre del modelo. El resultado: los 6 modelos más relevantes, ordenados por puntuación.',
          detail: 'Lo interesante es que el buscador es sensible al contexto. En la homepage busca en los 867 modelos de todas las marcas y tipos de dispositivo. Pero en la página de una marca específica (ej: Samsung), solo busca entre modelos de esa marca. Y en la página de un tipo de dispositivo (ej: tablets), solo tablets. El mismo componente, con props de filtro (`filtroTipo`, `filtroMarca`), se comporta de forma diferente según dónde se embeba. Los modelos se cargan bajo demanda en el primer foco del input y se cachean en localStorage para que las búsquedas siguientes sean instantáneas.',
        },
      },
      decisionEngine: {
        heading: 'El Motor de Decisiones',
        body: 'El sistema genera miles de páginas (muchas más de las 4.730 que recibieron tráfico), pero no todas merecen ser indexadas. Si nadie busca "reparar cámara delantera iPhone 11", esa página no debería competir en Google — pero sí debe existir para el usuario que navega desde la página del iPhone 11 y necesita esa reparación concreta. La clave es separar SEO de UX. El motor de decisiones consulta DataForSEO para obtener volumen de búsqueda real de cada combinación, y el resultado se almacena en el campo "indexable" de Airtable.',
        rules: [
          {
            condition: 'Volumen de búsqueda alto (DataForSEO)',
            action: 'Página indexable',
            detail: 'Si la keyword tiene volumen significativo, la página se genera con meta robots "index, follow", se incluye en el sitemap, y recibe enlazado interno prioritario.',
          },
          {
            condition: 'Volumen de búsqueda bajo o nulo',
            action: 'Página noindex (solo UX)',
            detail: 'La página existe para la experiencia de usuario y navegación interna, pero lleva meta robots "noindex" y no aparece en el sitemap.',
          },
          {
            condition: 'Sin datos de servicio en el ERP',
            action: 'No se genera página',
            detail: 'Si no hay datos reales del servicio (precio, disponibilidad), la página no se genera. Cero contenido thin.',
          },
          {
            condition: 'Reparación descatalogada',
            action: 'Bridge redirect',
            detail: 'La página se marca como "bridge" y redirige 301 a la alternativa más cercana. Preserva la autoridad acumulada.',
          },
        ],
        stats: 'El sistema genera miles de páginas en total. De esas, 4.084 están en el sitemap como indexables. 4.730 recibieron alguna impresión de Google. El resto no se indexa, pero sigue existiendo para la experiencia del usuario que navega la web.',
      },
      pipeline: {
        heading: 'Pipeline de Build',
        body: 'El pipeline transforma los datos del CMS en una web estática lista para desplegar. Todo está automatizado. schema.ts tiene 1.677 líneas que mapean la jerarquía de Airtable a tipos de Astro.',
        steps: [
          { label: 'Airtable API', desc: 'Extracción de registros con retry y backoff exponencial' },
          { label: 'Schema Mapping', desc: '1.677 líneas que transforman la jerarquía de 6 niveles en tipos TypeScript' },
          { label: 'Cache de Reviews', desc: 'Las reseñas se cachean para no hacer llamadas redundantes a la API' },
          { label: 'getStaticPaths', desc: 'Genera las rutas estáticas desde la taxonomía completa' },
          { label: 'ReparacionLayout', desc: '21 templates de página que renderizan según el nivel de la taxonomía' },
          { label: 'Astro SSG', desc: 'Build estático con 0 JavaScript en el cliente' },
          { label: 'Optimización', desc: 'Imágenes comprimidas, EXIF inyectado, sitemap filtrado, internal linking' },
          { label: 'Cloudflare CDN', desc: 'Deploy con invalidación de caché e edge caching global' },
        ],
      },
      contentAutomation: {
        heading: 'Pipeline de Contenido Automatizado',
        body: 'Generar miles de páginas es solo la mitad. Cada página necesita imágenes, metadata y copy únicos. Un conjunto de 8 scripts Node.js (1.411 líneas) automatiza toda la producción de contenido visual y textual sin intervención manual. Todo conectado a las 12 bases del Business OS en Airtable. Resultado: más de 26.000 imágenes generadas automáticamente.',
        pipelines: [
          {
            icon: 'camera',
            name: 'Generación Paramétrica de Imágenes',
            desc: 'De 1 foto de dispositivo se generan 18 variantes automáticas: una por tipo de reparación (pantalla, batería, cámara, puerto de carga...) + una imagen genérica. La foto del dispositivo se extrae de GSM Arena y se compone con overlays PNG de cada reparación. 867 modelos × 18 variantes = 15.500+ imágenes únicas, sin tocar Photoshop.',
          },
          {
            icon: 'code',
            name: 'Inyección EXIF para SEO Local',
            desc: 'Cada imagen recibe coordenadas GPS de Sevilla y una descripción SEO inyectada en los metadatos EXIF. Google Images lee estos datos para posicionar en búsquedas locales. Automatizado con piexifjs y codificación UCS-2.',
          },
          {
            icon: 'star',
            name: 'Pipeline de Fotos Antes/Después',
            desc: '10.000+ fotos de reparaciones reales procesadas automáticamente. Se descargan de Airtable, se redimensionan, se aplica blur para fondos, se componen en WebP, y las URLs resultantes se escriben de vuelta en Airtable. Pipeline ETL bidireccional: Airtable → procesamiento → Airtable.',
          },
          {
            icon: 'zap',
            name: 'Copy Dinámico por Modelo',
            desc: 'Cada modelo tiene un campo con sus specs de hardware (cámara, batería, procesador). Un prompt convierte esas specs en microcopy único para cada página. No es IA generando contenido: es IA describiendo datos reales de hardware. Cada página es diferente porque cada dispositivo es diferente.',
          },
        ],
        cascade: {
          heading: 'Cascada de Contenido: Una Reseña, Seis Páginas',
          body: 'El sistema hereda contenido automáticamente a través de la taxonomía. Una reseña de "reparación de pantalla de iPhone 12" no solo aparece en esa página — aparece en todas las páginas donde es relevante:',
          example: [
            { page: '/reparar-movil/apple/iphone-12/pantalla/sevilla', label: 'Modelo + reparación + ciudad' },
            { page: '/reparar-iphone/pantalla/sevilla', label: 'Dispositivo + reparación + ciudad' },
            { page: '/reparar-movil/apple/sevilla', label: 'Dispositivo + marca + ciudad' },
            { page: '/reparar-iphone/sevilla', label: 'Dispositivo + ciudad' },
            { page: '/reparar-movil/pantalla/sevilla', label: 'Dispositivo + reparación + ciudad' },
            { page: '/reparar-movil/sevilla', label: 'Dispositivo + ciudad' },
          ],
          detail: 'La misma lógica aplica a las fotos antes/después: una foto de reparación de pantalla de iPhone 12 aparece en todas las páginas de esa rama de la taxonomía. Esto multiplica el contenido único sin duplicar ni generar nada artificialmente. Cada página acumula más social proof y contenido visual a medida que el negocio crece.',
        },
        stats: '26.000+ imágenes generadas automáticamente. 867 modelos con 18 variantes cada uno. 10.000+ fotos de reparaciones reales. Cero intervención manual. Las 12 bases del Business OS alimentan el pipeline completo.',
      },
      imagePipeline: {
        heading: 'Dentro del Pipeline de Imágenes',
        intro: 'La sección anterior describe el pipeline a alto nivel. Aquí se ve exactamente cómo funciona: las plantillas reales, el código de composición, y el resultado de aplicarlo a 867 modelos distintos.',
        overlayShowcase: {
          heading: 'Las Plantillas de Overlay',
          body: 'Cada tipo de reparación tiene un overlay PNG de 384×256 píxeles. El overlay muestra visualmente qué pieza se repara: una pantalla rota, una batería, una cámara... Son 17 plantillas en total, cada una diseñada para superponerse sobre la foto de cualquier dispositivo.',
          items: [
            { src: 'pantalla.png', altEs: 'Overlay de reparación de pantalla', altEn: 'Screen repair overlay' },
            { src: 'bateria.png', altEs: 'Overlay de cambio de batería', altEn: 'Battery replacement overlay' },
            { src: 'camara-trasera.png', altEs: 'Overlay de cámara trasera', altEn: 'Rear camera overlay' },
            { src: 'puerto-carga.png', altEs: 'Overlay de puerto de carga', altEn: 'Charging port overlay' },
            { src: 'tapa-trasera.png', altEs: 'Overlay de tapa trasera', altEn: 'Back cover overlay' },
            { src: 'cristal.png', altEs: 'Overlay de cambio de cristal', altEn: 'Glass replacement overlay' },
          ],
        },
        compositionProcess: {
          heading: 'El Proceso de Composición',
          body: 'Cada imagen de reparación se genera en 6 pasos, completamente automatizado con un script Node.js y Sharp.js:',
          steps: [
            { label: 'Descargar foto del dispositivo', detail: 'Se extrae la foto oficial del dispositivo desde GSM Arena y se almacena temporalmente.' },
            { label: 'Crear canvas blanco 384×256', detail: 'Sharp.js crea una imagen base en blanco de 384×256 píxeles con canal alpha.' },
            { label: 'Superponer el overlay PNG', detail: 'La plantilla de reparación (pantalla, batería, etc.) se compone como primera capa sobre el canvas.' },
            { label: 'Centrar el dispositivo en x=96', detail: 'La foto del dispositivo se redimensiona proporcionalmente y se centra en la posición x=96, dejando espacio para el overlay a la derecha.' },
            { label: 'Exportar a WebP', detail: 'El resultado se exporta como WebP optimizado. Cada imagen pesa ~5-8 KB.' },
            { label: 'Repetir ×17 reparaciones + hero', detail: 'El proceso se repite para los 17 tipos de reparación más una imagen genérica (hero) de 256×256. Total: 18 imágenes por modelo.' },
          ],
        },
        codeSnippet: {
          heading: 'El Código Real',
          body: 'Este es el fragmento real del script `generarImagenesReparacionesModelos.mjs` que genera cada imagen de reparación:',
          segments: [
            {
              code: `await sharp({
  create: {
    width: 384, height: 256,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 }
  }
})
  .png()
  .composite([
    { input: overlayPath },
    { input: devicePhoto,
      top: Math.round(top),
      left: Math.round(left) }
  ])
  .webp()
  .toFile(outputPath)`,
              annotations: [
                { label: 'Canvas', detail: 'Crea una imagen en blanco de 384×256 con fondo blanco y canal alpha. Este es el lienzo sobre el que se compone todo.' },
                { label: 'Orden de composición', detail: 'Primero el overlay (plantilla de reparación), después la foto del dispositivo. El orden importa: el overlay queda detrás del dispositivo.' },
                { label: 'Posicionamiento', detail: 'La foto del dispositivo se centra verticalmente y se posiciona en x≈96. Esto deja espacio visual para que el overlay de reparación sea visible a la derecha.' },
              ],
            },
          ],
        },
        onePhotoDemo: {
          heading: '1 Foto → 18 Variantes',
          body: 'A partir de una sola foto del iPhone 14 Pro, el pipeline genera automáticamente 18 imágenes únicas: una imagen hero genérica y 17 variantes de reparación. Cada variante combina la foto del dispositivo con un overlay específico.',
          hero: {
            src: '/pseo/demo/apple-iphone-14-pro/reparar-apple-iphone-14-pro.webp',
            alt: 'iPhone 14 Pro — imagen hero genérica generada automáticamente',
            caption: 'Imagen hero: la foto del iPhone 14 Pro centrada en un canvas de 256×256, sin overlay.',
          },
          variants: [
            { src: 'cambiar-pantalla-apple-iphone-14-pro.webp', altEs: 'Cambiar pantalla iPhone 14 Pro', altEn: 'iPhone 14 Pro screen replacement' },
            { src: 'cambiar-bateria-apple-iphone-14-pro.webp', altEs: 'Cambiar batería iPhone 14 Pro', altEn: 'iPhone 14 Pro battery replacement' },
            { src: 'cambiar-camara-trasera-apple-iphone-14-pro.webp', altEs: 'Cambiar cámara trasera iPhone 14 Pro', altEn: 'iPhone 14 Pro rear camera replacement' },
            { src: 'cambiar-puerto-carga-apple-iphone-14-pro.webp', altEs: 'Cambiar puerto de carga iPhone 14 Pro', altEn: 'iPhone 14 Pro charging port replacement' },
            { src: 'cambiar-tapa-trasera-apple-iphone-14-pro.webp', altEs: 'Cambiar tapa trasera iPhone 14 Pro', altEn: 'iPhone 14 Pro back cover replacement' },
            { src: 'cambiar-cristal-apple-iphone-14-pro.webp', altEs: 'Cambiar cristal iPhone 14 Pro', altEn: 'iPhone 14 Pro glass replacement' },
            { src: 'cambiar-altavoz-apple-iphone-14-pro.webp', altEs: 'Cambiar altavoz iPhone 14 Pro', altEn: 'iPhone 14 Pro speaker replacement' },
            { src: 'cambiar-microfono-apple-iphone-14-pro.webp', altEs: 'Cambiar micrófono iPhone 14 Pro', altEn: 'iPhone 14 Pro microphone replacement' },
            { src: 'cambiar-auricular-apple-iphone-14-pro.webp', altEs: 'Cambiar auricular iPhone 14 Pro', altEn: 'iPhone 14 Pro earpiece replacement' },
          ],
          caption: {
            es: '9 de las 17 variantes generadas automáticamente para el iPhone 14 Pro. Cada imagen combina la foto real del dispositivo con un overlay de reparación específico.',
            en: '9 of the 17 auto-generated variants for the iPhone 14 Pro. Each image composites the real device photo with a specific repair overlay.',
          },
        },
        crossDeviceDemo: {
          heading: 'Mismo Pipeline, Diferente Dispositivo',
          body: 'El mismo proceso se aplica a cualquier dispositivo. La foto cambia, los overlays son los mismos. Esto es lo que permite escalar a 867 modelos sin trabajo manual.',
          heroes: [
            { src: '/pseo/demo/apple-iphone-14-pro/reparar-apple-iphone-14-pro.webp', alt: 'iPhone 14 Pro — hero' },
            { src: '/pseo/demo/samsung-galaxy-s23-ultra/reparar-samsung-galaxy-s23-ultra.webp', alt: 'Samsung Galaxy S23 Ultra — hero' },
            { src: '/pseo/demo/reparar-xiaomi-12.webp', alt: 'Xiaomi 12 — hero' },
          ],
          comparison: [
            { src: '/pseo/demo/apple-iphone-14-pro/cambiar-pantalla-apple-iphone-14-pro.webp', alt: 'Cambiar pantalla iPhone 14 Pro' },
            { src: '/pseo/demo/samsung-galaxy-s23-ultra/cambiar-pantalla-samsung-galaxy-s23-ultra.webp', alt: 'Cambiar pantalla Samsung Galaxy S23 Ultra' },
          ],
          comparisonCaption: {
            es: 'Mismo overlay de "cambiar pantalla", diferente dispositivo. La plantilla es idéntica — lo que cambia es la foto del modelo.',
            en: 'Same "screen replacement" overlay, different device. The template is identical — what changes is the model photo.',
          },
        },
        scale: {
          heading: 'La Escala',
          metrics: [
            { value: '867', label: 'Modelos', detail: 'Dispositivos únicos con imágenes generadas' },
            { value: '17', label: 'Overlays', detail: 'Plantillas de reparación (pantalla, batería, cámara...)' },
            { value: '18', label: 'Imgs/modelo', detail: '17 reparaciones + 1 hero por dispositivo' },
            { value: '15.606', label: 'Composites', detail: 'Total de imágenes generadas automáticamente' },
          ],
        },
      },
      reviewsPipeline: {
        heading: 'Pipeline de Reseñas',
        intro: 'Las reseñas son el social proof más potente de cada página. Pero gestionar 607 perfiles de clientes, sincronizar dos fuentes y cascadear la prueba social por toda la taxonomía requiere su propio pipeline.',
        sourceSync: {
          heading: 'Fuente y Sincronización',
          body: 'Las reseñas llegan de dos fuentes: Google My Business (verificadas públicamente) y encuestas internas post-reparación. Ambas se sincronizan a Airtable y se normalizan en un formato único.',
          table: {
            headers: ['Tabla', 'Fuente', 'Campos clave'],
            rows: [
              ['Reseñas sincronizar Astro', 'Google My Business', 'quote, name, puntuacion, imageUrl, respuesta'],
              ['Reseñas Internas', 'Encuestas post-reparación', 'quote, name, puntuacion, imageUrl, modelo vinculado'],
            ],
          },
        },
        imageProcessing: {
          heading: 'Procesamiento de Fotos de Perfil',
          body: 'Cada reseña con foto de perfil pasa por un pipeline de procesamiento automatizado:',
          steps: [
            { label: 'Descargar foto desde Airtable', detail: 'La URL de la foto de perfil se descarga desde el campo de attachments de Airtable.' },
            { label: 'Convertir a WebP quality 95', detail: 'Sharp.js convierte la imagen a WebP con calidad 95 para preservar el detalle del rostro.' },
            { label: 'Guardar en /bg/res/', detail: 'El archivo se guarda con nombre semántico: reparacion-{tipo}-{modelo}-{nombre}-{fecha}.webp' },
            { label: 'Escribir URL de vuelta en Airtable', detail: 'La URL resultante se escribe de vuelta en el campo correspondiente. ETL bidireccional.' },
          ],
        },
        codeSnippet: {
          heading: 'El Código Real',
          body: 'Este es el fragmento real de `generarImagenesReseñas.mjs` que procesa cada foto de perfil:',
          segments: [
            {
              code: `const imageBuffer = await fetch(attachmentUrl)
  .then(r => r.arrayBuffer())

await sharp(Buffer.from(imageBuffer))
  .webp({ quality: 95 })
  .toFile(outputPath)

// Write processed URL back to Airtable
await base('Reseñas sincronizar Astro')
  .update(record.id, {
    'imagen_procesada': outputUrl
  })`,
              annotations: [
                { label: 'Preservación de dimensiones', detail: 'No se redimensiona — la foto de perfil se mantiene en su tamaño original para máxima calidad en el carrusel.' },
                { label: 'WebP quality 95', detail: 'Quality más alto que las fotos de reparación (85) porque las fotos de perfil son más pequeñas y el detalle importa más.' },
                { label: 'ETL bidireccional', detail: 'Airtable es fuente Y destino: la foto se descarga, se procesa, y la URL resultante se escribe de vuelta en el registro.' },
              ],
            },
          ],
        },
        cascade: {
          heading: 'Cascada de Social Proof',
          body: 'Las reseñas no solo aparecen en una página — se heredan por toda la taxonomía. Una reseña vinculada a un modelo se propaga a todas las páginas donde ese modelo es relevante.',
          points: [
            'Reseña de "iPhone 14 Pro" → aparece en todas las reparaciones de ese modelo, en todas las ciudades',
            'Reseña de familia "iPhone 14" → aparece en todos los modelos de la familia (14, 14 Plus, 14 Pro, 14 Pro Max)',
            'Reseña de marca "Apple" → aparece en páginas de marca agregadas como /reparar-movil/apple/sevilla',
            'La cascada es automática: al vincular la reseña al nivel correcto, el build la distribuye',
          ],
        },
        profileDemo: {
          heading: '607 Perfiles Procesados',
          body: 'Estos son perfiles reales de clientes procesados por el pipeline. Cada foto fue descargada, convertida a WebP y vinculada de vuelta a Airtable.',
          items: [
            { src: 'cliente.webp', altEs: 'Perfil de cliente procesado', altEn: 'Processed customer profile' },
            { src: 'sarah.webp', altEs: 'Sarah — reparación de auricular iPhone 11', altEn: 'Sarah — iPhone 11 earpiece repair' },
            { src: 'cristina.webp', altEs: 'Cristina — reparación de auricular iPhone 12', altEn: 'Cristina — iPhone 12 earpiece repair' },
            { src: 'ricardo.webp', altEs: 'Ricardo — cambio de batería Google Pixel 4', altEn: 'Ricardo — Google Pixel 4 battery replacement' },
            { src: 'jacinto.webp', altEs: 'Jacinto — reparación de pantalla iPhone 11', altEn: 'Jacinto — iPhone 11 screen repair' },
            { src: 'ivan.webp', altEs: 'Iván — reparación de tapa trasera iPhone 12', altEn: 'Ivan — iPhone 12 back cover repair' },
          ],
          caption: {
            es: '6 de los 607 perfiles de clientes procesados automáticamente. Cada foto se descarga, convierte a WebP y vincula de vuelta a Airtable.',
            en: '6 of 607 customer profiles processed automatically. Each photo is downloaded, converted to WebP, and linked back to Airtable.',
          },
        },
        carouselCro: {
          heading: 'Renderizado: Carrusel CRO',
          body: 'En producción, las reseñas se renderizan en un carrusel con auto-rotación de 9 segundos, barra de progreso visual y navegación por puntos. Las top 20 reseñas son visibles directamente; el resto se expanden bajo un botón "Ver más". Todo renderizado en servidor — cero JavaScript para el carrusel base.',
          callout: 'Filtro automático: solo reseñas ≥5★ con comentario van primero. Las reseñas sin texto o con menos de 5 estrellas quedan después del fold.',
        },
        scale: {
          heading: 'La Escala',
          metrics: [
            { value: '607', label: 'Perfiles procesados', detail: 'Fotos de perfil convertidas a WebP' },
            { value: '2', label: 'Fuentes', detail: 'Google My Business + encuestas internas' },
            { value: '9s', label: 'Rotación', detail: 'Auto-rotación del carrusel CRO' },
            { value: '≥5★', label: 'Prioridad', detail: 'Reseñas con 5 estrellas y comentario van primero' },
          ],
        },
      },
      repairedDevicesPipeline: {
        heading: 'Pipeline Antes/Después',
        intro: 'Cada reparación completada genera evidencia fotográfica: 4 fotos que documentan el estado del dispositivo antes y después. Este pipeline procesa esas fotos automáticamente y las distribuye por la web.',
        captureProtocol: {
          heading: 'Protocolo de Captura',
          body: 'Cada reparación completada en el taller sigue un protocolo de 4 fotos:',
          steps: [
            { label: 'Frontal antes', detail: 'Foto del frontal del dispositivo antes de la reparación. Muestra el daño visible (pantalla rota, marcas, etc.).' },
            { label: 'Frontal después', detail: 'Foto del frontal tras la reparación. Mismo ángulo para comparación directa.' },
            { label: 'Trasera antes', detail: 'Foto de la parte trasera antes. Documenta el estado general del dispositivo.' },
            { label: 'Trasera después', detail: 'Foto de la parte trasera tras la reparación. Completa la documentación visual.' },
          ],
          privacyNote: 'El flag `difuminar` en Airtable marca las fotos que necesitan blur: pantallas encendidas con notificaciones visibles, datos personales, etc. El blur se aplica automáticamente en el pipeline.',
        },
        imageProcessing: {
          heading: 'Procesamiento Automatizado',
          body: 'Cada foto pasa por 6 pasos de procesamiento con Sharp.js:',
          steps: [
            { label: 'Descargar desde Airtable', detail: 'La foto original se descarga desde el campo de attachments del registro de reparación.' },
            { label: 'Resize a 1/4 de resolución', detail: 'La imagen se redimensiona al 25% de su tamaño original. Suficiente para web, reduce el peso drásticamente.' },
            { label: 'Blur condicional (sigma 8)', detail: 'Si el flag `difuminar` está activo, se aplica un blur gaussiano con sigma 8. Protege datos personales en pantalla.' },
            { label: 'Overlay blanco semi-transparente', detail: 'Se compone una capa blanca al 30% sobre el fondo para mejorar contraste y darle un look consistente.' },
            { label: 'Exportar a WebP quality 85', detail: 'Calidad 85 — más bajo que las fotos de perfil (95) porque a 1/4 de resolución el detalle extra no se nota.' },
            { label: 'Escribir slug de vuelta', detail: 'El nombre del archivo procesado se escribe de vuelta en Airtable para que el build de Astro lo encuentre.' },
          ],
        },
        codeSnippet: {
          heading: 'El Código Real',
          body: 'Este es el fragmento real de `CasosExito.mjs` que procesa cada foto de reparación:',
          segments: [
            {
              code: `let pipeline = sharp(inputBuffer)
  .resize({
    width: Math.round(metadata.width / 4),
    height: Math.round(metadata.height / 4)
  })

if (record.fields.difuminar) {
  pipeline = pipeline.blur(8)
}

await pipeline
  .composite([{
    input: whiteOverlay,
    blend: 'over'
  }])
  .webp({ quality: 85 })
  .toFile(outputPath)`,
              annotations: [
                { label: 'Resize 1/4', detail: 'Reduce a la cuarta parte. Una foto de 4032×3024 queda en 1008×756 — perfecto para web, reduce el peso de ~3MB a ~30KB.' },
                { label: 'Blur condicional', detail: 'Solo se aplica si el campo `difuminar` está activo en Airtable. Sigma 8 difumina notificaciones y datos personales visibles en pantalla.' },
                { label: 'Quality 85 vs 95', detail: 'Menor calidad que las fotos de perfil porque a 1/4 de resolución el detalle extra no aporta. Ahorra ~40% de peso por imagen.' },
              ],
            },
          ],
        },
        demo: {
          heading: 'Resultado Real: iPhone 14 Pro',
          body: 'Estas son fotos reales procesadas por el pipeline. Frontal y trasera, antes y después de la reparación.',
          frontal: [
            { src: '/pseo/before-after/iphone-14-pro-front-before.webp', alt: 'iPhone 14 Pro frontal — antes de reparación' },
            { src: '/pseo/before-after/iphone-14-pro-front-after.webp', alt: 'iPhone 14 Pro frontal — después de reparación' },
          ],
          frontalCaption: 'iPhone 14 Pro — frontal antes y después',
          trasera: [
            { src: '/pseo/before-after/iphone-14-pro-back-before.webp', alt: 'iPhone 14 Pro trasera — antes de reparación' },
            { src: '/pseo/before-after/iphone-14-pro-back-after.webp', alt: 'iPhone 14 Pro trasera — después de reparación' },
          ],
          traseraCaption: 'iPhone 14 Pro — trasera antes y después',
        },
        crossDeviceDemo: {
          heading: 'Mismo Pipeline, Diferentes Marcas',
          body: 'El pipeline funciona igual para cualquier marca y modelo. Aquí se ve aplicado a un Samsung Galaxy A51 y un Xiaomi Redmi Note 9S.',
          samsung: [
            { src: '/pseo/before-after/samsung-a51-before.webp', alt: 'Samsung Galaxy A51 — antes de reparación' },
            { src: '/pseo/before-after/samsung-a51-after.webp', alt: 'Samsung Galaxy A51 — después de reparación' },
          ],
          samsungCaption: 'Samsung Galaxy A51 — antes y después',
          xiaomi: [
            { src: '/pseo/before-after/xiaomi-note9s-before.webp', alt: 'Xiaomi Redmi Note 9S — antes de reparación' },
            { src: '/pseo/before-after/xiaomi-note9s-after.webp', alt: 'Xiaomi Redmi Note 9S — después de reparación' },
          ],
          xiaomiCaption: 'Xiaomi Redmi Note 9S — antes y después',
          caption: {
            es: 'Mismo pipeline de procesamiento para cualquier marca. Las fotos se descargan, redimensionan, difuminan si es necesario y exportan a WebP automáticamente.',
            en: 'Same processing pipeline for any brand. Photos are downloaded, resized, blurred if needed, and exported to WebP automatically.',
          },
        },
        naming: {
          heading: 'Convención de Nombres',
          body: 'Cada foto sigue una convención estricta que permite al build de Astro encontrarlas automáticamente:',
          pattern: '{fecha}-reparacion-{marca}-{modelo}-{ordenId}-{1|2|3|4}.webp',
          suffixes: [
            { title: 'Sufijo -1', detail: 'Frontal antes de la reparación' },
            { title: 'Sufijo -2', detail: 'Frontal después de la reparación' },
            { title: 'Sufijo -3', detail: 'Trasera antes de la reparación' },
            { title: 'Sufijo -4', detail: 'Trasera después de la reparación' },
          ],
        },
        scale: {
          heading: 'La Escala',
          metrics: [
            { value: '10.342', label: 'Fotos procesadas', detail: 'Fotos de reparaciones reales convertidas a WebP' },
            { value: '4', label: 'Ángulos', detail: 'Frontal antes/después + trasera antes/después' },
            { value: '1/4', label: 'Resolución', detail: 'Resize al 25% del original para web' },
            { value: 'Q85', label: 'WebP quality', detail: 'Calidad optimizada para fotos de reparación' },
          ],
        },
      },
      growth: {
        heading: 'Curva de Crecimiento',
        body: 'El proyecto se lanzó en octubre 2024. Los primeros meses fueron de indexación progresiva. El pico llegó en septiembre 2025 con 2.193 clicks, un crecimiento de 10,8x desde el primer mes. Vendí el negocio en su punto más alto.',
        monthly: [
          { month: 'Oct 2024', clicks: 202, impressions: 16420, note: 'Lanzamiento' },
          { month: 'Nov 2024', clicks: 748, impressions: 69054 },
          { month: 'Dic 2024', clicks: 949, impressions: 77387 },
          { month: 'Ene 2025', clicks: 1277, impressions: 110836 },
          { month: 'Feb 2025', clicks: 935, impressions: 100558 },
          { month: 'Mar 2025', clicks: 1191, impressions: 118826 },
          { month: 'Abr 2025', clicks: 1027, impressions: 106744 },
          { month: 'May 2025', clicks: 936, impressions: 97137 },
          { month: 'Jun 2025', clicks: 996, impressions: 121088 },
          { month: 'Jul 2025', clicks: 1611, impressions: 150927 },
          { month: 'Ago 2025', clicks: 1789, impressions: 164791 },
          { month: 'Sep 2025', clicks: 2193, impressions: 164440, note: 'Pico · Venta del negocio' },
        ],
        insight: 'De 202 a 2.193 clicks/mes en 11 meses. La estacionalidad del sector es visible: verano y vuelta al cole disparan las búsquedas de reparación. El sistema sigue en producción bajo el nuevo propietario.',
      },
      results: {
        heading: 'Resultados',
        body: 'Métricas acumuladas desde el lanzamiento (octubre 2024 a febrero 2026), directamente de Google Search Console:',
        metrics: [
          { value: '2,26M', label: 'Impresiones totales', detail: 'Acumulado en 17 meses de operación' },
          { value: '19.388', label: 'Clicks orgánicos', detail: 'CTR medio del 1,17% sobre 2,26M de impresiones' },
          { value: '4.730', label: 'URLs con impresiones', detail: '99,3% son páginas programáticas' },
          { value: '4.084', label: 'URLs en sitemap', detail: 'Solo las que pasan el motor de decisiones de DataForSEO' },
          { value: '80%', label: 'Clicks desde pSEO', detail: 'El tráfico orgánico del sitio viene de páginas programáticas' },
          { value: '<1s', label: 'Tiempo de carga', detail: 'Astro SSG con 0 JS en cliente + Cloudflare CDN' },
        ],
      },
      crawlBudget: {
        heading: 'Optimización del Crawl Budget',
        body: 'Con 4.700+ páginas, gestionar el crawl budget es crítico. Google no debería perder tiempo rastreando páginas que no van a posicionar.',
        strategies: [
          {
            title: 'Noindex selectivo con DataForSEO',
            detail: 'El campo "indexable" en Airtable se alimenta directamente de los datos de volumen de DataForSEO. Las páginas sin volumen llevan noindex. No es una decisión arbitraria: es data-driven.',
          },
          {
            title: 'Sitemap filtrado (4.084 URLs)',
            detail: 'El sitemap.xml solo incluye URLs indexables. De las 4.730 páginas con impresiones, solo 4.084 están en el sitemap. Google no descubre las demás a través de este canal.',
          },
          {
            title: 'Estructura de URLs con 6 patrones',
            detail: 'Cada nivel de la taxonomía tiene un patrón de URL predecible. Google entiende la jerarquía sin necesidad de heurísticas complejas.',
          },
          {
            title: 'Enlazado interno contextual',
            detail: 'Las páginas indexables reciben más enlaces internos. Las páginas de ciudad enlazan a reparaciones disponibles, los modelos enlazan a sus reparaciones, y las familias agregan sus modelos.',
          },
          {
            title: 'Bridge redirects para descatalogados',
            detail: 'En lugar de devolver 404 cuando una reparación se descataloga, se redirige 301 a la alternativa más cercana. Cero pérdida de autoridad, cero enlaces rotos.',
          },
        ],
      },
      urlTaxonomy: {
        heading: 'Taxonomía de URLs',
        body: 'La web usa 6 patrones de URL, cada uno correspondiente a un nivel de la taxonomía del negocio. Los patrones locales (con /sevilla) capturan intención local. Los patrones nacionales (sin ciudad) capturan búsquedas de nicho.',
        patterns: [
          { pattern: '/reparar-{dispositivo}/{ciudad}', example: '/reparar-smartwatch/sevilla', description: 'Dispositivo genérico + ciudad. La entrada más amplia al funnel local.' },
          { pattern: '/reparar-{dispositivo}/{marca}/{ciudad}', example: '/reparar-movil/samsung/sevilla', description: 'Dispositivo + marca + ciudad. Más específico, mejor CTR.' },
          { pattern: '/reparar-{dispositivo}/{reparación}/{ciudad}', example: '/reparar-iphone/bateria/sevilla', description: 'Dispositivo + tipo de reparación + ciudad. Alta intención transaccional.' },
          { pattern: '/reparar-{dispositivo}/{marca}/{reparación}/{ciudad}', example: '/reparar-movil/samsung/pantalla/sevilla', description: 'Combinación completa local. La más específica del funnel.' },
          { pattern: '/reparar-{dispositivo}/{modelo}/{reparación}', example: '/reparar-apple-watch/se/bateria', description: 'Modelo específico + reparación, sin ciudad. Para búsquedas nacionales de nicho.' },
          { pattern: '/cambiar-{reparación}-{marca}-{modelo}', example: '/cambiar-bateria-google-pixel-6a', description: 'Formato directo nacional. Captura búsquedas como "cambiar batería pixel 6a" con CTR alto (5%).' },
        ],
      },
      stack: {
        heading: 'Stack y Herramientas',
        body: 'El stack se eligió para una necesidad concreta: generar miles de páginas estáticas con datos de un CMS relacional, sin JavaScript en el cliente. Astro era la opción obvia para SSG puro. Airtable funcionaba como CMS porque ya era el Business OS del negocio — no tenía sentido migrar a Supabase para una web estática. DataForSEO se eligió por precio y cobertura de keywords en español.',
        items: [
          { name: 'Astro', role: 'SSG, 21 templates, 0 JS en cliente' },
          { name: 'Airtable', role: 'CMS headless, 14 tablas, ~60 campos/tabla' },
          { name: 'DataForSEO', role: 'Volúmenes de búsqueda, campo "indexable"' },
          { name: 'ERP propio', role: '867 modelos, precios, stock, fotos, reseñas' },
          { name: 'Cloudflare', role: 'CDN, edge caching, deploy' },
          { name: 'TypeScript', role: 'schema.ts de 1.677 líneas para el mapping' },
          { name: 'JSON-LD', role: '6 tipos de structured data por página' },
        ],
      },
      lessons: {
        heading: 'Lecciones Aprendidas',
        items: [
          {
            title: 'Google decide la geografía, no tú.',
            detail: 'Empecé queriendo posicionar en toda España. Google tenía otros planes. Las búsquedas de reparación tienen intención local fortísima. Las páginas sin ciudad competían peor que las locales de Sevilla. La lección: construye la infraestructura completa, pero deja que los datos de GSC te digan dónde poner el foco.',
          },
          {
            title: 'El motor de decisiones es más importante que el generador.',
            detail: 'Generar 10.000 páginas es trivial. Decidir cuáles indexar basándote en datos reales de DataForSEO es lo que marca la diferencia entre pSEO con resultados y una granja de contenido thin. De las miles de combinaciones posibles, solo 4.084 están en el sitemap.',
          },
          {
            title: 'El ERP es el diferenciador competitivo, no el template.',
            detail: 'Cualquiera puede generar páginas con IA. Nadie puede generar fotos reales de antes/después, reseñas verificadas, precios duales (original y compatible), y tiempos basados en datos históricos sin un ERP integrado. El contenido único no viene del copy, viene de los datos.',
          },
          {
            title: 'Airtable escala mejor de lo que esperaba.',
            detail: '14 tablas, ~60 campos por tabla, jerarquía de 6 niveles. Con retry y backoff exponencial en la API, el build es estable. El truco: cachear las reseñas y no hacer llamadas redundantes. Para un equipo de una persona, Airtable como CMS headless funciona.',
          },
          {
            title: 'Las URLs de nicho nacional dan el mejor CTR.',
            detail: 'El formato /cambiar-bateria-google-pixel-6a tiene un CTR del 5,0% con posición media 7,8. Estas búsquedas son tan específicas que casi no tienen competencia. El volumen individual es bajo, pero multiplicado por cientos de modelos, suma.',
          },
        ],
      },
    },
    cta: {
      heading: '¿Quieres replicar esta estrategia?',
      body: 'Puedo compartir el playbook completo de SEO programático: arquitectura del CMS, pipeline de build, motor de decisiones con DataForSEO, y las métricas reales de GSC que usé para iterar.',
      label: 'Hablemos',
    },
    faq: {
      heading: 'Preguntas Frecuentes',
      items: [
        {
          q: '¿El SEO programático no es spam?',
          a: 'Solo si las páginas no aportan valor. En este caso, cada página tiene datos reales del servicio: precio actual (original y compatible), tiempo estimado basado en históricos, fotos de antes/después de reparaciones reales, y reseñas verificadas de clientes. No es contenido generado por IA ni texto de relleno. Son datos de producción del ERP.',
        },
        {
          q: '¿Solo funciona en Sevilla?',
          a: 'Las páginas locales se centran en Sevilla porque es donde está la tienda física, y Google prioriza resultados con proximidad geográfica para búsquedas de reparación. Las páginas nacionales (formato /cambiar-{pieza}-{marca}-{modelo}) funcionan sin restricción geográfica y capturan búsquedas de nicho en toda España.',
        },
        {
          q: '¿Por qué no usaste IA para generar el contenido?',
          a: 'Porque el diferenciador competitivo es que los datos son reales. Los precios salen del ERP, las fotos son de reparaciones reales, las reseñas son de clientes verificados. Una página generada por IA puede sonar bien, pero no tiene datos de producción. El blog sí se apoyó en IA para la redacción, combinado con NotebookLM para el podcast de cada artículo.',
        },
        {
          q: '¿Airtable escala con 4.700+ páginas?',
          a: 'Sí, con matices. Las 14 tablas y ~60 campos por tabla funcionan bien con un pipeline de build (no consultas en tiempo real). La clave es retry con backoff exponencial en la API y cacheo de datos frecuentes como reseñas. Para consultas en vivo a escala mayor, habría que evaluar alternativas como Supabase.',
        },
        {
          q: '¿Cómo se mantienen actualizadas las páginas?',
          a: 'Cuando cambia un precio o se añade un modelo en el ERP, el dato se actualiza en Airtable. El siguiente build regenera las páginas afectadas. Las reseñas nuevas se propagan automáticamente por la cascada familia-modelo. No hay intervención manual para el contenido.',
        },
        {
          q: '¿Por qué Astro y no Next.js?',
          a: 'Para un sitio 100% estático donde el contenido cambia con baja frecuencia, Astro genera HTML puro con cero JavaScript en el cliente. Las páginas cargan en menos de 1 segundo, los Core Web Vitals son excelentes de forma nativa, y el deploy en Cloudflare CDN es trivial.',
        },
        {
          q: '¿Qué hace DataForSEO exactamente?',
          a: 'DataForSEO proporciona el volumen de búsqueda real de cada keyword. El resultado se almacena en el campo "indexable" de Airtable. Si una combinación de dispositivo + reparación + ciudad no tiene volumen de búsqueda, la página se genera pero lleva noindex. Es el motor de decisiones que evita diluir la autoridad del dominio con páginas que Google ignoraría.',
        },
      ],
    },
    resources: {
      heading: 'Recursos',
      items: [
        { label: 'Santifer iRepair (la web programática)', url: 'https://santiferirepair.es' },
        { label: 'Case Study: Business OS / ERP que alimenta estas páginas', url: '/business-os-para-airtable' },
        { label: 'Astro, el framework de sitio estático', url: 'https://astro.build' },
        { label: 'DataForSEO, API de datos SEO', url: 'https://dataforseo.com' },
        { label: 'Airtable, plataforma de datos y CMS', url: 'https://airtable.com' },
      ],
    },
    footer: {
      role: 'AI Product Manager · Solutions Architect',
      bio: 'Construyó y vendió un negocio de 16 años en 2025. Ahora aplica el mismo pensamiento de sistemas a AI enterprise.',
      fellowAt: 'Teaching Fellow en',
      fellowLink: 'AI Product Academy',
      copyright: 'Todos los derechos reservados.',
    },
  },
  en: {
    slug: 'programmatic-seo',
    altSlug: 'seo-programatico',
    readingTime: '28 min read',
    seo: {
      title: 'Programmatic SEO: 4,000+ Pages from an ERP | santifer.io',
      description: 'Case study: how I built 4,730 static landing pages with Airtable as headless CMS, DataForSEO for crawl budget optimization, and Astro SSG. 2M+ impressions, 19K+ clicks.',
    },
    nav: {
      breadcrumbHome: 'Home',
      breadcrumbCurrent: 'Programmatic SEO',
    },
    header: {
      kicker: 'Case Study — <a>Santifer iRepair</a>',
      kickerLink: 'https://santiferirepair.es',
      h1: 'Programmatic SEO: 4,700+ Pages from an ERP',
      subtitle: 'How I generated 4,730 unique landing pages with real production data, a 14-table Airtable CMS, and DataForSEO as the decision engine. 2.26M impressions, 19K+ clicks, zero AI-generated content.',
      date: 'Feb 25, 2026',
    },
    intro: {
      hook: 'In Spain\'s device repair market, I couldn\'t find anyone doing programmatic SEO. Every combination of device, brand, model, repair type, and city was an untapped long-tail opportunity.',
      body: 'The idea was simple: if someone searches "iPhone battery repair Seville", a dedicated page should exist — with the real price, estimated turnaround, and photos from actual repairs. But hand-building those pages for thousands of combinations wouldn\'t scale. I needed a system that auto-generated pages from the ERP, smart enough to decide which ones to index and which to skip.',
      context: 'Santifer iRepair was my device repair business in Seville since 2009. Sixteen years, over 30,000 repairs. In 2023 I decided the business website needed to stop being a brochure and start capturing the demand already sitting in Google. I built this programmatic SEO system as a competitive moat and sold the business in September 2025, at its peak.',
    },
    sections: {
      theNumbers: {
        heading: 'The Numbers',
        metrics: [
          { value: '2.26M', label: 'Impressions', detail: 'Total in Google Search Console' },
          { value: '19K+', label: 'Organic clicks', detail: 'Real traffic from organic search' },
          { value: '4,730', label: 'Pages with traffic', detail: 'Out of thousands generated, 4,084 indexable in sitemap, 4,730 picked up impressions' },
          { value: '10.8x', label: 'Monthly growth', detail: 'From 202 to 2,193 clicks/month in 11 months' },
          { value: '80%', label: 'Clicks from pSEO', detail: 'Organic traffic comes from programmatic pages' },
        ],
        timeline: 'Built March → October 2024 (7 months). One person. CMS, generation scripts, image pipeline, DataForSEO integration, and deployment — all in parallel. Production launch in October 2024.',
      },
      opportunity: {
        heading: 'The Opportunity',
        body: 'Spain\'s device repair market is hyper-local. People search by city, brand, and repair type. But most shops had generic sites — a single landing for all of Spain, if they had a site at all.',
        points: [
          'Thousands of long-tail combos with virtually zero SERP competition',
          'Clear transactional intent: the user wants a repair, not information',
          'No competitor in the sector was doing programmatic SEO in Spain (2023)',
          'The ERP already had everything: 867 models, prices, turnaround times, real photos',
          'The natural business taxonomy (device, brand, model, repair, city) maps directly to URLs',
        ],
        queryExamples: [
          { query: 'reparacion moviles sevilla', clicks: 42, impressions: 1947, ctr: '2.2%', position: '2.5' },
          { query: 'reparar iphone sevilla', clicks: 51, impressions: 3314, ctr: '1.5%', position: '12.9' },
          { query: 'reparacion iphone sevilla', clicks: 46, impressions: 4315, ctr: '1.1%', position: '5.2' },
          { query: 'cambiar bateria pixel 6a', clicks: 51, impressions: 755, ctr: '6.8%', position: '6.4' },
          { query: 'servicio tecnico garmin sevilla', clicks: 36, impressions: 534, ctr: '6.7%', position: '6.5' },
          { query: 'cambiar bateria apple watch', clicks: 37, impressions: 3967, ctr: '0.9%', position: '11.7' },
        ],
      },
      twoTypes: {
        heading: 'Two Strategies, One System',
        body: 'The project started with national ambitions, but Google had other ideas. Repair searches carry strong local intent — Google favors results close to the searcher, so pages without a city couldn\'t compete. The fix: a dual strategy. Local pages for Seville (where the physical shop sits) and national niche pages for specific repairs where location matters less.',
        local: {
          title: 'Local Pages (Seville)',
          description: 'Device + brand + repair combos with "/sevilla". Google ranks these higher thanks to proximity to the physical shop. They drive the most traffic.',
          examples: [
            { url: '/reparar-smartwatch/sevilla', clicks: 615, ctr: '3.7%' },
            { url: '/reparar-iphone/bateria/sevilla', clicks: 581, ctr: '2.5%' },
            { url: '/reparar-apple-watch/sevilla', clicks: 562, ctr: '2.7%' },
            { url: '/reparar-iphone/sevilla', clicks: 466, ctr: '0.6%' },
            { url: '/reparar-ipad/sevilla', clicks: 370, ctr: '1.2%' },
          ],
        },
        national: {
          title: 'National Pages (no city)',
          description: 'Niche repairs where location matters less. The "cambiar-{part}-{brand}-{model}" format captures informational queries that convert.',
          examples: [
            { url: '/cambiar-bateria-google-pixel-6a', clicks: 372, ctr: '5.0%' },
          ],
        },
      },
      architecture: {
        heading: 'The Architecture',
        body: 'The system has four layers. Airtable works as a headless CMS with 14 tables and ~60 fields per table. The ERP feeds real production data. DataForSEO decides what gets indexed. Astro generates static HTML with zero client-side JavaScript.',
        layers: [
          {
            icon: 'database',
            name: 'Airtable (Headless CMS)',
            desc: '14 tables, ~60 fields per table. 6-level hierarchy: Device Type, Brand, Family, Model, Repair + local variants. Dual pricing (original and compatible parts), image inheritance, cascading social proof.',
          },
          {
            icon: 'wrench',
            name: 'ERP (Production Data)',
            desc: 'Feeds Airtable with real data: before/after photos of actual repairs, verified customer reviews, up-to-date parts inventory. 867 models, 20+ brands, 15+ repair types.',
          },
          {
            icon: 'bar-chart',
            name: 'DataForSEO (Decision Engine)',
            desc: 'Queries real search volumes for each combination. The "indexable" field in Airtable is driven directly by this data. No volume means no index.',
          },
          {
            icon: 'zap',
            name: 'Astro (Static Generation)',
            desc: '21 page templates. Generates static HTML with 0 client JS. 6 JSON-LD types per page. Image SEO with EXIF injection. Deployed on Cloudflare CDN.',
          },
        ],
      },
      cmsDeepDive: {
        heading: 'Inside the CMS',
        body: 'Airtable isn\'t just a spreadsheet on steroids. Here, it runs as a full relational CMS. The key: a 6-level hierarchy that mirrors exactly how the business operates.',
        tables: [
          { name: 'Device Types', purpose: 'Root level of the taxonomy', keyFields: 'slug, name, SEO description, menu order' },
          { name: 'Brands', purpose: 'Brands linked to device types', keyFields: 'slug, name, logo, compatible types' },
          { name: 'Families', purpose: 'Model grouping (e.g., iPhone 14 series)', keyFields: 'slug, hero image (inheritable), brand' },
          { name: 'Models', purpose: 'Specific devices with pricing', keyFields: 'slug, family, image (inherits from family if empty), year' },
          { name: 'Repairs', purpose: 'Repair types per model', keyFields: 'slug, original price, compatible price, turnaround, indexable' },
          { name: 'Local Variants', purpose: 'City-specific pages for local SEO', keyFields: 'model + repair + city, adjusted price, availability' },
        ],
        highlights: [
          { title: 'Dual pricing', detail: 'Each repair has a price with original parts and a price with compatible parts. The user chooses on the landing page.' },
          { title: 'Image inheritance', detail: 'If a model has no image, it inherits from its family. Cuts maintenance without leaving pages blank.' },
          { title: 'Cascading social proof', detail: 'Reviews link at the model, family, or brand level. A review for "iPhone 14 Pro" shows up on every repair page for that model.' },
          { title: 'Bridge mode', detail: 'Discontinued repairs don\'t get deleted — they\'re flagged as "bridge" and redirect to the closest alternative. Zero 404s, zero authority loss.' },
        ],
      },
      pageAnatomy: {
        heading: 'Anatomy of a Page',
        body: 'Each of the 4,700+ pages is generated from a template, but the content is unique because it comes from the ERP. Not AI-generated text or filler copy — it\'s production data.',
        components: [
          { icon: 'list', name: 'Breadcrumb + Schema', desc: 'Hierarchical navigation reflecting the taxonomy. Generates BreadcrumbList JSON-LD automatically.' },
          { icon: 'dollar-sign', name: 'Real Pricing', desc: 'Original and compatible prices, pulled from the ERP. The user sees exactly what they\'ll pay.' },
          { icon: 'clock', name: 'Estimated Turnaround', desc: 'Based on actual historical repair data. Not a generic guess.' },
          { icon: 'camera', name: 'Before/After Photos', desc: 'Real images from completed repairs. EXIF injected with geolocation and SEO metadata.' },
          { icon: 'star', name: 'Verified Reviews', desc: 'Real customer reviews linked to the model or family. With Review and AggregateRating schema.' },
          { icon: 'code', name: '6 JSON-LD Types', desc: 'LocalBusiness, Product, Service, BreadcrumbList, FAQPage, AggregateRating. Every page has full markup.' },
        ],
        screenshot: {
          src: '/pseo/ss-repair-page-full.webp',
          alt: 'Anatomy of a programmatic repair page',
          caption: 'Real example: repair page generated from the ERP. Dual pricing, real reviews, full JSON-LD.',
        },
        storytelling: {
          heading: 'Conversion Flow per Page',
          body: 'Every page follows a conversion structure designed to take the user from discovery to action:',
          steps: [
            'Hero with dual pricing (original/compatible) + direct booking CTA',
            'Model-specific specs: camera, battery, device technologies',
            'Gallery of real before/after repair photos',
            'Verified customer reviews linked to the model or family',
            'FAQ generated from ERP data (real customer questions)',
            'Final CTA with shop map and booking button',
          ],
          example: 'A user searches "repair iPhone 14 Pro screen Seville." They land on a page with pricing (€189 original / €89 compatible), estimated turnaround (45 min), 3 real repair photos of the iPhone 14 Pro, and 12 verified reviews. No navigation needed — everything they need to decide is right there.',
        },
        dynamicCopy: {
          heading: 'Dynamic Per-Model Copy',
          body: 'Every device model gets unique microcopy generated from its real hardware specs. An Airtable field stores the technical specs (camera, battery, processor, water resistance) and a prompt generates a description that varies by model. An iPhone 14 Pro talks about its 48MP camera and ProMotion display. A Pixel 7a highlights its Tensor chip and computational photography. This isn\'t generic filler — it\'s copy that only applies to THAT model, based on real hardware data. Same template, unique content on every page.',
        },
        contextSearch: {
          heading: 'Context-Aware Search',
          body: 'The search bar isn\'t a simple text filter. It runs a custom scoring algorithm — no external libraries like Fuse.js. The user types "iphone 12 pro" and the system scores all 867 models: +20 if all words match, +30 for exact match, +10 if the model name starts with the query, and penalizes extra words in the model name. Result: the 6 most relevant models, ranked by score.',
          detail: 'The interesting part is that the search is context-aware. On the homepage it searches across all 867 models from every brand and device type. But on a brand page (e.g., Samsung), it only searches Samsung models. On a device type page (e.g., tablets), only tablets. The same component, with filter props (`filtroTipo`, `filtroMarca`), behaves differently depending on where it\'s embedded. Models lazy-load on first input focus and cache in localStorage so subsequent searches are instant.',
        },
      },
      decisionEngine: {
        heading: 'The Decision Engine',
        body: 'The system generates thousands of pages (well beyond the 4,730 that received traffic), but not all deserve to be indexed. If nobody searches "repair front camera iPhone 11", that page shouldn\'t compete on Google — but it needs to exist for the user browsing from the iPhone 11 page who needs exactly that repair. The key is separating SEO from UX. The decision engine queries DataForSEO for real search volume on each combination, and stores the result in Airtable\'s "indexable" field.',
        rules: [
          {
            condition: 'High search volume (DataForSEO)',
            action: 'Indexable page',
            detail: 'If the keyword has significant volume, the page is generated with meta robots "index, follow", included in the sitemap, and receives priority internal linking.',
          },
          {
            condition: 'Low or zero search volume',
            action: 'Noindex page (UX only)',
            detail: 'The page exists for user experience and internal navigation, but carries meta robots "noindex" and is excluded from the sitemap.',
          },
          {
            condition: 'No service data in the ERP',
            action: 'Page not generated',
            detail: 'If there\'s no real service data (price, availability), the page doesn\'t get built. Zero thin content.',
          },
          {
            condition: 'Discontinued repair',
            action: 'Bridge redirect',
            detail: 'The page is flagged as "bridge" and returns a 301 redirect to the closest alternative. Preserves accumulated authority.',
          },
        ],
        stats: 'The system generates thousands of pages total. Of those, 4,084 made it into the sitemap as indexable. 4,730 picked up impressions from Google. The rest aren\'t indexed but still exist for the user navigating the site.',
      },
      pipeline: {
        heading: 'Build Pipeline',
        body: 'The pipeline turns CMS data into a deploy-ready static site. Fully automated. schema.ts alone spans 1,677 lines mapping the Airtable hierarchy to Astro types.',
        steps: [
          { label: 'Airtable API', desc: 'Record extraction with retry and exponential backoff' },
          { label: 'Schema Mapping', desc: '1,677 lines transforming the 6-level hierarchy into TypeScript types' },
          { label: 'Review Cache', desc: 'Reviews are cached to avoid redundant API calls' },
          { label: 'getStaticPaths', desc: 'Generates static routes from the full taxonomy' },
          { label: 'ReparacionLayout', desc: '21 page templates rendering based on taxonomy level' },
          { label: 'Astro SSG', desc: 'Static build with 0 client-side JavaScript' },
          { label: 'Optimization', desc: 'Compressed images, EXIF injection, filtered sitemap, internal linking' },
          { label: 'Cloudflare CDN', desc: 'Deployment with cache invalidation and global edge caching' },
        ],
      },
      contentAutomation: {
        heading: 'Automated Content Pipeline',
        body: 'Generating thousands of pages is half the job. Each one needs unique images, metadata, and copy. Eight Node.js scripts (1,411 lines total) automate all visual and textual content production — zero manual work. Everything connects back to the 12 Airtable bases in the Business OS. Result: over 26,000 auto-generated images.',
        pipelines: [
          {
            icon: 'camera',
            name: 'Parametric Image Generation',
            desc: 'One device photo spawns 18 variants automatically — one per repair type (screen, battery, camera, charging port...) plus a generic image. Device photos are pulled from GSM Arena and composited with PNG repair overlays. 867 models × 18 variants = 15,500+ unique images, no Photoshop required.',
          },
          {
            icon: 'code',
            name: 'EXIF Injection for Local SEO',
            desc: 'Every image gets Seville GPS coordinates and an SEO description injected into its EXIF metadata. Google Images reads these for local search ranking. Automated with piexifjs and UCS-2 encoding.',
          },
          {
            icon: 'star',
            name: 'Before/After Photo Pipeline',
            desc: '10,000+ real repair photos processed automatically. Downloaded from Airtable, resized, background-blurred, composited to WebP, and the resulting URLs written back to Airtable. Bidirectional ETL: Airtable → processing → Airtable.',
          },
          {
            icon: 'zap',
            name: 'Dynamic Per-Model Copy',
            desc: 'Each device model has a field with its real hardware specs (camera, battery, processor). A prompt turns those specs into unique microcopy for each page. This isn\'t AI generating content — it\'s AI describing real hardware data. Every page reads differently because every device IS different.',
          },
        ],
        cascade: {
          heading: 'Content Cascade: One Review, Six Pages',
          body: 'The system automatically inherits content through the taxonomy. A review for "iPhone 12 screen repair" doesn\'t just appear on that page — it shows up everywhere it\'s relevant:',
          example: [
            { page: '/reparar-movil/apple/iphone-12/pantalla/sevilla', label: 'Model + repair + city' },
            { page: '/reparar-iphone/pantalla/sevilla', label: 'Device + repair + city' },
            { page: '/reparar-movil/apple/sevilla', label: 'Device + brand + city' },
            { page: '/reparar-iphone/sevilla', label: 'Device + city' },
            { page: '/reparar-movil/pantalla/sevilla', label: 'Device + repair + city' },
            { page: '/reparar-movil/sevilla', label: 'Device + city' },
          ],
          detail: 'The same logic applies to before/after photos: a photo from an iPhone 12 screen repair appears on every page in that taxonomy branch. This multiplies unique content without duplicating or generating anything artificially. Each page accumulates more social proof and visual content as the business grows.',
        },
        stats: '26,000+ auto-generated images. 867 models with 18 variants each. 10,000+ real repair photos. Zero manual intervention. The 12 Business OS bases feed the entire pipeline.',
      },
      imagePipeline: {
        heading: 'Inside the Image Pipeline',
        intro: 'The previous section describes the pipeline at a high level. Here you can see exactly how it works: the actual overlay templates, the composition code, and what happens when you run it across 867 different models.',
        overlayShowcase: {
          heading: 'The Overlay Templates',
          body: 'Each repair type has a 384×256 pixel PNG overlay. The overlay visually represents which part gets repaired: a cracked screen, a battery, a camera... 17 templates total, each designed to composite over any device photo.',
          items: [
            { src: 'pantalla.png', altEs: 'Overlay de reparación de pantalla', altEn: 'Screen repair overlay' },
            { src: 'bateria.png', altEs: 'Overlay de cambio de batería', altEn: 'Battery replacement overlay' },
            { src: 'camara-trasera.png', altEs: 'Overlay de cámara trasera', altEn: 'Rear camera overlay' },
            { src: 'puerto-carga.png', altEs: 'Overlay de puerto de carga', altEn: 'Charging port overlay' },
            { src: 'tapa-trasera.png', altEs: 'Overlay de tapa trasera', altEn: 'Back cover overlay' },
            { src: 'cristal.png', altEs: 'Overlay de cambio de cristal', altEn: 'Glass replacement overlay' },
          ],
        },
        compositionProcess: {
          heading: 'The Composition Process',
          body: 'Each repair image is generated in 6 steps, fully automated with a Node.js script and Sharp.js:',
          steps: [
            { label: 'Download device photo', detail: 'The official device photo is pulled from GSM Arena and stored temporarily.' },
            { label: 'Create 384×256 white canvas', detail: 'Sharp.js creates a blank base image at 384×256 pixels with an alpha channel.' },
            { label: 'Overlay the repair PNG', detail: 'The repair template (screen, battery, etc.) is composited as the first layer on the canvas.' },
            { label: 'Center device at x=96', detail: 'The device photo is proportionally resized and centered at x=96, leaving room for the overlay on the right.' },
            { label: 'Export to WebP', detail: 'The result is exported as optimized WebP. Each image weighs ~5-8 KB.' },
            { label: 'Repeat ×17 repairs + hero', detail: 'The process repeats for all 17 repair types plus a generic hero image at 256×256. Total: 18 images per model.' },
          ],
        },
        codeSnippet: {
          heading: 'The Actual Code',
          body: 'This is the real snippet from `generarImagenesReparacionesModelos.mjs` that generates each repair image:',
          segments: [
            {
              code: `await sharp({
  create: {
    width: 384, height: 256,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 }
  }
})
  .png()
  .composite([
    { input: overlayPath },
    { input: devicePhoto,
      top: Math.round(top),
      left: Math.round(left) }
  ])
  .webp()
  .toFile(outputPath)`,
              annotations: [
                { label: 'Canvas', detail: 'Creates a blank 384×256 image with a white background and alpha channel. This is the canvas everything composites onto.' },
                { label: 'Composition order', detail: 'Overlay first (repair template), then the device photo. Order matters: the overlay sits behind the device.' },
                { label: 'Positioning', detail: 'The device photo is vertically centered and positioned at x≈96. This leaves visual room for the repair overlay to be visible on the right.' },
              ],
            },
          ],
        },
        onePhotoDemo: {
          heading: '1 Photo → 18 Variants',
          body: 'From a single iPhone 14 Pro photo, the pipeline automatically generates 18 unique images: one generic hero and 17 repair variants. Each variant composites the device photo with a specific overlay.',
          hero: {
            src: '/pseo/demo/apple-iphone-14-pro/reparar-apple-iphone-14-pro.webp',
            alt: 'iPhone 14 Pro — auto-generated generic hero image',
            caption: 'Hero image: the iPhone 14 Pro photo centered on a 256×256 canvas, no overlay.',
          },
          variants: [
            { src: 'cambiar-pantalla-apple-iphone-14-pro.webp', altEs: 'Cambiar pantalla iPhone 14 Pro', altEn: 'iPhone 14 Pro screen replacement' },
            { src: 'cambiar-bateria-apple-iphone-14-pro.webp', altEs: 'Cambiar batería iPhone 14 Pro', altEn: 'iPhone 14 Pro battery replacement' },
            { src: 'cambiar-camara-trasera-apple-iphone-14-pro.webp', altEs: 'Cambiar cámara trasera iPhone 14 Pro', altEn: 'iPhone 14 Pro rear camera replacement' },
            { src: 'cambiar-puerto-carga-apple-iphone-14-pro.webp', altEs: 'Cambiar puerto de carga iPhone 14 Pro', altEn: 'iPhone 14 Pro charging port replacement' },
            { src: 'cambiar-tapa-trasera-apple-iphone-14-pro.webp', altEs: 'Cambiar tapa trasera iPhone 14 Pro', altEn: 'iPhone 14 Pro back cover replacement' },
            { src: 'cambiar-cristal-apple-iphone-14-pro.webp', altEs: 'Cambiar cristal iPhone 14 Pro', altEn: 'iPhone 14 Pro glass replacement' },
            { src: 'cambiar-altavoz-apple-iphone-14-pro.webp', altEs: 'Cambiar altavoz iPhone 14 Pro', altEn: 'iPhone 14 Pro speaker replacement' },
            { src: 'cambiar-microfono-apple-iphone-14-pro.webp', altEs: 'Cambiar micrófono iPhone 14 Pro', altEn: 'iPhone 14 Pro microphone replacement' },
            { src: 'cambiar-auricular-apple-iphone-14-pro.webp', altEs: 'Cambiar auricular iPhone 14 Pro', altEn: 'iPhone 14 Pro earpiece replacement' },
          ],
          caption: {
            es: '9 de las 17 variantes generadas automáticamente para el iPhone 14 Pro. Cada imagen combina la foto real del dispositivo con un overlay de reparación específico.',
            en: '9 of the 17 auto-generated variants for the iPhone 14 Pro. Each image composites the real device photo with a specific repair overlay.',
          },
        },
        crossDeviceDemo: {
          heading: 'Same Pipeline, Different Device',
          body: 'The same process applies to any device. The photo changes, the overlays stay the same. That\'s what makes it possible to scale to 867 models with zero manual work.',
          heroes: [
            { src: '/pseo/demo/apple-iphone-14-pro/reparar-apple-iphone-14-pro.webp', alt: 'iPhone 14 Pro — hero' },
            { src: '/pseo/demo/samsung-galaxy-s23-ultra/reparar-samsung-galaxy-s23-ultra.webp', alt: 'Samsung Galaxy S23 Ultra — hero' },
            { src: '/pseo/demo/reparar-xiaomi-12.webp', alt: 'Xiaomi 12 — hero' },
          ],
          comparison: [
            { src: '/pseo/demo/apple-iphone-14-pro/cambiar-pantalla-apple-iphone-14-pro.webp', alt: 'iPhone 14 Pro screen replacement' },
            { src: '/pseo/demo/samsung-galaxy-s23-ultra/cambiar-pantalla-samsung-galaxy-s23-ultra.webp', alt: 'Samsung Galaxy S23 Ultra screen replacement' },
          ],
          comparisonCaption: {
            es: 'Mismo overlay de "cambiar pantalla", diferente dispositivo. La plantilla es idéntica — lo que cambia es la foto del modelo.',
            en: 'Same "screen replacement" overlay, different device. The template is identical — what changes is the model photo.',
          },
        },
        scale: {
          heading: 'The Scale',
          metrics: [
            { value: '867', label: 'Models', detail: 'Unique devices with generated images' },
            { value: '17', label: 'Overlays', detail: 'Repair templates (screen, battery, camera...)' },
            { value: '18', label: 'Imgs/model', detail: '17 repairs + 1 hero per device' },
            { value: '15,606', label: 'Composites', detail: 'Total auto-generated images' },
          ],
        },
      },
      reviewsPipeline: {
        heading: 'Reviews Pipeline',
        intro: 'Reviews are the most powerful social proof on every page. But managing 607 customer profiles, syncing two sources, and cascading trust signals across the entire taxonomy requires its own pipeline.',
        sourceSync: {
          heading: 'Source & Sync',
          body: 'Reviews come from two sources: Google My Business (publicly verified) and internal post-repair surveys. Both sync to Airtable and normalize into a single format.',
          table: {
            headers: ['Table', 'Source', 'Key fields'],
            rows: [
              ['Reseñas sincronizar Astro', 'Google My Business', 'quote, name, rating, imageUrl, response'],
              ['Reseñas Internas', 'Post-repair surveys', 'quote, name, rating, imageUrl, linked model'],
            ],
          },
        },
        imageProcessing: {
          heading: 'Profile Photo Processing',
          body: 'Every review with a profile photo goes through an automated processing pipeline:',
          steps: [
            { label: 'Download photo from Airtable', detail: 'The profile photo URL is downloaded from the Airtable attachment field.' },
            { label: 'Convert to WebP quality 95', detail: 'Sharp.js converts the image to WebP at quality 95 to preserve facial detail.' },
            { label: 'Save to /bg/res/', detail: 'The file is saved with a semantic name: reparacion-{type}-{model}-{name}-{date}.webp' },
            { label: 'Write URL back to Airtable', detail: 'The resulting URL is written back to the corresponding field. Bidirectional ETL.' },
          ],
        },
        codeSnippet: {
          heading: 'The Actual Code',
          body: 'This is the real snippet from `generarImagenesReseñas.mjs` that processes each profile photo:',
          segments: [
            {
              code: `const imageBuffer = await fetch(attachmentUrl)
  .then(r => r.arrayBuffer())

await sharp(Buffer.from(imageBuffer))
  .webp({ quality: 95 })
  .toFile(outputPath)

// Write processed URL back to Airtable
await base('Reseñas sincronizar Astro')
  .update(record.id, {
    'imagen_procesada': outputUrl
  })`,
              annotations: [
                { label: 'Dimension preservation', detail: 'No resizing — profile photos keep their original dimensions for maximum quality in the carousel.' },
                { label: 'WebP quality 95', detail: 'Higher quality than repair photos (85) because profile photos are smaller and detail matters more.' },
                { label: 'Bidirectional ETL', detail: 'Airtable is both source AND destination: the photo is downloaded, processed, and the resulting URL is written back to the record.' },
              ],
            },
          ],
        },
        cascade: {
          heading: 'Social Proof Cascade',
          body: 'Reviews don\'t just appear on one page — they inherit across the entire taxonomy. A review linked to a model propagates to every page where that model is relevant.',
          points: [
            '"iPhone 14 Pro" review → appears on every repair page for that model, in every city',
            '"iPhone 14" family review → appears on all models in the family (14, 14 Plus, 14 Pro, 14 Pro Max)',
            '"Apple" brand review → appears on aggregated brand pages like /reparar-movil/apple/sevilla',
            'The cascade is automatic: link the review to the right level and the build distributes it',
          ],
        },
        profileDemo: {
          heading: '607 Profiles Processed',
          body: 'These are real customer profiles processed by the pipeline. Each photo was downloaded, converted to WebP, and linked back to Airtable.',
          items: [
            { src: 'cliente.webp', altEs: 'Perfil de cliente procesado', altEn: 'Processed customer profile' },
            { src: 'sarah.webp', altEs: 'Sarah — reparación de auricular iPhone 11', altEn: 'Sarah — iPhone 11 earpiece repair' },
            { src: 'cristina.webp', altEs: 'Cristina — reparación de auricular iPhone 12', altEn: 'Cristina — iPhone 12 earpiece repair' },
            { src: 'ricardo.webp', altEs: 'Ricardo — cambio de batería Google Pixel 4', altEn: 'Ricardo — Google Pixel 4 battery replacement' },
            { src: 'jacinto.webp', altEs: 'Jacinto — reparación de pantalla iPhone 11', altEn: 'Jacinto — iPhone 11 screen repair' },
            { src: 'ivan.webp', altEs: 'Iván — reparación de tapa trasera iPhone 12', altEn: 'Ivan — iPhone 12 back cover repair' },
          ],
          caption: {
            es: '6 de los 607 perfiles de clientes procesados automáticamente. Cada foto se descarga, convierte a WebP y vincula de vuelta a Airtable.',
            en: '6 of 607 customer profiles processed automatically. Each photo is downloaded, converted to WebP, and linked back to Airtable.',
          },
        },
        carouselCro: {
          heading: 'Rendering: CRO Carousel',
          body: 'In production, reviews render in a carousel with 9-second auto-rotation, a visual progress bar, and dot navigation. The top 20 reviews are visible directly; the rest expand under a "Show more" button. All server-rendered — zero JavaScript for the base carousel.',
          callout: 'Automatic filter: only reviews with ≥5★ and a written comment appear first. Reviews without text or below 5 stars fall below the fold.',
        },
        scale: {
          heading: 'The Scale',
          metrics: [
            { value: '607', label: 'Profiles processed', detail: 'Profile photos converted to WebP' },
            { value: '2', label: 'Sources', detail: 'Google My Business + internal surveys' },
            { value: '9s', label: 'Rotation', detail: 'CRO carousel auto-rotation interval' },
            { value: '≥5★', label: 'Priority', detail: '5-star reviews with comments shown first' },
          ],
        },
      },
      repairedDevicesPipeline: {
        heading: 'Before/After Pipeline',
        intro: 'Every completed repair generates photographic evidence: 4 photos documenting the device\'s state before and after. This pipeline processes those photos automatically and distributes them across the site.',
        captureProtocol: {
          heading: 'Capture Protocol',
          body: 'Every completed repair at the shop follows a 4-photo protocol:',
          steps: [
            { label: 'Front before', detail: 'Front-facing photo of the device before repair. Shows visible damage (cracked screen, marks, etc.).' },
            { label: 'Front after', detail: 'Front-facing photo after repair. Same angle for direct comparison.' },
            { label: 'Back before', detail: 'Back photo before repair. Documents the device\'s overall condition.' },
            { label: 'Back after', detail: 'Back photo after repair. Completes the visual documentation.' },
          ],
          privacyNote: 'The `difuminar` flag in Airtable marks photos that need blurring: screens showing notifications, personal data, etc. Blur is applied automatically in the pipeline.',
        },
        imageProcessing: {
          heading: 'Automated Processing',
          body: 'Each photo goes through 6 processing steps with Sharp.js:',
          steps: [
            { label: 'Download from Airtable', detail: 'The original photo is downloaded from the repair record\'s attachment field.' },
            { label: 'Resize to 1/4 resolution', detail: 'The image is scaled to 25% of its original size. Enough for web, cuts file size dramatically.' },
            { label: 'Conditional blur (sigma 8)', detail: 'If the `difuminar` flag is set, a Gaussian blur at sigma 8 is applied. Protects personal data visible on screen.' },
            { label: 'Semi-transparent white overlay', detail: 'A 30% white layer is composited over the background for consistent contrast and a clean look.' },
            { label: 'Export to WebP quality 85', detail: 'Quality 85 — lower than profile photos (95) because at 1/4 resolution the extra detail isn\'t noticeable.' },
            { label: 'Write slug back', detail: 'The processed filename is written back to Airtable so the Astro build can find it.' },
          ],
        },
        codeSnippet: {
          heading: 'The Actual Code',
          body: 'This is the real snippet from `CasosExito.mjs` that processes each repair photo:',
          segments: [
            {
              code: `let pipeline = sharp(inputBuffer)
  .resize({
    width: Math.round(metadata.width / 4),
    height: Math.round(metadata.height / 4)
  })

if (record.fields.difuminar) {
  pipeline = pipeline.blur(8)
}

await pipeline
  .composite([{
    input: whiteOverlay,
    blend: 'over'
  }])
  .webp({ quality: 85 })
  .toFile(outputPath)`,
              annotations: [
                { label: 'Resize 1/4', detail: 'Scales to one quarter. A 4032×3024 photo becomes 1008×756 — perfect for web, drops file size from ~3MB to ~30KB.' },
                { label: 'Conditional blur', detail: 'Only applied when the `difuminar` field is set in Airtable. Sigma 8 blurs notifications and personal data visible on screen.' },
                { label: 'Quality 85 vs 95', detail: 'Lower quality than profile photos because at 1/4 resolution the extra detail doesn\'t add value. Saves ~40% file size per image.' },
              ],
            },
          ],
        },
        demo: {
          heading: 'Real Result: iPhone 14 Pro',
          body: 'These are real photos processed by the pipeline. Front and back, before and after repair.',
          frontal: [
            { src: '/pseo/before-after/iphone-14-pro-front-before.webp', alt: 'iPhone 14 Pro front — before repair' },
            { src: '/pseo/before-after/iphone-14-pro-front-after.webp', alt: 'iPhone 14 Pro front — after repair' },
          ],
          frontalCaption: 'iPhone 14 Pro — front before and after',
          trasera: [
            { src: '/pseo/before-after/iphone-14-pro-back-before.webp', alt: 'iPhone 14 Pro back — before repair' },
            { src: '/pseo/before-after/iphone-14-pro-back-after.webp', alt: 'iPhone 14 Pro back — after repair' },
          ],
          traseraCaption: 'iPhone 14 Pro — back before and after',
        },
        crossDeviceDemo: {
          heading: 'Same Pipeline, Different Brands',
          body: 'The pipeline works the same for any brand and model. Here it is applied to a Samsung Galaxy A51 and a Xiaomi Redmi Note 9S.',
          samsung: [
            { src: '/pseo/before-after/samsung-a51-before.webp', alt: 'Samsung Galaxy A51 — before repair' },
            { src: '/pseo/before-after/samsung-a51-after.webp', alt: 'Samsung Galaxy A51 — after repair' },
          ],
          samsungCaption: 'Samsung Galaxy A51 — before and after',
          xiaomi: [
            { src: '/pseo/before-after/xiaomi-note9s-before.webp', alt: 'Xiaomi Redmi Note 9S — before repair' },
            { src: '/pseo/before-after/xiaomi-note9s-after.webp', alt: 'Xiaomi Redmi Note 9S — after repair' },
          ],
          xiaomiCaption: 'Xiaomi Redmi Note 9S — before and after',
          caption: {
            es: 'Mismo pipeline de procesamiento para cualquier marca. Las fotos se descargan, redimensionan, difuminan si es necesario y exportan a WebP automáticamente.',
            en: 'Same processing pipeline for any brand. Photos are downloaded, resized, blurred if needed, and exported to WebP automatically.',
          },
        },
        naming: {
          heading: 'Naming Convention',
          body: 'Each photo follows a strict naming convention that lets the Astro build find them automatically:',
          pattern: '{date}-reparacion-{brand}-{model}-{orderId}-{1|2|3|4}.webp',
          suffixes: [
            { title: 'Suffix -1', detail: 'Front before repair' },
            { title: 'Suffix -2', detail: 'Front after repair' },
            { title: 'Suffix -3', detail: 'Back before repair' },
            { title: 'Suffix -4', detail: 'Back after repair' },
          ],
        },
        scale: {
          heading: 'The Scale',
          metrics: [
            { value: '10,342', label: 'Photos processed', detail: 'Real repair photos converted to WebP' },
            { value: '4', label: 'Angles', detail: 'Front before/after + back before/after' },
            { value: '1/4', label: 'Resolution', detail: 'Resized to 25% of original for web' },
            { value: 'Q85', label: 'WebP quality', detail: 'Optimized quality for repair photos' },
          ],
        },
      },
      growth: {
        heading: 'Growth Curve',
        body: 'Launched in October 2024. The first months were all about indexation. The peak hit in September 2025 with 2,193 clicks — 10.8x from month one. I sold the business at its highest point.',
        monthly: [
          { month: 'Oct 2024', clicks: 202, impressions: 16420, note: 'Launch' },
          { month: 'Nov 2024', clicks: 748, impressions: 69054 },
          { month: 'Dec 2024', clicks: 949, impressions: 77387 },
          { month: 'Jan 2025', clicks: 1277, impressions: 110836 },
          { month: 'Feb 2025', clicks: 935, impressions: 100558 },
          { month: 'Mar 2025', clicks: 1191, impressions: 118826 },
          { month: 'Apr 2025', clicks: 1027, impressions: 106744 },
          { month: 'May 2025', clicks: 936, impressions: 97137 },
          { month: 'Jun 2025', clicks: 996, impressions: 121088 },
          { month: 'Jul 2025', clicks: 1611, impressions: 150927 },
          { month: 'Aug 2025', clicks: 1789, impressions: 164791 },
          { month: 'Sep 2025', clicks: 2193, impressions: 164440, note: 'Peak · Business sold' },
        ],
        insight: 'From 202 to 2,193 clicks/month in 11 months. Seasonality tracks clearly: summer and back-to-school spike repair searches. The system keeps running under the new owner.',
      },
      results: {
        heading: 'Results',
        body: 'Cumulative metrics since launch (October 2024 through February 2026), directly from Google Search Console:',
        metrics: [
          { value: '2.26M', label: 'Total impressions', detail: 'Accumulated over 17 months of operation' },
          { value: '19,388', label: 'Organic clicks', detail: 'Average CTR of 1.17% across 2.26M impressions' },
          { value: '4,730', label: 'URLs with impressions', detail: '99.3% are programmatic pages' },
          { value: '4,084', label: 'URLs in sitemap', detail: 'Only those that pass the DataForSEO decision engine' },
          { value: '80%', label: 'Clicks from pSEO', detail: 'Organic traffic comes from programmatic pages' },
          { value: '<1s', label: 'Page load time', detail: 'Astro SSG with 0 client JS + Cloudflare CDN' },
        ],
      },
      crawlBudget: {
        heading: 'Crawl Budget Optimization',
        body: 'With 4,700+ pages, managing crawl budget is critical. Google shouldn\'t waste time crawling pages that won\'t rank.',
        strategies: [
          {
            title: 'Selective noindex with DataForSEO',
            detail: 'The "indexable" field in Airtable is fed directly from DataForSEO volume data. Pages without search volume get noindex. Not an arbitrary call — it\'s data-driven.',
          },
          {
            title: 'Filtered sitemap (4,084 URLs)',
            detail: 'The sitemap.xml only includes indexable URLs. Out of 4,730 pages with impressions, just 4,084 made it into the sitemap. Google doesn\'t discover the rest through this channel.',
          },
          {
            title: 'URL structure with 6 patterns',
            detail: 'Each taxonomy level has a predictable URL pattern. Google understands the hierarchy without needing to guess.',
          },
          {
            title: 'Contextual internal linking',
            detail: 'Indexable pages receive more internal links. City pages link to available repairs, models link to their repairs, and families aggregate their models.',
          },
          {
            title: 'Bridge redirects for discontinued items',
            detail: 'Instead of returning a 404 when a repair is discontinued, it 301-redirects to the closest alternative. Zero authority loss, zero broken links.',
          },
        ],
      },
      urlTaxonomy: {
        heading: 'URL Taxonomy',
        body: 'The site uses 6 URL patterns, each corresponding to a level in the business taxonomy. Local patterns (with /sevilla) capture local intent. National patterns (no city) capture niche searches.',
        patterns: [
          { pattern: '/reparar-{device}/{city}', example: '/reparar-smartwatch/sevilla', description: 'Generic device + city. The broadest entry point into the local funnel.' },
          { pattern: '/reparar-{device}/{brand}/{city}', example: '/reparar-movil/samsung/sevilla', description: 'Device + brand + city. More specific, better CTR.' },
          { pattern: '/reparar-{device}/{repair-type}/{city}', example: '/reparar-iphone/bateria/sevilla', description: 'Device + repair type + city. High transactional intent.' },
          { pattern: '/reparar-{device}/{brand}/{repair-type}/{city}', example: '/reparar-movil/samsung/pantalla/sevilla', description: 'Full local combination. The most specific funnel entry.' },
          { pattern: '/reparar-{device}/{model}/{repair-type}', example: '/reparar-apple-watch/se/bateria', description: 'Specific model + repair, no city. For national niche searches.' },
          { pattern: '/cambiar-{repair}-{brand}-{model}', example: '/cambiar-bateria-google-pixel-6a', description: 'Direct national format. Captures queries like "change pixel 6a battery" with high CTR (5%).' },
        ],
      },
      stack: {
        heading: 'Stack & Tools',
        body: 'The stack was chosen for a specific need: generating thousands of static pages from a relational CMS, with zero client-side JavaScript. Astro was the obvious pick for pure SSG. Airtable worked as CMS because it was already the business\'s Business OS — migrating to Supabase for a static site made no sense. DataForSEO was chosen for price and Spanish keyword coverage.',
        items: [
          { name: 'Astro', role: 'SSG, 21 templates, 0 client JS' },
          { name: 'Airtable', role: 'Headless CMS, 14 tables, ~60 fields/table' },
          { name: 'DataForSEO', role: 'Search volumes, "indexable" field' },
          { name: 'Custom ERP', role: '867 models, prices, stock, photos, reviews' },
          { name: 'Cloudflare', role: 'CDN, edge caching, deployment' },
          { name: 'TypeScript', role: '1,677-line schema.ts for the mapping' },
          { name: 'JSON-LD', role: '6 types of structured data per page' },
        ],
      },
      lessons: {
        heading: 'Lessons Learned',
        items: [
          {
            title: 'Google decides the geography, not you.',
            detail: 'I started out wanting to rank nationwide. Google had other plans. Repair searches carry extremely strong local intent — pages without a city got crushed by Seville-specific ones. The lesson: build the full infrastructure, but let GSC data tell you where to double down.',
          },
          {
            title: 'The decision engine matters more than the generator.',
            detail: 'Generating 10,000 pages is trivial. Deciding which ones to index based on real DataForSEO data — that\'s what separates pSEO with results from a thin content farm. Out of all possible combos, only 4,084 made it into the sitemap.',
          },
          {
            title: 'The ERP is the moat, not the template.',
            detail: 'Anyone can spin up pages with AI. Nobody can generate real before/after photos, verified reviews, dual pricing (original and compatible), and turnaround times from historical data without an integrated ERP. Unique content doesn\'t come from copy — it comes from data.',
          },
          {
            title: 'Airtable scales better than expected.',
            detail: '14 tables, ~60 fields per table, 6-level hierarchy. With retry and exponential backoff on the API, the build stays stable. The trick: cache reviews and skip redundant calls. For a one-person team, Airtable as a headless CMS just works.',
          },
          {
            title: 'National niche URLs deliver the best CTR.',
            detail: 'The /cambiar-bateria-google-pixel-6a format pulls a 5.0% CTR at an average position of 7.8. These queries are so specific they\'ve got almost zero competition. Individual volume is low, but multiplied across hundreds of models, it adds up fast.',
          },
        ],
      },
    },
    cta: {
      heading: 'Want to run this playbook?',
      body: 'I can walk you through the full programmatic SEO stack: CMS architecture, build pipeline, DataForSEO decision engine, and the real GSC metrics I used to iterate.',
      label: 'Get in touch',
    },
    faq: {
      heading: 'FAQ',
      items: [
        {
          q: 'Isn\'t programmatic SEO just spam?',
          a: 'Only if the pages don\'t add value. Here, every page has real service data: current pricing (original and compatible parts), turnaround based on historical data, before/after photos from actual repairs, and verified customer reviews. This isn\'t AI-generated filler — it\'s production data from the ERP.',
        },
        {
          q: 'Does it only work in Seville?',
          a: 'Local pages focus on Seville because that\'s where the physical shop is, and Google favors nearby results for repair searches. National pages (the /cambiar-{part}-{brand}-{model} format) work without geographic limits and capture niche queries across all of Spain.',
        },
        {
          q: 'Why no AI-generated content?',
          a: 'Because the moat is real data. Prices come from the ERP, photos are from actual repairs, reviews are from verified customers. An AI-generated page might sound good, but there\'s no production data behind it. The blog did lean on AI for writing, paired with NotebookLM for each article\'s podcast episode.',
        },
        {
          q: 'Does Airtable scale with 4,700+ pages?',
          a: 'Yes, with caveats. The 14 tables and ~60 fields per table work well with a build pipeline (not real-time queries). The key: retry with exponential backoff on the API and caching frequently hit data like reviews. For live queries at larger scale, you\'d want to evaluate alternatives like Supabase.',
        },
        {
          q: 'How do you keep pages updated?',
          a: 'When a price changes or a model gets added in the ERP, the data syncs to Airtable. The next build regenerates the affected pages. New reviews propagate automatically through the family-model cascade. No manual work needed for content.',
        },
        {
          q: 'Why Astro instead of Next.js?',
          a: 'For a fully static site where content changes infrequently, Astro ships pure HTML with zero client-side JavaScript. Pages load under a second, Core Web Vitals are great out of the box, and Cloudflare CDN deployment is dead simple.',
        },
        {
          q: 'What does DataForSEO do exactly?',
          a: 'DataForSEO provides real search volume for each keyword. The result gets stored in Airtable\'s "indexable" field. If a device + repair + city combo has no search volume, the page is built but tagged noindex. It\'s the decision engine that keeps you from diluting domain authority with pages Google would ignore.',
        },
      ],
    },
    resources: {
      heading: 'Resources',
      items: [
        { label: 'Santifer iRepair (the programmatic site)', url: 'https://santiferirepair.es' },
        { label: 'Case Study: The Business OS / ERP behind these pages', url: '/business-os-for-airtable' },
        { label: 'Astro, the static site framework', url: 'https://astro.build' },
        { label: 'DataForSEO, SEO data API', url: 'https://dataforseo.com' },
        { label: 'Airtable, data platform and CMS', url: 'https://airtable.com' },
      ],
    },
    footer: {
      role: 'AI Product Manager · Solutions Architect',
      bio: 'Built and sold a 16-year business in 2025. Now bringing that same systems thinking to enterprise AI.',
      fellowAt: 'Teaching Fellow at',
      fellowLink: 'AI Product Academy',
      copyright: 'All rights reserved.',
    },
  },
} as const
