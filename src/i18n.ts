export const seo = {
  es: {
    title: 'Santiago Fernández | AI Product Manager · Solutions Architect · FDE',
    description: 'Ex-fundador y AI Product Manager especializado en automatización con LLMs y no-code. Certificado Anthropic. Disponible para roles remotos EU/USA.',
  },
  en: {
    title: 'Santiago Fernández | AI Product Manager · Solutions Architect · FDE',
    description: 'Ex-founder and AI Product Manager specialized in LLM automation and no-code. Anthropic certified. Available for remote EU/USA roles.',
  }
}

export const translations = {
  es: {
    greeting: 'Hola, soy',
    email: 'hola@santifer.io',
    role: 'Quitando fricción de lo que importa',
    taglines: [
      '*Quitando* fricción de lo que *importa*.',
      '*Descubriendo* los límites de la IA.',
      'Ex-fundador. Ahora *escalando* impacto.',
      'De la ambigüedad al *producto*.',
      '*Construyo* agentes que trabajan solos.',
      'Si se repite, lo *automatizo*.',
    ],
    location: 'Sevilla, ES · EU/USA remoto',
    roles: [
      'AI Product Manager',
      'Solutions Architect (No/Low-Code & AI)',
      'AI Forward Deployed Engineer'
    ],
    summary: {
      title: 'Resumen Profesional',
      p1: 'Ex-fundador y constructor de productos especializado en',
      p1Highlight: 'automatización impulsada por IA',
      p1End: 'y plataformas no/low-code. Después de escalar y vender mi negocio (venta en funcionamiento, 2025), ahora me enfoco en roles donde el impacto escala: convertir objetivos empresariales ambiguos en productos y flujos de trabajo seguros, medibles y listos para empresas.',
      p2: 'Opero con propiedad end-to-end a través de',
      p2Highlight: 'descubrimiento → priorización → entrega → adopción',
      p2End: ', colaborando estrechamente con stakeholders e ingeniería.',
      cards: [
        { title: 'Mentalidad de Constructor', desc: 'Pequeños experimentos y bucles de evaluación temprano para reducir riesgos' },
        { title: 'Fortalezas', desc: 'Sentido de producto bajo ambigüedad, ramp-up rápido (2-4 semanas a producción)' },
        { title: 'Fluidez Técnica', desc: 'APIs, flujos de trabajo LLM/agentes, orquestación y automatización' },
      ]
    },
    coreCompetencies: {
      title: 'Competencias Core',
      items: [
        { title: 'AI Product Discovery', desc: 'Definición de problemas, PRDs de IA, roadmap y priorización' },
        { title: 'Arquitectura de Soluciones', desc: 'Requisitos, diseño de sistemas, APIs/webhooks, OpenAPI' },
        { title: 'Workflows Agénticos', desc: 'Agentes LLM, tool use, traspaso HITL, voz + mensajería' },
        { title: 'LLMOps Foundations', desc: 'Bucles de evaluación, monitoreo/telemetría, trade-offs coste/latencia' },
        { title: 'Forward-Deployed Delivery', desc: 'Workshops con stakeholders, mapeo de workflows, prototipado rápido' },
        { title: 'Reliability & Ops', desc: 'Monitoreo, event logs, error handling, reintentos, SOPs' },
      ]
    },
    techStack: {
      title: 'Stack Técnico',
      categories: [
        { name: 'AI/LLM', items: ['OpenAI (custom GPTs, tool use via OpenAPI)', 'ElevenLabs', 'Claude'] },
        { name: 'Automation', items: ['Airtable (Builder/Admin)', 'n8n', 'Make', 'Zapier'] },
        { name: 'Integrations', items: ['Aircall', 'WATI (WhatsApp)', 'YouCanBookMe', 'DataForSEO'] },
        { name: 'Dev', items: ['Python', 'FastAPI', 'SQL', 'Node.js/JavaScript', 'Astro', 'GraphQL', 'Git'] },
        { name: 'Infra', items: ['Vercel'] },
      ]
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
          link: 'contentdigest.santifer.io'
        },
        {
          title: 'Claude Pulse',
          badge: 'Open Source',
          badgeBuilding: '',
          desc: 'Plugin SwiftBar para monitorización en tiempo real del uso de Claude Code en macOS. Métricas de consumo, predicción de rate limits, y consejos contextuales.',
          tech: ['Bash', 'SwiftBar', 'Anthropic API', 'jq'],
          link: 'github.com/santifer-dev/claude-pulse'
        },
        {
          title: 'Claudeable',
          badge: 'Open Source',
          badgeBuilding: '',
          desc: 'Metaproyecto de Claude Code para desarrollo web profesional. Skills personalizados, templates y MCPs preconfigurados para crear webs al nivel de Lovable.',
          tech: ['Claude Code', 'React', 'Tailwind', 'shadcn/ui', 'MCP'],
          link: 'github.com/santifer-dev/claudeable'
        },
        {
          title: 'Watermark Remover',
          badge: 'Open Source',
          badgeBuilding: '',
          desc: 'CLI en Python para eliminar marcas de agua de imágenes con IA. Detección automática con YOLO e inpainting con LaMa para reconstrucción realista.',
          tech: ['Python', 'YOLO', 'LaMa', 'OpenCV'],
          link: 'github.com/santifer-dev/watermark-remover'
        },
        {
          title: 'santifer.io',
          badge: 'Este Portfolio',
          badgeBuilding: '',
          desc: 'CV interactivo con chat IA integrado. El chatbot "Santi" responde preguntas sobre mi experiencia y habilidades. Streaming en tiempo real, prompt caching, i18n ES/EN, dark mode.',
          tech: ['React 19', 'TypeScript', 'Claude API', 'Prompt Caching', 'Vercel Edge'],
          link: 'github.com/santifer-dev/cv-santiago'
        }
      ]
    },
    claudeCode: {
      title: 'Claude Code Power User',
      badge: 'High-Agency · AI-Fluency',
      desc: 'Usuario avanzado de Claude Code como herramienta principal de desarrollo. Construyo proyectos completos mediante conversación, desde plugins de sistema hasta aplicaciones web. Mentalidad high-agency: sé qué construir y cómo dirigir la IA para lograrlo.'
    },
    experience: {
      title: 'Experiencia Laboral',
      santifer: {
        role: 'Fundador & Product Lead (AI Automation)',
        period: '2009 - 2025 · Retail / Servicios B2B-B2C',
        exit: 'Exit 2025',
        exitDesc: 'Construí, escalé y vendí el negocio como venta en funcionamiento',
        highlights: [
          'Reparación de móviles, tablets y smartwatches — +30,000 reparaciones',
          'Lideré transformación end-to-end de operaciones de servicio',
          'Productivicé workflows con validación, manejo de errores y reintentos',
          'Documenté SOPs y entrené al personal para adopción',
          'Cerré el loop Problema → Solución → Autoservicio para ~90% de clientes',
          'Experiencia directa front-of-house (2009-2015) y reparación técnica (2009-2019)',
          'Filosofía: automatizar todo lo posible—para el cliente y para procesos internos—para maximizar el valor entregado'
        ],
        jacobo: {
          title: 'Agente AI Omnicanal "Jacobo"',
          badge: '~90% autoservicio',
          desc: 'Voz (ElevenLabs) + WhatsApp (n8n/WATI) + Aircall cloud PBX. Orquestación de sub-agentes especializados vía tool calling.',
          items: [
            'Router principal: clasifica intent y delega a sub-agentes',
            'Sub-agente Citas: consulta slots, reserva, confirma vía WhatsApp',
            'Sub-agente Descuentos: calcula promociones según historial cliente',
            'Sub-agente Pedidos: valida stock, crea orden, notifica ETA',
            'HITL handoff: escala a humano con contexto completo'
          ],
          soldWith: 'Playbook disponible bajo petición'
        },
        webSeo: {
          title: 'Web Programática + SEO Automatizado',
          badge: 'Única en el sector en España',
          desc: '100% custom-made (2023). Headless CMS en Airtable como fuente de verdad, integrado con ERP, generando web en Astro con SEO programático.',
          items: [
            'Páginas por modelo/reparación generadas automáticamente',
            'Fotos antes/después + reseñas internas/externas desde ERP',
            'Volumen de búsquedas vía DataForSEO por taxonomía',
            'Decisión automatizada: indexable (SEO) vs solo UX',
            'Optimización de crawl budget'
          ],
          codeAvailable: 'Código disponible bajo petición'
        },
        erp: { title: 'ERP Interno', desc: 'Pedidos, inventario, órdenes + purchase orders automáticos de stock mínimo', metric: '20+ h/mes' },
        gpts: { title: 'GPTs Custom', desc: 'Stock, ubicación y precios via OpenAPI (voz/lenguaje natural)', metric: '10+ h/mes' },
        reservas: { title: 'Reservas', desc: 'YouCanBookMe + webhook custom + WhatsApp notifications', metric: '90% auto' },
        crm: { title: 'CRM + Contenido Social', desc: 'Lead scoring, mensajes automáticos, gamificación (Bronze→Platinum)', metric: '60+ h/mes' }
      },
      lico: {
        role: 'Consultor en Airtable & Operaciones E-commerce',
        period: '2024 - 2025 · Cosméticos D2C · Shopify',
        desc: 'Diseño de Airtable como Sistema Operativo interno: inventario, pedidos y tareas. Workshops de co-diseño con operaciones. Análisis de integraciones Airtable ↔ Shopify.'
      },
      everis: {
        role: 'Coordinador de Pruebas (8 testers) & Analista de Software',
        period: '2007 - 2009 · Consultoría',
        tesauro: {
          title: 'Tesauro de Codificación Médica Auto-aprendizaje',
          desc: 'Motor RL basado en grafos con feedback loops automáticos. Enlace entre desarrollo, consultoría y otras áreas. Sistema pionero pre-LLMs.'
        }
      }
    },
    speaking: {
      title: 'Ponencias',
      slides: 'Slides',
      items: [
        { year: '2025', event: 'Marily Nika AI PM Bootcamp', eventUrl: 'https://maven.com/marily-nika/ai-pm-bootcamp', title: 'No-Code: The AI PM\'s Secret Weapon', desc: 'Community session de 1h sobre no-code (Zapier, Make, n8n, Airtable) como superpoder del AI PM para validar y entregar más rápido.', pdf: '/slides/No-Code-The-AI-PMs-Secret-Weapon.pdf' },
        { year: '2025', event: 'Empresarios locales · Sevilla', eventUrl: '', title: 'Hiperautomatiza tu Pyme', desc: 'Taller sobre hiperautomatización para pymes: orquestación, RPA, IA y gobernanza. Caso práctico: Santifer iRepair.', pdf: '/slides/Hiperautomatiza tu Pyme (SFVA).pdf' },
      ]
    },
    education: {
      title: 'Formación',
      items: [
        { year: '2025', org: 'Maven', title: 'AI Product Management Bootcamp', desc: 'Liderado por Marily Nika (ex-Google PM). AI PRDs, diseño de agentes.', projectLink: 'contentdigest.santifer.io', projectLabel: 'Proyecto ganador' },
        { year: '2024', org: 'BIGSEO', title: 'Master en Inteligencia Artificial', desc: 'IA Generativa aplicada a negocios' },
        { year: '2023', org: 'BIGSEO', title: 'Master en SEO', desc: 'SEO técnico, contenido y analítica' },
        { year: '2001 - 2009', org: 'ETSI', title: 'Ing. de Telecomunicaciones', desc: 'Especialidad en Telemática' },
      ]
    },
    certifications: {
      title: 'Certificaciones',
      items: [
        { year: '2026', title: 'Introduction to Model Context Protocol', org: 'Anthropic', logo: 'anthropic', url: 'https://verify.skilljar.com/c/4pxam3irsioq' },
        { year: '2026', title: 'Claude Code in Action', org: 'Anthropic', logo: 'anthropic', url: 'https://verify.skilljar.com/c/eijx7hwc2x89' },
        { year: '2025', title: 'AI App Builder Certification', org: 'Airtable', logo: 'airtable', url: 'https://verify.skilljar.com/c/gwg7ak9qgf7r' },
        { year: '2024', title: 'Airtable Builder Certification', org: 'Airtable', logo: 'airtable', url: 'https://verify.skilljar.com/c/id2e4zgqtasv' },
        { year: '2024', title: 'Airtable Admin Certification', org: 'Airtable', logo: 'airtable', url: 'https://verify.skilljar.com/c/u3r8kgn5wdit' },
        { year: '2024', title: 'Make Advanced', org: 'Make Academy', logo: 'make', url: 'https://www.credly.com/badges/d27b8174-ef20-46bd-9d81-ee05e9c349e8' },
      ]
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
      softSkills: ['Comunicación', 'Liderazgo', 'Pensamiento Sistémico', 'Ownership E2E', 'Bias for Action', 'Influencia sin Autoridad', 'Gestión de Ambigüedad']
    },
    cta: {
      title: '¿Hablamos?',
      desc: 'Busco un rol senior remoto en EU/USA para liderar cambios de proceso, mejorar la experiencia y eficiencia del equipo, y entregar resultados con métricas claras.',
      contact: 'Contactar'
    }
  },
  en: {
    greeting: "Hi, I'm",
    email: 'hi@santifer.io',
    role: 'Removing friction from what matters',
    taglines: [
      '*Removing* friction from what *matters*.',
      '*Discovering* AI\'s limits.',
      'Ex-founder. Now *scaling* impact.',
      'From ambiguity to *product*.',
      'I *build* agents that work on their own.',
      'If it repeats, I *automate* it.',
    ],
    location: 'Seville, ES · EU/USA remote',
    roles: [
      'AI Product Manager',
      'Solutions Architect (No/Low-Code & AI)',
      'AI Forward Deployed Engineer'
    ],
    summary: {
      title: 'Professional Summary',
      p1: 'Former founder and product builder specialized in',
      p1Highlight: 'AI-powered automation',
      p1End: 'and no/low-code platforms. After scaling and selling my business (going-concern sale, 2025), I now focus on roles where impact scales: turning ambiguous business goals into secure, measurable, enterprise-ready products and workflows.',
      p2: 'I operate with end-to-end ownership across',
      p2Highlight: 'discovery → prioritization → delivery → adoption',
      p2End: ', collaborating closely with stakeholders and engineering.',
      cards: [
        { title: 'Builder Mindset', desc: 'Small experiments and early evaluation loops to de-risk decisions' },
        { title: 'Strengths', desc: 'Product sense under ambiguity, fast ramp-up (2-4 weeks to production)' },
        { title: 'Technical Fluency', desc: 'APIs, LLM/agent workflows, orchestration and automation' },
      ]
    },
    coreCompetencies: {
      title: 'Core Competencies',
      items: [
        { title: 'AI Product Discovery', desc: 'Problem definition, AI PRDs, roadmap & prioritization' },
        { title: 'Solution Architecture', desc: 'Requirements, system design, APIs/webhooks, OpenAPI' },
        { title: 'Agentic Workflows', desc: 'LLM agents, tool use, HITL handoff, voice + messaging' },
        { title: 'LLMOps Foundations', desc: 'Eval loops, monitoring/telemetry, cost/latency trade-offs' },
        { title: 'Forward-Deployed Delivery', desc: 'Stakeholder workshops, workflow mapping, rapid prototyping' },
        { title: 'Reliability & Ops', desc: 'Monitoring, event logs, error handling, retries, SOPs' },
      ]
    },
    techStack: {
      title: 'Tech Stack',
      categories: [
        { name: 'AI/LLM', items: ['OpenAI (custom GPTs, tool use via OpenAPI)', 'ElevenLabs', 'Claude'] },
        { name: 'Automation', items: ['Airtable (Builder/Admin)', 'n8n', 'Make', 'Zapier'] },
        { name: 'Integrations', items: ['Aircall', 'WATI (WhatsApp)', 'YouCanBookMe', 'DataForSEO'] },
        { name: 'Dev', items: ['Python', 'FastAPI', 'SQL', 'Node.js/JavaScript', 'Astro', 'GraphQL', 'Git'] },
        { name: 'Infra', items: ['Vercel'] },
      ]
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
          link: 'contentdigest.santifer.io'
        },
        {
          title: 'Claude Pulse',
          badge: 'Open Source',
          badgeBuilding: '',
          desc: 'SwiftBar plugin for real-time Claude Code usage monitoring on macOS. Consumption metrics, rate limit predictions, and context-aware tips.',
          tech: ['Bash', 'SwiftBar', 'Anthropic API', 'jq'],
          link: 'github.com/santifer-dev/claude-pulse'
        },
        {
          title: 'Claudeable',
          badge: 'Open Source',
          badgeBuilding: '',
          desc: 'Claude Code meta-project for professional web development. Custom skills, templates and pre-configured MCPs to build Lovable-quality websites.',
          tech: ['Claude Code', 'React', 'Tailwind', 'shadcn/ui', 'MCP'],
          link: 'github.com/santifer-dev/claudeable'
        },
        {
          title: 'Watermark Remover',
          badge: 'Open Source',
          badgeBuilding: '',
          desc: 'Python CLI to remove watermarks from images using AI. Automatic detection with YOLO and LaMa inpainting for realistic reconstruction.',
          tech: ['Python', 'YOLO', 'LaMa', 'OpenCV'],
          link: 'github.com/santifer-dev/watermark-remover'
        },
        {
          title: 'santifer.io',
          badge: 'This Portfolio',
          badgeBuilding: '',
          desc: 'Interactive CV with integrated AI chat. The "Santi" chatbot answers questions about my experience and skills. Real-time streaming, prompt caching, i18n ES/EN, dark mode.',
          tech: ['React 19', 'TypeScript', 'Claude API', 'Prompt Caching', 'Vercel Edge'],
          link: 'github.com/santifer-dev/cv-santiago'
        }
      ]
    },
    claudeCode: {
      title: 'Claude Code Power User',
      badge: 'High-Agency · AI-Fluency',
      desc: 'Advanced Claude Code user as primary development tool. I build complete projects through conversation, from system plugins to web apps. High-agency mindset: I know what to build and how to direct AI to achieve it.'
    },
    experience: {
      title: 'Work Experience',
      santifer: {
        role: 'Founder & Product Lead (AI Automation)',
        period: '2009 - 2025 · Retail / Services B2B-B2C',
        exit: 'Exit 2025',
        exitDesc: 'Built, scaled and sold the business as a going concern',
        highlights: [
          'Mobile, tablet and smartwatch repairs — +30,000 repairs completed',
          'Owned end-to-end transformation across service operations',
          'Productionized workflows with validation checks, error handling, retries',
          'Documented SOPs and trained staff for adoption',
          'Closed the Problem → Solution → Self-service loop for ~90% of customers',
          'Direct front-of-house experience (2009-2015) and hands-on repairs (2009-2019)',
          'Philosophy: automate everything possible—for the customer and for internal processes—to maximize value delivered'
        ],
        jacobo: {
          title: 'Omnichannel AI Agent "Jacobo"',
          badge: '~90% self-service',
          desc: 'Voice (ElevenLabs) + WhatsApp (n8n/WATI) + Aircall cloud PBX. Sub-agent orchestration via tool calling.',
          items: [
            'Main router: classifies intent and delegates to sub-agents',
            'Appointments sub-agent: checks slots, books, confirms via WhatsApp',
            'Discounts sub-agent: calculates promos based on customer history',
            'Orders sub-agent: validates stock, creates order, notifies ETA',
            'HITL handoff: escalates to human with full context'
          ],
          soldWith: 'Playbook available on request'
        },
        webSeo: {
          title: 'Programmatic Web + Automated SEO',
          badge: 'Only one in sector in Spain',
          desc: '100% custom-made (2023). Headless CMS in Airtable as source of truth, integrated with ERP, generating Astro website with programmatic SEO.',
          items: [
            'Pages per model/repair auto-generated',
            'Before/after photos + internal/external reviews from ERP',
            'Search volume via DataForSEO by taxonomy',
            'Automated decision: indexable (SEO) vs UX-only',
            'Crawl budget optimization'
          ],
          codeAvailable: 'Source code available on request'
        },
        erp: { title: 'Internal ERP', desc: 'Orders, inventory, work orders + automatic min-stock purchase orders', metric: '20+ h/mo' },
        gpts: { title: 'Custom GPTs', desc: 'Stock, location & pricing via OpenAPI (voice/natural language)', metric: '10+ h/mo' },
        reservas: { title: 'Bookings', desc: 'YouCanBookMe + custom webhook + WhatsApp notifications', metric: '90% auto' },
        crm: { title: 'CRM + Social Content', desc: 'Lead scoring, automated messages, gamification (Bronze→Platinum)', metric: '60+ h/mo' }
      },
      lico: {
        role: 'Airtable & E-commerce Operations Consultant',
        period: '2024 - 2025 · D2C Cosmetics · Shopify',
        desc: 'Designed Airtable as internal Operating System: inventory, orders, and tasks. Co-design workshops with operations. Airtable ↔ Shopify integration analysis.'
      },
      everis: {
        role: 'Test Coordinator (8 testers) & Software Analyst',
        period: '2007 - 2009 · Consulting',
        tesauro: {
          title: 'Self-learning Medical Coding Thesaurus',
          desc: 'Graph-based RL engine with automatic feedback loops. Liaison between dev, consulting, and project areas. Pioneer system pre-LLMs.'
        }
      }
    },
    speaking: {
      title: 'Speaking',
      slides: 'Slides',
      items: [
        { year: '2025', event: 'Marily Nika AI PM Bootcamp', eventUrl: 'https://maven.com/marily-nika/ai-pm-bootcamp', title: 'No-Code: The AI PM\'s Secret Weapon', desc: '1h community session on no-code (Zapier, Make, n8n, Airtable) as an AI PM superpower to validate and deliver faster.', pdf: '/slides/No-Code-The-AI-PMs-Secret-Weapon.pdf' },
        { year: '2025', event: 'Local entrepreneurs · Seville', eventUrl: '', title: 'Hiperautomatiza tu Pyme', desc: 'Workshop on hyperautomation for SMEs: orchestration, RPA, AI and governance. Case study: Santifer iRepair.', pdf: '/slides/Hiperautomatiza tu Pyme (SFVA).pdf' },
      ]
    },
    education: {
      title: 'Education',
      items: [
        { year: '2025', org: 'Maven', title: 'AI Product Management Bootcamp', desc: 'Led by Marily Nika (ex-Google PM). AI PRDs, agent design.', projectLink: 'contentdigest.santifer.io', projectLabel: 'Winning project' },
        { year: '2024', org: 'BIGSEO', title: 'Master in Artificial Intelligence', desc: 'Generative AI applied to business' },
        { year: '2023', org: 'BIGSEO', title: 'Master in SEO', desc: 'Technical SEO, content and analytics' },
        { year: '2001 - 2009', org: 'ETSI', title: 'Telecommunications Engineering', desc: 'Telematics specialization' },
      ]
    },
    certifications: {
      title: 'Certifications',
      items: [
        { year: '2026', title: 'Introduction to Model Context Protocol', org: 'Anthropic', logo: 'anthropic', url: 'https://verify.skilljar.com/c/4pxam3irsioq' },
        { year: '2026', title: 'Claude Code in Action', org: 'Anthropic', logo: 'anthropic', url: 'https://verify.skilljar.com/c/eijx7hwc2x89' },
        { year: '2025', title: 'AI App Builder Certification', org: 'Airtable', logo: 'airtable', url: 'https://verify.skilljar.com/c/gwg7ak9qgf7r' },
        { year: '2024', title: 'Airtable Builder Certification', org: 'Airtable', logo: 'airtable', url: 'https://verify.skilljar.com/c/id2e4zgqtasv' },
        { year: '2024', title: 'Airtable Admin Certification', org: 'Airtable', logo: 'airtable', url: 'https://verify.skilljar.com/c/u3r8kgn5wdit' },
        { year: '2024', title: 'Make Advanced', org: 'Make Academy', logo: 'make', url: 'https://www.credly.com/badges/d27b8174-ef20-46bd-9d81-ee05e9c349e8' },
      ]
    },
    skills: {
      title: 'Skills',
      languages: 'Languages',
      spanish: 'Spanish',
      native: 'Native',
      english: 'English',
      professional: 'Professional fluency',
      technical: 'Technical Skills',
      soft: 'Soft Skills',
      softSkills: ['Communication', 'Leadership', 'Systems Thinking', 'E2E Ownership', 'Bias for Action', 'Influence w/o Authority', 'Dealing with Ambiguity']
    },
    cta: {
      title: "Let's talk?",
      desc: 'Looking for a senior remote role in EU/USA to lead process changes, improve team experience and efficiency, and deliver results with clear metrics.',
      contact: 'Contact'
    }
  }
} as const

export type Lang = 'es' | 'en'
