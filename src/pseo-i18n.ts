export const pseoContent = {
  es: {
    slug: 'seo-programatico',
    altSlug: 'programmatic-seo',
    readingTime: '9 min de lectura',
    seo: {
      title: 'SEO Programático: Caso de Éxito en Reparación de Móviles en España | santifer.io',
      description: 'Case study: cómo construí una web programática con Airtable, n8n y Astro que posicionó un negocio de reparación en 60+ ciudades de España — único en el sector en 2023.',
    },
    nav: {
      breadcrumbHome: 'Inicio',
      breadcrumbCurrent: 'SEO Programático',
    },
    header: {
      kicker: 'Case Study — Santifer iRepair',
      h1: 'SEO Programático para Reparación de Móviles',
      subtitle: 'Cómo generé cientos de landing pages optimizadas con Airtable como CMS headless, datos de volumen de búsqueda de DataForSEO, y Astro — la única web programática del sector reparación en España (2023).',
      date: '25 feb 2026',
    },
    intro: {
      hook: 'En el sector de reparación de móviles en España, nadie estaba haciendo SEO programático. Cada combinación de marca × modelo × tipo de reparación × ciudad era una oportunidad de long-tail sin explotar.',
      body: 'La idea era simple: si alguien busca "cambiar pantalla iPhone 14 Pro Madrid", debería existir una página específica para esa búsqueda. Pero crear esas páginas a mano para cientos de combinaciones no era viable. Necesitaba un sistema que generase las páginas automáticamente desde una fuente de verdad centralizada, y que fuera lo suficientemente inteligente para decidir cuáles indexar.',
    },
    sections: {
      opportunity: {
        heading: 'La Oportunidad',
        body: 'El mercado de reparación de móviles en España es altamente local. Los usuarios buscan servicios por ciudad, marca y tipo de reparación. Pero la mayoría de negocios del sector tenían webs genéricas — una landing para toda España, si es que tenían web.',
        points: [
          'Miles de combinaciones long-tail sin competencia: "reparar pantalla Samsung Galaxy S23 Valencia"',
          'Intención de búsqueda transaccional clara — el usuario quiere reparar, no informarse',
          'Ningún competidor en el sector estaba usando SEO programático en España (2023)',
          'El ERP ya tenía todos los datos necesarios: modelos, precios, tiempos, fotos de antes/después',
          'La taxonomía natural del negocio (marca × modelo × reparación × ciudad) se mapea directamente a URLs',
        ],
      },
      architecture: {
        heading: 'La Arquitectura',
        body: 'Airtable funciona como CMS headless y fuente de verdad. Cada registro contiene un modelo, tipo de reparación, precio, tiempo estimado, y las ciudades donde ofrecemos el servicio. El ERP alimenta Airtable con datos reales: fotos de antes/después, reseñas de clientes, y stock de piezas.',
        layers: [
          {
            icon: '🗄️',
            name: 'Airtable (CMS Headless)',
            desc: 'Fuente de verdad centralizada. Cada registro = un servicio (modelo + reparación). Incluye precios, tiempos, descripción, imágenes y ciudades disponibles.',
          },
          {
            icon: '🔧',
            name: 'ERP (Datos Reales)',
            desc: 'Alimenta Airtable con datos de producción: fotos de antes/después de reparaciones reales, reseñas verificadas de clientes, stock de piezas actualizado.',
          },
          {
            icon: '⚡',
            name: 'n8n (Pipeline)',
            desc: 'Extrae datos de Airtable, aplica reglas de negocio, genera los archivos estáticos para Astro. Ejecuta el pipeline de build completo bajo demanda o en schedule.',
          },
          {
            icon: '🚀',
            name: 'Astro (Generación Estática)',
            desc: 'Genera páginas HTML estáticas ultra-rápidas. Cada combinación de modelo × reparación × ciudad produce una URL única con contenido específico.',
          },
        ],
      },
      decisionEngine: {
        heading: 'El Motor de Decisiones',
        body: 'No todas las páginas merecen ser indexadas. Generar miles de páginas sin criterio diluye la autoridad del dominio y desperdicia crawl budget. El motor de decisiones consulta DataForSEO para obtener volumen de búsqueda real de cada combinación.',
        rules: [
          {
            condition: 'Volumen de búsqueda alto',
            action: 'Página indexable',
            detail: 'Si la keyword tiene volumen significativo, la página se genera con meta robots "index, follow", se incluye en el sitemap, y recibe enlazado interno prioritario.',
          },
          {
            condition: 'Volumen de búsqueda bajo',
            action: 'Página noindex (solo UX)',
            detail: 'Si el volumen es bajo o nulo, la página existe para la experiencia de usuario (el cliente puede llegar vía navegación interna), pero lleva meta robots "noindex" y no aparece en el sitemap.',
          },
          {
            condition: 'Sin datos de servicio',
            action: 'No se genera página',
            detail: 'Si no hay datos reales del servicio en el ERP (precio, disponibilidad), la página no se genera. Cero contenido thin.',
          },
        ],
        taxonomy: 'La taxonomía es: Marca × Modelo × Tipo de Reparación × Ciudad. Ejemplo: Apple → iPhone 14 Pro → Cambio de pantalla → Madrid. Cada nodo de la taxonomía puede generar una página, pero solo si pasa las reglas del motor.',
      },
      pipeline: {
        heading: 'Pipeline de Build',
        body: 'El pipeline transforma los datos del CMS en una web estática lista para desplegar. Todo está automatizado — desde la extracción de datos hasta la generación del sitemap final.',
        steps: [
          { label: 'Airtable CMS', desc: 'Extracción de registros via API' },
          { label: 'n8n Pipeline', desc: 'Enriquecimiento con datos de ERP y DataForSEO' },
          { label: 'Motor de Decisiones', desc: 'Clasificación index/noindex por volumen' },
          { label: 'Astro Build', desc: 'Generación de páginas estáticas por template' },
          { label: 'Optimización', desc: 'Imágenes comprimidas, sitemap filtrado, internal linking' },
          { label: 'Deploy', desc: 'Publicación con invalidación de caché' },
        ],
      },
      results: {
        heading: 'Resultados',
        body: 'Métricas del proyecto tras el lanzamiento y primeros meses de indexación:',
        metrics: [
          { value: '60+', label: 'Ciudades', detail: 'Páginas específicas por ciudad en toda España' },
          { value: '100s', label: 'Landing pages', detail: 'Generadas automáticamente por combinación modelo × reparación × ciudad' },
          { value: 'Único', label: 'En el sector', detail: 'Ningún competidor en reparación de móviles en España usaba pSEO en 2023' },
          { value: '<2s', label: 'Carga de página', detail: 'Astro genera HTML estático ultra-rápido con imágenes optimizadas' },
        ],
      },
      crawlBudget: {
        heading: 'Optimización del Crawl Budget',
        body: 'Con cientos de páginas generadas, gestionar el crawl budget era crítico. Google no debería perder tiempo rastreando páginas que no van a posicionar.',
        strategies: [
          {
            title: 'Noindex selectivo',
            detail: 'Las páginas sin volumen de búsqueda llevan meta robots noindex. Existen para UX pero no consumen crawl budget de indexación.',
          },
          {
            title: 'Sitemap filtrado',
            detail: 'El sitemap.xml solo incluye URLs indexables. Google no descubre páginas noindex a través del sitemap.',
          },
          {
            title: 'Estructura de URLs limpia',
            detail: 'URLs descriptivas y jerárquicas: /reparacion/iphone-14-pro/pantalla/madrid. Facilita el crawl y comunica relevancia.',
          },
          {
            title: 'Enlazado interno inteligente',
            detail: 'Las páginas indexables reciben más enlaces internos. Las páginas de ciudad enlazan a reparaciones disponibles, y viceversa.',
          },
        ],
      },
      stack: {
        heading: 'Stack y Herramientas',
        items: [
          { name: 'Astro', role: 'Generador de sitio estático (SSG)' },
          { name: 'Airtable', role: 'CMS headless y fuente de verdad' },
          { name: 'n8n', role: 'Pipeline de build y automatización' },
          { name: 'DataForSEO', role: 'Datos de volumen de búsqueda por keyword' },
          { name: 'ERP propio', role: 'Datos reales: precios, stock, fotos, reseñas' },
          { name: 'Cloudflare', role: 'CDN, caché y despliegue' },
        ],
      },
      lessons: {
        heading: 'Lecciones Aprendidas',
        items: [
          {
            title: 'pSEO no es spam de páginas.',
            detail: 'Cada página debe tener contenido real y diferenciado. Las fotos de antes/después, reseñas reales y precios actualizados desde el ERP son lo que hace que las páginas aporten valor — no el template repetido.',
          },
          {
            title: 'El motor de decisiones es más importante que el generador.',
            detail: 'Generar páginas es trivial. Decidir cuáles indexar basándote en datos reales de búsqueda es lo que marca la diferencia entre pSEO con resultados y una granja de contenido thin.',
          },
          {
            title: 'Airtable es suficiente como CMS — hasta que no lo es.',
            detail: 'Para cientos de registros y un equipo pequeño, Airtable funciona genial como CMS headless. Pero tiene límites: la API tiene rate limits, no hay staging/preview nativo, y las relaciones complejas se vuelven incómodas.',
          },
          {
            title: 'El ERP es el diferenciador competitivo.',
            detail: 'Cualquiera puede generar páginas con ChatGPT. Nadie puede generar fotos reales de antes/después, reseñas verificadas, y precios al minuto sin un ERP integrado.',
          },
        ],
      },
    },
    cta: {
      heading: '¿Quieres replicar esta estrategia?',
      body: 'Puedo compartir el playbook completo de SEO programático: arquitectura del CMS, pipeline de build, motor de decisiones, y las métricas de crawl budget que usé para optimizar la indexación.',
      label: 'Hablemos',
    },
    faq: {
      heading: 'Preguntas Frecuentes',
      items: [
        {
          q: '¿El SEO programático no es spam?',
          a: 'Solo si las páginas no aportan valor. En este caso, cada página tiene datos reales del servicio: precio actual, tiempo de reparación, fotos de antes/después, y reseñas verificadas. No es contenido generado por IA ni texto de relleno — son datos de producción.',
        },
        {
          q: '¿Airtable escala como CMS?',
          a: 'Para este caso de uso, sí. Con cientos de registros y un pipeline de build (no consultas en tiempo real), los rate limits de Airtable no son un problema. Para miles de registros con consultas en vivo, habría que evaluar alternativas como Supabase o un CMS headless dedicado.',
        },
        {
          q: '¿Cómo se mantienen actualizadas las páginas?',
          a: 'El pipeline de n8n se ejecuta en schedule o bajo demanda. Cuando cambia un precio en el ERP, se refleja en Airtable, y el siguiente build regenera las páginas afectadas. No hay intervención manual.',
        },
        {
          q: '¿Por qué Astro y no Next.js?',
          a: 'Para un sitio 100% estático donde el contenido cambia con baja frecuencia, Astro genera HTML puro sin JavaScript en el cliente. Las páginas cargan más rápido, y los Core Web Vitals son excelentes de forma nativa.',
        },
        {
          q: '¿Cuántas páginas se indexaron finalmente?',
          a: 'Aproximadamente el 60% de las páginas generadas son indexables. El resto existe para UX (navegación interna) con noindex. La proporción varía según el mercado: ciudades grandes tienen más combinaciones indexables.',
        },
      ],
    },
    resources: {
      heading: 'Recursos',
      items: [
        { label: 'Astro — Framework de Sitio Estático', url: 'https://astro.build' },
        { label: 'DataForSEO — API de Datos SEO', url: 'https://dataforseo.com' },
        { label: 'Airtable — Plataforma de Datos y CMS', url: 'https://airtable.com' },
        { label: 'n8n — Automatización de Workflows', url: 'https://n8n.io' },
      ],
    },
    footer: {
      role: 'AI Product Manager · Solutions Architect',
      copyright: 'Todos los derechos reservados.',
    },
  },
  en: {
    slug: 'programmatic-seo',
    altSlug: 'seo-programatico',
    readingTime: '9 min read',
    seo: {
      title: 'Programmatic SEO: How I Ranked a Repair Business in 60+ Cities | santifer.io',
      description: 'Case study: how I built a programmatic SEO website with Airtable, n8n and Astro that ranked a phone repair business in 60+ Spanish cities — unique in the sector in 2023.',
    },
    nav: {
      breadcrumbHome: 'Home',
      breadcrumbCurrent: 'Programmatic SEO',
    },
    header: {
      kicker: 'Case Study — Santifer iRepair',
      h1: 'Programmatic SEO for Phone Repair',
      subtitle: 'How I generated hundreds of optimized landing pages with Airtable as headless CMS, DataForSEO search volume data, and Astro — the only programmatic SEO website in the phone repair sector in Spain (2023).',
      date: 'Feb 25, 2026',
    },
    intro: {
      hook: 'In the phone repair sector in Spain, nobody was doing programmatic SEO. Every combination of brand x model x repair type x city was an untapped long-tail opportunity.',
      body: 'The idea was simple: if someone searches for "iPhone 14 Pro screen replacement Madrid", there should be a specific page for that query. But creating those pages manually for hundreds of combinations wasn\'t viable. I needed a system that auto-generated pages from a centralized source of truth, and was smart enough to decide which ones to index.',
    },
    sections: {
      opportunity: {
        heading: 'The Opportunity',
        body: 'The phone repair market in Spain is highly local. Users search for services by city, brand, and repair type. But most businesses in the sector had generic websites — a single landing for all of Spain, if they had a website at all.',
        points: [
          'Thousands of long-tail combinations with zero competition: "Samsung Galaxy S23 screen repair Valencia"',
          'Clear transactional search intent — the user wants to repair, not research',
          'No competitor in the sector was using programmatic SEO in Spain (2023)',
          'The ERP already had all the necessary data: models, prices, times, before/after photos',
          'The natural business taxonomy (brand x model x repair type x city) maps directly to URLs',
        ],
      },
      architecture: {
        heading: 'The Architecture',
        body: 'Airtable works as a headless CMS and source of truth. Each record contains a model, repair type, price, estimated time, and the cities where the service is offered. The ERP feeds Airtable with real data: before/after photos, customer reviews, and parts stock.',
        layers: [
          {
            icon: '🗄️',
            name: 'Airtable (Headless CMS)',
            desc: 'Centralized source of truth. Each record = one service (model + repair). Includes prices, times, descriptions, images, and available cities.',
          },
          {
            icon: '🔧',
            name: 'ERP (Real Data)',
            desc: 'Feeds Airtable with production data: real before/after repair photos, verified customer reviews, updated parts stock.',
          },
          {
            icon: '⚡',
            name: 'n8n (Pipeline)',
            desc: 'Extracts data from Airtable, applies business rules, generates static files for Astro. Runs the full build pipeline on-demand or on schedule.',
          },
          {
            icon: '🚀',
            name: 'Astro (Static Generation)',
            desc: 'Generates ultra-fast static HTML pages. Each model x repair x city combination produces a unique URL with specific content.',
          },
        ],
      },
      decisionEngine: {
        heading: 'The Decision Engine',
        body: 'Not all pages deserve to be indexed. Generating thousands of pages without criteria dilutes domain authority and wastes crawl budget. The decision engine queries DataForSEO to get real search volume for each combination.',
        rules: [
          {
            condition: 'High search volume',
            action: 'Indexable page',
            detail: 'If the keyword has significant volume, the page is generated with meta robots "index, follow", included in the sitemap, and receives priority internal linking.',
          },
          {
            condition: 'Low search volume',
            action: 'Noindex page (UX only)',
            detail: 'If volume is low or zero, the page exists for user experience (the customer can reach it via internal navigation), but carries meta robots "noindex" and doesn\'t appear in the sitemap.',
          },
          {
            condition: 'No service data',
            action: 'Page not generated',
            detail: 'If there\'s no real service data in the ERP (price, availability), the page isn\'t generated. Zero thin content.',
          },
        ],
        taxonomy: 'The taxonomy is: Brand x Model x Repair Type x City. Example: Apple → iPhone 14 Pro → Screen replacement → Madrid. Each taxonomy node can generate a page, but only if it passes the engine\'s rules.',
      },
      pipeline: {
        heading: 'Build Pipeline',
        body: 'The pipeline transforms CMS data into a static website ready to deploy. Everything is automated — from data extraction to final sitemap generation.',
        steps: [
          { label: 'Airtable CMS', desc: 'Record extraction via API' },
          { label: 'n8n Pipeline', desc: 'Enrichment with ERP and DataForSEO data' },
          { label: 'Decision Engine', desc: 'Index/noindex classification by volume' },
          { label: 'Astro Build', desc: 'Static page generation per template' },
          { label: 'Optimization', desc: 'Compressed images, filtered sitemap, internal linking' },
          { label: 'Deploy', desc: 'Publish with cache invalidation' },
        ],
      },
      results: {
        heading: 'Results',
        body: 'Project metrics after launch and initial months of indexation:',
        metrics: [
          { value: '60+', label: 'Cities', detail: 'City-specific pages across Spain' },
          { value: '100s', label: 'Landing pages', detail: 'Auto-generated per model x repair x city combination' },
          { value: 'Only one', label: 'In the sector', detail: 'No competitor in phone repair in Spain was using pSEO in 2023' },
          { value: '<2s', label: 'Page load', detail: 'Astro generates ultra-fast static HTML with optimized images' },
        ],
      },
      crawlBudget: {
        heading: 'Crawl Budget Optimization',
        body: 'With hundreds of generated pages, managing crawl budget was critical. Google shouldn\'t waste time crawling pages that won\'t rank.',
        strategies: [
          {
            title: 'Selective noindex',
            detail: 'Pages without search volume carry meta robots noindex. They exist for UX but don\'t consume indexation crawl budget.',
          },
          {
            title: 'Filtered sitemap',
            detail: 'The sitemap.xml only includes indexable URLs. Google doesn\'t discover noindex pages through the sitemap.',
          },
          {
            title: 'Clean URL structure',
            detail: 'Descriptive, hierarchical URLs: /repair/iphone-14-pro/screen/madrid. Facilitates crawling and communicates relevance.',
          },
          {
            title: 'Smart internal linking',
            detail: 'Indexable pages receive more internal links. City pages link to available repairs, and vice versa.',
          },
        ],
      },
      stack: {
        heading: 'Stack & Tools',
        items: [
          { name: 'Astro', role: 'Static site generator (SSG)' },
          { name: 'Airtable', role: 'Headless CMS and source of truth' },
          { name: 'n8n', role: 'Build pipeline and automation' },
          { name: 'DataForSEO', role: 'Search volume data per keyword' },
          { name: 'Custom ERP', role: 'Real data: prices, stock, photos, reviews' },
          { name: 'Cloudflare', role: 'CDN, caching and deployment' },
        ],
      },
      lessons: {
        heading: 'Lessons Learned',
        items: [
          {
            title: 'pSEO is not page spam.',
            detail: 'Every page must have real, differentiated content. Before/after photos, real reviews, and live prices from the ERP are what make pages valuable — not a repeated template.',
          },
          {
            title: 'The decision engine matters more than the generator.',
            detail: 'Generating pages is trivial. Deciding which ones to index based on real search data is what separates pSEO with results from a thin content farm.',
          },
          {
            title: 'Airtable is enough as a CMS — until it isn\'t.',
            detail: 'For hundreds of records and a small team, Airtable works great as a headless CMS. But it has limits: API rate limits, no native staging/preview, and complex relations get awkward.',
          },
          {
            title: 'The ERP is the competitive differentiator.',
            detail: 'Anyone can generate pages with ChatGPT. Nobody can generate real before/after photos, verified reviews, and up-to-the-minute prices without an integrated ERP.',
          },
        ],
      },
    },
    cta: {
      heading: 'Want to replicate this strategy?',
      body: 'I can share the full programmatic SEO playbook: CMS architecture, build pipeline, decision engine, and the crawl budget metrics I used to optimize indexation.',
      label: 'Get in touch',
    },
    faq: {
      heading: 'FAQ',
      items: [
        {
          q: 'Isn\'t programmatic SEO just spam?',
          a: 'Only if the pages don\'t provide value. In this case, every page has real service data: current price, repair time, before/after photos, and verified reviews. It\'s not AI-generated content or filler text — it\'s production data.',
        },
        {
          q: 'Does Airtable scale as a CMS?',
          a: 'For this use case, yes. With hundreds of records and a build pipeline (not real-time queries), Airtable\'s rate limits aren\'t a problem. For thousands of records with live queries, you\'d need to evaluate alternatives like Supabase or a dedicated headless CMS.',
        },
        {
          q: 'How do you keep pages updated?',
          a: 'The n8n pipeline runs on schedule or on-demand. When a price changes in the ERP, it\'s reflected in Airtable, and the next build regenerates the affected pages. No manual intervention.',
        },
        {
          q: 'Why Astro and not Next.js?',
          a: 'For a 100% static site where content changes infrequently, Astro generates pure HTML with no client-side JavaScript. Pages load faster, and Core Web Vitals are excellent natively.',
        },
        {
          q: 'How many pages were actually indexed?',
          a: 'Roughly 60% of generated pages are indexable. The rest exist for UX (internal navigation) with noindex. The ratio varies by market: larger cities have more indexable combinations.',
        },
      ],
    },
    resources: {
      heading: 'Resources',
      items: [
        { label: 'Astro — Static Site Framework', url: 'https://astro.build' },
        { label: 'DataForSEO — SEO Data API', url: 'https://dataforseo.com' },
        { label: 'Airtable — Data Platform & CMS', url: 'https://airtable.com' },
        { label: 'n8n — Workflow Automation', url: 'https://n8n.io' },
      ],
    },
    footer: {
      role: 'AI Product Manager · Solutions Architect',
      copyright: 'All rights reserved.',
    },
  },
} as const
