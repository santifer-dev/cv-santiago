export const jacoboContent = {
    es: {
      slug: 'agente-ia-jacobo',
      altSlug: 'ai-agent-jacobo',
      readingTime: '35 min de lectura',
      seo: {
        title: 'Jacobo: Agente IA Multi-Agente con Tool Calling y Voice AI · Case Study de Producción | santifer.io',
        description: 'Case study: cómo un FDE construyó un agente IA omnicanal con sub-agentes, tool calling, HITL y Voice AI (n8n + ElevenLabs) que logra 90% de autoservicio. Workflows descargables.',
      },
      nav: {
        breadcrumbHome: 'Inicio',
        breadcrumbCurrent: 'Agente IA Jacobo',
      },
      header: {
        kicker: 'Case Study: Santifer iRepair (búscalo en Google, sigue operando hoy)',
        h1: 'Jacobo: Agente IA Omnicanal con Sub-agentes y Tool Calling',
        subtitle: 'Cómo construí un agente IA que atiende por WhatsApp y teléfono fijo, orquesta sub-agentes especializados vía webhooks y logra ~90% de autoservicio en un negocio de reparación de móviles.',
        badge: 'Sistema vendido con el negocio en 2025. Sigue en producción hoy',
        date: '25 feb 2026',
      },
      heroMetrics: [
        {
          value: '~90%',
          label: 'Autoservicio',
        },
        {
          value: '~80h/mes',
          label: 'Automatizadas',
        },
        {
          value: '<30s',
          label: 'Respuesta',
        },
        {
          value: '<200€',
          label: 'Coste/mes',
        },
        {
          value: '24/7',
          label: 'Disponible',
        },
      ],
      tldr: 'Un sistema multi-agente de IA que resuelve ~90% de las consultas sin intervención humana, 24/7, por <200€/mes. 4 agentes + 3 tools, dual-channel (WhatsApp + teléfono fijo). Construido en <1 mes sobre un Business OS de 5 años. Vendido con el negocio en 2025. Los 7 workflows de n8n son descargables al final.',
      intro: {
        hook: '~15 interrupciones al día. Cada una, una reparación parada. Cada WhatsApp sin responder, un cliente que se iba a la competencia. Construí un agente IA que gestiona ambos canales: ~90% de las interacciones, 24/7, por menos de 200€/mes.',
        body: 'No un chatbot con respuestas enlatadas. Un agente que consulta precios reales, verifica stock, gestiona citas y sabe cuándo escalar a un humano con todo el contexto. Así nació Jacobo. En este artículo comparto la arquitectura completa y los workflows de producción para que puedas replicarlo.',
      },
      internalLinks: {
        businessOs: {
          text: 'Business OS | Case Study',
          href: '/business-os-para-airtable',
        },
        pseo: {
          text: 'SEO Programático | Case Study',
          href: '/seo-programatico',
        },
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
            'Un empleado a tiempo parcial dedicado a atención al cliente costaba más de lo que el negocio podía justificar',
            'Los clientes llegaban por dos canales principales (WhatsApp y teléfono fijo) y la solución tenía que cubrir ambos con la misma lógica, no duplicar el trabajo',
          ],
          alternatives: {
            body: 'Sabía tres cosas desde el principio: Airtable era el cerebro (el Business OS ya llevaba años como SSOT), necesitaba tool calling real contra esos datos, y el agente tenía que ser multimodal (voz + chat) compartiendo los mismos recursos. La pregunta era qué herramienta de orquestación usar:',
            items: [
              {
                tool: 'Tidio / Intercom',
                issue: 'Chatbots generalistas con árboles de decisión. No pueden consultar stock en tiempo real ni calcular precios dinámicos contra Airtable. Para un negocio de reparaciones, son poco más que un FAQ interactivo.',
              },
              {
                tool: 'ManyChat (WhatsApp)',
                issue: 'Bueno para flujos de marketing, pero sin capacidad de tool calling contra un ERP existente. No puede verificar stock, crear órdenes de trabajo ni hacer handoff con contexto.',
              },
              {
                tool: 'Solución vertical (RepairDesk chat)',
                issue: 'Ningún SaaS de reparaciones ofrecía un agente conversacional con lenguaje natural y tool calling contra datos en tiempo real. Los que tenían chat eran básicamente formularios disfrazados.',
              },
            ],
            punchline: 'n8n era la elección natural: orquestación de workflows con webhooks, soporte nativo para agentes con LLMs y tool calling, y la capacidad de que cada sub-agente fuera un workflow independiente testeable. Todo conectado al Business OS que ya existía en Airtable.',
          },
        },
        architecture: {
          heading: 'La Arquitectura',
          body: 'Jacobo no es un chatbot con un prompt largo. Es un sistema de sub-agentes especializados, cada uno desplegado como un webhook independiente en n8n, orquestados mediante tool calling desde un router central. Cada workflow que ves en este artículo es descargable: podrás importarlo directamente en n8n.',
          whySubAgents: {
            heading: '¿Por qué sub-agentes en vez de un prompt monolítico?',
            reasons: [
              {
                title: 'Testabilidad',
                detail: 'Cada sub-agente tiene su propio webhook. Puedo probarlo de forma aislada con una llamada HTTP, sin montar el sistema completo.',
              },
              {
                title: 'Evolución independiente',
                detail: 'Un cambio en la lógica de descuentos no toca las citas. Puedo iterar un dominio sin riesgo de romper otro.',
              },
              {
                title: 'Cost efficiency',
                detail: 'No todos los sub-agentes necesitan el mismo modelo. Citas usa MiniMax M2.5 (rápido y barato para parsear preferencias temporales). Presupuestos usa GPT-4.1 mini (precisión en structured output). Cada sub-agente con el modelo justo para su tarea.',
              },
              {
                title: 'Platform-agnostic',
                detail: 'Los sub-agentes son webhooks. No saben si los llama n8n (WhatsApp) o ElevenLabs (voz). Reutilizables por cualquier orquestador sin duplicar lógica.',
              },
            ],
          },
          agentsHeading: '4 Agentes y 3 Tools Para Gobernarlos a Todos',
          agentsBody: '4 agentes con LLM propio toman decisiones. 3 tools sin LLM ejecutan lógica de negocio pura. Todo conectado por webhooks.',
          toolsLabel: 'Tools (sin LLM)',
          agents: [
            {
              kind: 'agent',
              icon: '🧭',
              name: 'Router Principal (n8n)',
              desc: 'El cerebro del canal WhatsApp. Clasifica el intent, elige el sub-agente correcto y mantiene el contexto con una ventana de memoria de 20 mensajes.',
              details: [
                'GPT-4.1 vía OpenRouter · 37 nodos',
                'Patrón LangChain Agent con 7 tools como endpoints HTTP',
                'Think tool para razonar antes de cadenas complejas',
                'Pseudo-streaming: parte la respuesta en frases y las envía una a una por WhatsApp',
              ],
            },
            {
              kind: 'agent',
              icon: '🎙️',
              name: 'Voice Router (ElevenLabs)',
              desc: 'El cerebro del canal de voz. Recibe llamadas vía Aircall → Twilio → ElevenLabs Conversational AI, con su propio system prompt optimizado para conversación hablada.',
              details: [
                'ElevenLabs Conversational AI · GPT-4o',
                'Mismos sub-agentes que el Router Principal, conectados como tools HTTP',
                'RAG nativo out-of-the-box: knowledge base con catálogo de reparaciones, precios y FAQs',
                'Latencia optimizada para voz: respuestas cortas y directas',
                'Detección de horario comercial para transferir a humano fuera de horas',
              ],
            },
            {
              kind: 'agent',
              icon: '📅',
              name: 'Sub-agente Citas',
              desc: 'Convierte "mañana por la mañana" en una cita confirmada. Parsea preferencias temporales en lenguaje natural, consulta YouCanBookMe y envía template de confirmación por WhatsApp.',
              details: [
                'MiniMax M2.5 vía OpenRouter · 18 nodos',
                '15 reglas de parseo temporal: desde "después de comer" hasta "cualquier día menos lunes"',
                'El sub-agente más sofisticado del sistema',
              ],
            },
            {
              kind: 'agent',
              icon: '💰',
              name: 'Sub-agente Presupuestos',
              desc: 'Toda consulta de precio pasa por aquí. Busca modelo y reparación exactos en Airtable, devuelve precio real con estado de stock y decide el siguiente paso.',
              details: [
                'GPT-4.1 mini vía OpenRouter · 11 nodos',
                '¿Hay stock? → ofrece cita',
                '¿Sin stock? → ofrece pedido',
                '¿No existe? → enlace al formulario de presupuesto',
              ],
            },
            {
              kind: 'tool',
              icon: '📦',
              name: 'Pedidos',
              desc: 'Crea órdenes de reparación en Airtable cuando la pieza no tiene stock.',
              details: [
                '3 nodos: webhook → crear registro → responder',
                'Simple por diseño: toda la validación ocurrió en Presupuestos',
              ],
            },
            {
              kind: 'tool',
              icon: '🧮',
              name: 'Calculadora de Descuentos',
              desc: 'Lógica pura de negocio, sin LLM. Calcula descuentos combo cuando el cliente agrupa varias reparaciones.',
              details: [
                '3 nodos · sin LLM',
                'Batería + pantalla + cristal trasero = precio multi-reparación automático',
                'Las reglas de descuento viven aquí, no repartidas entre prompts',
              ],
            },
            {
              kind: 'tool',
              icon: '🙋',
              name: 'HITL Handoff',
              desc: 'La válvula de escape. Escala a humano vía Slack con deep-link directo a la conversación en WATI.',
              details: [
                '5 nodos · publica en #chat',
                'Incluye resumen de conversación, intent detectado e historial del cliente',
                'El humano tiene contexto completo antes de abrir el chat',
              ],
            },
          ],
          memory: {
            heading: 'Memoria Conversacional',
            body: 'Jacobo no tiene estado propio entre mensajes. Cada vez que llega un mensaje nuevo, reconstruye el contexto leyendo el historial real de la conversación desde WATI:',
            steps: [
              {
                label: '¿Atendido?',
                detail: 'Un switch comprueba si ya existe sesión activa para este número. Si no, dispara la recarga de memoria.',
              },
              {
                label: 'Fetch de WATI',
                detail: 'Llamada HTTP a getMessages/{waId} con pageSize=80. Recupera los últimos 80 mensajes de la conversación completa: mensajes del cliente, respuestas de Jacobo, templates, broadcasts y mensajes de operadores humanos.',
              },
              {
                label: 'Parseo en 3 fases',
                detail: 'Tres nodos de código transforman los eventos WATI en pares {human, ai} compatibles con LangChain. Filtra broadcasts, templates de confirmación y eventos de sistema. Un flag __reloadFlag__ permite resetear la memoria manualmente.',
              },
              {
                label: 'Buffer Window',
                detail: 'Los últimos 20 mensajes se cargan en el LangChain BufferWindow, keyed por número de teléfono. El agente "recuerda" conversaciones previas: si ayer confirmaste una cita, hoy Jacobo lo sabe.',
              },
            ],
            punchline: 'Esto es lo que permite que Jacobo continúe conversaciones interrumpidas, reconozca clientes recurrentes y sepa que un humano intervino antes en esa conversación.',
          },
          debugTools: {
            heading: 'Herramientas de debug en producción',
            body: 'Dos comandos ocultos para depurar la memoria en producción sin tocar n8n. "Borrar memoria" reseteaba el buffer del cliente, útil cuando una conversación se corrompía o el LLM entraba en bucle. "HISTORIAL" volcaba el JSON crudo del buffer. Y eso fue lo que nos enseñó a sanitizar las respuestas: el LLM devolvía el JSON completo al cliente si no se filtraba.',
          },
          pseudoStreaming: {
            heading: 'Pseudo-Streaming en WhatsApp',
            body: 'WhatsApp no soporta streaming. Un párrafo largo se siente como un bot; mensajes secuenciales se sienten como una persona escribiendo. El router divide cada respuesta por saltos de línea y envía cada fragmento con 1 segundo de espera entre ellos vía la API de WATI. El resultado: la experiencia de "está escribiendo..." sin infraestructura de streaming.',
          },
          stackIntro: 'Jacobo se apoya en 8 servicios que cubren desde la entrada del cliente hasta el escalado humano. Cada uno tiene un rol único; ninguno es reemplazable sin cambiar la arquitectura.',
          stack: [
            {
              name: 'WATI',
              role: 'WhatsApp Business API: canal principal de entrada',
            },
            {
              name: 'Aircall',
              role: 'Cloud PBX: Jacobo como compañero en la centralita',
            },
            {
              name: 'n8n',
              role: 'Orquestación de workflows y sub-agentes (7 workflows, ~80 nodos)',
            },
            {
              name: 'OpenRouter',
              role: 'Gateway model-agnostic para LLMs (MiniMax M2.5 + GPT-4.1)',
            },
            {
              name: 'ElevenLabs',
              role: 'Agente de voz conversacional (eleven_flash_v2_5, temp 0.0)',
            },
            {
              name: 'Airtable',
              role: 'CRM, inventario, historial de clientes (source of truth)',
            },
            {
              name: 'YouCanBookMe',
              role: 'Gestión de citas y disponibilidad',
            },
            {
              name: 'Slack',
              role: 'Canal de escalado HITL (#chat)',
            },
          ],
        },
        e2eFlows: {
          heading: 'Flujos End-to-End',
          body: 'Cada flujo traza el happy path desde la consulta del cliente hasta la resolución. Los sub-agentes involucrados aparecen etiquetados en cada paso.',
          items: [
            {
              icon: '🔧',
              name: 'Cita de Reparación',
              trigger: 'Cliente pregunta por una reparación',
              summary: 'Desde la consulta hasta la cita confirmada con piezas reservadas, sin intervención humana.',
              agentsTouched: [
                'Router',
                'Presupuestos',
                'Citas',
              ],
              details: [
                'Cliente escribe por WhatsApp: "Hola, ¿cuánto cuesta cambiar la pantalla de un iPhone 14 Pro?"',
                'Router clasifica intent como consulta de precio → delega a sub-agente Presupuestos',
                'Presupuestos busca en Airtable: modelo + tipo de reparación → devuelve precio real (189€), disponibilidad de pieza y tiempo estimado (45-60 min)',
                'Stock disponible → Jacobo responde con precio y pregunta: "¿Quieres reservar cita?"',
                'Cliente dice "Sí, mañana por la mañana" → Router delega a sub-agente Citas',
                'Citas parsea la preferencia temporal, consulta YouCanBookMe → ofrece slots: "10:00 y 11:30"',
                'Cliente confirma → cita creada en YouCanBookMe + OT generada en Airtable + piezas auto-reservadas del inventario',
                'Confirmación enviada por WhatsApp con resumen: fecha, hora, precio, dirección de la tienda',
              ],
            },
            {
              icon: '💬',
              name: 'Consulta de Precios',
              trigger: 'Cliente pregunta precio de una reparación o producto',
              summary: 'Búsqueda en Airtable con datos reales, CTA adaptado según disponibilidad de stock.',
              agentsTouched: [
                'Router',
                'Presupuestos',
              ],
              details: [
                'Cliente: "¿Cuánto cuesta cambiar la batería de un Samsung S23?"',
                'Router clasifica intent → delega a Presupuestos',
                'GPT-4.1 busca en Airtable: modelo exacto + tipo de reparación',
                'Si hay stock → responde con precio, tiempo y ofrece reservar cita',
                'Si NO hay stock → responde con precio, indica que hay que pedir la pieza y ofrece hacer el pedido',
                'Si el modelo no existe en la base → Jacobo lo dice claramente en vez de inventar un precio',
                'Stock-aware routing: el CTA cambia según la disponibilidad real en Airtable',
              ],
            },
            {
              icon: '🙋',
              name: 'Escalado a Humano (HITL)',
              trigger: 'Intent no claro, garantía, queja o petición explícita',
              summary: 'Handoff con contexto completo al equipo humano vía Slack. El humano no arranca de cero.',
              agentsTouched: [
                'Router',
                'HITL Handoff',
              ],
              details: [
                'Triggers de escalado: frustración detectada, consulta fuera de dominio, caso de garantía, petición explícita de hablar con una persona',
                'Router activa HITL Handoff → envía notificación a Slack (#chat)',
                'El mensaje de Slack incluye: resumen de la conversación, intent detectado, datos del cliente desde Airtable, razón de la escalación',
                'Deep-link a WATI: el humano hace clic y salta directo a la conversación de WhatsApp del cliente',
                'El humano no arranca de cero: tiene todo el contexto. Tiempo medio de resolución post-handoff: segundos, no minutos',
                'Jacobo avisa al cliente: "Te paso con un compañero que puede ayudarte mejor con esto"',
              ],
            },
          ],
        },
        deepDiveBooking: {
          heading: 'Deep Dive: Reservar Cita en Lenguaje Natural',
          body: 'El sub-agente de citas es el workflow más sofisticado del sistema. Su trabajo: convertir "mañana por la mañana" en una cita confirmada con piezas reservadas, sin que el cliente toque un formulario.',
          challenge: {
            heading: 'El reto: cruzar dos mundos',
            body: 'El cliente habla en lenguaje natural ("el jueves a media mañana, o si no el viernes por la tarde"). La API de YouCanBookMe habla en timestamps Unix. El sub-agente tiene que traducir uno al otro y encontrar la intersección.',
          },
          parseUrl: {
            heading: 'ParseURL',
            body: 'Un nodo Code que extrae el subdomain de la URL de YouCanBookMe para determinar qué perfil de reservas usar. Parsea el query string para campos dinámicos del formulario (tipo de reparación, datos del cliente). Diferentes calendarios para diferentes servicios: santifer-citav2-componentes para reparaciones de componentes, santifer-citav2-diagnostico para diagnósticos. El subdomain determina el flujo completo que seguirá la reserva.',
          },
          analizarDisponibilidad: {
            heading: 'AnalizarDisponibilidad (LLM)',
            body: 'Un agente LLM con MiniMax M2.5 convierte lenguaje natural en un array JSON estructurado: [{date, start, end, exact}]. El system prompt contiene 15 reglas de parseo temporal que cubren todos los casos reales. Incluye un Structured Output Parser para garantizar formato válido y memoria por sesión (sessionKey = teléfono/ycbmUrl) para que el cliente pueda refinar preferencias sin empezar de cero. Si no hay preferencia explícita, devuelve los próximos 3 días laborables con horario completo.',
            rules: [
              'Rangos por defecto: "mañana" = 10:00-14:00, "tarde" = 17:00-21:00, "todo el día" = 10:00-21:00',
              'Plurales: "mañanas" → próximas 3 mañanas laborables',
              'Rangos explícitos: "de 10 a 12" → start=10:00, end=12:00, exact=true',
              'Condicionales: "o si no el viernes" → añade viernes como rango alternativo',
              'Redondeo: 10:15 → 10:00-11:00 (bloque de 1 hora)',
              'Filtra fines de semana automáticamente (L-V solamente)',
              '"Media mañana" = 11:00-13:00, "a primera hora" = 10:00-11:00',
              '"Después de comer" = 17:00-19:00',
              'Hoy solo se incluye si quedan ≥2 horas de horario comercial',
              'Fechas relativas: "pasado mañana", "el próximo martes" → resueltas a fecha absoluta',
            ],
          },
          ycbmApi: {
            heading: 'YCBM API (3 llamadas)',
            body: 'Pipeline secuencial de 3 HTTP Requests contra la API de YouCanBookMe. Cada llamada depende de la anterior; no se puede paralelizar:',
            steps: [
              { label: 'POST /v1/intents', detail: 'Envía el subdomain → crea un intent de reserva y devuelve un ID único' },
              { label: 'GET /v1/intents/{id}/availabilitykey', detail: 'Con el ID del intent → obtiene la clave de disponibilidad' },
              { label: 'GET /v1/availabilities/{key}', detail: 'Con la clave → obtiene todos los slots reales disponibles con timestamps Unix' },
            ],
          },
          filterSlots: {
            heading: 'FilterSlots: El Cruce',
            body: 'Un nodo Code puro que realiza la intersección de conjuntos: rangos del LLM × slots reales de YCBM. Convierte timestamps Unix a Europe/Madrid usando Intl.DateTimeFormat, luego filtra: localDate === r.date && localTime >= r.start && localTime < r.end. El output es un array [{date, timestamp, start}] que puede contener 0, 1, o N slots. Es el nodo más elegante del workflow: pura lógica de conjuntos, sin LLM, sin API. Solo matemáticas temporales.',
          },
          autoBooking: {
            heading: 'Auto-booking Condicional',
            body: 'Un nodo If evalúa slots.length y bifurca en 3 caminos. El sub-agente tiene su propia memoria por sesión: el cliente puede refinar ("no, mejor el jueves") sin empezar de cero.',
            paths: [
              { condition: 'Exactamente 1 slot', action: 'Confirma automáticamente (zero friction): preparePatchBody construye form data con email, teléfono, queryVars dinámicos y comentarios → emailCheck verifica si tiene email → patchSelections (PATCH /v1/intents/{id}/selections) → patchConfirm (PATCH /v1/intents/{id}/confirm) → confirmarCita informa al cliente' },
              { condition: 'Varios slots', action: 'escogerHora agrupa slots por fecha y presenta opciones al cliente con instrucciones contextuales' },
              { condition: '0 slots', action: 'Informa que no hay disponibilidad en ese rango y pide otra preferencia horaria' },
            ],
          },
          punchline: 'El resultado: un cliente escribe "mañana a media mañana" y 3 segundos después tiene una cita confirmada con piezas reservadas. Sin formularios, sin "seleccione fecha en el calendario", sin fricción. Para un FDE, esto es la diferencia entre "hice un chatbot" y "diseñé un sistema que traduce intención humana a acciones de API".',
        },
        toolCalling: {
          heading: 'Tool Calling en Producción',
          body: 'Jacobo no genera respuestas desde su training data. Cada respuesta se construye consultando sistemas reales vía 7 tools definidos como HTTP endpoints:',
          tools: [
            {
              name: 'presupuestoModelo',
              desc: 'Busca precios y stock de reparaciones/accesorios en Airtable. LLM: GPT-4.1 para precisión en structured output.',
            },
            {
              name: 'subagenteCitas',
              desc: 'Gestiona disponibilidad y reservas vía YouCanBookMe. El LLM parsea preferencias temporales en lenguaje natural.',
            },
            {
              name: 'hacerPedido',
              desc: 'Crea órdenes de reparación/pedido en Airtable. 3 nodos: webhook → crear registro → responder.',
            },
            {
              name: 'Calculadora',
              desc: 'Descuento por volumen: más reparaciones juntas = más descuento. Lógica pura de negocio, sin LLM.',
            },
            {
              name: 'contactarAgenteHumano',
              desc: 'Escalado HITL vía Slack con motivo de la escalación, deep-link a WATI y contexto completo. Funciona tanto desde WhatsApp como desde llamada telefónica.',
            },
            {
              name: 'enviarMensajeWati',
              desc: 'Envía información por WhatsApp en paralelo. Cuando el agente de voz necesitaba mandar un enlace o presupuesto, lo hacía por WhatsApp mientras seguía hablando por teléfono.',
            },
            {
              name: 'Think',
              desc: 'Meta-tool de razonamiento interno. El agente "piensa en voz alta" antes de cadenas multi-tool para reducir errores.',
            },
          ],
          waitMessage: {
            heading: 'mensajeConsulta: UX mientras piensa',
            body: 'Cuando Jacobo llama a presupuestoModelo (1-3 segundos de latencia), primero dispara mensajeConsulta: un "Estoy consultando disponibilidad..." que llega al cliente antes de que el sub-agente responda. Sin esto, el cliente veía 5 segundos de silencio y pensaba que el bot se había colgado. Un detalle de UX que marca la diferencia entre "chatbot roto" y "asistente que trabaja".',
          },
          thinkTool: {
            heading: 'El Tool "Think"',
            body: 'Antes de ejecutar una cadena de tools (consultar precio → verificar stock → ofrecer cita), el agente invoca Think para planificar la secuencia. Esto reduce errores en cadenas multi-tool porque el LLM explicita su razonamiento antes de actuar.',
          },
          stockAware: {
            heading: 'Stock-Aware Routing',
            body: 'El output de presupuestoModelo determina el siguiente paso. No es un flujo fijo: el CTA cambia según la disponibilidad real.',
            flows: [
              {
                condition: 'Pieza en stock',
                action: '→ Ofrece reservar cita de reparación',
              },
              {
                condition: 'Pieza sin stock',
                action: '→ Ofrece hacer pedido al proveedor con ETA',
              },
              {
                condition: 'Modelo no encontrado',
                action: '→ Lo dice claramente y ofrece contacto humano',
              },
            ],
          },
        },
        channels: {
          heading: 'Los Dos Canales',
          body: 'Jacobo opera en dos canales simultáneos. Lo importante: ambos comparten los mismos sub-agentes webhook. La lógica de negocio se escribe una vez.',
          whatsapp: {
            name: 'WhatsApp (mayor volumen)',
            detail: 'WATI como WhatsApp Business API + n8n como orquestador. El 70% de las consultas llegan por aquí.',
            highlights: [
              'Router n8n con patrón LangChain Agent: 37 nodos, 7 tools como endpoints HTTP, GPT-4.1 vía OpenRouter',
              'Templates de WhatsApp aprobados por Meta para confirmaciones de cita, seguimiento de pedidos y notificaciones',
              'Pseudo-streaming: parte la respuesta en frases y las envía una a una. El cliente ve a Jacobo "escribiendo" como una persona real',
              'Memory: 20 mensajes por sesión, keyed por número de teléfono. Reconstruye contexto leyendo el historial completo de WATI',
              'Event Routing: 3 switches filtran ruido (eventos de sistema, broadcasts, mensajes del operador humano) antes de llegar al agente',
              'Human Takeover transparente: cuando un humano toma control vía WATI, Jacobo detecta el cambio y no interrumpe',
            ],
          },
          voice: {
            name: 'Teléfono Fijo (voz)',
            detail: 'Aircall como Cloud PBX + Twilio como bridge telefónico + ElevenLabs como agente de voz conversacional. Jacobo es literalmente un "compañero más" en la centralita Aircall con sus propias reglas de routing.',
            highlights: [
              'Integración Aircall → Twilio → ElevenLabs: las llamadas entraban por la centralita Aircall del negocio. Cuando nadie atendía o fuera de horario, Aircall redirigía a un número Twilio dedicado que conectaba con el agente ElevenLabs. Para el cliente, era transparente: marcaba el fijo de la tienda y hablaba con Jacobo',
              'El cliente llamaba a un teléfono fijo y hablaba con Jacobo como con cualquier empleado. NO era un widget web ni un IVR con menús. Era una llamada telefónica real con voz natural',
              'ASR de alta calidad (provider: ElevenLabs, PCM 16kHz) + turn_timeout de 7s + silence_end_call de 20s para manejar pausas naturales en conversación',
              'LLM: GPT-4.1 (temp 0.0) para máxima precisión en tool calling por voz. Latencia optimizada (optimize_streaming_latency: 4)',
              'Voice model: eleven_flash_v2_5, velocidad 1.2x, stability 0.6, similarity 0.8. Conversaciones de hasta 5 minutos (300s)',
              'Knowledge base con 3 fuentes (Google Maps, web de Santifer iRepair, resumen del negocio) aprovechando el RAG nativo de ElevenLabs (e5_mistral_7b_instruct). No construí RAG custom: la plataforma lo ofrecía y suponía alto impacto con zero effort. Priorización RICE pura. En n8n no lo necesitaba: el agente de WhatsApp ya accedía al contexto de negocio vía tool calling directo a Airtable',
              '5 tools webhook compartidos con n8n: presupuestoModelo, subagenteCitas, Calculadora, contactarAgenteHumano y enviarMensajeWati. Timeout de 20s por tool, ejecución inmediata',
              'enviarMensajeWati era la magia cross-channel: mientras hablaba por teléfono, Jacobo enviaba enlaces y presupuestos por WhatsApp en paralelo usando el caller_id como variable dinámica. A los clientes les encantaba recibir la info en el móvil mientras seguían hablando',
            ],
          },
          cocaColaAnecdote: {
            heading: 'Incidente de producción: la Coca-Cola',
            body: 'Un cliente estaba hablando de una reparación de móvil. A mitad de conversación, se giró para pedir una Coca-Cola a un camarero. Jacobo escuchó. Y le dijo que no servimos Coca-Colas.',
            diagnosis: {
              heading: 'Diagnóstico: tres señales que el sistema ignoró',
              items: [
                { label: 'Volumen', detail: 'Cayó ~40%: se alejó del teléfono' },
                { label: 'Spectral tilt', detail: 'Cambió: voz off-axis pierde frecuencias altas' },
                { label: 'Relevancia semántica', detail: '"Coca-Cola" tenía cero relación con reparaciones de móviles' },
              ],
            },
            takeaway: 'VAD básico no es suficiente. Necesitas addressee detection: proximidad acústica + análisis prosódico + gating semántico trabajando juntos.',
          },
          missedCallRecovery: {
            heading: 'Recuperación de Llamadas Perdidas',
            body: 'Si el cliente colgaba o nadie atendía, Aircall enviaba un webhook a Make.com que disparaba un template de WhatsApp vía WATI con botones de acción. Una gran parte de los leads llegaban por aquí: gente que llamaba, no esperaba, y Jacobo los cazaba. Como se nutría del contexto de WATI, al contestar ya sabía que habían intentado llamar.',
          },
          dualOrchestrator: {
            heading: 'Arquitectura Dual-Orquestador',
            body: 'Este es el patrón clave: n8n orquesta WhatsApp, ElevenLabs orquesta voz, pero ambos llaman a los mismos sub-agentes webhook. Es un patrón de microservicios real aplicado a agentes IA. Los sub-agentes no saben quién los llama, y no necesitan saberlo.',
          },
          unifiedVoiceUx: {
            heading: 'UX Unificada: Una Sola Voz',
            body: 'Todos los audios de la centralita (bienvenida, menú IVR, buzón de voz) fueron generados con ElevenLabs usando la misma voz que Jacobo. Cuando el cliente pulsa 3 o nadie puede atender y salta el agente real, la voz es idéntica. No hay ruptura. Y si nadie atiende y Jacobo le escribe por WhatsApp tras la llamada perdida, la identidad sigue siendo la misma. Una experiencia unificada de principio a fin, da igual el canal.',
            punchline: '"Marca 3 para hablar conmigo, Jacobo." Esa es la voz de la centralita presentando al agente IA en primera persona. La misma voz que luego te atiende. Un agente que se anuncia a sí mismo.',
            audioIntro: 'Escucha la centralita real. La misma voz de Jacobo en bienvenida, IVR y agente en vivo:',
            audios: [
              {
                src: '/jacobo/pbx-welcome.mp3',
                label: 'Bienvenida',
                transcript: '"A continuación, atenderemos tu llamada. Gracias por llamar a Santifer iRepair. Para asegurar la calidad del servicio, tu llamada puede ser grabada."',
              },
              {
                src: '/jacobo/pbx-ivr.mp3',
                label: 'Menú IVR',
                transcript: '"Marca 1 para solicitar una nueva reparación. Marca 2 para consultar el estado de tu reparación. Marca 3 para hablar conmigo, Jacobo. Tu asistente virtual 24/7 en Santifer iRepair. Obtendrás presupuesto y cita al instante."',
                highlight: 'Marca 3 para hablar conmigo, Jacobo',
              },
            ],
          },
          eventRouting: {
            heading: 'Pre-filtrado: ¿Debe Jacobo Responder?',
            body: 'Antes de que el mensaje llegue al AI Agent, tres switches filtran el ruido y deciden quién debe responder:',
            steps: [
              {
                label: 'Tipo de Evento',
                detail: 'Filtra solo mensajes reales. Ignora eventos de sistema, confirmaciones de entrega, actualizaciones de estado y broadcasts masivos. Sin esto, Jacobo respondería a sus propios mensajes de confirmación.',
              },
              {
                label: '¿Quién?',
                detail: 'Detecta si el último en hablar fue el cliente o un operador humano. Cuando un humano toma control de la conversación vía el deep-link de WATI, sus mensajes llegan como owner: true. Jacobo lo sabe y no interrumpe.',
              },
              {
                label: '¿Atendido?',
                detail: 'Comprueba si ya existe sesión activa. Si el cliente responde a una conversación que estaba gestionando un humano, pero la tienda ya cerró, Jacobo entra con tono empático: "Hemos cerrado al mediodía, pero yo puedo ayudarte hasta que abramos por la tarde". Graceful degradation real.',
              },
            ],
            punchline: 'Este filtro de 3 nodos es lo que permite la convivencia humano-agente sin conflictos. El humano puede tomar el mando en cualquier momento, y cuando deja de estar disponible, Jacobo retoma con todo el contexto.',
          },
        },
        results: {
          heading: 'Resultados',
          body: 'Métricas de producción tras 6 meses operando (los workflows son descargables al final para verificar la arquitectura):',
          metrics: [
            {
              value: '~90%',
              label: 'Autoservicio',
              detail: 'Consultas resueltas sin intervención humana',
            },
            {
              value: '24/7',
              label: 'Disponibilidad',
              detail: 'Sin limitación de horario de tienda',
            },
            {
              value: '<30s',
              label: 'Tiempo de respuesta',
              detail: 'Vs. minutos cuando dependía de una persona',
            },
            {
              value: '<200€',
              label: 'Coste mensual',
              detail: 'Infraestructura total (n8n + WATI + Aircall + LLMs)',
            },
          ],
          beforeAfter: {
            heading: 'Antes vs Después',
            items: [
              {
                area: 'Consultas de precio/stock',
                before: '~15 interrupciones/día al técnico',
                after: 'Jacobo responde con datos reales de Airtable en <30s',
              },
              {
                area: 'Reserva de citas',
                before: 'Manual por teléfono, errores de horario frecuentes',
                after: 'Automático vía YouCanBookMe, piezas auto-reservadas',
              },
              {
                area: 'Fuera de horario',
                before: 'Consultas perdidas, clientes a la competencia',
                after: 'Jacobo atiende 24/7 por WhatsApp y teléfono fijo',
              },
              {
                area: 'Escalaciones a humano',
                before: 'El humano empezaba de cero, repitiendo preguntas',
                after: 'Handoff con contexto completo, resolución en segundos',
              },
              {
                area: 'Coste de atención al cliente',
                before: 'Empleado part-time ~800-1.000€/mes',
                after: '<200€/mes total infraestructura',
              },
            ],
          },
          roi: 'El ROI no es solo el ahorro directo. Es la disponibilidad 24/7, las citas que antes se perdían fuera de horario, y los técnicos que ahora reparan en vez de contestar preguntas.',
          benchmarks: 'Benchmark de industria: los contact centers enterprise promedian un 20-30% de resolución por IA. Los asistentes virtuales más avanzados alcanzan un 15%. Jacobo logró ~90% en un dominio especializado. La diferencia: sub-agentes con acceso a datos en tiempo real vs chatbots genéricos.',
          exitNarrative: 'Jacobo sigue operando 24/7 bajo nuevo dueño desde septiembre de 2025. El comprador lo adquirió funcionando. La mejor prueba de un sistema: funciona sin su creador. Los patrones de arquitectura documentados aquí son los mismos que llevaría a tu equipo.',
        },
        decisions: {
          heading: 'Decisiones Técnicas (ADRs)',
          body: 'Cada decisión técnica tiene un porqué. Estas son las más importantes:',
          items: [
            {
              title: 'Multi-model (GPT-4.1 + MiniMax + GPT-4.1 mini) vs single LLM',
              detail: 'Cada componente con el modelo justo: GPT-4.1 para el router principal y el agente de voz (tool calling preciso), GPT-4.1 mini para presupuestos (structured output), MiniMax M2.5 para citas (rápido y barato para parsear preferencias temporales). OpenRouter como gateway permite cambiar entre modelos sin reescribir workflows.',
            },
            {
              title: 'OpenRouter como gateway model-agnostic',
              detail: 'Cambiar entre modelos sin reescribir workflows, fallback automático si un modelo está caído. Evaluamos Claude, GPT-4, MiniMax: elegimos por caso de uso, no por marca.',
            },
            {
              title: 'n8n vs Make para orquestación',
              detail: 'Cada sub-agente es un workflow independiente con webhook propio. Make no permite esta modularidad. n8n permite LangChain agent patterns, memory management y tool calling nativo.',
            },
            {
              title: 'Sub-agentes como microservicios webhook',
              detail: 'Desacoplados, testeables individualmente, deployment independiente. El mismo sub-agente sirve a WhatsApp (vía n8n) y a teléfono (vía ElevenLabs) sin duplicar código.',
            },
            {
              title: 'Airtable como cerebro vs base de datos',
              detail: 'Ya existía el Business OS completo en Airtable (12 bases, 2.100+ campos). Single source of truth para stock, precios e historial de clientes. Construir sobre lo que ya existe, no duplicar.',
            },
            {
              title: 'Memory window: 20 mensajes por sesión',
              detail: 'Balance entre contexto y coste de tokens. Suficiente para una conversación de reparación (el 95% se resuelve en <10 mensajes). Keyed por número de teléfono para continuidad.',
            },
            {
              title: 'Think tool para razonamiento interno',
              detail: 'Razonamiento explícito antes de cadenas multi-tool. Reduce errores porque el LLM planifica la secuencia (consultar precio → verificar stock → ofrecer cita) antes de ejecutar.',
            },
            {
              title: 'HITL vía Slack con motivo de escalado',
              detail: 'El LLM genera el motivo de la escalación y lo incluye en el mensaje de Slack: por qué necesita intervención humana, qué ha intentado y qué necesita el cliente. Funciona igual desde WhatsApp (deep-link a WATI) y desde llamada telefónica. El humano sabe por qué se le necesita antes de abrir la conversación.',
            },
            {
              title: 'WhatsApp primero, voz después',
              detail: 'El 70% del volumen llegaba por WhatsApp. Empezar ahí maximizó el impacto antes de expandir a voz. La voz (ElevenLabs + Aircall) reutilizó los sub-agentes existentes.',
            },
            {
              title: 'Dual-orquestador con sub-agentes compartidos',
              detail: 'n8n para WhatsApp/web, ElevenLabs para voz. Los sub-agentes son webhooks platform-agnostic. Reutilizables por cualquier orquestador sin duplicar lógica. Patrón de microservicios real.',
            },
            {
              title: 'ElevenLabs como "compañero" en Aircall',
              detail: 'Jacobo integrado en PBX con routing rules: entra por overflow o fuera de horario. El cliente llama a un teléfono fijo, experiencia transparente. eleven_flash_v2_5 con temp 0.0 para máxima consistencia.',
            },
            {
              title: 'Aircall → Twilio → ElevenLabs (y el trade-off de latencia)',
              detail: 'La cadena Aircall PBX → Twilio (bridge telefónico) → ElevenLabs funcionaba, pero cada hop añadía latencia: ~950-1.500ms mouth-to-ear. Twilio usa G.711 a 8kHz, cuando los modelos STT están optimizados para 16kHz, forzando resampling con pérdida de precisión. Hoy elegiría SIP trunk directo (Telnyx ofrece G.722 wideband a 16kHz nativo e infraestructura co-located con sub-200ms RTT) eliminando el hop intermedio. El diseño platform-agnostic de los sub-agentes facilitaría esta migración: solo cambiaría el transporte, no la lógica.',
            },
          ],
        },
        platformEvolution: {
          heading: 'Evolución de la Plataforma',
          tagline: 'Jacobo no fue una ocurrencia. Fue la consecuencia inevitable de 5 años construyendo un Business OS robusto debajo.',
          steps: [
            {
              year: '2019-2024',
              event: 'Business OS como base',
              detail: 'Cinco años construyendo un sistema operativo de negocio completo en Airtable: 12 bases, 2.100+ campos, inventario en tiempo real, CRM con historial de clientes. Sin esta base de datos limpia y accesible, un agente IA sería un chatbot genérico que inventa respuestas.',
            },
            {
              year: 'Ene 2025',
              event: 'Formación y diseño deliberado',
              detail: 'Antes de escribir una línea, me formé en arquitecturas de agentes IA. Sabía que necesitaba tool calling, que Airtable era el SSOT, y que el agente tenía que ser multimodal: voz y chat compartiendo los mismos recursos.',
            },
            {
              year: 'Feb 2025',
              event: 'Primera versión de prueba (monolítica)',
              detail: 'Probé el enfoque de un solo prompt con mucho contexto y confirmé lo que intuía: un prompt monolítico no escala con múltiples dominios. La prueba validó la decisión de sub-agentes como webhooks, platform-agnostic por diseño.',
            },
            {
              year: 'Feb 2025',
              event: 'Versión definitiva multi-agente',
              detail: 'Mi primer agente IA, en producción en menos de un mes. Arquitectura de sub-agentes completa: cada dominio en su propio workflow con webhook independiente, router central con tool calling, multi-model por caso de uso. La velocidad se debe al Business OS que ya existía debajo. Todo en paralelo a las demás responsabilidades del negocio.',
            },
            {
              year: 'Mar 2025',
              event: 'Canal de voz (Aircall + Twilio + ElevenLabs)',
              detail: 'Jacobo como compañero en la centralita Aircall, conectado vía Twilio a ElevenLabs. Reutilizó los sub-agentes existentes sin duplicar lógica. Validación del diseño platform-agnostic: los webhooks sirvieron a un segundo orquestador sin tocar una línea.',
            },
            {
              year: 'Sep 2025',
              event: 'Going-concern sale',
              detail: 'Jacobo lleva activo 24/7 desde su lanzamiento. Formó parte de la venta del negocio como activo operativo: el comprador lo adquirió funcionando. Cinco años de arquitectura limpia lo hicieron inevitable.',
            },
          ],
          bridge: ['Jacobo no fue un experimento.', '16 años construyendo un negocio con mis manos.', 'Sistematizarlo hasta que funcionara {sin mí}.', 'Jacobo fue la pieza que {cerró el ciclo}.', 'Vendí el negocio como empresa en marcha.', 'Los sistemas siguen operando hoy — bajo {nuevo dueño}.'],
          crossLink: {
            text: 'Jacobo se construyó sobre el Business OS que diseñé durante 5 años. Lee el case study completo →',
            href: '/business-os-para-airtable',
          },
        },
        lessons: {
          heading: 'Lecciones Aprendidas',
          items: [
            {
              title: 'Sub-agentes > un prompt monolítico.',
              detail: 'Durante el diseño, probé un prompt con todo el contexto y confirmé que no escala con múltiples dominios. La arquitectura de sub-agentes fue una decisión deliberada desde el principio: cada pieza testeable, iterable e independiente. Un cambio en descuentos no puede romper las citas. Es la misma lógica que los microservicios, aplicada a agentes IA.',
            },
            {
              title: 'HITL no es un fallback, es una feature.',
              detail: 'El handoff humano bien hecho genera más confianza que un bot que intenta resolver todo. Los clientes valoran que el sistema sepa cuándo necesitan a una persona. El truco: que el humano no empiece de cero.',
            },
            {
              title: 'El CRM es el cerebro del agente, no el LLM.',
              detail: 'Jacobo no es inteligente por el modelo de lenguaje. Es inteligente porque consulta precios, stock e historial de clientes en Airtable. Sin esos datos, es un chatbot genérico que inventa respuestas.',
            },
            {
              title: 'Empieza por el canal de mayor volumen.',
              detail: 'WhatsApp representaba el 70% de las consultas. Empezar ahí maximizó el impacto. Cuando añadimos voz, los sub-agentes ya estaban probados y solo hubo que conectar un orquestador nuevo.',
            },
            {
              title: 'Los modelos se eligen por caso de uso, no por marca.',
              detail: 'GPT-4.1 para el router y voz (tool calling preciso), GPT-4.1 mini para presupuestos (structured output), MiniMax M2.5 para citas (rápido y económico). OpenRouter como gateway permite cambiar sin reescribir. Esto es más FDE que decir "uso X para todo".',
            },
            {
              title: 'El Think tool previene errores en cadenas multi-tool.',
              detail: 'Antes de consultar precio → verificar stock → ofrecer cita, el agente explicita su plan. Un paso de razonamiento explícito reduce errores en la secuencia. Es como el "rubber duck debugging" pero para el propio agente.',
            },
          ],
        },
        whatIdDoDifferently: {
          heading: 'Qué Haría Diferente',
          body: 'Jacobo funcionó en producción durante meses, pero con perspectiva hay decisiones que cambiaría:',
          items: [
            {
              title: 'Evaluación estructurada desde el día 1',
              detail: 'Implementé evals post-hoc cuando el sistema ya estaba en producción. Si empezara de nuevo, definiría métricas de calidad de respuesta, intent classification accuracy y HITL rate antes de la primera versión. Retrofitear observabilidad es más costoso que diseñarla desde el inicio.',
            },
            {
              title: 'SIP trunk directo en vez de Aircall → Twilio → ElevenLabs',
              detail: 'La cadena de 3 hops añadía ~950-1.500ms de latencia mouth-to-ear y forzaba resampling de G.711 (8kHz) a 16kHz. Con Telnyx SIP trunk directo a ElevenLabs, tendría G.722 wideband nativo y sub-200ms RTT. Elegí la cadena larga porque Aircall ya estaba contratado; hoy priorizaría latencia sobre conveniencia.',
            },
            {
              title: 'Vector store para memoria en vez de fetch bruto de WATI',
              detail: 'El fetch de 80 mensajes desde WATI funciona, pero no escala a clientes con historial largo ni permite búsqueda semántica. Un vector store (Pinecone, Qdrant) con embeddings de conversaciones permitiría "recuerda aquella vez que trajiste el iPhone 12" sin cargar toda la conversación.',
            },
          ],
        },
        enterprisePatterns: {
          heading: 'Patrones Transferibles a Enterprise',
          body: 'Jacobo se construyó para una PYME, pero los patrones de arquitectura son enterprise-grade. Esto es lo que construí vs. lo que añadiría a escala enterprise:',
          builtVsEnterprise: [
            {
              pattern: 'Sub-agent routing con tool calling',
              built: 'Router + 7 sub-agentes webhook con intent classification y delegation',
              enterprise: 'Añadir circuit breakers, retry policies y fallback a modelo alternativo por sub-agente',
            },
            {
              pattern: 'Multi-model orchestration',
              built: 'GPT-4.1 (router/voz) + GPT-4.1 mini (presupuestos) + MiniMax (citas) vía OpenRouter',
              enterprise: 'A/B testing de modelos por sub-agente, canary deployments de nuevas versiones de prompts',
            },
            {
              pattern: 'HITL framework',
              built: 'Escalado vía Slack con contexto completo y deep-link a la conversación',
              enterprise: 'Queue management, SLAs por tier de cliente, analytics de razones de escalado',
            },
            {
              pattern: 'Platform-agnostic sub-agents',
              built: 'Webhooks compartidos entre n8n (WhatsApp) y ElevenLabs (voz)',
              enterprise: 'API gateway, rate limiting, autenticación, versionado de endpoints',
            },
            {
              pattern: 'Observabilidad',
              built: 'Logs de n8n + alertas de Slack',
              enterprise: 'Langfuse/Datadog para traces, latencia y cost tracking por conversación',
            },
            {
              pattern: 'Infraestructura de voz',
              built: 'Aircall → Twilio → ElevenLabs: funcional, pero cada hop añade latencia (~950-1.500ms mouth-to-ear). Twilio usa G.711 a 8kHz, requiere resampling a 16kHz para los modelos de STT, degradando precisión',
              enterprise: 'SIP trunk directo (Telnyx/Plivo) → ElevenLabs vía SIP, eliminando el hop de Twilio. Telnyx ofrece G.722 wideband a 16kHz nativo (sin resampling) e infraestructura co-located (GPU + telefonía en el mismo PoP) con sub-200ms RTT. Para apps/web: WebRTC directo (Opus 16-48kHz) vía LiveKit, sin PSTN, con 300-600ms mouth-to-ear',
            },
          ],
          applicability: {
            heading: 'Aplicabilidad por industria',
            examples: [
              {
                domain: 'Travel (Hopper, Booking)',
                detail: 'Sub-agentes para vuelos, hoteles, seguros. HITL para cambios complejos. Tool calling contra availability APIs.',
              },
              {
                domain: 'Fintech',
                detail: 'Sub-agentes para transacciones, consultas de saldo, soporte. Stock-aware routing → balance-aware routing.',
              },
              {
                domain: 'Healthcare',
                detail: 'Sub-agentes para citas, resultados, triage. HITL como feature crítica para derivación a especialista.',
              },
              {
                domain: 'E-commerce',
                detail: 'Sub-agentes para tracking, devoluciones, recomendaciones. Los mismos patrones de inventory lookup y booking.',
              },
              {
                domain: 'Plataformas de Voice AI',
                detail: 'Orquestación de agentes conversacionales con latencia optimizada. Los patrones de cross-channel (voz → texto) y HITL aplican directamente a cualquier plataforma de voz.',
              },
              {
                domain: 'Plataformas de Datos/AI',
                detail: 'Tool calling contra APIs internas, routing de sub-agentes por intent, memory management. La misma arquitectura escala a cualquier orquestador de agentes.',
              },
            ],
          },
        },
        promptEngineering: {
          heading: 'Prompt Engineering en Producción',
          body: 'No hice fine-tuning. Para un chatbot de tienda de reparaciones, iterar sobre el prompt con hard rules es más pragmático, más barato y más rápido de ajustar que entrenar un modelo custom. Cada regla que ves abajo nació de un caso real en producción.',
          whyNotFineTuning: {
            heading: '¿Por qué hard rules en el prompt y no fine-tuning?',
            reasons: [
              'Fine-tuning es caro y lento de iterar. Una regla en el prompt se cambia en segundos y se despliega al instante.',
              'El dominio cambiaba constantemente: precios, stock, horarios, promociones. Un modelo fine-tuned queda obsoleto en días.',
              'Las reglas son auditables: cualquier persona del equipo puede leer el prompt y entender por qué Jacobo se comporta así.',
              'El 90% de los errores de producción se resolvieron añadiendo una línea al prompt, no reentrenando un modelo.',
            ],
          },
          businessHours: {
            heading: 'Detección de horario comercial',
            body: 'Un nodo de código JavaScript verificaba si la tienda estaba abierta antes de cada conversación. El resultado se inyectaba como variable dinámica en el prompt: si `isBH` era false, Jacobo ajustaba su tono ("fuera de horario intentaré ayudarte igualmente") y no prometía respuestas inmediatas de compañeros humanos.',
            code: `const madridTime = new Date().toLocaleString('en-US', {
  timeZone: 'Europe/Madrid',
});
const madridDate = new Date(madridTime);
const day  = madridDate.getDay();   // 0-domingo … 6-sábado
const hour = madridDate.getHours();

const isBH = day >= 1 && day <= 5 &&
             ((hour >= 10 && hour < 14) || (hour >= 17 && hour < 21));

return [{ json: { isBH } }];`,
          },
          mainPrompt: {
            heading: 'System prompt del router principal (n8n)',
            body: 'Versión simplificada del prompt de producción. El original tiene 18 reglas y variables adicionales, pero cada bloque aquí refleja una técnica deliberada de prompt engineering.',
            segments: [
              {
                code: `## ROL
Te llamas Jacobo y trabajas en Santifer iRepair, tienda de reparación
de móviles, tablets, smartwatches en Sevilla. Eres un experto comercial
y en electrónica, que sabe diagnosticar los problemas que tienen los
usuarios en sus dispositivos móviles.`,
                annotations: [
                  {
                    label: 'Role prompting + persona',
                    detail: 'Definir ROL, nombre, empresa y dominio de expertise acota el espacio de respuestas. Sin esto, el LLM divaga o inventa servicios que no ofrecemos.',
                  },
                ],
              },
              {
                code: `HorarioComercial={{ \$('isBH').item.json.isBH }}
- Si false → la tienda está cerrada: informa con amabilidad
- Si true → responde con normalidad y ofrece ayuda inmediata`,
                annotations: [
                  {
                    label: 'Variables dinámicas inyectadas',
                    detail: 'HorarioComercial se inyecta como variable del workflow. El prompt cambia de comportamiento sin cambiar el prompt: una decisión de negocio (horario) controla el tono del agente.',
                  },
                ],
              },
              {
                code: `## Objetivo
Identificar modelo + avería → consultar stock → conversión hacia cita,
pedido o presupuesto.`,
                annotations: [
                  {
                    label: 'Objetivo orientado a conversión',
                    detail: 'El objetivo explícito ("conversión hacia cita, pedido o presupuesto") evita que el LLM se quede en conversación técnica sin avanzar. Sin esto, Jacobo explicaba diferencias entre chips durante minutos.',
                  },
                ],
              },
              {
                code: `Si el dispositivo no es móvil, tablet o
smartwatch, dar ayuda general pero no invitar a dejarlo en tienda.`,
                annotations: [
                  {
                    label: 'Scope limiting',
                    detail: 'Limita el alcance sin rechazar al cliente: el agente sigue siendo útil fuera de su dominio pero no hace promesas.',
                  },
                ],
              },
              {
                code: `## Instrucciones
1. Identificar modelo y síntomas → llamar a "presupuestoModelo"
2. Si varias reparaciones → llamar a "Calculadora" (array de precios)
3. Tras respuesta de presupuestoModelo:
   3.1 Hay stock → ofrecer cita vía "subagenteCitas" con urlCita
   3.2 No hay stock → ofrecer pedido urgente vía "hacerPedido"
   3.3 No hay presupuesto → facilitar urlPresupuesto

## Herramientas
- "mensajeConsulta": mensaje de espera antes de consultar precio
- "presupuestoModelo": lookup de modelo + avería en Airtable
- "contactarAgenteHumano": escalado HITL vía Slack
- "Think": razonamiento interno antes de tool calls complejos
- "Calculadora": descuento multi-reparación
- "subagenteCitas": gestión de citas vía YouCanBookMe
- "hacerPedido": crear pedido en Airtable cuando no hay stock`,
                annotations: [
                  {
                    label: 'Tool definitions como contrato',
                    detail: 'Cada herramienta documentada con su función exacta y cuándo usarla. El LLM necesita saber qué hace cada tool Y en qué orden llamarlas. Sin el contrato, hacía tool calls redundantes o en orden incorrecto.',
                  },
                ],
              },
              {
                code: `## HARD RULES (nacidas de producción)
1. Siempre llamar a Think antes de responder o pasar datos`,
                annotations: [
                  {
                    label: 'Think tool como chain-of-thought forzado',
                    detail: '"Siempre llamar a Think antes de responder o pasar datos" fuerza razonamiento explícito. Sin esto, el agente saltaba directamente a tool calls sin verificar que tenía todos los parámetros, generando errores.',
                  },
                ],
              },
              {
                code: `2. No modificar URLs de "presupuestoModelo" (Meta da error)
3. Un solo * para negrita (WhatsApp), no dos **
4. iPhone + Pantalla → ofrecer SIEMPRE opción premium (12 meses
   garantía vs 6). No está en web → derivar a humano si interesa
5. Enlaces planos, sin markdown (Meta rechaza [text](url))
6. Solo llamar a subagenteCitas TRAS presupuestoModelo
7. Diagnóstico: 19€, solo se cobra si no acepta la reparación
8. Correo: contacto@santiferirepair.es (no info@)`,
                annotations: [
                  {
                    label: 'Hard rules como guardrails de producción',
                    detail: 'Las reglas del final no son estilo: son correcciones de errores reales. Cada una tiene una historia detrás (URL rota, cliente confundido, venta perdida). Son el equivalente a tests de regresión, pero en el prompt.',
                  },
                ],
              },
              {
                code: `9. No decir "agendar" cita → decir "tomar" cita
10. No recomendar otras tiendas`,
                annotations: [
                  {
                    label: 'Negative prompting',
                    detail: '"No recomendar otras tiendas", "no decir agendar", "no modificar URLs". Decirle al LLM qué NO hacer es tan importante como decirle qué hacer: los modelos tienden a ser "serviciales" de más.',
                  },
                ],
              },
            ],
          },
          voicePrompt: {
            heading: 'System prompt del agente de voz (ElevenLabs)',
            body: 'Versión simplificada del prompt de voz en producción. Mismo dominio, adaptado a conversación telefónica. Comparte las mismas tools webhook pero el flujo es más directo.',
            segments: [
              {
                code: `## ROL
Te llamas Jacobo y trabajas en Santifer iRepair, tienda de reparación
de móviles, tablets, smartwatches en Sevilla. Sé conciso, amigable y
resolutivo.`,
                annotations: [
                  {
                    label: 'Persona compacta para voz',
                    detail: 'El prompt de WhatsApp tiene un ROL extenso con reglas de tono. En voz, la brevedad es clave: el LLM necesita menos contexto para generar respuestas cortas y naturales. Menos tokens de sistema = menor latencia en la primera respuesta.',
                  },
                ],
              },
              {
                code: `## Objetivo
Identificar modelo + avería → consultar stock → facilitar enlace.
Solo dar detalles técnicos cuando el cliente no tenga clara la avería.
Objetivo: que el cliente tome cita (si hay stock) o genere pedido.`,
                annotations: [
                  {
                    label: 'Funnel de conversión en una línea',
                    detail: 'El mismo embudo que WhatsApp condensado. En voz, el agente necesita decidir rápido: la conversación no espera. Una línea con el flujo completo (modelo → stock → enlace) es más efectiva que un párrafo.',
                  },
                ],
              },
              {
                code: `## Instrucciones
1. Obtener modelo y avería
2. Indicar que estás haciendo la consulta → llamar a "presupuestoModelo"
3. Enviar "urlSantifer" vía "EnviarMensajeWati" (WhatsApp en paralelo)
4. Si varias reparaciones → llamar a "Calculadora"
5. Informar precio + disponibilidad + "te he mandado la info por WhatsApp"`,
                annotations: [
                  {
                    label: 'Cross-channel UX',
                    detail: 'El paso 3 es la magia: mientras el cliente sigue hablando por teléfono, Jacobo le envía el enlace por WhatsApp usando el caller_id. El cliente recibe la info en el móvil sin colgar. A los clientes les encantaba.',
                  },
                ],
              },
              {
                code: `## HARD RULES
1. No modificar URLs de "presupuestoModelo"
2. iPhone + Pantalla → ofrecer opción premium (12 meses garantía)
3. No decir "agendar" → decir "tomar"
4. Cierre 18-22 agosto: si necesitan recoger equipo → mensajería gratis

Número del cliente: {{system__caller_id}}`,
                annotations: [
                  {
                    label: 'Variable dinámica: caller_id',
                    detail: 'ElevenLabs inyecta {{system__caller_id}} con el número de teléfono de la llamada entrante. Es lo que permite el cross-channel: Jacobo usa ese número para enviar WhatsApp al mismo cliente que está hablando por teléfono.',
                  },
                ],
              },
            ],
          },
          citasPrompt: {
            heading: 'System prompt del sub-agente de citas (n8n)',
            body: '15 reglas de parseo temporal que convierten frases coloquiales en rangos horarios JSON. Este prompt es la pieza clave del sub-agente más sofisticado del sistema: traduce lenguaje natural a timestamps compatibles con la API de YouCanBookMe.',
            segments: [
              {
                code: `Eres un micro-servicio que convierte frases de preferencia horaria fecha y hora (español de España)
en un array JSON de rangos.`,
                annotations: [
                  {
                    label: 'Micro-service framing',
                    detail: 'Darle al LLM el rol de "micro-servicio" en vez de "asistente" acota radicalmente su comportamiento: no saluda, no explica, no pregunta. Solo parsea y devuelve JSON. Reduce alucinaciones al mínimo.',
                  },
                ],
              },
              {
                code: `REGLAS DE NEGOCIO
1. Rangos por defecto:
   – mañana = 10:00-14:00
   – tarde   = 17:00-21:00
   – "todo el día" = 10:00-21:00
2. exact será true solo si el usuario da una hora puntual que termine
   en 00 o 30 (ej. "lunes a las 10" o "martes a las 17:30" pero no
   "miércoles a las 10:15").
   Si menciona un rango ("martes de 10 a 12") ⇒ exact:false.
3. Horas con minutos ≠ 00 ó 30 se redondean:
   - Redondea hacia abajo al múltiplo de 30 min anterior.
   - Crea un rango de 1 hora a partir de esa hora redondeada
     (ej. 10:15 ⇒ 10:00-11:00, exact:true porque era puntual).
4. La fecha actual es {{ \$now.format('yyyy-MM-dd HH:mm') }} (Europe/Madrid).
5. Acepta varias peticiones separadas por "y", comas o punto y coma.`,
                annotations: [
                  {
                    label: 'Domain constraints como reglas',
                    detail: 'Los horarios del negocio, los slots de 30 minutos, el redondeo y la timezone se codifican como reglas explícitas. Sin esto, el LLM inventaba franjas horarias inexistentes o slots de 15 minutos.',
                  },
                ],
              },
              {
                code: `6. Devuelve EXCLUSIVAMENTE una llamada de función con esta forma:
   {"name":"slots","arguments":{"slots":[
     {"date":"AAAA-MM-DD","start":"HH:mm","end":"HH:mm","exact":true/false}
   ]}}
6.1 Si la frase incluye "mañana" sin especificar parte del día,
    trátalo como «todo el día» de mañana (10:00–21:00).`,
                annotations: [
                  {
                    label: 'Structured output forzado',
                    detail: 'Forzar un JSON schema específico garantiza que el output sea parseable por el siguiente nodo de n8n. "EXCLUSIVAMENTE" es clave: sin esa palabra, el LLM añadía texto conversacional antes del JSON.',
                  },
                ],
              },
              {
                code: `7. PLURAL ("mañanas", "tardes"): devuelve las próximas N=3 franjas.
   Incluye hoy si la franja aún no ha terminado.
8. Solo abre de lunes a viernes. Nunca sábado ni domingo.
9. Conectores condicionales ("o", "o bien", "o si no"):
   preferencias alternativas en el mismo orden.
10. "A partir de [día]": todo el día (10:00-21:00) + N-1 laborables.
11. N=5 por defecto.
12. Día concreto: solo las horas de ese día.
13. "Esta semana": todas las franjas laborables restantes (Lu-Vi).
14. Plurales: próximas 3 franjas.
15. Sin preferencia horaria: próximos 3 días laborables, todo el día.`,
                annotations: [
                  {
                    label: 'Enumeración de edge cases',
                    detail: 'Cada regla (7-15) cubre un caso real que falló en producción: plurales, conectores condicionales, "esta semana". Sin enumerar explícitamente cada edge case, el LLM interpretaba libremente y generaba slots incorrectos.',
                  },
                ],
              },
              {
                code: `# EJEMPLOS
Input: "mañana por la mañana"
→ {"slots":[{"date":"[mañana]","start":"10:00","end":"14:00","exact":false}]}

Input: "martes de 10 a 12 y viernes todo el día"
→ {"slots":[
  {"date":"[martes]","start":"10:00","end":"12:00","exact":false},
  {"date":"[viernes]","start":"10:00","end":"21:00","exact":false}
]}

Input: "lunes a las 10"
→ {"slots":[{"date":"[lunes]","start":"10:00","end":"11:00","exact":true}]}`,
                annotations: [
                  {
                    label: 'Few-shot prompting',
                    detail: '3 ejemplos input→output que cubren los 3 escenarios clave: franja genérica (exact:false), multi-slot con "y", y hora exacta (exact:true). Suficientes para anclar el formato sin sobreajustar el comportamiento.',
                  },
                ],
              },
            ],
          },
          iterationExamples: {
            heading: 'Ejemplos de iteraciones reales',
            items: [
              {
                rule: 'No modificar URLs',
                origin: 'Meta rechazaba mensajes con URLs concatenadas. Un cliente no recibió su enlace de cita porque Jacobo juntó dos URLs en una.',
              },
              {
                rule: 'Un solo * para negrita',
                origin: 'WhatsApp usa *texto* para negrita. Jacobo usaba **texto** (estilo markdown) y el cliente veía los asteriscos literales.',
              },
              {
                rule: 'Siempre ofrecer pantalla premium en iPhone',
                origin: 'Los clientes preguntaban después de colgar si había una opción mejor. Se perdían ventas de margen alto.',
              },
              {
                rule: 'No decir "agendar"',
                origin: 'En España nadie dice "agendar una cita". Es un anglicismo que los LLMs usan constantemente. Los clientes lo notaban.',
              },
              {
                rule: 'Enlaces planos sin markdown',
                origin: 'Meta/WhatsApp no renderiza [texto](url). El cliente veía texto roto en vez de un enlace clickeable.',
              },
              {
                rule: 'No recomendar otras tiendas',
                origin: 'Jacobo recomendó una competencia cuando un cliente preguntó por un servicio que no ofrecíamos. Aprendizaje rápido.',
              },
              {
                rule: 'Atribución del creador como lead gen',
                origin: 'Un reclutador preguntó a Jacobo "¿quién te ha diseñado?" y no supo responder. Ahora el prompt de producción incluye reglas que mencionan a Santiago como creador con enlace a LinkedIn. El agente se convierte en un canal pasivo de generación de leads.',
              },
            ],
          },
        },
        mainRouter: {
          heading: 'Los Dos Cerebros',
          body: 'Jacobo tiene dos routers independientes que comparten los mismos tools y sub-agentes. Uno orquesta WhatsApp, el otro gestiona las llamadas de voz. Misma lógica de negocio, dos interfaces completamente distintas.',
          whatsappRouter: {
            heading: 'Router WhatsApp (n8n)',
            body: 'El cerebro de texto: un workflow de n8n con 37 nodos que clasifica cada mensaje, decide qué sub-agente invocar y orquesta la respuesta. Aquí viven el tool calling, el prompt engineering y toda la lógica de enrutamiento.',
          },
          voiceRouter: {
            heading: 'Router Voz (ElevenLabs)',
            body: 'El cerebro de voz: un agente conversacional en ElevenLabs con Gemini 2.5 Flash, knowledge bases con la documentación del negocio, y los mismos tools expuestos como webhooks. El cliente habla por teléfono y Jacobo responde en tiempo real, consultando precios, disponibilidad y gestionando citas, exactamente igual que por WhatsApp.',
          },
        },
        deepDiveQuotes: {
          heading: 'Deep Dive: Sub-agente de Presupuestos',
          body: 'El sub-agente de presupuestos es el más crítico del sistema: cada consulta de precio pasa por aquí. Usa GPT-4.1 mini vía OpenRouter por su precisión en structured output. Su respuesta determina el siguiente paso del flujo completo.',
          challenge: {
            heading: 'El reto: del texto libre al presupuesto estructurado',
            body: 'El cliente escribe "cuánto cuesta cambiar la pantalla de un iPhone 15 Pro Max". El router necesita un JSON con precio, stock, URLs de cita y pieza. El sub-agente conecta lenguaje natural con la base de datos de Airtable en tiempo real.',
          },
          cleanModel: {
            heading: 'CleanModel: Codificar conocimiento tácito',
            body: 'Los clientes no escriben modelos como una base de datos. Escriben "iphone 15", "iPhone15 pro max", "ip 15 pro", "I-Phone 15Pro Max". Un técnico humano resolvía esto con experiencia: sabía que "el grande negro" probablemente era un Pro Max. Ese conocimiento tácito se pierde si no se diseña para ello.',
            detail: 'CleanModel normaliza el input: elimina espacios, paréntesis, guiones y pasa a minúsculas. "iPhone 15 Pro Max" → "iphone15promax". Esto alimenta una búsqueda con SEARCH() en Airtable por campo modeloLimpio (también normalizado), permitiendo fuzzy matching sin depender de escritura exacta.',
            insight: 'Este nodo codifica conocimiento tácito de negocio. Sin él, el agente fallaría con la mayoría de inputs reales, porque los clientes no hablan como bases de datos. Es un ejemplo de por qué construir agentes requiere entender el dominio, no solo conectar APIs.',
          },
          aiAgent: {
            heading: 'AI Agent: GPT-4.1 mini vía OpenRouter',
            body: 'El cerebro del sub-agente. System prompt con ROL ultra-scoped: "agente especializado en buscar precios". Incluye Think tool para razonamiento explícito antes de cada tool call y Simple Memory (buffer window) con sessionKey estática.',
            tools: [
              {
                label: 'BuscarModelo',
                detail: 'Busca por campo modeloLimpio en tabla Modelos → devuelve RECORD_ID, Name, URLSantiferNueva, Cita diagnóstico.',
              },
              {
                label: 'BuscarReparacionesModelo',
                detail: 'Busca por RECORD_ID → devuelve 20 tipos de reparación con "Precio, stock y cita" (pantalla original, compatible, batería, micrófono, altavoz, puerto carga, cámara trasera/delantera, etc.).',
              },
              {
                label: 'Structured Output Parser',
                detail: 'Formatea a JSON con schema: modelo, reparación, precio, stock, urlSantifer, urlCita, urlPresupuesto, urlDiagnostico, idPiezaAirtable, idModeloAirtable.',
              },
            ],
            fallback: 'Si no encuentra coincidencia, el system prompt instruye: "tienes que ir acotando el modelo para obtener más resultados, hasta que te quedes con el que corresponda", replicando el razonamiento de un humano experimentado.',
          },
          filtrarRespuesta: {
            heading: 'FiltrarRespuesta: Post-procesado determinista',
            body: 'Nodo Code que valida y limpia la respuesta del AI Agent antes de devolverla al router. Valida que urlSantifer apunte al dominio correcto (si no contiene "santiferirepair.es" → "NO DISPONIBLE EN WEB AUN"). Después aplica 3 paths de eliminación de campos según estado:',
            rules: [
              {
                condition: 'stock === true',
                action: 'Elimina urlPresupuesto, idPieza, idModelo: el cliente puede reservar cita directamente.',
              },
              {
                condition: 'stock === false',
                action: 'Elimina urlCita y urlPresupuesto: necesita pedir pieza antes de reparar.',
              },
              {
                condition: 'precio === "PRESUPUESTO"',
                action: 'Elimina urlCita e idPieza: la reparación no está catalogada, requiere valoración manual.',
              },
            ],
          },
          punchline: 'El resultado: un cliente pregunta "cuánto cuesta arreglar la pantalla de mi iPhone" y en 4 segundos tiene precio real, disponibilidad de stock y un enlace directo para reservar cita o hacer pedido. Sin formularios, sin "le paso con un compañero". El sub-agente consulta justo los campos imprescindibles de Airtable y devuelve exactamente lo que el router necesita para cerrar la conversión.',
          presupuestoPrompt: {
            heading: 'System prompt del sub-agente de presupuestos (n8n)',
            body: 'El prompt define tres herramientas (BuscarModelo, BuscarReparacionesModelo, Structured Output Parser) y un flujo de 4 pasos para devolver presupuestos estructurados con estado de stock.',
            segments: [
              {
                code: `## ROL
Eres un sub-agente de presupuestos para Santifer iRepair.
Tu trabajo: recibir un modelo y una reparación, buscarlos en Airtable
y devolver un presupuesto estructurado.`,
                annotations: [
                  {
                    label: 'Scoped sub-agent role',
                    detail: 'No es un asistente general: es un sub-agente con una única responsabilidad. El scope ultra-estrecho elimina tentaciones del LLM de conversar, sugerir alternativas o añadir contexto no solicitado.',
                  },
                ],
              },
              {
                code: `## OBJETIVO
Buscar el modelo exacto y la reparación solicitada en la base de datos.
Devolver precio, disponibilidad de stock y siguiente paso recomendado.`,
                annotations: [
                  {
                    label: 'Single-responsibility objective',
                    detail: 'Una sola tarea: buscar + devolver presupuesto. El "siguiente paso recomendado" (cita, pedido, presupuesto manual) permite al router principal decidir sin necesidad de otra llamada al LLM.',
                  },
                ],
              },
              {
                code: `## HERRAMIENTAS
- "BuscarModelo": busca el modelo del dispositivo en Airtable
- "BuscarReparacionesModelo": busca reparaciones disponibles para ese modelo
- "Structured Output Parser": formatea la respuesta en JSON estructurado`,
                annotations: [
                  {
                    label: 'Tool chain pipeline',
                    detail: 'Las 3 tools forman un pipeline secuencial: buscar modelo → buscar reparaciones → formatear. El Structured Output Parser al final garantiza que el JSON sea consumible por el router sin post-procesado.',
                  },
                ],
              },
              {
                code: `## PASOS
1. Recibir modeloInput y reparacionInput del router
2. Llamar a BuscarModelo con modeloLimpio
3. Si encuentra el modelo → llamar a BuscarReparacionesModelo
4. Devolver JSON: precio, stock, tiempo estimado, urlCita, urlPresupuesto`,
                annotations: [
                  {
                    label: 'Explicit step sequencing',
                    detail: 'Orden determinista paso a paso. Sin esto, el LLM a veces saltaba BuscarModelo e intentaba adivinar el precio. Cada paso condiciona al siguiente: no hay ambigüedad sobre qué hacer.',
                  },
                ],
              },
              {
                code: `// User message template (n8n inyecta las variables)
Modelo: {{ \$json.modeloInput }}
Modelo limpio: {{ \$json.modeloLimpio }}
Reparación: {{ \$json.reparacionInput }}`,
                annotations: [
                  {
                    label: 'Variable injection via template',
                    detail: 'n8n inyecta modeloInput (lo que dijo el cliente), modeloLimpio (normalizado por el router) y reparacionInput. La separación input/limpio permite al sub-agente buscar con el nombre normalizado sin perder el contexto original del cliente.',
                  },
                ],
              },
            ],
          },
        },
        deepDiveOthers: {
          heading: 'Deep Dive: Tools',
          body: 'No todas las piezas del sistema necesitan un LLM. Estas tres tools son workflows ligeros que ejecutan una sola operación cada uno, simples por diseño: la lógica de decisión vive en el router.',
          orders: {
            heading: 'hacerPedido: Pedidos Urgentes',
            body: 'Cuando el sub-agente de presupuestos detecta que no hay stock de la pieza, el router invoca hacerPedido. El workflow crea un registro en la tabla "Pedidos" de Airtable con todos los datos necesarios para que el equipo gestione el pedido al proveedor.',
            nodes: 'Webhook → Airtable Create (tabla Pedidos) → Respond to Webhook',
            details: [
              'Marca automáticamente "¿Tiene prisa? = SI" porque el cliente está esperando',
              'Vincula idPieza e idModelo para trazabilidad completa en el Business OS',
              'Añade nota "Pedido automatizado por Jacobo" + comentario del cliente',
              'El equipo recibe el pedido en su vista de Airtable sin intervención manual',
            ],
          },
          calculator: {
            heading: 'Calculadora de Descuentos',
            body: 'Lógica pura de negocio, cero LLM. Cuando el cliente necesita varias reparaciones (ej: pantalla + batería + cámara), el router envía un array de precios y la calculadora aplica descuentos escalonados automáticamente.',
            nodes: 'Webhook → Code (lógica de descuentos) → Response',
            details: [
              'Ordena precios de mayor a menor: la reparación más cara no tiene descuento',
              'Descuento por posición: ≤50€ → 15€ off, ≤100€ → 20€ off, >100€ → 25€ off',
              'Devuelve resumen formateado: precio sin descuento, descuento aplicado, precio final',
              'El cliente ve inmediatamente cuánto ahorra por agrupar reparaciones en una sola visita',
            ],
            segments: [
              {
                code: `const precios = item.json.body.precios;

// Validaciones básicas
if (!Array.isArray(precios) || precios.length < 2) {
    throw new Error('Debes enviar un array "precios" con al menos 2 números.');
}`,
                annotations: [
                  {
                    label: 'Validación defensiva',
                    detail: 'El sub-agente no confía en el router: valida que el array exista y tenga al menos 2 precios. Si el LLM envió datos malformados, falla rápido con error descriptivo en vez de devolver NaN.',
                  },
                ],
              },
              {
                code: `// 1) Ordenamos de mayor a menor
const ordenados = [...precios].sort((a, b) => b - a);

// 2) Calculamos descuento por posición (el primero no tiene)
const descuentos = ordenados.map((precio, idx) => {
    if (idx === 0) return 0;        // sin descuento para el más caro
    if (precio <= 50)  return 15;
    if (precio <= 100) return 20;
    return 25;                      // >100 €
});`,
                annotations: [
                  {
                    label: 'Reglas de negocio como código, no como prompt',
                    detail: 'Los descuentos viven en un nodo Code, no en un prompt. Esto garantiza determinismo: una pantalla de 189€ + batería de 45€ siempre da exactamente el mismo descuento. Cero alucinaciones posibles.',
                  },
                ],
              },
              {
                code: `// 3) Totales
const totalSinDescuento = ordenados.reduce((s, p) => s + p, 0);
const descuentoTotal    = descuentos.reduce((s, d) => s + d, 0);
const totalConDescuento = totalSinDescuento - descuentoTotal;

// 4) Preparar respuesta
const resumen =
    \`Presupuesto total sin descuento: \${totalSinDescuento.toFixed(2)} €
Descuento aplicado: \${descuentoTotal.toFixed(2)} €
Presupuesto reparándolo todo junto: \${totalConDescuento.toFixed(2)} €\`;`,
                annotations: [
                  {
                    label: 'Respuesta formateada para el router',
                    detail: 'El resumen en texto plano lo recibe el router y lo pasa directamente al cliente. El LLM no reformula: copia el texto tal cual. Así el precio que ve el cliente es exactamente el que calculó el código.',
                  },
                ],
              },
            ],
          },
          hitl: {
            heading: 'HITL Handoff: Escalada a Humano',
            body: 'La válvula de escape del sistema. Cuando Jacobo detecta que no puede resolver (cliente frustrado, caso complejo, petición fuera de scope), escala a un humano vía Slack con contexto completo.',
            nodes: 'Webhook → Slack (#chat) → Respond to Webhook',
            details: [
              'Publica en el canal #chat con emoji 🤖 como avatar',
              'El mensaje incluye: resumen de la conversación, intent detectado e historial del cliente',
              'Deep-link directo a la conversación en WATI: el humano abre y ya tiene todo el contexto',
              'Jacobo confirma al cliente que un humano le contactará, sin cortar la conversación',
            ],
          },
          whatsapp: {
            heading: 'EnviarMensajeWati: Cross-Channel',
            body: 'El puente entre canales. Cuando el cliente habla por teléfono con Jacobo (ElevenLabs), este workflow envía enlaces y confirmaciones por WhatsApp en paralelo. El cliente recibe la info por escrito mientras sigue hablando.',
            nodes: 'Webhook → HTTP Request (API WATI) → Respond to Webhook',
            details: [
              'Envía template "urlreparacion2" con la URL de cita personalizada',
              'Permite que el agente de voz diga "te acabo de enviar el enlace por WhatsApp"',
              'El cliente no necesita apuntar nada: cuando cuelga, la info ya está en su móvil',
            ],
          },
        },
      },
      cta: {
        heading: '¿Buscas a alguien que construya esto para tu empresa?',
        body: 'Jacobo gestiona citas, consulta inventario real y escala con contexto, todo en menos de 30 segundos. La arquitectura de sub-agentes, tool calling y patrones HITL se aplica directamente a travel, fintech, salud o e-commerce.',
        label: 'LinkedIn',
        labelSecondary: 'Email',
      },
      ctaAfterEnterprise: {
        heading: 'Estos patrones están listos para escalar. Yo también.',
      },
      ctaAfterDownloads: {
        heading: 'Te han gustado los workflows. Imagina lo que puedo hacer con los tuyos.',
      },
      faq: {
        heading: 'Preguntas Frecuentes',
        items: [
          {
            q: '¿Cuánto cuesta construir un agente IA para WhatsApp?',
            a: 'Las herramientas (n8n cloud, WATI, Aircall, LLMs vía OpenRouter) cuestan en total menos de 200€/mes. El coste principal es el tiempo de diseño y desarrollo de la arquitectura. Para un negocio de este tamaño, es una fracción del coste de un empleado a tiempo parcial dedicado a atención al cliente.',
          },
          {
            q: '¿Qué pasa si la IA se equivoca con un precio?',
            a: 'Los precios no vienen del LLM: vienen de Airtable. Jacobo consulta el inventario en tiempo real. Si el precio cambia en Airtable, Jacobo da el precio correcto automáticamente. No hay alucinación posible en datos estructurados.',
          },
          {
            q: '¿Cómo funciona el agente de voz por teléfono?',
            a: 'Jacobo está integrado en la centralita Aircall como un "compañero" más. Entra cuando nadie puede atender o fuera de horario. El cliente llama a un teléfono fijo y habla con Jacobo con voz natural (ElevenLabs). Usa los mismos sub-agentes webhook que WhatsApp: misma lógica, diferente interfaz.',
          },
          {
            q: '¿Por qué n8n y no LangChain/LangGraph directamente?',
            a: 'n8n permite que cada sub-agente sea un workflow visual con webhook propio, testeable con una llamada HTTP. La barrera de mantenimiento es menor que un repo de Python. Para la complejidad de este sistema (7 workflows, ~80 nodos), la visualización de n8n es una ventaja, no una limitación.',
          },
          {
            q: '¿Cuánto tiempo llevó construir Jacobo?',
            a: 'Menos de un mes desde el diseño hasta producción. Y era mi primer agente IA, construido en paralelo a las demás responsabilidades del negocio. La velocidad se debe a que el Business OS ya existía: datos limpios y accesibles en Airtable, inventario en tiempo real, CRM con historial. Sin esa base de 5 años, habría sido mucho más lento. Jacobo fue la consecuencia inevitable de un sistema operativo de negocio robusto.',
          },
          {
            q: '¿Puedes construir algo así para mi empresa?',
            a: 'Sí. Los patrones de Jacobo (sub-agentes, tool calling, HITL, cross-channel) son agnósticos de industria. Lo que cambia son los datos y las integraciones, no la arquitectura. Si tu negocio tiene datos estructurados y procesos repetitivos, puedo diseñar un sistema similar.',
          },
          {
            q: '¿Jacobo sigue funcionando?',
            a: 'Sí. Vendí el negocio en 2025 y Jacobo se vendió con él. Sigue en producción atendiendo clientes hoy. Es la mejor validación posible: el comprador mantuvo el sistema porque funciona.',
          },
          {
            q: '¿Cómo pasaste de negocio propio a buscar rol en enterprise?',
            a: 'Construí un negocio de 16 años con sistemas que escalan: ERP custom, agente IA, SEO programático, CRM con gamificación. Ahora quiero aplicar ese mismo pensamiento de sistemas a problemas más grandes: como FDE, Solutions Architect o AI Production Manager.',
          },
        ],
      },
      resources: {
        heading: 'Recursos',
        items: [
          {
            label: 'n8n · Workflow Automation',
            url: 'https://n8n.io',
          },
          {
            label: 'OpenRouter · Model Gateway',
            url: 'https://openrouter.ai',
          },
          {
            label: 'ElevenLabs · Conversational AI',
            url: 'https://elevenlabs.io',
          },
          {
            label: 'WATI · WhatsApp Business API',
            url: 'https://www.wati.io',
          },
          {
            label: 'Aircall · Cloud PBX',
            url: 'https://aircall.io',
          },
          {
            label: 'Airtable · Database Platform',
            url: 'https://airtable.com',
          },
        ],
      },
      downloads: {
        badge: '7 workflows de producción descargables. Open source by default',
        inlineLabel: 'Ver en GitHub',
        inlineHint: 'Importa en n8n en 1 click',
        section: {
          heading: 'Pruébalo Tú Mismo',
          intro: 'Estos son los workflows reales que corren en producción desde hace 2 años. Sanitizados, documentados, listos para importar en n8n. Si construyes algo con ellos, me encantaría verlo.',
          downloadAllLabel: 'Descargar todo (ZIP)',
          downloadAllSize: '~37 KB',
          importHeading: 'Cómo importar en n8n',
          importSteps: [
            'Abre tu instancia de n8n y ve a Workflows',
            'Click en "..." → "Import from file"',
            'Selecciona cualquier archivo .json de la descarga',
            'Actualiza las credenciales (API keys, webhooks) con tus propios valores',
          ],
        },
        workflows: [
          {
            id: 'jacobo-chatbot-v2',
            icon: '🧭',
            name: 'Jacobo Chatbot V2',
            subtitle: 'Central Router',
            description: 'El cerebro del canal WhatsApp. Clasifica intent, elige sub-agente, mantiene ventana de memoria de 20 mensajes.',
            href: 'https://github.com/santifer/jacobo-workflows/blob/main/jacobo-chatbot-v2.json',
            fileSize: '~66 KB',
            nodes: '37 nodos',
            llm: 'GPT-4.1',
          },
          {
            id: 'subagente-citas',
            icon: '📅',
            name: 'subagenteCitas',
            subtitle: 'Appointment Booking',
            description: 'Convierte "mañana por la mañana" en una cita confirmada. Parsea preferencias temporales en lenguaje natural.',
            href: 'https://github.com/santifer/jacobo-workflows/blob/main/subagente-citas.json',
            fileSize: '~24 KB',
            nodes: '18 nodos',
            llm: 'MiniMax M2.5',
          },
          {
            id: 'presupuesto-modelo',
            icon: '💰',
            name: 'Presupuesto Modelo',
            subtitle: 'Quote Agent',
            description: 'Busca modelo y reparación en Airtable, devuelve precio real con estado de stock.',
            href: 'https://github.com/santifer/jacobo-workflows/blob/main/presupuesto-modelo.json',
            fileSize: '~15 KB',
            nodes: '11 nodos',
            llm: 'GPT-4.1 mini',
          },
          {
            id: 'hacer-pedido',
            icon: '📦',
            name: 'hacerPedido',
            subtitle: 'Order Creation',
            description: 'Crea órdenes de reparación en Airtable cuando la pieza no tiene stock.',
            href: 'https://github.com/santifer/jacobo-workflows/blob/main/hacer-pedido.json',
            fileSize: '~79 KB',
            nodes: '3 nodos',
          },
          {
            id: 'calculadora-santifer',
            icon: '🧮',
            name: 'CalculadoraSantifer',
            subtitle: 'Discount Calculator',
            description: 'Lógica pura de negocio. Calcula descuentos combo cuando el cliente agrupa varias reparaciones.',
            href: 'https://github.com/santifer/jacobo-workflows/blob/main/calculadora-santifer.json',
            fileSize: '~2.7 KB',
            nodes: '3 nodos',
          },
          {
            id: 'contactar-agente-humano',
            icon: '🙋',
            name: 'contactarAgenteHumano',
            subtitle: 'HITL Handoff',
            description: 'La válvula de escape. Escala a humano vía Slack con deep-link directo a la conversación.',
            href: 'https://github.com/santifer/jacobo-workflows/blob/main/contactar-agente-humano.json',
            fileSize: '~2.3 KB',
            nodes: '5 nodos',
          },
          {
            id: 'enviar-mensaje-wati',
            icon: '📱',
            name: 'EnviarMensajeWati',
            subtitle: 'WhatsApp Sender',
            description: 'Puente cross-channel: el agente de voz envía mensajes por WhatsApp vía la API de WATI.',
            href: 'https://github.com/santifer/jacobo-workflows/blob/main/enviar-mensaje-wati.json',
            fileSize: '~2.5 KB',
            nodes: '3 nodos',
          },
        ],
        githubNote: 'Todos los workflows están en GitHub: haz fork, dale star, o descarga directamente.',
        githubCta: 'Ver repo en GitHub',
      },
      footer: {
        role: 'AI Product Manager · Solutions Architect',
        bio: 'Construyó y vendió un negocio de 16 años en 2025. Ahora aplica el mismo pensamiento de sistemas a AI enterprise: como FDE, Solutions Architect o AI Production Manager.',
        fellowAt: 'Teaching Fellow en',
        fellowLink: 'AI Product Academy',
        copyright: 'Todos los derechos reservados.',
      },
    },
    en: {
      slug: 'ai-agent-jacobo',
      altSlug: 'agente-ia-jacobo',
      readingTime: '35 min read',
      seo: {
        title: 'Jacobo: Multi-Agent AI with Tool Calling & Voice AI — Production Case Study | santifer.io',
        description: 'Case study: how an FDE built an omnichannel AI agent with sub-agents, tool calling, HITL, and Voice AI (n8n + ElevenLabs) achieving 90% self-service. Downloadable workflows.',
      },
      nav: {
        breadcrumbHome: 'Home',
        breadcrumbCurrent: 'AI Agent Jacobo',
      },
      header: {
        kicker: 'Case Study: Santifer iRepair (Google it — still operating today)',
        h1: 'Jacobo: Multi-Agent AI with Sub-Agent Orchestration & Tool Calling',
        subtitle: 'How I built an AI agent that handles WhatsApp and landline calls, orchestrates specialized sub-agents via webhooks, and achieves ~90% self-service at a phone repair business.',
        badge: 'Sold with the business in 2025 — still running in production today',
        date: 'Feb 25, 2026',
      },
      heroMetrics: [
        {
          value: '~90%',
          label: 'Self-service',
        },
        {
          value: '~80h/mo',
          label: 'Automated',
        },
        {
          value: '<30s',
          label: 'Response',
        },
        {
          value: '<€200',
          label: 'Cost/mo',
        },
        {
          value: '24/7',
          label: 'Available',
        },
      ],
      tldr: 'A multi-agent AI system that handles ~90% of customer queries without human intervention, 24/7, for <€200/month. 4 agents + 3 tools, dual-channel (WhatsApp + landline). Built in <1 month on top of a 5-year Business OS. Sold with the business in 2025. All 7 n8n workflows are downloadable at the end.',
      intro: {
        hook: '~15 interruptions per day. Each one, a repair on hold. Every unanswered WhatsApp, a customer walking to the competition. I built an AI agent that handles both — ~90% of interactions, 24/7, for less than €200/month.',
        body: 'Not a chatbot with canned responses. An agent that checks real prices, verifies stock, books appointments, and knows when to loop in a human with full context. That\'s what Jacobo became. In this article I share the complete architecture and the production workflows so you can replicate it.',
      },
      internalLinks: {
        businessOs: {
          text: 'Business OS — Case Study',
          href: '/business-os-for-airtable',
        },
        pseo: {
          text: 'Programmatic SEO — Case Study',
          href: '/programmatic-seo',
        },
      },
      sections: {
        theProblem: {
          heading: 'The Problem',
          body: 'With 30,000+ repairs completed and multiple support channels (phone, WhatsApp, web), the bottleneck was clear:',
          painPoints: [
            '80% of inquiries were repetitive: prices, appointments, repair status',
            'Every inquiry pulled the technician away from active repairs',
            'Response times swung wildly depending on the day\'s workload',
            'Data lived in three places: Airtable, the calendar, and inventory',
            'Availability stopped at store closing time',
            'Hiring part-time support didn\'t pencil out',
            'Customers reached out via WhatsApp and landline. The solution had to cover both with shared logic, not duplicate the work',
          ],
          alternatives: {
            body: 'The constraints were fixed: Airtable was the brain (the Business OS had been the SSOT for years), I needed real tool calling against live data, and the agent had to cover voice + chat from the same backend. The only open question was which orchestration layer to use:',
            items: [
              {
                tool: 'Tidio / Intercom',
                issue: 'Generalist chatbots with decision trees. Can\'t check stock in real time or calculate dynamic pricing against Airtable. For a repair business, they\'re little more than an interactive FAQ.',
              },
              {
                tool: 'ManyChat (WhatsApp)',
                issue: 'Good for marketing flows, but no tool calling capability against an existing ERP. Can\'t verify stock, create work orders, or do context-rich handoff.',
              },
              {
                tool: 'Vertical solution (RepairDesk chat)',
                issue: 'No repair SaaS offered a conversational agent with natural language and tool calling against real-time data. The ones with chat were essentially forms in disguise.',
              },
            ],
            punchline: 'n8n was the natural fit: workflow orchestration with webhooks, native LLM agent support with tool calling, and the ability to deploy each sub-agent as an independent, testable workflow. All wired into the Business OS already running in Airtable.',
          },
        },
        architecture: {
          heading: 'The Architecture',
          body: 'Jacobo isn\'t a chatbot with a long prompt. It\'s a system of specialized sub-agents, each deployed as an independent webhook in n8n, orchestrated via tool calling from a central router. Every workflow in this article is importable directly into n8n — grab them at the end.',
          whySubAgents: {
            heading: 'Why sub-agents instead of a monolithic prompt?',
            reasons: [
              {
                title: 'Testability',
                detail: 'Each sub-agent has its own webhook. I can test it in isolation with an HTTP call, without spinning up the entire system.',
              },
              {
                title: 'Independent evolution',
                detail: 'Changing discount logic can\'t break appointments. I can iterate on one domain without risking another.',
              },
              {
                title: 'Cost efficiency',
                detail: 'Not every sub-agent needs the same model. Appointments runs on MiniMax M2.5 (fast and cheap for parsing time preferences). Quotes runs on GPT-4.1 mini (precision for structured output). Right-sized models per task.',
              },
              {
                title: 'Platform-agnostic',
                detail: 'Sub-agents are just webhooks. They don\'t know whether n8n (WhatsApp) or ElevenLabs (voice) is calling them. Any orchestrator can reuse them without duplicating logic.',
              },
            ],
          },
          agentsHeading: '4 Agents & 3 Tools to Rule Them All',
          agentsBody: '4 agents with their own LLM make decisions. 3 tools with no LLM execute pure business logic. All connected via webhooks.',
          toolsLabel: 'Tools (no LLM)',
          agents: [
            {
              kind: 'agent',
              icon: '🧭',
              name: 'Main Router (n8n)',
              desc: 'The brain of the WhatsApp channel. Classifies intent, picks the right sub-agent, and keeps track of the conversation with a 20-message memory window.',
              details: [
                'GPT-4.1 via OpenRouter · 37 nodes',
                'LangChain Agent pattern with 7 tools as HTTP endpoints',
                'Think tool for internal reasoning before complex chains',
                'Pseudo-streaming: splits responses into sentences, sends them one by one via WhatsApp',
              ],
            },
            {
              kind: 'agent',
              icon: '🎙️',
              name: 'Voice Router (ElevenLabs)',
              desc: 'The brain of the voice channel. Receives calls via Aircall → Twilio → ElevenLabs Conversational AI, with its own system prompt optimized for spoken conversation.',
              details: [
                'ElevenLabs Conversational AI · GPT-4o',
                'Same sub-agents as the Main Router, connected as HTTP tools',
                'Native RAG out-of-the-box: knowledge base with repair catalog, pricing and FAQs',
                'Voice-optimized latency: short, direct responses',
                'Business hours detection to transfer to a human outside hours',
              ],
            },
            {
              kind: 'agent',
              icon: '📅',
              name: 'Appointments Sub-agent',
              desc: 'Turns "tomorrow morning" into a confirmed booking. Parses natural language time preferences, checks YouCanBookMe for available slots, and sends a WhatsApp confirmation template.',
              details: [
                'MiniMax M2.5 via OpenRouter · 18 nodes',
                '15 temporal parsing rules: from "after lunch" to "any day except Monday"',
                'The most sophisticated sub-agent in the system',
              ],
            },
            {
              kind: 'agent',
              icon: '💰',
              name: 'Quotes Sub-agent',
              desc: 'Every price inquiry flows through here. Looks up the exact model and repair in Airtable, returns real pricing with stock status, and decides the next step.',
              details: [
                'GPT-4.1 mini via OpenRouter · 11 nodes',
                'Stock available? → offer appointment',
                'Out of stock? → offer order',
                'No listing? → link to the quote form',
              ],
            },
            {
              kind: 'tool',
              icon: '📦',
              name: 'Orders',
              desc: 'Creates repair orders in Airtable when a part is out of stock.',
              details: [
                '3 nodes: webhook → create record → respond',
                'Simple by design: all validation happened upstream in Quotes',
              ],
            },
            {
              kind: 'tool',
              icon: '🧮',
              name: 'Discount Calculator',
              desc: 'Pure business logic, no LLM. Calculates combo discounts when customers bundle multiple repairs.',
              details: [
                '3 nodes · no LLM',
                'Battery + screen + back glass = automatic multi-repair pricing',
                'Discount rules live here, not scattered across prompts',
              ],
            },
            {
              kind: 'tool',
              icon: '🙋',
              name: 'HITL Handoff',
              desc: 'The escape valve. Escalates to a human via Slack with a deep-link straight into the WATI conversation.',
              details: [
                '5 nodes · posts to #chat',
                'Includes conversation summary, detected intent, and customer history',
                'Human gets full context before opening the chat',
              ],
            },
          ],
          memory: {
            heading: 'Conversational Memory',
            body: 'Jacobo holds no state between messages. On every new message, it rebuilds context by reading the actual conversation history from WATI:',
            steps: [
              {
                label: 'Already served?',
                detail: 'A switch checks whether an active session exists for this phone number. If not, it triggers a memory reload.',
              },
              {
                label: 'WATI fetch',
                detail: 'HTTP call to getMessages/{waId} with pageSize=80. Retrieves the last 80 messages from the full conversation: customer messages, Jacobo responses, templates, broadcasts, and human operator messages.',
              },
              {
                label: '3-phase parsing',
                detail: 'Three code nodes transform raw WATI events into {human, ai} pairs compatible with LangChain. Filters out broadcasts, confirmation templates, and system events. A __reloadFlag__ allows manual memory resets.',
              },
              {
                label: 'Buffer Window',
                detail: 'The last 20 messages are loaded into the LangChain BufferWindow, keyed by phone number. The agent "remembers" past conversations: if you confirmed an appointment yesterday, Jacobo knows today.',
              },
            ],
            punchline: 'This is what lets Jacobo pick up interrupted conversations, recognize returning customers, and know when a human stepped in earlier.',
          },
          debugTools: {
            heading: 'Production debug tools',
            body: 'Two hidden commands to debug memory in production without touching n8n. "Borrar memoria" reset the customer\'s buffer, useful when a conversation got corrupted or the LLM entered a loop. "HISTORIAL" dumped the raw buffer JSON — and that\'s what taught us to sanitize responses: the LLM returned the full JSON to the customer if left unfiltered.',
          },
          pseudoStreaming: {
            heading: 'Pseudo-Streaming on WhatsApp',
            body: 'WhatsApp doesn\'t support streaming. A wall of text feels like a bot; sequential messages feel like someone typing. The router splits each response on line breaks and sends each chunk with a 1-second delay via the WATI API. Result: the "typing..." experience with zero streaming infrastructure.',
          },
          stackIntro: 'Jacobo runs on 8 services, end-to-end from first contact to human handoff. Every one is load-bearing — swap any of them and you\'re rearchitecting.',
          stack: [
            {
              name: 'WATI',
              role: 'WhatsApp Business API — primary inbound channel',
            },
            {
              name: 'Aircall',
              role: 'Cloud PBX — Jacobo as a teammate on the phone system',
            },
            {
              name: 'n8n',
              role: 'Workflow orchestration and sub-agents (7 workflows, ~80 nodes)',
            },
            {
              name: 'OpenRouter',
              role: 'Model-agnostic LLM gateway (MiniMax M2.5 + GPT-4.1)',
            },
            {
              name: 'ElevenLabs',
              role: 'Conversational voice agent (eleven_flash_v2_5, temp 0.0)',
            },
            {
              name: 'Airtable',
              role: 'CRM, inventory, customer history (source of truth)',
            },
            {
              name: 'YouCanBookMe',
              role: 'Appointment scheduling and availability',
            },
            {
              name: 'Slack',
              role: 'HITL escalation channel (#chat)',
            },
          ],
        },
        e2eFlows: {
          heading: 'End-to-End Flows',
          body: 'Each flow walks the happy path from inquiry to resolution, with the sub-agents involved called out at each step.',
          items: [
            {
              icon: '🔧',
              name: 'Repair Appointment',
              trigger: 'Customer asks about a repair',
              summary: 'From inquiry to confirmed appointment with reserved parts, zero human intervention.',
              agentsTouched: [
                'Router',
                'Quotes',
                'Appointments',
              ],
              details: [
                'Customer writes on WhatsApp: "Hi, how much does it cost to replace an iPhone 14 Pro screen?"',
                'Router classifies intent as price inquiry → delegates to Quotes sub-agent',
                'Quotes searches Airtable: model + repair type → returns real price (€189), part availability and estimated time (45-60 min)',
                'Stock available → Jacobo responds with price and asks: "Want to book an appointment?"',
                'Customer says "Yes, tomorrow morning" → Router delegates to Appointments sub-agent',
                'Appointments parses the time preference, queries YouCanBookMe → offers slots: "10:00 and 11:30"',
                'Customer confirms → appointment created in YouCanBookMe + work order generated in Airtable + parts auto-reserved from inventory',
                'Confirmation sent via WhatsApp with summary: date, time, price, store address',
              ],
            },
            {
              icon: '💬',
              name: 'Price Inquiry',
              trigger: 'Customer asks about repair or product price',
              summary: 'Airtable lookup with real data, CTA adapted based on stock availability.',
              agentsTouched: [
                'Router',
                'Quotes',
              ],
              details: [
                'Customer: "How much to replace a Samsung S23 battery?"',
                'Router classifies intent → delegates to Quotes',
                'GPT-4.1 searches Airtable: exact model + repair type',
                'If in stock → responds with price, time, and offers to book an appointment',
                'If NOT in stock → responds with price, indicates the part needs to be ordered, offers to place the order',
                'If model doesn\'t exist in the database → Jacobo clearly says so instead of making up a price',
                'Stock-aware routing: the CTA changes based on real availability in Airtable',
              ],
            },
            {
              icon: '🙋',
              name: 'Human Escalation (HITL)',
              trigger: 'Unclear intent, warranty, complaint, or explicit request',
              summary: 'Handoff with full context to the human team via Slack. The human doesn\'t start from scratch.',
              agentsTouched: [
                'Router',
                'HITL Handoff',
              ],
              details: [
                'Escalation triggers: detected frustration, out-of-domain query, warranty case, explicit request to speak with a person',
                'Router activates HITL Handoff → sends notification to Slack (#chat)',
                'The Slack message includes: conversation summary, detected intent, customer data from Airtable, escalation reason',
                'Deep-link to WATI: the human clicks and jumps straight into the customer\'s WhatsApp conversation',
                'The human doesn\'t start from scratch: they have full context. Average post-handoff resolution time: seconds, not minutes',
                'Jacobo tells the customer: "I\'m connecting you with a colleague who can help you better with this"',
              ],
            },
          ],
        },
        deepDiveBooking: {
          heading: 'Deep Dive: Natural Language Booking',
          body: 'The appointments sub-agent has one job: turn "tomorrow morning" into a confirmed booking with reserved parts. No forms, no calendar picker.',
          challenge: {
            heading: 'The challenge: bridging two worlds',
            body: 'The customer speaks natural language ("Thursday mid-morning, or else Friday afternoon"). The YouCanBookMe API speaks Unix timestamps. The sub-agent bridges the gap and finds the intersection.',
          },
          parseUrl: {
            heading: 'ParseURL',
            body: 'A Code node that extracts the subdomain from the YouCanBookMe URL to determine which booking profile to use. Parses the query string for dynamic form fields (repair type, customer data). Different calendars for different services: santifer-citav2-componentes for component repairs, santifer-citav2-diagnostico for diagnostics. The subdomain determines the entire booking flow downstream.',
          },
          analizarDisponibilidad: {
            heading: 'AnalizarDisponibilidad (LLM)',
            body: 'An LLM agent powered by MiniMax M2.5 converts natural language into a structured JSON array: [{date, start, end, exact}]. The system prompt contains 15 temporal parsing rules covering every real-world case. Includes a Structured Output Parser to guarantee valid format and per-session memory (sessionKey = phone/ycbmUrl) so the customer can refine preferences without starting over. If no explicit preference, returns the next 3 business days with full schedule.',
            rules: [
              'Default ranges: "morning" = 10:00-14:00, "afternoon" = 5:00-9:00pm, "all day" = 10:00-21:00',
              'Plurals: "mornings" → next 3 business mornings',
              'Explicit ranges: "10 to 12" → start=10:00, end=12:00, exact=true',
              'Conditionals: "or else Friday" → adds Friday as alternative range',
              'Rounding: 10:15 → 10:00-11:00 (1-hour block)',
              'Filters weekends automatically (Mon-Fri only)',
              '"Mid-morning" = 11:00-13:00, "first thing" = 10:00-11:00',
              '"After lunch" = 17:00-19:00',
              'Today only included if ≥2 hours of business hours remain',
              'Relative dates: "day after tomorrow", "next Tuesday" → resolved to absolute date',
            ],
          },
          ycbmApi: {
            heading: 'YCBM API (3 calls)',
            body: 'Sequential pipeline of 3 HTTP Requests against the YouCanBookMe API. Each call depends on the previous one — no parallelization possible:',
            steps: [
              { label: 'POST /v1/intents', detail: 'Sends the subdomain → creates a booking intent and returns a unique ID' },
              { label: 'GET /v1/intents/{id}/availabilitykey', detail: 'With the intent ID → retrieves the availability key' },
              { label: 'GET /v1/availabilities/{key}', detail: 'With the key → fetches all real available slots with Unix timestamps' },
            ],
          },
          filterSlots: {
            heading: 'FilterSlots — The Intersection',
            body: 'A pure Code node performing set intersection: LLM ranges × real YCBM slots. Converts Unix timestamps to Europe/Madrid using Intl.DateTimeFormat, then filters: localDate === r.date && localTime >= r.start && localTime < r.end. Output is an array [{date, timestamp, start}] that can contain 0, 1, or N slots. The most elegant node in the workflow: pure set logic, no LLM, no API — just temporal math.',
          },
          autoBooking: {
            heading: 'Conditional Auto-booking',
            body: 'An If node evaluates slots.length and branches into 3 paths. The sub-agent has its own per-session memory: the customer can refine ("no, Thursday instead") without starting over.',
            paths: [
              { condition: 'Exactly 1 slot', action: 'Auto-confirms (zero friction): preparePatchBody builds form data with email, phone, dynamic queryVars, and comments → emailCheck verifies email exists → patchSelections (PATCH /v1/intents/{id}/selections) → patchConfirm (PATCH /v1/intents/{id}/confirm) → confirmarCita informs the customer' },
              { condition: 'Multiple slots', action: 'escogerHora groups slots by date and presents options to the customer with contextual instructions' },
              { condition: '0 slots', action: 'Informs no availability in that range and asks for another time preference' },
            ],
          },
          punchline: 'The result: a customer writes "tomorrow mid-morning" and 3 seconds later has a confirmed appointment with reserved parts. No forms, no date picker, no friction. This is the difference between "I built a chatbot" and "I designed a system that translates human intent into API actions."',
        },
        toolCalling: {
          heading: 'Tool Calling in Production',
          body: 'Jacobo doesn\'t make up answers from training data. Every response is grounded in real systems via 7 tools defined as HTTP endpoints:',
          tools: [
            {
              name: 'presupuestoModelo',
              desc: 'Looks up repair/accessory prices and stock in Airtable. LLM: GPT-4.1 for structured output precision.',
            },
            {
              name: 'subagenteCitas',
              desc: 'Manages availability and bookings via YouCanBookMe. The LLM parses temporal preferences from natural language.',
            },
            {
              name: 'hacerPedido',
              desc: 'Creates repair/purchase orders in Airtable. 3 nodes: webhook → create record → respond.',
            },
            {
              name: 'Calculadora',
              desc: 'Volume discount: more repairs together = bigger discount. Pure business logic, no LLM.',
            },
            {
              name: 'contactarAgenteHumano',
              desc: 'HITL escalation via Slack with escalation reason, deep-link to WATI, and full context. Works from both WhatsApp and phone calls.',
            },
            {
              name: 'enviarMensajeWati',
              desc: 'Sends information via WhatsApp in parallel. When the voice agent needed to send a link or quote, it did so via WhatsApp while still talking on the phone.',
            },
            {
              name: 'Think',
              desc: 'Internal reasoning meta-tool. The agent "thinks out loud" before multi-tool chains to reduce errors.',
            },
          ],
          waitMessage: {
            heading: 'mensajeConsulta: UX while thinking',
            body: 'When Jacobo calls presupuestoModelo (1-3s latency), it fires mensajeConsulta first: an "I\'m checking availability..." that lands before the sub-agent responds. Without it, customers saw 5 seconds of dead air and assumed the bot was broken. One UX detail, massive difference.',
          },
          thinkTool: {
            heading: 'The "Think" Tool',
            body: 'Before executing a tool chain (check price → verify stock → offer appointment), the agent invokes Think to plan the sequence. Explicit reasoning before action cuts errors in multi-tool chains significantly.',
          },
          stockAware: {
            heading: 'Stock-Aware Routing',
            body: 'presupuestoModelo\'s output determines what happens next. It\'s not a fixed flow: the CTA adapts to real-time availability.',
            flows: [
              {
                condition: 'Part in stock',
                action: '→ Offers to book a repair appointment',
              },
              {
                condition: 'Part out of stock',
                action: '→ Offers to place an order with supplier ETA',
              },
              {
                condition: 'Model not found',
                action: '→ Clearly states it and offers human contact',
              },
            ],
          },
        },
        channels: {
          heading: 'The Two Channels',
          body: 'Jacobo runs on two channels simultaneously. The key: both share the same sub-agent webhooks. Business logic written once, served everywhere.',
          whatsapp: {
            name: 'WhatsApp (highest volume)',
            detail: 'WATI as WhatsApp Business API + n8n as orchestrator. 70% of queries flow through here.',
            highlights: [
              'n8n router with LangChain Agent pattern: 37 nodes, 7 tools as HTTP endpoints, GPT-4.1 via OpenRouter',
              'Meta-approved WhatsApp templates for appointment confirmations, order tracking and notifications',
              'Pseudo-streaming: splits the response into sentences and sends them one by one. The customer sees Jacobo "typing" like a real person',
              'Memory: 20 messages per session, keyed by phone number. Rebuilds context by reading full conversation history from WATI',
              'Event Routing: 3 switches filter noise (system events, broadcasts, human operator messages) before reaching the agent',
              'Transparent Human Takeover: when a human takes control via WATI, Jacobo detects the handoff and stays quiet',
            ],
          },
          voice: {
            name: 'Landline (voice)',
            detail: 'Aircall as Cloud PBX + Twilio as phone bridge + ElevenLabs as conversational voice agent. Jacobo sits on the Aircall phone system as a literal "teammate" with its own routing rules.',
            highlights: [
              'Aircall → Twilio → ElevenLabs integration: calls came through the business Aircall PBX. When no one answered or after hours, Aircall redirected to a dedicated Twilio number connected to the ElevenLabs agent. For the customer, it was transparent: they dialed the store landline and talked to Jacobo',
              'The customer called a landline and talked to Jacobo like any other employee. NOT a web widget or an IVR with menus. It was a real phone call with natural voice',
              'High-quality ASR (provider: ElevenLabs, PCM 16kHz) + 7s turn_timeout + 20s silence_end_call to handle natural conversational pauses',
              'LLM: GPT-4.1 (temp 0.0) for maximum precision in voice tool calling. Optimized latency (optimize_streaming_latency: 4)',
              'Voice model: eleven_flash_v2_5, speed 1.2x, stability 0.6, similarity 0.8. Conversations up to 5 minutes (300s)',
              'Knowledge base with 3 sources (Google Maps, Santifer iRepair website, business summary) leveraging ElevenLabs\' native RAG (e5_mistral_7b_instruct). Didn\'t build custom RAG: the platform offered it and it was high impact with zero effort. Pure RICE prioritization. n8n didn\'t need it: the WhatsApp agent already accessed business context via direct tool calling to Airtable',
              '5 shared webhook tools with n8n: presupuestoModelo, subagenteCitas, Calculadora, contactarAgenteHumano, and enviarMensajeWati. 20s timeout per tool, immediate execution',
              'enviarMensajeWati was the cross-channel magic: while talking on the phone, Jacobo sent links and quotes via WhatsApp in parallel using the caller_id as a dynamic variable. Customers loved getting the info on their phone while still on the call',
            ],
          },
          cocaColaAnecdote: {
            heading: 'Production incident: the Coca-Cola',
            body: 'A customer was discussing a phone repair. Mid-conversation, he turned to order a Coca-Cola from a waiter. Jacobo heard it — and told him we don\'t serve Coca-Colas.',
            diagnosis: {
              heading: 'Diagnosis: three signals the system ignored',
              items: [
                { label: 'Volume', detail: 'Dropped ~40% — he moved away from the phone' },
                { label: 'Spectral tilt', detail: 'Shifted — off-axis voice loses high frequencies' },
                { label: 'Semantic relevance', detail: '"Coca-Cola" had zero relation to phone repairs' },
              ],
            },
            takeaway: 'Basic VAD isn\'t enough. You need addressee detection: acoustic proximity + prosodic analysis + semantic gating working together.',
          },
          missedCallRecovery: {
            heading: 'Missed Call Recovery',
            body: 'If the customer hung up or no one answered, Aircall fired a webhook to Make.com which triggered a WhatsApp template via WATI with action buttons. A huge chunk of leads came through here: people who called, didn\'t wait, and Jacobo caught them. Since it pulled context from WATI, when they replied it already knew they\'d tried to call.',
          },
          dualOrchestrator: {
            heading: 'Dual-Orchestrator Architecture',
            body: 'This is the key pattern: n8n orchestrates WhatsApp, ElevenLabs orchestrates voice, but both hit the same sub-agent webhooks. A real microservices pattern applied to AI agents. The sub-agents don\'t know who\'s calling them. They don\'t need to.',
          },
          unifiedVoiceUx: {
            heading: 'Unified UX: One Voice',
            body: 'Every PBX audio — welcome greeting, IVR menu, voicemail — was generated with ElevenLabs using Jacobo\'s same voice. When the customer presses 3 or no one can answer and the live agent picks up, the voice is identical. No break. And if no one picks up and Jacobo texts them on WhatsApp after the missed call, the identity stays the same. A unified experience from start to finish, regardless of channel.',
            punchline: '"Press 3 to talk to me, Jacobo." That\'s the PBX introducing the AI agent in first person. The same voice that then picks up. An agent that announces itself.',
            audioIntro: 'Listen to the actual PBX. Jacobo\'s same voice across welcome, IVR menu, and live agent:',
            audios: [
              {
                src: '/jacobo/pbx-welcome.mp3',
                label: 'Welcome',
                transcript: '"We\'ll be right with you. Thank you for calling Santifer iRepair. For quality assurance, your call may be recorded."',
                transcriptOriginal: '"A continuación, atenderemos tu llamada. Gracias por llamar a Santifer iRepair. Para asegurar la calidad del servicio, tu llamada puede ser grabada."',
              },
              {
                src: '/jacobo/pbx-ivr.mp3',
                label: 'IVR Menu',
                transcript: '"Press 1 for a new repair. Press 2 to check your repair status. Press 3 to talk to me, Jacobo. Your 24/7 virtual assistant at Santifer iRepair. Get a quote and book an appointment instantly."',
                transcriptOriginal: '"Marca 1 para solicitar una nueva reparación. Marca 2 para consultar el estado de tu reparación. Marca 3 para hablar conmigo, Jacobo. Tu asistente virtual 24/7 en Santifer iRepair. Obtendrás presupuesto y cita al instante."',
                highlight: 'Press 3 to talk to me, Jacobo',
              },
            ],
          },
          eventRouting: {
            heading: 'Pre-filtering: Should Jacobo Respond?',
            body: 'Before a message reaches the AI Agent, three switches filter noise and decide who should respond:',
            steps: [
              {
                label: 'Event Type',
                detail: 'Filters only real messages. Ignores system events, delivery confirmations, status updates, and mass broadcasts. Without this, Jacobo would respond to its own confirmation messages.',
              },
              {
                label: 'Who sent it?',
                detail: 'Detects whether the last speaker was the customer or a human operator. When a human takes control of the conversation via the WATI deep-link, their messages arrive as owner: true. Jacobo knows this and doesn\'t interrupt.',
              },
              {
                label: 'Already served?',
                detail: 'Checks for an active session. If a customer replies to a conversation a human was handling, but the store has already closed, Jacobo enters with an empathetic tone: "We closed at noon, but I can help you until we reopen this afternoon." Real graceful degradation.',
              },
            ],
            punchline: 'This 3-node filter is what makes human-agent coexistence work without conflicts. The human can take over anytime. When they\'re gone, Jacobo picks back up with full context.',
          },
        },
        results: {
          heading: 'Results',
          body: 'Production metrics after 6 months live:',
          metrics: [
            {
              value: '~90%',
              label: 'Self-service',
              detail: 'Inquiries resolved without human intervention',
            },
            {
              value: '24/7',
              label: 'Availability',
              detail: 'No longer limited to store hours',
            },
            {
              value: '<30s',
              label: 'Response time',
              detail: 'Vs. minutes when it depended on a person',
            },
            {
              value: '<€200',
              label: 'Monthly cost',
              detail: 'Total infrastructure (n8n + WATI + Aircall + LLMs)',
            },
          ],
          beforeAfter: {
            heading: 'Before vs After',
            items: [
              {
                area: 'Price/stock inquiries',
                before: '~15 interruptions/day to the technician',
                after: 'Jacobo responds with real Airtable data in <30s',
              },
              {
                area: 'Appointment booking',
                before: 'Manual via phone, frequent scheduling errors',
                after: 'Automatic via YouCanBookMe, parts auto-reserved',
              },
              {
                area: 'After hours',
                before: 'Lost inquiries, customers going to competitors',
                after: 'Jacobo handles 24/7 via WhatsApp and landline',
              },
              {
                area: 'Human escalations',
                before: 'Human started from scratch, repeating questions',
                after: 'Handoff with full context, resolution in seconds',
              },
              {
                area: 'Customer support cost',
                before: 'Part-time employee ~€800-1,000/mo',
                after: '<€200/mo total infrastructure',
              },
            ],
          },
          roi: 'The real return isn\'t just the cost saving. It\'s the technician who\'s actually repairing phones instead of answering them, and the appointment that used to fall through the cracks at 10pm — now confirmed automatically.',
          benchmarks: 'Industry benchmark: enterprise contact centers average 20-30% AI resolution rate. The most advanced virtual assistants achieve 15%. Jacobo hit ~90% in a specialized domain. The difference: domain-specific sub-agents with real-time data access vs generic chatbots.',
          exitNarrative: 'Jacobo is still running 24/7 under new ownership since September 2025. The buyer acquired it operating — the best proof of a system: it runs without its creator. The architecture patterns documented here are the same ones I\'d bring to your team.',
        },
        decisions: {
          heading: 'Architecture Decision Records (ADRs)',
          body: 'The decisions that shaped the system — and why I made each one:',
          items: [
            {
              title: 'Multi-model (GPT-4.1 + MiniMax + GPT-4.1 mini) vs single LLM',
              detail: 'Each component with the right model: GPT-4.1 for the main router and voice agent (precise tool calling), GPT-4.1 mini for quotes (structured output), MiniMax M2.5 for appointments (fast and cheap for parsing time preferences). OpenRouter as gateway allows switching between models without rewriting workflows.',
            },
            {
              title: 'OpenRouter as model-agnostic gateway',
              detail: 'Switch between models without rewriting workflows, automatic fallback if a model is down. We evaluated Claude, GPT-4, MiniMax: chose by use case, not by brand.',
            },
            {
              title: 'n8n vs Make for orchestration',
              detail: 'Each sub-agent is an independent workflow with its own webhook. Make doesn\'t allow this modularity. n8n supports LangChain agent patterns, memory management and native tool calling.',
            },
            {
              title: 'Sub-agents as webhook microservices',
              detail: 'Decoupled, individually testable, independently deployable. The same sub-agent serves WhatsApp (via n8n) and phone (via ElevenLabs) without duplicating code.',
            },
            {
              title: 'Airtable as brain vs database',
              detail: 'The complete Business OS already existed in Airtable (12 bases, 2,100+ fields). Single source of truth for stock, prices and customer history. Build on what already exists, don\'t duplicate.',
            },
            {
              title: 'Memory window: 20 messages per session',
              detail: 'Balance between context and token cost. Sufficient for a repair conversation (95% resolve in <10 messages). Keyed by phone number for continuity.',
            },
            {
              title: 'Think tool for internal reasoning',
              detail: 'Explicit reasoning before multi-tool chains. Reduces errors because the LLM plans the sequence (check price → verify stock → offer appointment) before executing.',
            },
            {
              title: 'HITL via Slack with escalation reason',
              detail: 'The LLM generates the escalation reason and includes it in the Slack message: why human intervention is needed, what it has tried, and what the customer needs. Works identically from WhatsApp (deep-link to WATI) and phone calls. The human knows why they\'re needed before opening the conversation.',
            },
            {
              title: 'WhatsApp first, voice second',
              detail: '70% of volume came through WhatsApp. Starting there maximized impact before expanding to voice. Voice (ElevenLabs + Aircall) reused existing sub-agents without duplicating logic.',
            },
            {
              title: 'Dual-orchestrator with shared sub-agents',
              detail: 'n8n for WhatsApp/web, ElevenLabs for voice. Sub-agents are platform-agnostic webhooks. Reusable by any orchestrator without duplicating logic. A real microservices pattern.',
            },
            {
              title: 'ElevenLabs as "teammate" on Aircall',
              detail: 'Jacobo integrated into PBX with routing rules: picks up on overflow or after hours. The customer calls a landline, transparent experience. eleven_flash_v2_5 with temp 0.0 for maximum consistency.',
            },
            {
              title: 'Aircall → Twilio → ElevenLabs (and the latency trade-off)',
              detail: 'The Aircall PBX → Twilio (phone bridge) → ElevenLabs chain worked, but each hop added latency: ~950-1,500ms mouth-to-ear. Twilio uses G.711 at 8kHz when STT models are optimized for 16kHz, forcing resampling with accuracy loss. Today I\'d choose a direct SIP trunk (Telnyx offers G.722 wideband at native 16kHz and co-located infrastructure with sub-200ms RTT) eliminating the intermediate hop. The platform-agnostic sub-agent design would make this migration straightforward: only the transport changes, not the logic.',
            },
          ],
        },
        platformEvolution: {
          heading: 'Platform Evolution',
          tagline: 'Jacobo wasn\'t a weekend hack. It was the inevitable result of 5 years building a proper Business OS underneath.',
          steps: [
            {
              year: '2019-2024',
              event: 'Business OS as foundation',
              detail: 'Five years building a complete business operating system in Airtable: 12 bases, 2,100+ fields, real-time inventory, CRM with full customer history. Without this clean data layer, any AI agent would just be a generic chatbot making things up.',
            },
            {
              year: 'Jan 2025',
              event: 'Training and deliberate design',
              detail: 'Before writing a line of code, I studied AI agent architectures. I knew I needed tool calling, that Airtable was the SSOT, and that the same backend had to serve both voice and chat.',
            },
            {
              year: 'Feb 2025',
              event: 'First test version (monolithic)',
              detail: 'Tried the single-prompt-with-everything approach. Confirmed what I suspected: a monolithic prompt doesn\'t scale across multiple domains. This test validated the sub-agent-as-webhooks architecture, platform-agnostic by design.',
            },
            {
              year: 'Feb 2025',
              event: 'Definitive multi-agent version',
              detail: 'My first AI agent, shipped to production in under a month. Full sub-agent architecture: each domain in its own workflow with independent webhook, central router with tool calling, multi-model per use case. The speed came from the Business OS already running underneath. Built alongside all other business responsibilities.',
            },
            {
              year: 'Mar 2025',
              event: 'Voice channel (Aircall + Twilio + ElevenLabs)',
              detail: 'Jacobo as a teammate on the Aircall phone system, connected via Twilio to ElevenLabs. Reused existing sub-agents without duplicating logic. Validation of the platform-agnostic design: the webhooks served a second orchestrator without touching a single line.',
            },
            {
              year: 'Sep 2025',
              event: 'Going-concern sale',
              detail: 'Jacobo has been running 24/7 since launch. It was part of the business sale as an operational asset: the buyer acquired it operating. Five years of clean architecture made this exit possible.',
            },
          ],
          bridge: ['Jacobo wasn\'t an experiment.', '16 years building a business with my own hands.', 'Systematize it until it runs {without me}.', 'Jacobo was the piece that {closed the loop}.', 'I sold the business as a going concern.', 'The systems I built still run today — under {new ownership}.'],
          crossLink: {
            text: 'Jacobo was built on top of the Business OS I designed over 5 years — read the full case study →',
            href: '/business-os-for-airtable',
          },
        },
        lessons: {
          heading: 'Lessons Learned',
          items: [
            {
              title: 'Sub-agents > monolithic prompt.',
              detail: 'I tested a single prompt with full context during design and confirmed it doesn\'t scale across domains. The sub-agent architecture was deliberate from the start: each piece testable, iterable, and independent. Changing discounts can\'t break appointments. Microservices logic, applied to AI agents.',
            },
            {
              title: 'HITL isn\'t a fallback, it\'s a feature.',
              detail: 'A well-implemented handoff builds more trust than a bot that tries to handle everything. Customers value a system that knows when they need a person. The trick: the human picks up with full context, not from scratch.',
            },
            {
              title: 'The CRM is the agent\'s brain, not the LLM.',
              detail: 'Jacobo isn\'t smart because of the LLM. It\'s smart because it queries real prices, stock, and customer history in Airtable. Strip away that data and it\'s just another chatbot making things up.',
            },
            {
              title: 'Start with the highest-volume channel.',
              detail: 'WhatsApp carried 70% of volume. Starting there maximized impact. When voice came later, the sub-agents were already battle-tested. We just plugged in a new orchestrator.',
            },
            {
              title: 'Choose models by use case, not by brand.',
              detail: 'GPT-4.1 for router and voice (precise tool calling), GPT-4.1 mini for quotes (structured output), MiniMax M2.5 for appointments (fast and cheap). OpenRouter as gateway lets you swap models without rewriting. More FDE than "I use X for everything."',
            },
            {
              title: 'The Think tool prevents errors in multi-tool chains.',
              detail: 'Before checking price → verifying stock → offering an appointment, the agent makes its plan explicit. One reasoning step cuts errors in the chain. Rubber duck debugging, but for the agent itself.',
            },
          ],
        },
        whatIdDoDifferently: {
          heading: 'What I\'d Do Differently',
          body: 'Jacobo ran in production for months. Here\'s what I\'d change:',
          items: [
            {
              title: 'Structured evaluation from day 1',
              detail: 'I bolted on evals after the system was already in production. Starting over, I\'d define response quality metrics, intent classification accuracy, and HITL rate before v1. Retrofitting observability costs more than building it in from day one.',
            },
            {
              title: 'Direct SIP trunk instead of Aircall → Twilio → ElevenLabs',
              detail: 'The 3-hop chain added ~950-1,500ms mouth-to-ear latency and forced G.711 (8kHz) → 16kHz resampling. A Telnyx SIP trunk direct to ElevenLabs would give native G.722 wideband and sub-200ms RTT. I went with the long chain because Aircall was already contracted. Today I\'d prioritize latency over convenience.',
            },
            {
              title: 'Vector store for memory instead of raw WATI fetch',
              detail: 'Fetching 80 messages from WATI works, but doesn\'t scale for customers with long histories and can\'t do semantic search. A vector store (Pinecone, Qdrant) with conversation embeddings would unlock "remember when you brought the iPhone 12" without loading the full thread.',
            },
          ],
        },
        enterprisePatterns: {
          heading: 'Transferable Enterprise Patterns',
          body: 'Jacobo was built for an SMB. The patterns scale. Here\'s what I shipped vs. what I\'d add at enterprise scale:',
          builtVsEnterprise: [
            {
              pattern: 'Sub-agent routing with tool calling',
              built: 'Router + 7 webhook sub-agents with intent classification and delegation',
              enterprise: 'Add circuit breakers, retry policies and per-sub-agent model fallback',
            },
            {
              pattern: 'Multi-model orchestration',
              built: 'GPT-4.1 (router/voice) + GPT-4.1 mini (quotes) + MiniMax (appointments) via OpenRouter',
              enterprise: 'A/B testing models per sub-agent, canary deployments for new prompt versions',
            },
            {
              pattern: 'HITL framework',
              built: 'Escalation via Slack with full context and deep-link to the conversation',
              enterprise: 'Queue management, SLAs per customer tier, escalation reason analytics',
            },
            {
              pattern: 'Platform-agnostic sub-agents',
              built: 'Shared webhooks between n8n (WhatsApp) and ElevenLabs (voice)',
              enterprise: 'API gateway, rate limiting, authentication, endpoint versioning',
            },
            {
              pattern: 'Observability',
              built: 'n8n logs + Slack alerts',
              enterprise: 'Langfuse/Datadog for traces, latency and per-conversation cost tracking',
            },
            {
              pattern: 'Voice infrastructure',
              built: 'Aircall → Twilio → ElevenLabs: functional, but each hop adds latency (~950-1,500ms mouth-to-ear). Twilio uses G.711 at 8kHz, requiring resampling to 16kHz for STT models, degrading accuracy',
              enterprise: 'Direct SIP trunk (Telnyx/Plivo) → ElevenLabs via SIP, eliminating the Twilio hop. Telnyx offers G.722 wideband at native 16kHz (no resampling) and co-located infrastructure (GPU + telephony in the same PoP) with sub-200ms RTT. For apps/web: direct WebRTC (Opus 16-48kHz) via LiveKit, no PSTN, achieving 300-600ms mouth-to-ear',
            },
          ],
          applicability: {
            heading: 'Industry applicability',
            examples: [
              {
                domain: 'Travel (Hopper, Booking)',
                detail: 'Sub-agents for flights, hotels, insurance. HITL for complex changes. Tool calling against availability APIs.',
              },
              {
                domain: 'Fintech',
                detail: 'Sub-agents for transactions, balance queries, support. Stock-aware routing → balance-aware routing.',
              },
              {
                domain: 'Healthcare',
                detail: 'Sub-agents for appointments, results, triage. HITL as critical feature for specialist referral.',
              },
              {
                domain: 'E-commerce',
                detail: 'Sub-agents for tracking, returns, recommendations. Same inventory lookup and booking patterns.',
              },
              {
                domain: 'Voice AI Platforms',
                detail: 'Conversational agent orchestration with optimized latency. The cross-channel (voice → text) and HITL patterns apply directly to any voice platform.',
              },
              {
                domain: 'Data/AI Platforms',
                detail: 'Tool calling against internal APIs, intent-based sub-agent routing, memory management. The same architecture scales to any agent orchestrator.',
              },
            ],
          },
        },
        promptEngineering: {
          heading: 'Prompt Engineering in Production',
          body: 'No fine-tuning. For a repair shop agent, iterating on the prompt with hard rules is more pragmatic, cheaper, and faster than training a custom model. Every rule below has a production incident behind it.',
          whyNotFineTuning: {
            heading: 'Why hard rules in the prompt instead of fine-tuning?',
            reasons: [
              'Fine-tuning is expensive and slow to iterate. A prompt rule ships in seconds.',
              'The domain changed constantly: prices, stock, hours, promotions. A fine-tuned model goes stale in days.',
              'Rules are auditable. Anyone on the team can read the prompt and understand why Jacobo behaves a certain way.',
              '90% of production errors got fixed by adding one line to the prompt. Not retraining a model.',
            ],
          },
          businessHours: {
            heading: 'Business hours detection',
            body: 'A JavaScript code node checked whether the store was open before each conversation. The result got injected as a dynamic variable into the prompt: when `isBH` was false, Jacobo shifted tone ("after hours I\'ll try to help you anyway") and stopped promising immediate human responses.',
            code: `const madridTime = new Date().toLocaleString('en-US', {
  timeZone: 'Europe/Madrid',
});
const madridDate = new Date(madridTime);
const day  = madridDate.getDay();   // 0=Sunday … 6=Saturday
const hour = madridDate.getHours();

const isBH = day >= 1 && day <= 5 &&
             ((hour >= 10 && hour < 14) || (hour >= 17 && hour < 21));

return [{ json: { isBH } }];`,
          },
          mainPrompt: {
            heading: 'Main router system prompt (n8n)',
            body: 'Simplified version of the production prompt. The original has 18 rules and additional variables. Each block here reflects a deliberate prompt engineering technique.',
            segments: [
              {
                code: `## ROL
Te llamas Jacobo y trabajas en Santifer iRepair, tienda de reparación
de móviles, tablets, smartwatches en Sevilla. Eres un experto comercial
y en electrónica, que sabe diagnosticar los problemas que tienen los
usuarios en sus dispositivos móviles.`,
                annotations: [
                  {
                    label: 'Role prompting + persona',
                    detail: 'Defining ROL, name, company, and domain of expertise constrains the response space. Without this, the LLM wanders or invents services we don\'t offer.',
                  },
                ],
              },
              {
                code: `HorarioComercial={{ \$('isBH').item.json.isBH }}
- Si false → la tienda está cerrada: informa con amabilidad
- Si true → responde con normalidad y ofrece ayuda inmediata`,
                annotations: [
                  {
                    label: 'Dynamic variable injection',
                    detail: 'HorarioComercial is injected as a workflow variable. The prompt changes behavior without changing the prompt: a business decision (opening hours) controls the agent\'s tone.',
                  },
                ],
              },
              {
                code: `## Objetivo
Identificar modelo + avería → consultar stock → conversión hacia cita,
pedido o presupuesto.`,
                annotations: [
                  {
                    label: 'Conversion-oriented objective',
                    detail: 'The explicit goal ("conversion towards appointment, order, or quote") prevents the LLM from staying in technical chat without advancing. Without this, Jacobo would explain chip differences for minutes.',
                  },
                ],
              },
              {
                code: `Si el dispositivo no es móvil, tablet o
smartwatch, dar ayuda general pero no invitar a dejarlo en tienda.`,
                annotations: [
                  {
                    label: 'Scope limiting',
                    detail: 'Limits scope without rejecting the customer: the agent remains useful outside its domain but doesn\'t make promises.',
                  },
                ],
              },
              {
                code: `## Instrucciones
1. Identificar modelo y síntomas → llamar a "presupuestoModelo"
2. Si varias reparaciones → llamar a "Calculadora" (array de precios)
3. Tras respuesta de presupuestoModelo:
   3.1 Hay stock → ofrecer cita vía "subagenteCitas" con urlCita
   3.2 No hay stock → ofrecer pedido urgente vía "hacerPedido"
   3.3 No hay presupuesto → facilitar urlPresupuesto

## Herramientas
- "mensajeConsulta": mensaje de espera antes de consultar precio
- "presupuestoModelo": lookup de modelo + avería en Airtable
- "contactarAgenteHumano": escalado HITL vía Slack
- "Think": razonamiento interno antes de tool calls complejos
- "Calculadora": descuento multi-reparación
- "subagenteCitas": gestión de citas vía YouCanBookMe
- "hacerPedido": crear pedido en Airtable cuando no hay stock`,
                annotations: [
                  {
                    label: 'Tool definitions as contract',
                    detail: 'Each tool documented with its exact function and when to use it. The LLM needs to know what each tool does AND in what order to call them. Without the contract, it made redundant or misordered tool calls.',
                  },
                ],
              },
              {
                code: `## HARD RULES (nacidas de producción)
1. Siempre llamar a Think antes de responder o pasar datos`,
                annotations: [
                  {
                    label: 'Think tool as forced chain-of-thought',
                    detail: '"Always call Think before responding or passing data" forces explicit reasoning. Without this, the agent would jump straight to tool calls without verifying it had all parameters, causing errors.',
                  },
                ],
              },
              {
                code: `2. No modificar URLs de "presupuestoModelo" (Meta da error)
3. Un solo * para negrita (WhatsApp), no dos **
4. iPhone + Pantalla → ofrecer SIEMPRE opción premium (12 meses
   garantía vs 6). No está en web → derivar a humano si interesa
5. Enlaces planos, sin markdown (Meta rechaza [text](url))
6. Solo llamar a subagenteCitas TRAS presupuestoModelo
7. Diagnóstico: 19€, solo se cobra si no acepta la reparación
8. Correo: contacto@santiferirepair.es (no info@)`,
                annotations: [
                  {
                    label: 'Hard rules as production guardrails',
                    detail: 'The rules at the end aren\'t style preferences: they\'re corrections from real errors. Each one has a story behind it (broken URL, confused customer, lost sale). They\'re the equivalent of regression tests, but in the prompt.',
                  },
                ],
              },
              {
                code: `9. No decir "agendar" cita → decir "tomar" cita
10. No recomendar otras tiendas`,
                annotations: [
                  {
                    label: 'Negative prompting',
                    detail: '"Don\'t recommend other shops", "don\'t say agendar", "don\'t modify URLs". Telling the LLM what NOT to do is as important as telling it what to do: models tend to be overly "helpful".',
                  },
                ],
              },
            ],
          },
          voicePrompt: {
            heading: 'Voice agent system prompt (ElevenLabs)',
            body: 'Simplified version of the production voice prompt. Same domain, adapted for phone conversation. It shares the same webhook tools but the flow is more direct.',
            segments: [
              {
                code: `## ROL
Te llamas Jacobo y trabajas en Santifer iRepair, tienda de reparación
de móviles, tablets, smartwatches en Sevilla. Sé conciso, amigable y
resolutivo.`,
                annotations: [
                  {
                    label: 'Compact persona for voice',
                    detail: 'The WhatsApp prompt has an extensive ROL with tone rules. In voice, brevity is key: the LLM needs less context to generate short, natural responses. Fewer system tokens = lower first-response latency.',
                  },
                ],
              },
              {
                code: `## Objetivo
Identificar modelo + avería → consultar stock → facilitar enlace.
Solo dar detalles técnicos cuando el cliente no tenga clara la avería.
Objetivo: que el cliente tome cita (si hay stock) o genere pedido.`,
                annotations: [
                  {
                    label: 'Single-line conversion funnel',
                    detail: 'Same funnel as WhatsApp, condensed. In voice, the agent needs to decide fast: the conversation won\'t wait. One line with the full flow (model → stock → link) beats a paragraph.',
                  },
                ],
              },
              {
                code: `## Instrucciones
1. Obtener modelo y avería
2. Indicar que estás haciendo la consulta → llamar a "presupuestoModelo"
3. Enviar "urlSantifer" vía "EnviarMensajeWati" (WhatsApp en paralelo)
4. Si varias reparaciones → llamar a "Calculadora"
5. Informar precio + disponibilidad + "te he mandado la info por WhatsApp"`,
                annotations: [
                  {
                    label: 'Cross-channel UX',
                    detail: 'Step 3 is the magic: while the customer is still talking on the phone, Jacobo sends them the link via WhatsApp using the caller_id. The customer gets the info on their phone without hanging up. Customers loved it.',
                  },
                ],
              },
              {
                code: `## HARD RULES
1. No modificar URLs de "presupuestoModelo"
2. iPhone + Pantalla → ofrecer opción premium (12 meses garantía)
3. No decir "agendar" → decir "tomar"
4. Cierre 18-22 agosto: si necesitan recoger equipo → mensajería gratis

Número del cliente: {{system__caller_id}}`,
                annotations: [
                  {
                    label: 'Dynamic variable: caller_id',
                    detail: 'ElevenLabs injects {{system__caller_id}} with the incoming call\'s phone number. This is what enables cross-channel: Jacobo uses that number to send WhatsApp messages to the same customer who\'s on the phone.',
                  },
                ],
              },
            ],
          },
          citasPrompt: {
            heading: 'Appointments sub-agent system prompt (n8n)',
            body: '15 temporal parsing rules that convert colloquial phrases into JSON time ranges. This prompt powers the most complex sub-agent in the system: it bridges natural language and the YouCanBookMe API.',
            segments: [
              {
                code: `Eres un micro-servicio que convierte frases de preferencia horaria fecha y hora (español de España)
en un array JSON de rangos.`,
                annotations: [
                  {
                    label: 'Micro-service framing',
                    detail: 'Assigning the LLM the role of "micro-service" instead of "assistant" radically constrains its behavior: no greetings, no explanations, no questions. Just parse and return JSON. Reduces hallucinations to a minimum.',
                  },
                ],
              },
              {
                code: `REGLAS DE NEGOCIO
1. Rangos por defecto:
   – mañana = 10:00-14:00
   – tarde   = 17:00-21:00
   – "todo el día" = 10:00-21:00
2. exact será true solo si el usuario da una hora puntual que termine
   en 00 o 30 (ej. "lunes a las 10" o "martes a las 17:30" pero no
   "miércoles a las 10:15").
   Si menciona un rango ("martes de 10 a 12") ⇒ exact:false.
3. Horas con minutos ≠ 00 ó 30 se redondean:
   - Redondea hacia abajo al múltiplo de 30 min anterior.
   - Crea un rango de 1 hora a partir de esa hora redondeada
     (ej. 10:15 ⇒ 10:00-11:00, exact:true porque era puntual).
4. La fecha actual es {{ \$now.format('yyyy-MM-dd HH:mm') }} (Europe/Madrid).
5. Acepta varias peticiones separadas por "y", comas o punto y coma.`,
                annotations: [
                  {
                    label: 'Domain constraints as rules',
                    detail: 'Business hours, 30-minute slots, rounding logic, and timezone are encoded as explicit rules. Without these, the LLM invented non-existent time ranges or 15-minute slots.',
                  },
                ],
              },
              {
                code: `6. Devuelve EXCLUSIVAMENTE una llamada de función con esta forma:
   {"name":"slots","arguments":{"slots":[
     {"date":"AAAA-MM-DD","start":"HH:mm","end":"HH:mm","exact":true/false}
   ]}}
6.1 Si la frase incluye "mañana" sin especificar parte del día,
    trátalo como «todo el día» de mañana (10:00–21:00).`,
                annotations: [
                  {
                    label: 'Forced structured output',
                    detail: 'Enforcing a specific JSON schema guarantees the output is parseable by the next n8n node. "EXCLUSIVAMENTE" is key: without that word, the LLM would prepend conversational text before the JSON.',
                  },
                ],
              },
              {
                code: `7. PLURAL ("mañanas", "tardes"): devuelve las próximas N=3 franjas.
   Incluye hoy si la franja aún no ha terminado.
8. Solo abre de lunes a viernes. Nunca sábado ni domingo.
9. Conectores condicionales ("o", "o bien", "o si no"):
   preferencias alternativas en el mismo orden.
10. "A partir de [día]": todo el día (10:00-21:00) + N-1 laborables.
11. N=5 por defecto.
12. Día concreto: solo las horas de ese día.
13. "Esta semana": todas las franjas laborables restantes (Lu-Vi).
14. Plurales: próximas 3 franjas.
15. Sin preferencia horaria: próximos 3 días laborables, todo el día.`,
                annotations: [
                  {
                    label: 'Edge case enumeration',
                    detail: 'Each rule (7-15) addresses a real production failure: plurals, conditional connectors, "this week". Without explicitly enumerating each edge case, the LLM interpreted freely and generated incorrect slots.',
                  },
                ],
              },
              {
                code: `# EJEMPLOS
Input: "mañana por la mañana"
→ {"slots":[{"date":"[mañana]","start":"10:00","end":"14:00","exact":false}]}

Input: "martes de 10 a 12 y viernes todo el día"
→ {"slots":[
  {"date":"[martes]","start":"10:00","end":"12:00","exact":false},
  {"date":"[viernes]","start":"10:00","end":"21:00","exact":false}
]}

Input: "lunes a las 10"
→ {"slots":[{"date":"[lunes]","start":"10:00","end":"11:00","exact":true}]}`,
                annotations: [
                  {
                    label: 'Few-shot prompting',
                    detail: '3 input→output examples covering the 3 key scenarios: generic range (exact:false), multi-slot with "y", and exact time (exact:true). Just enough to anchor the format without overfitting behavior.',
                  },
                ],
              },
            ],
          },
          iterationExamples: {
            heading: 'Real iteration examples',
            items: [
              {
                rule: 'Don\'t modify URLs',
                origin: 'Meta rejected messages with concatenated URLs. A customer never received their appointment link because Jacobo merged two URLs into one.',
              },
              {
                rule: 'Single * for bold',
                origin: 'WhatsApp uses *text* for bold. Jacobo used **text** (markdown style) and the customer saw literal asterisks.',
              },
              {
                rule: 'Always offer premium screen for iPhone',
                origin: 'Customers asked after hanging up if there was a better option. High-margin sales were being lost.',
              },
              {
                rule: 'Don\'t say "agendar"',
                origin: 'In Spain, nobody says "agendar una cita" (schedule an appointment). It\'s an anglicism that LLMs use constantly. Customers noticed.',
              },
              {
                rule: 'Plain links, no markdown',
                origin: 'Meta/WhatsApp doesn\'t render [text](url). The customer saw broken text instead of a clickable link.',
              },
              {
                rule: 'Don\'t recommend other shops',
                origin: 'Jacobo recommended a competitor when a customer asked about a service we didn\'t offer. Quick lesson learned.',
              },
              {
                rule: 'Creator attribution as lead gen',
                origin: 'A recruiter asked Jacobo "who designed you?" and it didn\'t know. Now the production prompt includes rules mentioning Santiago as creator with a LinkedIn link. The agent becomes a passive lead generation channel.',
              },
            ],
          },
        },
        mainRouter: {
          heading: 'The Two Brains',
          body: 'Jacobo has two independent routers sharing the same tools and sub-agents. One orchestrates WhatsApp, the other handles voice calls. Same business logic, two completely different interfaces.',
          whatsappRouter: {
            heading: 'WhatsApp Router (n8n)',
            body: 'The text brain: an n8n workflow with 37 nodes that classifies every message, decides which sub-agent to invoke, and orchestrates the response. Tool calling, prompt engineering, and all routing logic live here.',
          },
          voiceRouter: {
            heading: 'Voice Router (ElevenLabs)',
            body: 'The voice brain: a conversational agent on ElevenLabs powered by Gemini 2.5 Flash, knowledge bases with business documentation, and the same tools exposed as webhooks. The customer talks on the phone and Jacobo responds in real time, checking prices, availability and managing appointments — exactly the same as WhatsApp.',
          },
        },
        deepDiveQuotes: {
          heading: 'Deep Dive: Quotes Sub-agent',
          body: 'The quotes sub-agent is the most critical in the system: every price inquiry flows through it. It uses GPT-4.1 mini via OpenRouter for structured output precision. Its response determines the entire flow\'s next step.',
          challenge: {
            heading: 'The challenge: from free text to structured quote',
            body: 'The customer writes "how much to replace the screen on an iPhone 15 Pro Max". The router needs a JSON with price, stock status, appointment and part URLs. The sub-agent bridges natural language with the Airtable database in real time.',
          },
          cleanModel: {
            heading: 'CleanModel — Encoding tacit knowledge',
            body: 'Customers don\'t type model names like a database. They write "iphone 15", "iPhone15 pro max", "ip 15 pro", "I-Phone 15Pro Max". A human technician solved this with experience — they knew "the big black one" was probably a Pro Max. That tacit knowledge gets lost if you don\'t design for it.',
            detail: 'CleanModel normalizes the input: strips spaces, parentheses, hyphens, and lowercases. "iPhone 15 Pro Max" → "iphone15promax". This feeds a SEARCH() lookup in Airtable on the modeloLimpio field (also normalized), enabling fuzzy matching without relying on exact spelling.',
            insight: 'This node encodes tacit business knowledge. Without it, the agent would fail on most real inputs — because customers don\'t talk like databases. It\'s an example of why building agents requires domain understanding, not just connecting APIs.',
          },
          aiAgent: {
            heading: 'AI Agent — GPT-4.1 mini via OpenRouter',
            body: 'The sub-agent\'s brain. System prompt with an ultra-scoped ROLE: "agent specialized in looking up prices". Includes Think tool for explicit reasoning before each tool call and Simple Memory (buffer window) with a static sessionKey.',
            tools: [
              {
                label: 'BuscarModelo',
                detail: 'Searches by modeloLimpio field in the Models table → returns RECORD_ID, Name, URLSantiferNueva, Cita diagnóstico.',
              },
              {
                label: 'BuscarReparacionesModelo',
                detail: 'Searches by RECORD_ID → returns 20 repair types with "Price, stock & appointment" (original screen, compatible, battery, microphone, speaker, charging port, rear/front camera, etc.).',
              },
              {
                label: 'Structured Output Parser',
                detail: 'Formats to JSON with schema: modelo, reparación, precio, stock, urlSantifer, urlCita, urlPresupuesto, urlDiagnostico, idPiezaAirtable, idModeloAirtable.',
              },
            ],
            fallback: 'If no match is found, the system prompt instructs: "you must keep narrowing the model to get more results, until you find the right one" — replicating a seasoned technician\'s reasoning.',
          },
          filtrarRespuesta: {
            heading: 'FiltrarRespuesta — Deterministic post-processing',
            body: 'Code node that validates and cleans the AI Agent\'s response before returning it to the router. Validates that urlSantifer points to the correct domain (if it doesn\'t contain "santiferirepair.es" → "NOT AVAILABLE ON WEB YET"). Then applies 3 field-stripping paths based on state:',
            rules: [
              {
                condition: 'stock === true',
                action: 'Strips urlPresupuesto, idPieza, idModelo — customer can book an appointment directly.',
              },
              {
                condition: 'stock === false',
                action: 'Strips urlCita and urlPresupuesto — part needs to be ordered before repair.',
              },
              {
                condition: 'precio === "PRESUPUESTO"',
                action: 'Strips urlCita and idPieza — repair not catalogued, requires manual assessment.',
              },
            ],
          },
          punchline: 'The result: a customer asks "how much to fix my iPhone screen" and in 4 seconds gets a real price, stock availability, and a direct link to book an appointment or place an order. No forms, no "let me transfer you". The sub-agent queries only the essential Airtable fields and returns exactly what the router needs to close the conversion.',
          presupuestoPrompt: {
            heading: 'Quotes sub-agent system prompt (n8n)',
            body: 'The prompt defines three tools (BuscarModelo, BuscarReparacionesModelo, Structured Output Parser) and a 4-step flow to return structured quotes with stock status.',
            segments: [
              {
                code: `## ROL
Eres un sub-agente de presupuestos para Santifer iRepair.
Tu trabajo: recibir un modelo y una reparación, buscarlos en Airtable
y devolver un presupuesto estructurado.`,
                annotations: [
                  {
                    label: 'Scoped sub-agent role',
                    detail: 'Not a general assistant: a sub-agent with a single responsibility. The ultra-narrow scope eliminates the LLM\'s temptation to chat, suggest alternatives, or add unsolicited context.',
                  },
                ],
              },
              {
                code: `## OBJETIVO
Buscar el modelo exacto y la reparación solicitada en la base de datos.
Devolver precio, disponibilidad de stock y siguiente paso recomendado.`,
                annotations: [
                  {
                    label: 'Single-responsibility objective',
                    detail: 'One job: look up + return quote. The "recommended next step" (appointment, order, manual quote) lets the main router decide without another LLM call.',
                  },
                ],
              },
              {
                code: `## HERRAMIENTAS
- "BuscarModelo": busca el modelo del dispositivo en Airtable
- "BuscarReparacionesModelo": busca reparaciones disponibles para ese modelo
- "Structured Output Parser": formatea la respuesta en JSON estructurado`,
                annotations: [
                  {
                    label: 'Tool chain pipeline',
                    detail: 'The 3 tools form a sequential pipeline: find model → find repairs → format. The Structured Output Parser at the end guarantees the JSON is consumable by the router without post-processing.',
                  },
                ],
              },
              {
                code: `## PASOS
1. Recibir modeloInput y reparacionInput del router
2. Llamar a BuscarModelo con modeloLimpio
3. Si encuentra el modelo → llamar a BuscarReparacionesModelo
4. Devolver JSON: precio, stock, tiempo estimado, urlCita, urlPresupuesto`,
                annotations: [
                  {
                    label: 'Explicit step sequencing',
                    detail: 'Deterministic step-by-step order. Without this, the LLM would sometimes skip BuscarModelo and try to guess the price. Each step conditions the next: zero ambiguity about what to do.',
                  },
                ],
              },
              {
                code: `// User message template (n8n injects the variables)
Modelo: {{ \$json.modeloInput }}
Modelo limpio: {{ \$json.modeloLimpio }}
Reparación: {{ \$json.reparacionInput }}`,
                annotations: [
                  {
                    label: 'Variable injection via template',
                    detail: 'n8n injects modeloInput (what the customer said), modeloLimpio (normalized by the router), and reparacionInput. Separating raw/clean input lets the sub-agent search with the normalized name without losing the customer\'s original context.',
                  },
                ],
              },
            ],
          },
        },
        deepDiveOthers: {
          heading: 'Deep Dive: Tools',
          body: 'Not every piece of the system needs an LLM. These three tools are lightweight workflows that each execute a single operation, simple by design: decision logic lives in the router.',
          orders: {
            heading: 'hacerPedido: Rush Orders',
            body: 'When the quotes sub-agent detects the part is out of stock, the router invokes hacerPedido. The workflow creates a record in the Airtable "Pedidos" table with everything the team needs to order from the supplier.',
            nodes: 'Webhook → Airtable Create (Pedidos table) → Respond to Webhook',
            details: [
              'Automatically flags "Rush? = YES" because the customer is waiting',
              'Links idPieza and idModelo for full traceability in the Business OS',
              'Adds note "Automated order by Jacobo" + customer comment',
              'The team receives the order in their Airtable view with zero manual intervention',
            ],
          },
          calculator: {
            heading: 'Discount Calculator',
            body: 'Pure business logic, zero LLM. When the customer needs multiple repairs (e.g., screen + battery + back glass), the router sends a price array and the calculator applies tiered discounts automatically.',
            nodes: 'Webhook → Code (discount logic) → Response',
            details: [
              'Sorts prices high-to-low: the most expensive repair gets no discount',
              'Position-based discount: ≤€50 → €15 off, ≤€100 → €20 off, >€100 → €25 off',
              'Returns formatted summary: price without discount, discount applied, final price',
              'The customer instantly sees how much they save by bundling repairs in one visit',
            ],
            segments: [
              {
                code: `const precios = item.json.body.precios;

// Validaciones básicas
if (!Array.isArray(precios) || precios.length < 2) {
    throw new Error('Debes enviar un array "precios" con al menos 2 números.');
}`,
                annotations: [
                  {
                    label: 'Defensive validation',
                    detail: 'The sub-agent doesn\'t trust the router: validates the array exists and has at least 2 prices. If the LLM sent malformed data, it fails fast with a descriptive error instead of returning NaN.',
                  },
                ],
              },
              {
                code: `// 1) Ordenamos de mayor a menor
const ordenados = [...precios].sort((a, b) => b - a);

// 2) Calculamos descuento por posición (el primero no tiene)
const descuentos = ordenados.map((precio, idx) => {
    if (idx === 0) return 0;        // sin descuento para el más caro
    if (precio <= 50)  return 15;
    if (precio <= 100) return 20;
    return 25;                      // >100 €
});`,
                annotations: [
                  {
                    label: 'Business rules as code, not as prompt',
                    detail: 'Discounts live in a Code node, not a prompt. This guarantees determinism: a €189 screen + €45 battery always yields the exact same discount. Zero hallucinations possible.',
                  },
                ],
              },
              {
                code: `// 3) Totales
const totalSinDescuento = ordenados.reduce((s, p) => s + p, 0);
const descuentoTotal    = descuentos.reduce((s, d) => s + d, 0);
const totalConDescuento = totalSinDescuento - descuentoTotal;

// 4) Preparar respuesta
const resumen =
    \`Presupuesto total sin descuento: \${totalSinDescuento.toFixed(2)} €
Descuento aplicado: \${descuentoTotal.toFixed(2)} €
Presupuesto reparándolo todo junto: \${totalConDescuento.toFixed(2)} €\`;`,
                annotations: [
                  {
                    label: 'Pre-formatted response for the router',
                    detail: 'The plain-text summary goes to the router and is passed directly to the customer. The LLM doesn\'t rephrase: it copies the text verbatim. The price the customer sees is exactly what the code calculated.',
                  },
                ],
              },
            ],
          },
          hitl: {
            heading: 'HITL Handoff: Human Escalation',
            body: 'The system\'s escape valve. When Jacobo detects it can\'t resolve (frustrated customer, complex case, out-of-scope request), it escalates to a human via Slack with full context.',
            nodes: 'Webhook → Slack (#chat) → Respond to Webhook',
            details: [
              'Posts to #chat channel with 🤖 emoji as avatar',
              'Message includes: conversation summary, detected intent, and customer history',
              'Deep-link directly to the WATI conversation: the human opens it with full context already loaded',
              'Jacobo confirms to the customer that a human will reach out, without cutting the conversation',
            ],
          },
          whatsapp: {
            heading: 'EnviarMensajeWati: Cross-Channel',
            body: 'The bridge between channels. When the customer is on the phone with Jacobo (ElevenLabs), this workflow sends links and confirmations via WhatsApp in parallel. The customer gets the info in writing while still talking.',
            nodes: 'Webhook → HTTP Request (WATI API) → Respond to Webhook',
            details: [
              'Sends "urlreparacion2" template with the personalized appointment URL',
              'Enables the voice agent to say "I just sent you the link on WhatsApp"',
              'The customer doesn\'t need to write anything down: when they hang up, the info is already on their phone',
            ],
          },
        },
      },
      cta: {
        heading: 'Looking for someone to build this for your company?',
        body: 'Jacobo handles appointments, queries real inventory, and escalates with context, all in under 30 seconds. The sub-agent architecture, tool calling, and HITL patterns apply directly to travel, fintech, healthcare, or e-commerce.',
        label: 'LinkedIn',
        labelSecondary: 'Email',
      },
      ctaAfterEnterprise: {
        heading: 'These patterns are ready to scale. So am I.',
      },
      ctaAfterDownloads: {
        heading: 'You liked the workflows. Imagine what I can do with yours.',
      },
      faq: {
        heading: 'FAQ',
        items: [
          {
            q: 'How much does it cost to build an AI agent for WhatsApp?',
            a: 'The tools (n8n cloud, WATI, Aircall, LLMs via OpenRouter) cost less than €200/month total. The main cost is the time to design and develop the architecture. For a business this size, it\'s a fraction of the cost of a part-time customer service employee.',
          },
          {
            q: 'What happens if the AI gets a price wrong?',
            a: 'Prices don\'t come from the LLM: they come from Airtable. Jacobo queries inventory in real time. If a price changes in Airtable, Jacobo gives the correct price automatically. No hallucination possible on structured data.',
          },
          {
            q: 'How does the voice agent on a landline work?',
            a: 'Jacobo is integrated into the Aircall PBX as another "teammate". It picks up when no one else can or after hours. The customer calls a landline and talks to Jacobo with natural voice (ElevenLabs). It uses the same sub-agent webhooks as WhatsApp: same logic, different interface.',
          },
          {
            q: 'Why n8n and not LangChain/LangGraph directly?',
            a: 'n8n lets each sub-agent be a visual workflow with its own webhook, testable with an HTTP call. The maintenance barrier is lower than a Python repo. For this system\'s complexity (7 workflows, ~80 nodes), n8n\'s visualization is an advantage, not a limitation.',
          },
          {
            q: 'How long did it take to build Jacobo?',
            a: 'Less than a month from design to production. And it was my first AI agent, built in parallel with all other business responsibilities. The speed came from the Business OS already existing: clean, accessible data in Airtable, real-time inventory, CRM with history. Without that 5-year foundation, it would have been much slower. Jacobo was the inevitable consequence of a robust business operating system.',
          },
          {
            q: 'Can you build something like this for my company?',
            a: 'Yes. Jacobo\'s patterns (sub-agents, tool calling, HITL, cross-channel) are industry-agnostic. What changes is the data and integrations, not the architecture. If your business has structured data and repetitive processes, I can design a similar system.',
          },
          {
            q: 'Is Jacobo still running?',
            a: 'Yes. I sold the business in 2025 and Jacobo was sold with it — it\'s still in production serving customers today. That\'s the best validation possible: the buyer kept the system because it works.',
          },
          {
            q: 'How did you go from owning a business to looking for an enterprise role?',
            a: 'I built a 16-year business with systems that scale: custom ERP, AI agent, programmatic SEO, gamified CRM. Now I want to apply that same systems thinking to bigger problems — as an FDE, Solutions Architect, or AI Production Manager.',
          },
        ],
      },
      resources: {
        heading: 'Resources',
        items: [
          {
            label: 'n8n — Workflow Automation',
            url: 'https://n8n.io',
          },
          {
            label: 'OpenRouter — Model Gateway',
            url: 'https://openrouter.ai',
          },
          {
            label: 'ElevenLabs — Conversational AI',
            url: 'https://elevenlabs.io',
          },
          {
            label: 'WATI — WhatsApp Business API',
            url: 'https://www.wati.io',
          },
          {
            label: 'Aircall — Cloud PBX',
            url: 'https://aircall.io',
          },
          {
            label: 'Airtable — Database Platform',
            url: 'https://airtable.com',
          },
        ],
      },
      downloads: {
        badge: '7 production workflows downloadable — open source by default',
        inlineLabel: 'View on GitHub',
        inlineHint: 'Import into n8n in 1 click',
        section: {
          heading: 'Run It Yourself',
          intro: 'These are the actual workflows that have been running in production for 2 years. Sanitized, documented, ready to import into n8n. If you build something with them, I\'d love to see it.',
          downloadAllLabel: 'Download all (ZIP)',
          downloadAllSize: '~37 KB',
          importHeading: 'How to import into n8n',
          importSteps: [
            'Open your n8n instance and go to Workflows',
            'Click "..." → "Import from file"',
            'Select any .json file from the download',
            'Update credentials (API keys, webhooks) with your own values',
          ],
        },
        workflows: [
          {
            id: 'jacobo-chatbot-v2',
            icon: '🧭',
            name: 'Jacobo Chatbot V2',
            subtitle: 'Central Router',
            description: 'The brain of the WhatsApp channel. Classifies intent, picks the right sub-agent, maintains a 20-message memory window.',
            href: 'https://github.com/santifer/jacobo-workflows/blob/main/jacobo-chatbot-v2.json',
            fileSize: '~66 KB',
            nodes: '37 nodes',
            llm: 'GPT-4.1',
          },
          {
            id: 'subagente-citas',
            icon: '📅',
            name: 'subagenteCitas',
            subtitle: 'Appointment Booking',
            description: 'Turns "tomorrow morning" into a confirmed appointment. Parses natural language time preferences.',
            href: 'https://github.com/santifer/jacobo-workflows/blob/main/subagente-citas.json',
            fileSize: '~24 KB',
            nodes: '18 nodes',
            llm: 'MiniMax M2.5',
          },
          {
            id: 'presupuesto-modelo',
            icon: '💰',
            name: 'Presupuesto Modelo',
            subtitle: 'Quote Agent',
            description: 'Looks up exact model + repair in Airtable, returns real price with stock status.',
            href: 'https://github.com/santifer/jacobo-workflows/blob/main/presupuesto-modelo.json',
            fileSize: '~15 KB',
            nodes: '11 nodes',
            llm: 'GPT-4.1 mini',
          },
          {
            id: 'hacer-pedido',
            icon: '📦',
            name: 'hacerPedido',
            subtitle: 'Order Creation',
            description: 'Creates repair orders in Airtable when parts are out of stock.',
            href: 'https://github.com/santifer/jacobo-workflows/blob/main/hacer-pedido.json',
            fileSize: '~79 KB',
            nodes: '3 nodes',
          },
          {
            id: 'calculadora-santifer',
            icon: '🧮',
            name: 'CalculadoraSantifer',
            subtitle: 'Discount Calculator',
            description: 'Pure business logic. Calculates combo discounts when customers bundle multiple repairs.',
            href: 'https://github.com/santifer/jacobo-workflows/blob/main/calculadora-santifer.json',
            fileSize: '~2.7 KB',
            nodes: '3 nodes',
          },
          {
            id: 'contactar-agente-humano',
            icon: '🙋',
            name: 'contactarAgenteHumano',
            subtitle: 'HITL Handoff',
            description: 'The escape valve. Escalates to human via Slack with a deep-link to the conversation.',
            href: 'https://github.com/santifer/jacobo-workflows/blob/main/contactar-agente-humano.json',
            fileSize: '~2.3 KB',
            nodes: '5 nodes',
          },
          {
            id: 'enviar-mensaje-wati',
            icon: '📱',
            name: 'EnviarMensajeWati',
            subtitle: 'WhatsApp Sender',
            description: 'Cross-channel bridge: the voice agent sends WhatsApp messages via the WATI API.',
            href: 'https://github.com/santifer/jacobo-workflows/blob/main/enviar-mensaje-wati.json',
            fileSize: '~2.5 KB',
            nodes: '3 nodes',
          },
        ],
        githubNote: 'All workflows live on GitHub — fork, star, or download directly.',
        githubCta: 'View repo on GitHub',
      },
      footer: {
        role: 'AI Product Manager · Solutions Architect',
        bio: 'Built and sold a 16-year business in 2025. Now applying the same systems thinking to enterprise AI — as an FDE, Solutions Architect, or AI Production Manager.',
        fellowAt: 'Teaching Fellow at',
        fellowLink: 'AI Product Academy',
        copyright: 'All rights reserved.',
      },
    },
  } as const
