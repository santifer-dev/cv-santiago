export const jacoboContent = {
  es: {
    slug: 'agente-ia-jacobo',
    altSlug: 'ai-agent-jacobo',
    readingTime: '8 min de lectura',
    seo: {
      title: 'Jacobo: Agente IA de Atención al Cliente — 90% Autoservicio | santifer.io',
      description: 'Case study: cómo construí un agente IA omnicanal con n8n, Claude y Airtable que logra 90% de autoservicio en atención al cliente para reparación de móviles.',
    },
    nav: {
      breadcrumbHome: 'Inicio',
      breadcrumbCurrent: 'Agente IA Jacobo',
    },
    header: {
      kicker: 'Case Study — Santifer iRepair',
      h1: 'Jacobo: Agente IA de Atención al Cliente',
      subtitle: 'Cómo construí un agente IA omnicanal que logra ~90% de autoservicio para un negocio de reparación de móviles — con sub-agentes especializados, voz y WhatsApp.',
      date: '25 feb 2026',
    },
    intro: {
      hook: 'Un negocio de reparación de móviles recibe cientos de consultas al mes. La mayoría son las mismas preguntas: precios, disponibilidad, estado de reparación.',
      body: 'Antes de Jacobo, cada consulta requería intervención humana. No era sostenible. Necesitaba un sistema que resolviera el 80% de las consultas sin intervención, y que escalara el resto a un humano con todo el contexto necesario para responder en segundos.',
    },
    sections: {
      theProblem: {
        heading: 'El Problema',
        body: 'Con +30.000 reparaciones completadas y múltiples canales de atención (teléfono, WhatsApp, web), el cuello de botella era claro:',
        painPoints: [
          'El 80% de las consultas eran repetitivas: precios, citas, estado de reparación',
          'Cada consulta interrumpía al técnico que estaba reparando dispositivos',
          'Los tiempos de respuesta variaban según la carga del día',
          'La información estaba dispersa entre Airtable, el calendario y el inventario',
          'El horario de atención limitaba la disponibilidad a horas de tienda',
        ],
      },
      architecture: {
        heading: 'La Arquitectura',
        body: 'Jacobo no es un chatbot con un prompt largo. Es un sistema de sub-agentes especializados orquestados mediante tool calling. Cada sub-agente tiene su propia lógica, sus propias herramientas y su propio dominio de conocimiento.',
        agents: [
          {
            icon: '🧭',
            name: 'Router Principal',
            desc: 'Clasifica el intent del usuario y delega a sub-agentes especializados. Gestiona el contexto de la conversación.',
          },
          {
            icon: '📅',
            name: 'Sub-agente Citas',
            desc: 'Consulta slots disponibles en YouCanBookMe, reserva, y confirma vía WhatsApp automáticamente.',
          },
          {
            icon: '💰',
            name: 'Sub-agente Descuentos',
            desc: 'Calcula promociones basándose en el historial del cliente en Airtable. Aplica reglas de negocio complejas.',
          },
          {
            icon: '📦',
            name: 'Sub-agente Pedidos',
            desc: 'Valida stock en inventario, crea órdenes de reparación, y notifica el ETA estimado al cliente.',
          },
          {
            icon: '🙋',
            name: 'HITL Handoff',
            desc: 'Escala a humano cuando detecta frustración, solicitudes complejas, o consultas fuera de dominio — con contexto completo.',
          },
        ],
      },
      howItWorks: {
        heading: 'Cómo Funciona',
        body: 'Un ejemplo real de interacción. El cliente escribe por WhatsApp, Jacobo resuelve consultando múltiples sistemas en tiempo real:',
        flow: [
          { from: 'user', label: 'Cliente', message: 'Hola, ¿cuánto cuesta cambiar la pantalla de un iPhone 14 Pro?' },
          { from: 'agent', label: 'Jacobo → Sub-agente Pedidos', message: 'La pantalla del iPhone 14 Pro tiene un coste de 189€. Incluye la pieza original y 1 año de garantía. La reparación tarda entre 45-60 minutos. ¿Quieres reservar cita?' },
          { from: 'user', label: 'Cliente', message: 'Sí, ¿tenéis hueco mañana por la mañana?' },
          { from: 'agent', label: 'Jacobo → Sub-agente Citas', message: 'Tengo disponible mañana a las 10:00 y a las 11:30. ¿Cuál prefieres?' },
          { from: 'user', label: 'Cliente', message: '10:00 perfecto' },
          { from: 'agent', label: 'Jacobo → Confirmación', message: 'Reservado. Mañana a las 10:00 para cambio de pantalla iPhone 14 Pro (189€). Te envío confirmación por WhatsApp.' },
        ],
      },
      hitl: {
        heading: 'El Handoff Humano',
        body: 'No todo se puede automatizar, ni debería. Jacobo escala a un humano cuando: detecta frustración o insatisfacción, la consulta es compleja o fuera de dominio, el cliente pide explícitamente hablar con una persona, o hay un caso de garantía que requiere evaluación técnica. El handoff incluye un resumen completo: historial de la conversación, intent detectado, datos del cliente desde Airtable, y la razón de la escalación.',
        punchline: 'El humano no arranca de cero. Arranca con todo el contexto. El tiempo medio de resolución después del handoff baja de minutos a segundos.',
      },
      results: {
        heading: 'Resultados',
        body: 'Métricas de producción tras 6 meses operando:',
        metrics: [
          { value: '~90%', label: 'Autoservicio', detail: 'Consultas resueltas sin intervención humana' },
          { value: '24/7', label: 'Disponibilidad', detail: 'Sin limitación de horario de tienda' },
          { value: '<30s', label: 'Tiempo de respuesta', detail: 'Vs. minutos cuando dependía de una persona' },
          { value: '3', label: 'Canales', detail: 'Voz + WhatsApp + Web, experiencia unificada' },
        ],
      },
      stack: {
        heading: 'Stack y Herramientas',
        items: [
          { name: 'n8n', role: 'Orquestación de workflows y sub-agentes' },
          { name: 'Claude (Anthropic)', role: 'LLM para comprensión y generación' },
          { name: 'Airtable', role: 'CRM, inventario, historial de clientes' },
          { name: 'WATI', role: 'WhatsApp Business API' },
          { name: 'Aircall', role: 'Cloud PBX para canal de voz' },
          { name: 'ElevenLabs', role: 'Text-to-speech para respuestas de voz' },
          { name: 'YouCanBookMe', role: 'Gestión de citas y disponibilidad' },
        ],
      },
      lessons: {
        heading: 'Lecciones Aprendidas',
        items: [
          {
            title: 'Sub-agentes > un prompt enorme.',
            detail: 'Separar la lógica por dominio (citas, precios, pedidos) hace que cada pieza sea testeable, iterable e independiente. Un cambio en la lógica de descuentos no rompe las citas.',
          },
          {
            title: 'HITL no es un fallback — es una feature.',
            detail: 'El handoff humano bien hecho genera más confianza que un bot que intenta resolver todo. Los clientes valoran que el sistema sepa cuándo necesitan a una persona.',
          },
          {
            title: 'El CRM es el cerebro del agente.',
            detail: 'Jacobo no es inteligente por el LLM. Es inteligente porque tiene acceso al historial completo del cliente en Airtable. Sin esos datos, es un chatbot genérico.',
          },
          {
            title: 'Empieza por el canal con más volumen.',
            detail: 'WhatsApp representaba el 70% de las consultas. Empezar ahí maximizó el impacto antes de expandir a voz y web.',
          },
        ],
      },
    },
    cta: {
      heading: '¿Te interesa la arquitectura?',
      body: 'Puedo compartir el playbook completo de Jacobo: arquitectura de sub-agentes, prompts, lógica de handoff, y las decisiones que tomé para llegar a producción.',
      label: 'Hablemos',
    },
    faq: {
      heading: 'Preguntas Frecuentes',
      items: [
        {
          q: '¿Cuánto costó construir Jacobo?',
          a: 'El coste principal es el tiempo de desarrollo. Las herramientas (n8n cloud, WATI, Aircall) cuestan en total menos de 200€/mes. El LLM (Claude) varía según volumen, pero para un negocio de este tamaño es una fracción del coste de un empleado a tiempo parcial dedicado a atención al cliente.',
        },
        {
          q: '¿Qué pasa si la IA se equivoca con un precio?',
          a: 'Los precios no vienen del LLM — vienen de Airtable. Jacobo consulta el inventario en tiempo real. Si el precio cambia en Airtable, Jacobo da el precio correcto automáticamente. No hay alucinación posible en datos estructurados.',
        },
        {
          q: '¿Por qué sub-agentes y no un solo prompt grande?',
          a: 'Un prompt monolítico con toda la lógica de citas, precios, pedidos y escalación se vuelve inmanejable. Los sub-agentes permiten iterar cada dominio de forma independiente, añadir tests por pieza, y escalar sin romper funcionalidad existente.',
        },
        {
          q: '¿Se puede adaptar a otro sector?',
          a: 'La arquitectura es genérica: router + sub-agentes especializados + HITL. Lo que cambia es el contenido de cada sub-agente y las integraciones. Si tienes un negocio con consultas repetitivas y datos en un CRM, el patrón aplica directamente.',
        },
        {
          q: '¿Qué tasa de escalación tiene?',
          a: 'Aproximadamente el 10% de las consultas se escalan a un humano. La mayoría son casos de garantía que requieren evaluación técnica visual, o clientes que piden explícitamente hablar con una persona.',
        },
      ],
    },
    resources: {
      heading: 'Recursos',
      items: [
        { label: 'n8n — Workflow Automation', url: 'https://n8n.io' },
        { label: 'Anthropic Claude API', url: 'https://docs.anthropic.com' },
        { label: 'WATI — WhatsApp Business API', url: 'https://www.wati.io' },
        { label: 'ElevenLabs — Text to Speech', url: 'https://elevenlabs.io' },
      ],
    },
    footer: {
      role: 'AI Product Manager · Solutions Architect',
      copyright: 'Todos los derechos reservados.',
    },
  },
  en: {
    slug: 'ai-agent-jacobo',
    altSlug: 'agente-ia-jacobo',
    readingTime: '8 min read',
    seo: {
      title: 'Jacobo: AI Customer Service Agent — 90% Self-Service Rate | santifer.io',
      description: 'Case study: how I built an omnichannel AI agent with n8n, Claude and Airtable that achieves 90% self-service rate for a phone repair business.',
    },
    nav: {
      breadcrumbHome: 'Home',
      breadcrumbCurrent: 'AI Agent Jacobo',
    },
    header: {
      kicker: 'Case Study — Santifer iRepair',
      h1: 'Jacobo: AI Customer Service Agent',
      subtitle: 'How I built an omnichannel AI agent achieving ~90% self-service rate for a phone repair business — with specialized sub-agents, voice, and WhatsApp.',
      date: 'Feb 25, 2026',
    },
    intro: {
      hook: 'A phone repair business gets hundreds of inquiries per month. Most are the same questions: prices, availability, repair status.',
      body: 'Before Jacobo, every inquiry required human intervention. It wasn\'t sustainable. I needed a system that could resolve 80% of inquiries without intervention, and escalate the rest to a human with all the context needed to respond in seconds.',
    },
    sections: {
      theProblem: {
        heading: 'The Problem',
        body: 'With 30,000+ repairs completed and multiple support channels (phone, WhatsApp, web), the bottleneck was clear:',
        painPoints: [
          '80% of inquiries were repetitive: prices, appointments, repair status',
          'Every inquiry interrupted the technician actively repairing devices',
          'Response times varied depending on daily workload',
          'Information was scattered across Airtable, the calendar, and inventory',
          'Business hours limited availability to store opening times',
        ],
      },
      architecture: {
        heading: 'The Architecture',
        body: 'Jacobo is not a chatbot with a long prompt. It\'s a system of specialized sub-agents orchestrated via tool calling. Each sub-agent has its own logic, its own tools, and its own knowledge domain.',
        agents: [
          {
            icon: '🧭',
            name: 'Main Router',
            desc: 'Classifies user intent and delegates to specialized sub-agents. Manages conversation context.',
          },
          {
            icon: '📅',
            name: 'Appointments Sub-agent',
            desc: 'Checks available slots in YouCanBookMe, books appointments, and confirms via WhatsApp automatically.',
          },
          {
            icon: '💰',
            name: 'Discounts Sub-agent',
            desc: 'Calculates promotions based on customer history in Airtable. Applies complex business rules.',
          },
          {
            icon: '📦',
            name: 'Orders Sub-agent',
            desc: 'Validates inventory stock, creates repair orders, and notifies the customer with estimated ETA.',
          },
          {
            icon: '🙋',
            name: 'HITL Handoff',
            desc: 'Escalates to a human when it detects frustration, complex requests, or out-of-domain queries — with full context.',
          },
        ],
      },
      howItWorks: {
        heading: 'How It Works',
        body: 'A real interaction example. The customer writes on WhatsApp, Jacobo resolves by querying multiple systems in real time:',
        flow: [
          { from: 'user', label: 'Customer', message: 'Hi, how much does it cost to replace an iPhone 14 Pro screen?' },
          { from: 'agent', label: 'Jacobo → Orders Sub-agent', message: 'The iPhone 14 Pro screen replacement costs €189. Includes original part and 1-year warranty. Repair takes 45-60 minutes. Want to book an appointment?' },
          { from: 'user', label: 'Customer', message: 'Yes, do you have a slot tomorrow morning?' },
          { from: 'agent', label: 'Jacobo → Appointments Sub-agent', message: 'I have tomorrow at 10:00 and 11:30 available. Which do you prefer?' },
          { from: 'user', label: 'Customer', message: '10:00 works' },
          { from: 'agent', label: 'Jacobo → Confirmation', message: 'Booked. Tomorrow at 10:00 for iPhone 14 Pro screen replacement (€189). Sending confirmation via WhatsApp.' },
        ],
      },
      hitl: {
        heading: 'The HITL Handoff',
        body: 'Not everything can or should be automated. Jacobo escalates to a human when: it detects frustration or dissatisfaction, the query is complex or out of domain, the customer explicitly asks to speak with a person, or there\'s a warranty case requiring technical evaluation. The handoff includes a complete summary: conversation history, detected intent, customer data from Airtable, and the reason for escalation.',
        punchline: 'The human doesn\'t start from zero. They start with full context. Average resolution time after handoff drops from minutes to seconds.',
      },
      results: {
        heading: 'Results',
        body: 'Production metrics after 6 months in operation:',
        metrics: [
          { value: '~90%', label: 'Self-service', detail: 'Inquiries resolved without human intervention' },
          { value: '24/7', label: 'Availability', detail: 'No longer limited to store hours' },
          { value: '<30s', label: 'Response time', detail: 'Vs. minutes when it depended on a person' },
          { value: '3', label: 'Channels', detail: 'Voice + WhatsApp + Web, unified experience' },
        ],
      },
      stack: {
        heading: 'Stack & Tools',
        items: [
          { name: 'n8n', role: 'Workflow orchestration and sub-agents' },
          { name: 'Claude (Anthropic)', role: 'LLM for understanding and generation' },
          { name: 'Airtable', role: 'CRM, inventory, customer history' },
          { name: 'WATI', role: 'WhatsApp Business API' },
          { name: 'Aircall', role: 'Cloud PBX for voice channel' },
          { name: 'ElevenLabs', role: 'Text-to-speech for voice responses' },
          { name: 'YouCanBookMe', role: 'Appointment scheduling and availability' },
        ],
      },
      lessons: {
        heading: 'Lessons Learned',
        items: [
          {
            title: 'Sub-agents > one giant prompt.',
            detail: 'Separating logic by domain (appointments, pricing, orders) makes each piece testable, iterable, and independent. A change in discount logic doesn\'t break appointments.',
          },
          {
            title: 'HITL isn\'t a fallback — it\'s a feature.',
            detail: 'A well-implemented human handoff generates more trust than a bot that tries to handle everything. Customers value a system that knows when they need a person.',
          },
          {
            title: 'The CRM is the agent\'s brain.',
            detail: 'Jacobo isn\'t smart because of the LLM. It\'s smart because it has access to the customer\'s complete history in Airtable. Without that data, it\'s just a generic chatbot.',
          },
          {
            title: 'Start with the highest-volume channel.',
            detail: 'WhatsApp accounted for 70% of inquiries. Starting there maximized impact before expanding to voice and web.',
          },
        ],
      },
    },
    cta: {
      heading: 'Want the architecture playbook?',
      body: 'I can share Jacobo\'s full playbook: sub-agent architecture, prompts, handoff logic, and the decisions I made to get to production.',
      label: 'Get in touch',
    },
    faq: {
      heading: 'FAQ',
      items: [
        {
          q: 'How much did it cost to build Jacobo?',
          a: 'The main cost is development time. The tools (n8n cloud, WATI, Aircall) cost less than €200/month total. The LLM (Claude) varies by volume, but for a business this size it\'s a fraction of the cost of a part-time customer service employee.',
        },
        {
          q: 'What happens if the AI gets a price wrong?',
          a: 'Prices don\'t come from the LLM — they come from Airtable. Jacobo queries inventory in real time. If a price changes in Airtable, Jacobo gives the correct price automatically. No hallucination possible on structured data.',
        },
        {
          q: 'Why sub-agents instead of one big prompt?',
          a: 'A monolithic prompt with all the logic for appointments, pricing, orders, and escalation becomes unmanageable. Sub-agents let you iterate each domain independently, add tests per piece, and scale without breaking existing functionality.',
        },
        {
          q: 'Can this be adapted to another industry?',
          a: 'The architecture is generic: router + specialized sub-agents + HITL. What changes is the content of each sub-agent and the integrations. If you have a business with repetitive inquiries and data in a CRM, the pattern applies directly.',
        },
        {
          q: 'What\'s the escalation rate?',
          a: 'About 10% of inquiries get escalated to a human. Most are warranty cases requiring visual technical evaluation, or customers who explicitly ask to speak with a person.',
        },
      ],
    },
    resources: {
      heading: 'Resources',
      items: [
        { label: 'n8n — Workflow Automation', url: 'https://n8n.io' },
        { label: 'Anthropic Claude API', url: 'https://docs.anthropic.com' },
        { label: 'WATI — WhatsApp Business API', url: 'https://www.wati.io' },
        { label: 'ElevenLabs — Text to Speech', url: 'https://elevenlabs.io' },
      ],
    },
    footer: {
      role: 'AI Product Manager · Solutions Architect',
      copyright: 'All rights reserved.',
    },
  },
} as const
