export const seo = {
  es: {
    title:
      'Santiago Fernández | AI Product Manager · Solutions Architect · FDE',
    description:
      'Fundador reconvertido a AI Product Manager. Automatización con LLMs, no-code, certificado Anthropic. Abierto a roles remotos EU / USA.',
  },
  en: {
    title:
      'Santiago Fernández | AI Product Manager · Solutions Architect · FDE',
    description:
      'Founder turned AI Product Manager. LLM automation, no-code platforms, Anthropic certified. Open to remote roles in EU / USA.',
  },
};

export const translations = {
  es: {
    greeting: 'Hola, soy',
    email: 'hola@santifer.io',
    role: 'Convierto trabajo manual en sistemas reutilizables.',
    story: {
      context: '+15 años construyendo+ todo desde cero.',
      reflections: ['Esto ya lo sé hacer.', 'Hay algo más grande.'],
      hookParagraphs: [
        ['Un día, vendí el negocio. Compré *claridad.*'],
        [
          'Lo que me mueve no cabe en una tienda.',
          '*Construir* +sistemas que liberan equipos+. Eso escala.',
        ],
      ],
      why: 'En Santifer iRepair automaticé todo lo que pude: desde un agente de IA que atendía el 90% de los clientes hasta un sistema operativo que orquestaba 12 bases de datos.',
      seeking:
        'Ahora busco hacer eso a mayor escala—en empresas donde el impacto se multiplica.',
      nav: [
        { icon: 'briefcase', label: 'Mi camino', href: '#experience' },
        { icon: 'folder', label: 'Lo que construyo', href: '#projects' },
        { icon: 'mail', label: 'Hablemos', href: '#contact' },
        { icon: 'bot', label: 'Pregúntame', href: '#chat', highlight: true },
      ],
      skills: [
        'AI Product Discovery',
        'Arquitectura de Soluciones',
        'Workflows Agénticos',
        'LLMOps',
        'Forward-Deployed',
        'Reliability & Ops',
      ],
      skipButton: 'Saltar intro',
    },
    taglines: [] as readonly string[],
    location: 'Sevilla, ES · EU / USA remoto',
    roles: [
      'AI Product Manager',
      'Solutions Architect (No / Low-Code & AI)',
      'AI Forward Deployed Engineer',
    ],
    summary: {
      title: 'Resumen Profesional',
      p1: 'Fundador y constructor de productos enfocado en',
      p1Highlight: 'automatización impulsada por IA',
      p1End:
        'y plataformas no / low-code. Tras escalar y vender mi negocio (venta en funcionamiento, 2025), me enfoco en roles donde el impacto se multiplica: convertir objetivos difusos en productos y workflows seguros, medibles y listos para producción.',
      p2: 'Propiedad end-to-end a través de',
      p2Highlight: 'descubrimiento → priorización → entrega → adopción',
      p2End: ', colaborando estrechamente con stakeholders e ingeniería.',
      cards: [
        {
          title: 'Mentalidad de Constructor',
          desc: 'Pequeños experimentos y bucles de evaluación temprano para reducir riesgos',
        },
        {
          title: 'Fortalezas',
          desc: 'Sentido de producto bajo ambigüedad, ramp-up rápido (2-4 semanas a producción)',
        },
        {
          title: 'Fluidez Técnica',
          desc: 'APIs, flujos de trabajo LLM / agentes, orquestación y automatización',
        },
      ],
    },
    coreCompetencies: {
      title: 'Competencias Core',
      items: [
        {
          title: 'AI Product Discovery',
          desc: 'Definición de problemas, PRDs de IA, roadmap y priorización',
        },
        {
          title: 'Arquitectura de Soluciones',
          desc: 'Requisitos, diseño de sistemas, APIs / webhooks, OpenAPI',
        },
        {
          title: 'Workflows Agénticos',
          desc: 'Agentes LLM, tool use, traspaso HITL, voz + mensajería',
        },
        {
          title: 'LLMOps Foundations',
          desc: 'Observabilidad, evals, telemetría, trade-offs coste / latencia',
        },
        {
          title: 'Forward-Deployed Delivery',
          desc: 'Workshops con stakeholders, mapeo de workflows, prototipado rápido',
        },
        {
          title: 'Reliability & Ops',
          desc: 'Monitoreo, event logs, error handling, reintentos, SOPs',
        },
      ],
    },
    techStack: {
      title: 'Stack Técnico',
      categories: [
        {
          name: 'AI / LLM',
          items: [
            'OpenAI (custom GPTs, tool use via OpenAPI)',
            'ElevenLabs',
            'Claude',
          ],
        },
        {
          name: 'Automation',
          items: ['Airtable (Builder / Admin)', 'n8n', 'Make', 'Zapier'],
        },
        {
          name: 'Integrations',
          items: ['Aircall', 'WATI (WhatsApp)', 'YouCanBookMe', 'DataForSEO'],
        },
        {
          name: 'Dev',
          items: [
            'Python',
            'FastAPI',
            'SQL',
            'Node.js / JavaScript',
            'Astro',
            'GraphQL',
            'Git',
          ],
        },
        { name: 'Infra', items: ['Vercel'] },
        { name: 'LLMOps', items: ['Observability', 'Evals', 'Langfuse'] },
      ],
    },
    projects: {
      title: 'Proyectos',
      githubLink: 'github.com/santifer-dev',
      viewCode: 'Ver código',
      viewPrototype: 'Ver prototipo',
      items: [
        {
          title: 'Content Digest',
          badge: 'Maven Capstone',
          badgeBuilding: 'En desarrollo',
          desc: 'Servicio Python + FastAPI para ingestión de contenido con LLM y generación de resúmenes. Prototipo ganador, ahora en producción con mejores prácticas empresariales.',
          tech: ['Python', 'FastAPI', 'OpenAI API', 'LLMOps'],
          link: 'contentdigest.santifer.io',
        },
        {
          title: 'santifer.io',
          badge: 'Este Portfolio',
          badgeBuilding: '',
          desc: 'CV interactivo con chat IA. Construido con **Claudeable**, monitorizado con **Claude Pulse**, animaciones debuggeadas con **Claude Eye**. LLMOps: Langfuse, 31 evals, prompt caching.',
          tech: [
            'React 19',
            'TypeScript',
            'Claude API',
            'Langfuse',
            'Vercel Edge',
          ],
          link: 'github.com/santifer-dev/cv-santiago',
        },
        {
          title: 'Claude Pulse',
          badge: 'Open Source',
          badgeBuilding: '',
          desc: 'Plugin SwiftBar para monitorización en tiempo real del uso de Claude Code en macOS. Métricas de consumo, predicción de rate limits, y consejos contextuales.',
          tech: ['Bash', 'SwiftBar', 'Anthropic API', 'jq'],
          link: 'github.com/santifer-dev/claude-pulse',
          isDependency: true,
          dependencyRole: 'monitoring',
        },
        {
          title: 'Claude Eye',
          badge: 'Open Source',
          badgeBuilding: '',
          desc: 'CLI que analiza videos de animaciones web frame por frame con Claude Vision. Detecta desyncs en transiciones CSS y genera reportes con timestamps exactos.',
          tech: ['Node.js', 'TypeScript', 'Claude Vision', 'FFmpeg'],
          link: 'github.com/santifer-dev/claude-eye',
          isDependency: true,
          dependencyRole: 'animations',
        },
        {
          title: 'Claudeable',
          badge: 'Open Source',
          badgeBuilding: '',
          desc: 'Metaproyecto de Claude Code para desarrollo web profesional. Skills personalizados, templates y MCPs preconfigurados para crear webs al nivel de Lovable.',
          tech: ['Claude Code', 'React', 'Tailwind', 'shadcn/ui', 'MCP'],
          link: 'github.com/santifer-dev/claudeable',
          isDependency: true,
          dependencyRole: 'framework',
        },
        {
          title: 'Watermark Remover',
          badge: 'Open Source',
          badgeBuilding: '',
          desc: 'CLI en Python para eliminar marcas de agua de imágenes con IA. Detección automática con YOLO e inpainting con LaMa para reconstrucción realista.',
          tech: ['Python', 'YOLO', 'LaMa', 'OpenCV'],
          link: 'github.com/santifer-dev/watermark-remover',
        },
      ],
      saPlaybook: {
        title: 'SA Playbook',
        badge: 'Privado · Bajo petición',
        tagline: 'Claude Code + Airtable Gold Partner Stack',
        desc: 'Sistema de productividad para Solutions Architects que trabajan con múltiples clientes DTC. Contexto instantáneo entre proyectos, guardrails automáticos para producción, y documentación que se genera sola.',
        features: [
          { icon: 'zap', text: 'Context switching de 30min a 30seg' },
          {
            icon: 'shield',
            text: 'Guardrails que bloquean operaciones destructivas en prod',
          },
          {
            icon: 'fileText',
            text: 'SESSION_BRIEF auto-generado al abrir proyecto',
          },
          { icon: 'git', text: 'ADRs y logging completo de operaciones' },
        ],
        footer: 'Disponible bajo petición para oportunidades relevantes',
        cta: 'Solicitar acceso',
      },
    },
    claudeCode: {
      title: 'Claude Code Power User',
      badge: 'High-Agency · AI-Fluency',
      desc: 'Usuario avanzado de Claude Code como herramienta principal de desarrollo. Construyo proyectos completos mediante conversación, desde plugins de sistema hasta aplicaciones web. Mentalidad high-agency: sé qué construir y cómo dirigir la IA para lograrlo.',
    },
    experience: {
      title: 'Experiencia Laboral',
      santifer: {
        role: 'Fundador & Product Lead (AI Automation)',
        period: '2009 - 2025 · Retail / Servicios B2B-B2C',
        exit: 'Exit 2025',
        exitDesc:
          'Construí, escalé y vendí el negocio como venta en funcionamiento',
        highlights: [
          'Reparación de móviles, tablets y smartwatches — +30,000 reparaciones',
          'Transformé de arriba a abajo las operaciones de servicio',
          'Productivicé workflows con validación, manejo de errores y reintentos',
          'Documenté SOPs y entrené al personal para adopción',
          'Cerré el loop Problema → Solución → Autoservicio para ~90% de clientes',
          'Experiencia directa front-of-house (2009-2015) y reparación técnica (2009-2019)',
          'Filosofía: si se repite, se automatiza — para el cliente y para el equipo',
        ],
        businessOS: {
          title: 'Business Operating System',
          badge: 'Airtable · Source of Truth',
          desc: 'Sistema operativo empresarial completo construido 100% en Airtable. Single source of truth que alimenta todos los sistemas: web, agente AI, GPTs, comunicaciones y operaciones.',
          metrics: [
            { value: '+2,100', label: 'campos' },
            { value: '12', label: 'bases conectadas' },
            { value: '+170h', label: 'automatizadas / mes' },
          ],
          modules: [
            {
              icon: 'database',
              text: 'ERP completo con 496 campos y 20+ validaciones automáticas',
            },
            {
              icon: 'users',
              text: 'CRM con gamificación (Bronze→Platinum) y Aircall integrado',
            },
            {
              icon: 'layout',
              text: 'CMS Headless → Web sincronizada automáticamente',
            },
            {
              icon: 'package',
              text: 'Inventario inteligente con pedidos automáticos a mínimo stock',
            },
            {
              icon: 'messageSquare',
              text: 'Comunicaciones omnicanal: SMS, WhatsApp, email automáticos',
            },
            {
              icon: 'receipt',
              text: 'Contabilidad automatizada: conciliación bancaria, facturas y gastos',
            },
            {
              icon: 'calendarCheck',
              text: 'Cita previa online con verificación de stock: confirma cita o genera pedido urgente',
            },
          ],
          footer: 'Walkthrough de arquitectura disponible selectivamente',
        },
        jacobo: {
          title: 'Agente AI Omnicanal "Jacobo"',
          badge: '~90% autoservicio',
          desc: 'Voz (ElevenLabs) + WhatsApp (n8n / WATI) + Aircall cloud PBX. Orquestación de sub-agentes especializados vía tool calling.',
          items: [
            {
              icon: 'network',
              text: 'Router principal: clasifica intent y delega a sub-agentes',
            },
            {
              icon: 'calendar',
              text: 'Sub-agente Citas: consulta slots, reserva, confirma vía WhatsApp',
            },
            {
              icon: 'percent',
              text: 'Sub-agente Descuentos: calcula promociones según historial cliente',
            },
            {
              icon: 'package',
              text: 'Sub-agente Pedidos: valida stock, crea orden, notifica ETA',
            },
            {
              icon: 'userCheck',
              text: 'HITL handoff: escala a humano con contexto completo',
            },
          ],
          soldWith: 'Playbook disponible bajo petición',
        },
        webSeo: {
          title: 'Web Programática + SEO Automatizado',
          badge: 'Única en el sector en España',
          desc: '100% custom-made (2023). Headless CMS en Airtable como fuente de verdad, integrado con ERP, generando web en Astro con SEO programático.',
          items: [
            {
              icon: 'fileText',
              text: 'Páginas por modelo / reparación generadas automáticamente',
            },
            {
              icon: 'image',
              text: 'Fotos antes / después + reseñas internas / externas desde ERP',
            },
            {
              icon: 'trendingUp',
              text: 'Volumen de búsquedas vía DataForSEO por taxonomía',
            },
            {
              icon: 'gitBranch',
              text: 'Decisión automatizada: indexable (SEO) vs solo UX',
            },
            { icon: 'bot', text: 'Optimización de crawl budget' },
          ],
          codeAvailable: 'Código disponible bajo petición',
        },
        erp: {
          title: 'ERP Interno',
          desc: 'Pedidos, inventario, órdenes + purchase orders automáticos de stock mínimo',
          metric: '20+ h / mes',
        },
        gpts: {
          title: 'GPTs Custom',
          desc: 'Stock, ubicación y precios via OpenAPI (voz / lenguaje natural)',
          metric: '10+ h / mes',
        },
        reservas: {
          title: 'Cita Previa Exprés',
          desc: 'Marca de la casa. YCBM → Airtable (stock check) → WhatsApp confirmación',
          metric: '90% auto',
        },
        crm: {
          title: 'CRM + Contenido Social',
          desc: 'Lead scoring, mensajes automáticos, gamificación (Bronze→Platinum)',
          metric: '60+ h / mes',
        },
        genAI: {
          title: 'IA Generativa Marketing',
          desc: 'Imágenes (ChatGPT), video (HeyGen, Sora), música (Suno). Digital + signage en tienda',
          metric: 'Early adopter',
        },
      },
      lico: {
        role: 'Consultor en Airtable & Operaciones E-commerce',
        period: '2024 - 2025 · Cosméticos D2C · Shopify',
        desc: 'Diseño de Airtable como Sistema Operativo interno: inventario, pedidos y tareas. Workshops de co-diseño con operaciones. Análisis de integraciones Airtable ↔ Shopify.',
        testimonial: {
          quote:
            'Su experiencia y conocimiento fueron claves para estructurar nuestros datos de manera ordenada... Lo que nos está permitiendo dedicar menos tiempo a labores burocráticas y más a labores realmente productivas.',
          author: 'Juan Sabaté',
          role: 'co-CEO @ LICO Cosmetics',
        },
      },
      everis: {
        role: 'Coordinador de Pruebas (8 testers) & Analista de Software',
        period: '2007 - 2009 · Consultoría',
        tesauro: {
          title: 'Tesauro de Codificación Médica Auto-aprendizaje',
          desc: 'Motor RL basado en grafos con feedback loops automáticos. Enlace entre desarrollo, consultoría y otras áreas. Sistema pionero pre-LLMs.',
        },
        testimonial: {
          quote:
            'Demostró una ilusión enorme y ganas de hacerlo bien... Consiguió no conformarse con su posición de partida y esa inquietud le hizo progresar a pasos agigantados. Comprometido, valioso, leal y sobre todo, con mucha actitud.',
          author: 'Manuel López Alcázar',
          role: 'Socio @ KPMG (fue mi supervisor en Everis)',
        },
      },
    },
    speaking: {
      title: 'Enseñando',
      slides: 'Slides',
      comingSoon: 'Próximamente',
      items: [
        {
          year: '2026',
          event: 'Marily Nika AI PM Bootcamp',
          eventUrl: 'https://maven.com/marily-nika/ai-pm-bootcamp',
          title: 'Teaching Fellow',
          desc: 'Enseñando a AI product managers a construir y lanzar — no solo definir.',
          pdf: '',
          featured: true,
        },
        {
          year: '2025',
          event: 'Marily Nika AI PM Bootcamp',
          eventUrl: 'https://maven.com/marily-nika/ai-pm-bootcamp',
          title: "No-Code: The AI PM's Secret Weapon",
          desc: 'Community session de 1h sobre no-code (Zapier, Make, n8n, Airtable) como superpoder del AI PM para validar y entregar más rápido.',
          pdf: '/slides/No-Code-The-AI-PMs-Secret-Weapon.pdf',
          featured: false,
        },
        {
          year: '2025',
          event: 'Empresarios locales · Sevilla',
          eventUrl: '',
          title: 'Hiperautomatiza tu Pyme',
          desc: 'Taller sobre hiperautomatización para pymes: orquestación, RPA, IA y gobernanza. Caso práctico: Santifer iRepair.',
          pdf: '/slides/Hiperautomatiza tu Pyme (SFVA).pdf',
          featured: false,
        },
      ],
    },
    education: {
      title: 'Formación',
      items: [
        {
          year: '2025',
          org: 'Maven',
          title: 'AI Product Management Bootcamp',
          desc: 'Liderado por Marily Nika (ex-Google PM). AI PRDs, diseño de agentes.',
          projectLink: 'contentdigest.santifer.io',
          projectLabel: 'Proyecto ganador',
        },
        {
          year: '2024',
          org: 'BIGSEO',
          title: 'Master en Inteligencia Artificial',
          desc: 'IA Generativa aplicada a negocios',
        },
        {
          year: '2023',
          org: 'BIGSEO',
          title: 'Master en SEO',
          desc: 'SEO técnico, contenido y analítica',
          testimonial: {
            quote:
              'Su compromiso y evolución durante la formación fue formidable. Ha demostrado no solo sus conocimientos en SEO sino también una capacidad brillante de unir grupos y ganarse el aprecio de todos sus compañeros.',
            author: 'Javier Martínez García',
            role: 'CMO @ BIGSEO & BIG School',
            photo: '/javier-martinez.jpeg',
            linkedin: 'https://www.linkedin.com/in/javiermark/',
          },
        },
        {
          year: '2001 - 2009',
          org: 'ETSI',
          title: 'Ing. de Telecomunicaciones',
          desc: 'Especialidad en Telemática',
        },
      ],
    },
    certifications: {
      title: 'Certificaciones',
      items: [
        {
          year: '2026',
          title: 'Introduction to Model Context Protocol',
          org: 'Anthropic',
          logo: 'anthropic',
          url: 'https://verify.skilljar.com/c/4pxam3irsioq',
        },
        {
          year: '2026',
          title: 'Claude Code in Action',
          org: 'Anthropic',
          logo: 'anthropic',
          url: 'https://verify.skilljar.com/c/eijx7hwc2x89',
        },
        {
          year: '2025',
          title: 'AI App Builder Certification',
          org: 'Airtable',
          logo: 'airtable',
          url: 'https://verify.skilljar.com/c/gwg7ak9qgf7r',
        },
        {
          year: '2024',
          title: 'Airtable Builder Certification',
          org: 'Airtable',
          logo: 'airtable',
          url: 'https://verify.skilljar.com/c/id2e4zgqtasv',
        },
        {
          year: '2024',
          title: 'Airtable Admin Certification',
          org: 'Airtable',
          logo: 'airtable',
          url: 'https://verify.skilljar.com/c/u3r8kgn5wdit',
        },
        {
          year: '2024',
          title: 'Make Advanced',
          org: 'Make Academy',
          logo: 'make',
          url: 'https://www.credly.com/badges/d27b8174-ef20-46bd-9d81-ee05e9c349e8',
        },
      ],
    },
    skills: {
      title: 'Competencias',
      languages: 'Idiomas',
      spanish: 'Español',
      native: 'Nativo',
      english: 'Inglés',
      professional: 'Profesional fluido',
      technical: 'Habilidades Técnicas',
      soft: 'Soft Skills',
      softSkills: [
        'Comunicación',
        'Liderazgo',
        'Pensamiento Sistémico',
        'Ownership E2E',
        'Bias for Action',
        'Influencia sin Autoridad',
        'Gestión de Ambigüedad',
      ],
    },
    cta: {
      title: '¿Hablamos?',
      desc: 'Busco un rol senior remoto (EU / USA) donde pueda liderar producto, desbloquear equipos con automatización y entregar resultados que se puedan medir.',
      contact: 'Contactar',
    },
  },
  en: {
    greeting: "Hi, I'm",
    email: 'hi@santifer.io',
    role: 'I turn manual work into reusable systems.',
    story: {
      context: '+15 years building+ everything from scratch.',
      reflections: ["I've mastered this.", "There's something bigger."],
      hookParagraphs: [
        ['One day, I sold my business. I bought *clarity.*'],
        [
          "What drives me doesn't fit on a shelf.",
          '*Building* +systems that unblock teams+. And it scales.',
        ],
      ],
      why: 'At Santifer iRepair I automated everything I could: from an AI agent that handled 90% of customers to an operating system orchestrating 12 databases.',
      seeking: 'Now I want to do it at scale — where impact compounds.',
      nav: [
        { icon: 'briefcase', label: 'My path', href: '#experience' },
        { icon: 'folder', label: 'What I build', href: '#projects' },
        { icon: 'mail', label: "Let's talk", href: '#contact' },
        { icon: 'bot', label: 'Ask me', href: '#chat', highlight: true },
      ],
      skills: [
        'AI Product Discovery',
        'Solution Architecture',
        'Agentic Workflows',
        'LLMOps',
        'Forward-Deployed',
        'Reliability & Ops',
      ],
      skipButton: 'Skip intro',
    },
    taglines: [] as readonly string[],
    location: 'Seville, ES · EU / USA remote',
    roles: [
      'AI Product Manager',
      'Solutions Architect (No / Low-Code & AI)',
      'AI Forward Deployed Engineer',
    ],
    summary: {
      title: 'Professional Summary',
      p1: 'Founder and product builder focused on',
      p1Highlight: 'AI-powered automation',
      p1End:
        'and no / low-code platforms. After scaling and selling my business (going-concern sale, 2025), I focus on roles where impact compounds: turning ambiguous business goals into secure, measurable, enterprise-ready products and workflows.',
      p2: 'End-to-end ownership across',
      p2Highlight: 'discovery → prioritization → delivery → adoption',
      p2End: ', collaborating closely with stakeholders and engineering.',
      cards: [
        {
          title: 'Builder Mindset',
          desc: 'Small experiments and early evaluation loops to de-risk decisions',
        },
        {
          title: 'Strengths',
          desc: 'Product sense under ambiguity, fast ramp-up (2-4 weeks to production)',
        },
        {
          title: 'Technical Fluency',
          desc: 'APIs, LLM / agent workflows, orchestration, and automation',
        },
      ],
    },
    coreCompetencies: {
      title: 'Core Competencies',
      items: [
        {
          title: 'AI Product Discovery',
          desc: 'Problem definition, AI PRDs, roadmap & prioritization',
        },
        {
          title: 'Solution Architecture',
          desc: 'Requirements, system design, APIs / webhooks, OpenAPI',
        },
        {
          title: 'Agentic Workflows',
          desc: 'LLM agents, tool use, HITL handoff, voice + messaging',
        },
        {
          title: 'LLMOps Foundations',
          desc: 'Observability, evals, telemetry, cost / latency trade-offs',
        },
        {
          title: 'Forward-Deployed Delivery',
          desc: 'Stakeholder workshops, workflow mapping, rapid prototyping',
        },
        {
          title: 'Reliability & Ops',
          desc: 'Monitoring, event logs, error handling, retries, SOPs',
        },
      ],
    },
    techStack: {
      title: 'Tech Stack',
      categories: [
        {
          name: 'AI / LLM',
          items: [
            'OpenAI (custom GPTs, tool use via OpenAPI)',
            'ElevenLabs',
            'Claude',
          ],
        },
        {
          name: 'Automation',
          items: ['Airtable (Builder / Admin)', 'n8n', 'Make', 'Zapier'],
        },
        {
          name: 'Integrations',
          items: ['Aircall', 'WATI (WhatsApp)', 'YouCanBookMe', 'DataForSEO'],
        },
        {
          name: 'Dev',
          items: [
            'Python',
            'FastAPI',
            'SQL',
            'Node.js / JavaScript',
            'Astro',
            'GraphQL',
            'Git',
          ],
        },
        { name: 'Infra', items: ['Vercel'] },
        { name: 'LLMOps', items: ['Observability', 'Evals', 'Langfuse'] },
      ],
    },
    projects: {
      title: 'Projects',
      githubLink: 'github.com/santifer-dev',
      viewCode: 'View code',
      viewPrototype: 'View prototype',
      items: [
        {
          title: 'Content Digest',
          badge: 'Maven Capstone',
          badgeBuilding: 'Building',
          desc: 'Python + FastAPI service for LLM-powered content ingestion and digest generation. Winning prototype, now in production with enterprise best practices.',
          tech: ['Python', 'FastAPI', 'OpenAI API', 'LLMOps'],
          link: 'contentdigest.santifer.io',
        },
        {
          title: 'santifer.io',
          badge: 'This Portfolio',
          badgeBuilding: '',
          desc: 'Interactive CV with AI chat. Built with **Claudeable**, monitored with **Claude Pulse**, animations debugged with **Claude Eye**. LLMOps: Langfuse, 31 evals, prompt caching.',
          tech: [
            'React 19',
            'TypeScript',
            'Claude API',
            'Langfuse',
            'Vercel Edge',
          ],
          link: 'github.com/santifer-dev/cv-santiago',
        },
        {
          title: 'Claude Pulse',
          badge: 'Open Source',
          badgeBuilding: '',
          desc: 'SwiftBar plugin for real-time Claude Code usage monitoring on macOS. Consumption metrics, rate limit predictions, and context-aware tips.',
          tech: ['Bash', 'SwiftBar', 'Anthropic API', 'jq'],
          link: 'github.com/santifer-dev/claude-pulse',
          isDependency: true,
          dependencyRole: 'monitoring',
        },
        {
          title: 'Claude Eye',
          badge: 'Open Source',
          badgeBuilding: '',
          desc: 'CLI that analyzes web animation videos frame-by-frame using Claude Vision. Detects CSS transition desyncs and generates reports with exact timestamps.',
          tech: ['Node.js', 'TypeScript', 'Claude Vision', 'FFmpeg'],
          link: 'github.com/santifer-dev/claude-eye',
          isDependency: true,
          dependencyRole: 'animations',
        },
        {
          title: 'Claudeable',
          badge: 'Open Source',
          badgeBuilding: '',
          desc: 'Claude Code meta-project for professional web development. Custom skills, templates and pre-configured MCPs to build Lovable-quality websites.',
          tech: ['Claude Code', 'React', 'Tailwind', 'shadcn/ui', 'MCP'],
          link: 'github.com/santifer-dev/claudeable',
          isDependency: true,
          dependencyRole: 'framework',
        },
        {
          title: 'Watermark Remover',
          badge: 'Open Source',
          badgeBuilding: '',
          desc: 'Python CLI to remove watermarks from images using AI. Automatic detection with YOLO and LaMa inpainting for clean, realistic results.',
          tech: ['Python', 'YOLO', 'LaMa', 'OpenCV'],
          link: 'github.com/santifer-dev/watermark-remover',
        },
      ],
      saPlaybook: {
        title: 'SA Playbook',
        badge: 'Private · On Request',
        tagline: 'Claude Code + Airtable Gold Partner Stack',
        desc: 'Productivity system for Solutions Architects managing multiple DTC clients. Instant context switching between projects, automatic guardrails for production, and self-generating documentation.',
        features: [
          { icon: 'zap', text: 'Context switching from 30min to 30sec' },
          {
            icon: 'shield',
            text: 'Guardrails blocking destructive ops in prod',
          },
          {
            icon: 'fileText',
            text: 'Auto-generated SESSION_BRIEF on project open',
          },
          { icon: 'git', text: 'Full ADRs and operation logging' },
        ],
        footer: 'Available on request for relevant opportunities',
        cta: 'Request access',
      },
    },
    claudeCode: {
      title: 'Claude Code Power User',
      badge: 'High-Agency · AI-Fluency',
      desc: 'Advanced Claude Code user as primary development tool. I build complete projects through conversation, from system plugins to web apps. High-agency mindset: I know what to build and how to direct AI to achieve it.',
    },
    experience: {
      title: 'Work Experience',
      santifer: {
        role: 'Founder & Product Lead (AI Automation)',
        period: '2009 - 2025 · Retail / Services B2B-B2C',
        exit: 'Exit 2025',
        exitDesc: 'Built, scaled, and sold the business as a going concern',
        highlights: [
          'Mobile, tablet and smartwatch repairs — +30,000 repairs completed',
          'Drove full automation transformation across service operations',
          'Productionized workflows with validation checks, error handling, retries',
          'Documented SOPs and trained staff for adoption',
          'Closed the Problem → Solution → Self-service loop for ~90% of customers',
          'Direct front-of-house experience (2009-2015) and hands-on repairs (2009-2019)',
          'Philosophy: if it repeats, automate it — for the customer and for the team',
        ],
        businessOS: {
          title: 'Business Operating System',
          badge: 'Airtable · Source of Truth',
          desc: 'Complete business operating system built 100% in Airtable. Single source of truth powering all systems: web, AI agent, GPTs, communications, and operations.',
          metrics: [
            { value: '+2,100', label: 'fields' },
            { value: '12', label: 'connected bases' },
            { value: '+170h', label: 'automated / month' },
          ],
          modules: [
            {
              icon: 'database',
              text: 'Full ERP with 496 fields and 20+ automatic validations',
            },
            {
              icon: 'users',
              text: 'CRM with gamification (Bronze→Platinum) and Aircall integrated',
            },
            { icon: 'layout', text: 'Headless CMS → Auto-synced website' },
            {
              icon: 'package',
              text: 'Smart inventory with automatic min-stock purchase orders',
            },
            {
              icon: 'messageSquare',
              text: 'Omnichannel comms: SMS, WhatsApp, email automations',
            },
            {
              icon: 'receipt',
              text: 'Automated accounting: bank reconciliation, invoices and expenses',
            },
            {
              icon: 'calendarCheck',
              text: 'Online booking with stock check: confirms appointment or triggers urgent order',
            },
          ],
          footer: 'Architecture walkthrough available selectively',
        },
        jacobo: {
          title: 'Omnichannel AI Agent "Jacobo"',
          badge: '~90% self-service',
          desc: 'Voice (ElevenLabs) + WhatsApp (n8n / WATI) + Aircall cloud PBX. Sub-agent orchestration via tool calling.',
          items: [
            {
              icon: 'network',
              text: 'Main router: classifies intent and delegates to sub-agents',
            },
            {
              icon: 'calendar',
              text: 'Appointments sub-agent: checks slots, books, confirms via WhatsApp',
            },
            {
              icon: 'percent',
              text: 'Discounts sub-agent: calculates promos based on customer history',
            },
            {
              icon: 'package',
              text: 'Orders sub-agent: validates stock, creates order, notifies ETA',
            },
            {
              icon: 'userCheck',
              text: 'HITL handoff: escalates to human with full context',
            },
          ],
          soldWith: 'Playbook available on request',
        },
        webSeo: {
          title: 'Programmatic Web + Automated SEO',
          badge: 'Only one in sector in Spain',
          desc: '100% custom-made (2023). Headless CMS in Airtable as source of truth, integrated with ERP, generating Astro website with programmatic SEO.',
          items: [
            {
              icon: 'fileText',
              text: 'Pages per model / repair auto-generated',
            },
            {
              icon: 'image',
              text: 'Before / after photos + internal / external reviews from ERP',
            },
            {
              icon: 'trendingUp',
              text: 'Search volume via DataForSEO by taxonomy',
            },
            {
              icon: 'gitBranch',
              text: 'Automated decision: indexable (SEO) vs UX-only',
            },
            { icon: 'bot', text: 'Crawl budget optimization' },
          ],
          codeAvailable: 'Source code available on request',
        },
        erp: {
          title: 'Internal ERP',
          desc: 'Orders, inventory, work orders + automatic min-stock purchase orders',
          metric: '20+ h / mo',
        },
        gpts: {
          title: 'Custom GPTs',
          desc: 'Stock, location & pricing via OpenAPI (voice / natural language)',
          metric: '10+ h / mo',
        },
        reservas: {
          title: 'Express Booking',
          desc: 'House signature. YCBM → Airtable (stock check) → WhatsApp confirmation',
          metric: '90% auto',
        },
        crm: {
          title: 'CRM + Social Content',
          desc: 'Lead scoring, automated messages, gamification (Bronze→Platinum)',
          metric: '60+ h / mo',
        },
        genAI: {
          title: 'Generative AI Marketing',
          desc: 'Images (ChatGPT), video (HeyGen, Sora), music (Suno). Digital + in-store signage',
          metric: 'Early adopter',
        },
      },
      lico: {
        role: 'Airtable & E-commerce Operations Consultant',
        period: '2024 - 2025 · D2C Cosmetics · Shopify',
        desc: 'Designed Airtable as internal Operating System: inventory, orders, and tasks. Co-design workshops with operations. Airtable ↔ Shopify integration analysis.',
        testimonial: {
          quote:
            'His expertise was key to structuring our data properly — so we spend less time on admin and more on work that actually moves the needle.',
          author: 'Juan Sabaté',
          role: 'co-CEO @ LICO Cosmetics',
        },
      },
      everis: {
        role: 'Test Coordinator (8 testers) & Software Analyst',
        period: '2007 - 2009 · Consulting',
        tesauro: {
          title: 'Self-learning Medical Coding Thesaurus',
          desc: 'Graph-based RL engine with automatic feedback loops. Liaison between dev, consulting, and project areas. Pioneer system pre-LLMs.',
        },
        testimonial: {
          quote:
            'Huge enthusiasm and drive from day one. He refused to settle for his starting role — that restlessness pushed him to grow fast. Committed, reliable, and above all, someone with real attitude.',
          author: 'Manuel López Alcázar',
          role: 'Partner @ KPMG (was my supervisor at Everis)',
        },
      },
    },
    speaking: {
      title: 'Sharing',
      slides: 'Slides',
      comingSoon: 'More coming soon.',
      items: [
        {
          year: '2026',
          event: 'Marily Nika AI PM Bootcamp',
          eventUrl: 'https://maven.com/marily-nika/ai-pm-bootcamp',
          title: 'Teaching Fellow',
          desc: 'Teaching AI product managers to build and ship — not just define.',
          pdf: '',
          featured: true,
        },
        {
          year: '2025',
          event: 'Marily Nika AI PM Bootcamp',
          eventUrl: 'https://maven.com/marily-nika/ai-pm-bootcamp',
          title: "No-Code: The AI PM's Secret Weapon",
          desc: '1h community session on no-code (Zapier, Make, n8n, Airtable) as an AI PM superpower to validate and deliver faster.',
          pdf: '/slides/No-Code-The-AI-PMs-Secret-Weapon.pdf',
          featured: false,
        },
        {
          year: '2025',
          event: 'Local entrepreneurs · Seville',
          eventUrl: '',
          title: 'Hiperautomatiza tu Pyme',
          desc: 'Workshop on hyperautomation for SMEs: orchestration, RPA, AI and governance. Case study: Santifer iRepair.',
          pdf: '/slides/Hiperautomatiza tu Pyme (SFVA).pdf',
          featured: false,
        },
      ],
    },
    education: {
      title: 'Education',
      items: [
        {
          year: '2025',
          org: 'Maven',
          title: 'AI Product Management Bootcamp',
          desc: 'Led by Marily Nika (ex-Google PM). AI PRDs, agent design.',
          projectLink: 'contentdigest.santifer.io',
          projectLabel: 'Winning project',
        },
        {
          year: '2024',
          org: 'BIGSEO',
          title: 'Master in Artificial Intelligence',
          desc: 'Applied GenAI for business',
        },
        {
          year: '2023',
          org: 'BIGSEO',
          title: 'Master in SEO',
          desc: 'Technical SEO, content and analytics',
          testimonial: {
            quote:
              'Santiago stood out — not just for his SEO skills, but for how he brought the cohort together. Everyone respected him by the end.',
            author: 'Javier Martínez García',
            role: 'CMO @ BIGSEO & BIG School',
            photo: '/javier-martinez.jpeg',
            linkedin: 'https://www.linkedin.com/in/javiermark/',
          },
        },
        {
          year: '2001 - 2009',
          org: 'ETSI',
          title: 'Telecommunications Engineering',
          desc: 'Telematics specialization',
        },
      ],
    },
    certifications: {
      title: 'Certifications',
      items: [
        {
          year: '2026',
          title: 'Introduction to Model Context Protocol',
          org: 'Anthropic',
          logo: 'anthropic',
          url: 'https://verify.skilljar.com/c/4pxam3irsioq',
        },
        {
          year: '2026',
          title: 'Claude Code in Action',
          org: 'Anthropic',
          logo: 'anthropic',
          url: 'https://verify.skilljar.com/c/eijx7hwc2x89',
        },
        {
          year: '2025',
          title: 'AI App Builder Certification',
          org: 'Airtable',
          logo: 'airtable',
          url: 'https://verify.skilljar.com/c/gwg7ak9qgf7r',
        },
        {
          year: '2024',
          title: 'Airtable Builder Certification',
          org: 'Airtable',
          logo: 'airtable',
          url: 'https://verify.skilljar.com/c/id2e4zgqtasv',
        },
        {
          year: '2024',
          title: 'Airtable Admin Certification',
          org: 'Airtable',
          logo: 'airtable',
          url: 'https://verify.skilljar.com/c/u3r8kgn5wdit',
        },
        {
          year: '2024',
          title: 'Make Advanced',
          org: 'Make Academy',
          logo: 'make',
          url: 'https://www.credly.com/badges/d27b8174-ef20-46bd-9d81-ee05e9c349e8',
        },
      ],
    },
    skills: {
      title: 'Skills',
      languages: 'Languages',
      spanish: 'Spanish',
      native: 'Native',
      english: 'English',
      professional: 'Professional proficiency',
      technical: 'Technical Skills',
      soft: 'Soft Skills',
      softSkills: [
        'Communication',
        'Leadership',
        'Systems Thinking',
        'E2E Ownership',
        'Bias for Action',
        'Influence w/o Authority',
        'Dealing with Ambiguity',
      ],
    },
    cta: {
      title: "Let's talk",
      desc: 'Looking for a senior remote role (EU / USA) where I can own product delivery, unblock teams through automation, and ship results you can measure.',
      contact: 'Contact',
    },
  },
} as const;

export type Lang = 'es' | 'en';
