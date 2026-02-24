export type N8nLang = 'es' | 'en'

/**
 * Classification prompt used in Workflow 2.
 * Identical in both languages — it's a prompt for LLMs, always in English.
 */
export const CLASSIFICATION_PROMPT = `You are a product feedback classifier for a SaaS company.

Your task: classify the feedback below into exactly ONE category.

Categories:
- BUG — The user reports something broken, crashing, erroring, or not
  working as expected. Look for words like: crash, error, broken, fail,
  wrong, doesn't work, can't.
- FEATURE — The user requests new functionality or an improvement to
  existing features. Look for words like: add, would be nice, wish,
  could you, suggestion, improve.
- QUESTION — The user asks how to do something or needs help
  understanding the product. Look for words like: how do I, where is,
  can I, is it possible, help.

Rules:
- If the feedback contains BOTH a bug and a feature request, classify
  as BUG (broken things take priority).
- If unclear, classify as QUESTION (safest default — a human will review).
- Respond with ONLY the category name in caps. No explanation, no punctuation.

Feedback: {{ $json.Feedback }}`

export const n8nContent = {
  es: {
    slug: 'n8n-para-pms',
    altSlug: 'n8n-for-pms',
    readingTime: '5 min de lectura',
    seo: {
      title: 'n8n para Product Managers: Automatiza Sprint Reports y Clasifica Feedback con IA',
      description: 'Cheat sheet práctico para Product Managers: automatiza sprint reports y clasifica feedback con IA usando n8n. 2 workflow templates importables, un prompt listo para usar y guía paso a paso.',
    },
    nav: {
      back: 'santifer.io',
      breadcrumbHome: 'Inicio',
      breadcrumbCurrent: 'n8n para PMs',
    },
    header: {
      kicker: 'Lightning Session — AI Product Academy',
      h1: 'n8n para Product Managers',
      subtitle: 'Cheat sheet práctico: automatiza tus sprint reports y clasifica feedback con IA — sin escribir código.',
      date: '24 feb 2026',
    },
    intro: {
      hook: '¿Cuántas horas a la semana dedicas a trabajo que no tiene nada que ver con producto?',
      body: 'Yo lo medí. Veinte. Algunas semanas, treinta. Sprint reports que se comen un día entero. Feedback disperso en cinco herramientas que tenía que leer, clasificar y convertir en tickets uno por uno. Status updates escritos desde cero cada lunes.',
      punchline: 'No era product manager. Era un router de datos muy caro. Moviendo información entre herramientas que deberían hablarse entre ellas. Gastaba 170 horas al mes en esto en mi propia empresa antes de automatizarlo todo. Hoy te enseño cómo hacer lo mismo con dos workflows que puedes montar en una tarde.',
    },
    timeSinks: {
      heading: 'Los 5 Sumideros de Tiempo del PM (20-30 horas/semana)',
      columns: { num: '#', sink: 'Sumidero', hours: 'Horas/semana', pattern: 'Patrón de automatización' },
      rows: [
        { num: '1', sink: 'Sprint reports', hours: '8-12/sprint', pattern: 'Schedule → Query → Format → Send' },
        { num: '2', sink: 'Clasificar feedback', hours: '5-10', pattern: 'Trigger → AI Classify → Route' },
        { num: '3', sink: 'Mover datos entre herramientas', hours: '3-5', pattern: 'Trigger → Extract → Create → Notify' },
        { num: '4', sink: 'Mantener al equipo sincronizado', hours: '2-4', pattern: 'Schedule → Aggregate → Summarize → Post' },
        { num: '5', sink: 'Preparar decisiones', hours: '1-2/reunión', pattern: 'Schedule → Multi-query → Compile → Send' },
      ],
    },
    workflow1: {
      heading: 'Workflow 1: El Viernes Automatizable',
      description: 'Sprint report automático que se publica en Slack cada viernes a las 9am.',
      pipelineLabels: [
        { name: 'Schedule', detail: '(Vie 9am)' },
        { name: 'Airtable', detail: '(leer sprint)' },
        { name: 'Code', detail: '(formatear)' },
        { name: 'Slack', detail: '(publicar)' },
      ],
      imgAlt: 'Workflow n8n de sprint report automatizado para product managers: Schedule Trigger cada viernes → Leer datos del sprint en Airtable → Formatear reporte con nodo Code → Publicar en canal de Slack',
      imgTitle: 'Workflow 1: Sprint Report Automatizado con n8n',
      figcaption: 'Workflow 1 en n8n: sprint report automatizado — Schedule → Airtable → Code → Slack',
      nodesHeading: 'Nodos clave:',
      nodes: [
        { name: 'Schedule Trigger:', detail: 'Cada semana, viernes, 9:00 AM' },
        { name: 'Airtable:', detail: 'Filtrar por Sprint = Actual, Status = Done' },
        { name: 'Code node:', detail: 'Agrupar por asignado, contar story points, formatear como Slack markdown' },
        { name: 'Slack:', detail: 'Publicar en #sprint-updates' },
      ],
      quote: 'Tu sprint report llega cada viernes a las 9:05. No hiciste nada.',
      downloadLabel: 'Descargar Workflow 1 JSON',
    },
    transition: {
      line1: 'No hay IA en el Workflow 1. Es pura fontanería.',
      line2: 'Cuatro nodos que te ahorran 4-6 horas por sprint. Ahora imagina qué pasa cuando añadimos inteligencia.',
    },
    workflow2: {
      heading: 'Workflow 2: El Router Inteligente',
      description: 'Clasificación de feedback con IA que envía bugs, features y preguntas al canal de Slack correcto. Un nodo de IA convierte una tubería tonta en una tubería inteligente.',
      pipelineLabels: [
        { name: 'Form Trigger', detail: '' },
        { name: 'AI Classify', detail: '(LLM)' },
        { name: 'Switch', detail: '(Bug/Feature/Question)' },
        { name: 'Slack', detail: '+ Airtable' },
      ],
      imgAlt: 'Workflow n8n de clasificación de feedback con IA para product managers: Form Trigger → Clasificador IA con Claude → Nodo Switch enruta bugs, features y preguntas a canales de Slack separados → Log en Airtable',
      imgTitle: 'Workflow 2: Clasificación de Feedback con IA en n8n',
      figcaption: 'Workflow 2 en n8n: clasificador de feedback con IA — Form → Claude AI → Switch → Slack + Airtable',
      nodesHeading: 'Nodos clave:',
      nodes: [
        { name: 'n8n Form Trigger:', detail: 'Nombre, Email, Texto de Feedback, Área de Producto' },
        { name: 'Basic LLM Chain:', detail: 'Clasificar feedback con IA' },
        { name: 'Switch:', detail: 'Enrutar según output del LLM (BUG / FEATURE / QUESTION)' },
        { name: 'Slack:', detail: 'Canal diferente por categoría' },
        { name: 'Airtable:', detail: 'Registrar cada feedback clasificado' },
      ],
      promptHeading: 'El Prompt de Clasificación',
      promptCopyLabel: 'Copiar prompt',
      promptCopiedLabel: '¡Copiado!',
      whyWorksHeading: '¿Por qué funciona este prompt?',
      whyWorks: [
        { label: 'Role', detail: 'establece contexto ("product feedback classifier")' },
        { label: 'Signal words', detail: 'por categoría guían el pattern matching del LLM' },
        { label: 'Tiebreaker rule', detail: 'resuelve casos ambiguos (bugs > features > questions)' },
        { label: 'Safe default', detail: 'nada se pierde' },
        { label: 'Strict output', detail: 'hace que el nodo Switch sea fiable' },
      ],
      quote: 'Un nodo de IA convirtió una tubería tonta en una tubería inteligente.',
      ambiguousHeading: 'La Prueba Ambigua',
      ambiguousExample: '"Estaría genial que el export pudiera manejar más de 100 filas sin crashear."',
      ambiguousExplanation1: '¿Es un feature request ("estaría genial") o un bug ("crashear")? La tiebreaker rule del prompt lo resuelve: si el feedback contiene un bug y un feature request, clasificar como BUG — lo roto tiene prioridad.',
      ambiguousExplanation2: 'Si no estás de acuerdo con esa clasificación, cambias una línea del prompt. No un retrain del modelo. No un ticket para data science. Una línea de texto. Escribiste acceptance criteria, no código — y esa es una decisión de producto, no de ingeniería.',
      downloadLabel: 'Descargar Workflow 2 JSON',
    },
    pattern: {
      heading: 'El Patrón',
      description: 'Ambos workflows siguen la misma estructura:',
      labels: {
        trigger: 'TRIGGER',
        read: 'READ',
        process: 'PROCESS',
        act: 'ACT',
        when: 'cuándo',
        getData: 'obtener datos',
        transform: 'transformar/clasificar',
        notify: 'notificar/registrar',
      },
      worksFor: 'Este patrón sirve para:',
      useCases: [
        'Priorizar tickets de soporte',
        'Enrutar leads de ventas',
        'Triagear quejas de clientes',
        'Clasificar respuestas NPS',
        'Procesar envíos de formularios',
      ],
      punchline: 'La tubería no cambia. El prompt sí.',
    },
    getStarted: {
      heading: 'Empieza',
      steps: [
        { num: 1, text: '<a>n8n Cloud (free tier)</a> — regístrate y empieza a construir' },
        { num: 2, text: 'Elige la tarea más aburrida de tu viernes' },
        { num: 3, text: 'Monta un workflow esta semana' },
      ],
      quote: 'La primera automatización es la más difícil. La segunda lleva la mitad de tiempo.',
    },
    lessons: {
      heading: 'Lo que Aprendí Automatizando 170 Horas al Mes',
      items: [
        {
          title: 'Automatiza la tarea aburrida primero.',
          detail: 'El caso de uso vistoso es tentador. Pero los sprint reports me devolvieron 12 horas cada dos semanas — más que cualquier integración ingeniosa que monté.',
        },
        {
          title: 'Tu base de datos es el cerebro.',
          detail: 'No montes una "base de datos de automatización" aparte. Jira, Airtable y Sheets ya contienen el 90% de los datos que tus workflows necesitan.',
        },
        {
          title: 'Automatiza el trigger, no solo la tarea.',
          detail: 'Un workflow que corre "cuando pulso un botón" ahorra tiempo. Uno que corre "cuando se cierra un deal" ahorra tiempo Y te saca del loop por completo. El segundo vale 10x más.',
        },
        {
          title: 'Empieza con uno.',
          detail: 'Intenté automatizar todo a la vez y acabé con 14 workflows medio rotos y cero ahorro de tiempo. Un workflow funcionando fiablemente le gana a cinco en borrador.',
        },
      ],
    },
    faq: {
      heading: 'Preguntas Frecuentes',
      items: [
        {
          q: '¿Puede n8n conectarse a Jira / Salesforce / mi herramienta?',
          a: 'Sí. Más de 400 integraciones — Jira, Salesforce, Notion, Linear, HubSpot, Zendesk, Google Sheets. Si lo usas, n8n probablemente se conecta.',
        },
        {
          q: '¿n8n es gratis?',
          a: 'Free tier en cloud, o self-host gratis. El free tier es suficiente para todo lo que se muestra aquí.',
        },
        {
          q: '¿Qué LLM debería usar para el clasificador?',
          a: 'El que tu empresa ya pague. El prompt funciona igual con Claude, GPT-4 o Gemini. El patrón de clasificación no cambia con el modelo.',
        },
        {
          q: '¿En qué se diferencia de Zapier o Make?',
          a: 'Open source, self-hostable, nodos de IA nativos y un canvas visual que te deja ver la lógica de branching. Zapier es genial para triggers simples. n8n es para cuando necesitas branching, IA, loops y control total.',
        },
        {
          q: '¿Y si la IA clasifica algo mal?',
          a: 'Cambias el prompt. Añades un signal word, ajustas la tiebreaker rule, añades una categoría. Iteras en texto plano, no en código. Y el log de Airtable te permite revisar y corregir.',
        },
      ],
    },
    import: {
      heading: 'Importa los Workflows',
      description: 'Descarga los archivos JSON e impórtalos directamente en tu instancia de n8n:',
      wf1Label: 'Workflow 1 — El Viernes Automatizable',
      wf2Label: 'Workflow 2 — El Router Inteligente',
      howToHeading: 'Cómo importar:',
      howToText: 'En n8n, pulsa el botón +, selecciona "Import from File" y elige el JSON. Después conecta tus credenciales de Slack, Airtable e IA.',
    },
    resources: {
      heading: 'Recursos',
      items: [
        { label: 'n8n Documentation', url: 'https://docs.n8n.io' },
        { label: 'Airtable node docs', url: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.airtable/' },
        { label: 'AI nodes guide', url: 'https://docs.n8n.io/integrations/builtin/cluster-nodes/' },
      ],
    },
    footer: {
      role: 'AI Product Manager · Solutions Architect',
      copyright: 'Todos los derechos reservados.',
    },
  },
  en: {
    slug: 'n8n-for-pms',
    altSlug: 'n8n-para-pms',
    readingTime: '5 min read',
    seo: {
      title: 'n8n for Product Managers: Automate Sprint Reports & Classify Feedback with AI',
      description: 'Practical cheat sheet for Product Managers: automate sprint reports and classify feedback with AI using n8n. 2 importable workflow templates, a ready-to-use prompt, and step-by-step guide.',
    },
    nav: {
      back: 'santifer.io',
      breadcrumbHome: 'Home',
      breadcrumbCurrent: 'n8n for PMs',
    },
    header: {
      kicker: 'Lightning Session — AI Product Academy',
      h1: 'n8n for Product Managers',
      subtitle: 'Practical cheat sheet: automate your sprint reports and classify feedback with AI — no code required.',
      date: 'Feb 24, 2026',
    },
    intro: {
      hook: 'How many hours a week do you spend on work that has nothing to do with product?',
      body: 'I tracked mine. It was twenty. Some weeks, thirty. Sprint reports that take a full day. Feedback scattered across five tools that I had to read, classify, and turn into tickets one by one. Status updates typed from scratch every Monday.',
      punchline: 'I wasn\'t a product manager. I was a very expensive data router. Moving information between tools that should have been talking to each other. I spent 170 hours a month on this at my own company before I automated all of it. Today I\'ll show you how to do the same with two workflows you can build in an afternoon.',
    },
    timeSinks: {
      heading: 'The 5 PM Time Sinks (20-30 hours/week)',
      columns: { num: '#', sink: 'Time Sink', hours: 'Hours/Week', pattern: 'Automation Pattern' },
      rows: [
        { num: '1', sink: 'Sprint reports', hours: '8-12/sprint', pattern: 'Schedule → Query → Format → Send' },
        { num: '2', sink: 'Classifying feedback', hours: '5-10', pattern: 'Trigger → AI Classify → Route' },
        { num: '3', sink: 'Moving data between tools', hours: '3-5', pattern: 'Trigger → Extract → Create → Notify' },
        { num: '4', sink: 'Keeping team in sync', hours: '2-4', pattern: 'Schedule → Aggregate → Summarize → Post' },
        { num: '5', sink: 'Preparing for decisions', hours: '1-2/meeting', pattern: 'Schedule → Multi-query → Compile → Send' },
      ],
    },
    workflow1: {
      heading: 'Workflow 1: The Automatable Friday',
      description: 'Automated sprint report that posts to Slack every Friday at 9am.',
      pipelineLabels: [
        { name: 'Schedule', detail: '(Fri 9am)' },
        { name: 'Airtable', detail: '(read sprint)' },
        { name: 'Code', detail: '(format)' },
        { name: 'Slack', detail: '(post)' },
      ],
      imgAlt: 'n8n automated sprint report workflow for product managers: Schedule Trigger every Friday → Read Sprint Data from Airtable → Format Report with Code node → Post to Slack channel',
      imgTitle: 'Workflow 1: Automated Sprint Report with n8n',
      figcaption: 'Workflow 1 in n8n: automated sprint report — Schedule → Airtable → Code → Slack',
      nodesHeading: 'Key nodes:',
      nodes: [
        { name: 'Schedule Trigger:', detail: 'Every week, Friday, 9:00 AM' },
        { name: 'Airtable:', detail: 'Filter by Sprint = Current, Status = Done' },
        { name: 'Code node:', detail: 'Group by assignee, count story points, format as Slack markdown' },
        { name: 'Slack:', detail: 'Post to #sprint-updates' },
      ],
      quote: 'Your sprint report arrives every Friday at 9:05am. You did nothing.',
      downloadLabel: 'Download Workflow 1 JSON',
    },
    transition: {
      line1: 'There\'s no AI in Workflow 1. It\'s pure plumbing.',
      line2: 'Four nodes that save you 4-6 hours every sprint. Now imagine what happens when we add intelligence.',
    },
    workflow2: {
      heading: 'Workflow 2: The Intelligent Router',
      description: 'AI-powered feedback classification that routes bugs, features, and questions to the right Slack channel. One AI node turns a dumb pipe into a smart pipe.',
      pipelineLabels: [
        { name: 'Form Trigger', detail: '' },
        { name: 'AI Classify', detail: '(LLM)' },
        { name: 'Switch', detail: '(Bug/Feature/Question)' },
        { name: 'Slack', detail: '+ Airtable' },
      ],
      imgAlt: 'n8n AI feedback classification workflow for product managers: Form Trigger → AI Classifier with Claude → Switch node routes bugs, features, and questions to separate Slack channels → Log to Airtable',
      imgTitle: 'Workflow 2: AI-Powered Feedback Classification with n8n',
      figcaption: 'Workflow 2 in n8n: AI feedback classifier — Form → Claude AI → Switch → Slack + Airtable',
      nodesHeading: 'Key nodes:',
      nodes: [
        { name: 'n8n Form Trigger:', detail: 'Name, Email, Feedback Text, Product Area' },
        { name: 'Basic LLM Chain:', detail: 'Classify feedback using AI' },
        { name: 'Switch:', detail: 'Route based on LLM output (BUG / FEATURE / QUESTION)' },
        { name: 'Slack:', detail: 'Different channel per category' },
        { name: 'Airtable:', detail: 'Log every classified feedback' },
      ],
      promptHeading: 'The Classification Prompt',
      promptCopyLabel: 'Copy prompt',
      promptCopiedLabel: 'Copied!',
      whyWorksHeading: 'Why this prompt works:',
      whyWorks: [
        { label: 'Role', detail: 'sets context ("product feedback classifier")' },
        { label: 'Signal words', detail: 'per category guide the LLM\'s pattern matching' },
        { label: 'Tiebreaker rule', detail: 'handles ambiguous cases (bugs > features > questions)' },
        { label: 'Safe default', detail: 'ensures nothing gets lost' },
        { label: 'Strict output', detail: 'makes the Switch node reliable' },
      ],
      quote: 'One AI node turned a dumb pipe into a smart pipe.',
      ambiguousHeading: 'The Ambiguous Test',
      ambiguousExample: '"It would be really nice if the export could handle more than 100 rows without crashing."',
      ambiguousExplanation1: 'Is this a feature request ("it would be nice") or a bug ("crashing")? The tiebreaker rule in the prompt handles it: if feedback contains both a bug and a feature request, classify as BUG — broken things take priority.',
      ambiguousExplanation2: 'If you disagree with that classification, you change one line of the prompt. Not a model retrain. Not a ticket to data science. One line of text. You wrote acceptance criteria, not code — and that\'s a product decision, not an engineering decision.',
      downloadLabel: 'Download Workflow 2 JSON',
    },
    pattern: {
      heading: 'The Pattern',
      description: 'Both workflows follow the same structure:',
      labels: {
        trigger: 'TRIGGER',
        read: 'READ',
        process: 'PROCESS',
        act: 'ACT',
        when: 'when',
        getData: 'get data',
        transform: 'transform/classify',
        notify: 'notify/log',
      },
      worksFor: 'This pattern works for:',
      useCases: [
        'Prioritizing support tickets',
        'Routing sales leads',
        'Triaging customer complaints',
        'Classifying NPS responses',
        'Processing form submissions',
      ],
      punchline: 'The pipe stays the same. The prompt changes.',
    },
    getStarted: {
      heading: 'Get Started',
      steps: [
        { num: 1, text: '<a>n8n Cloud (free tier)</a> — sign up and start building' },
        { num: 2, text: 'Pick your most boring Friday task' },
        { num: 3, text: 'Build one workflow this week' },
      ],
      quote: 'The first automation is the hardest. The second takes half the time.',
    },
    lessons: {
      heading: 'What I Learned Automating 170 Hours a Month',
      items: [
        {
          title: 'Automate the boring task first.',
          detail: 'The flashy use case is tempting. But sprint reports won me 12 hours back every two weeks — more than any clever integration I built.',
        },
        {
          title: 'Your database is the brain.',
          detail: 'Don\'t build a separate "automation database." Jira, Airtable, and Sheets already contain 90% of the data your workflows need.',
        },
        {
          title: 'Automate the trigger, not just the task.',
          detail: 'A workflow that runs "when I click a button" saves time. A workflow that runs "when a deal closes" saves time AND removes you from the loop entirely. The second kind is worth 10x more.',
        },
        {
          title: 'Start with one.',
          detail: 'I tried to automate everything at once and ended up with 14 half-broken workflows and zero time savings. One workflow running reliably beats five in draft mode.',
        },
      ],
    },
    faq: {
      heading: 'Common Questions',
      items: [
        {
          q: 'Can n8n connect to Jira / Salesforce / my tool?',
          a: 'Yes. Over 400 integrations — Jira, Salesforce, Notion, Linear, HubSpot, Zendesk, Google Sheets. If you use it, n8n probably connects to it.',
        },
        {
          q: 'Is n8n free?',
          a: 'Free tier on cloud, or self-host for free. The free tier is enough for everything shown here.',
        },
        {
          q: 'What LLM should I use for the classifier?',
          a: 'Whatever your company already pays for. The prompt works the same with Claude, GPT-4, or Gemini. The classification pattern doesn\'t change with the model.',
        },
        {
          q: 'How is this different from Zapier or Make?',
          a: 'Open source, self-hostable, AI nodes built in, and a visual canvas that lets you see the branching logic. Zapier is great for simple triggers. n8n is for when you need branching, AI, loops, and full control.',
        },
        {
          q: 'What if the AI classifies something wrong?',
          a: 'You change the prompt. Add a new signal word, adjust the tiebreaker rule, add a category. You iterate in plain English, not in code. And the Airtable log lets you review and correct.',
        },
      ],
    },
    import: {
      heading: 'Import the Workflows',
      description: 'Download the JSON files and import them directly into your n8n instance:',
      wf1Label: 'Workflow 1 — The Automatable Friday',
      wf2Label: 'Workflow 2 — The Intelligent Router',
      howToHeading: 'How to import:',
      howToText: 'In n8n, click the + button, select "Import from File", and choose the JSON. Then connect your own Slack, Airtable, and AI credentials.',
    },
    resources: {
      heading: 'Resources',
      items: [
        { label: 'n8n Documentation', url: 'https://docs.n8n.io' },
        { label: 'Airtable node docs', url: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.airtable/' },
        { label: 'AI nodes guide', url: 'https://docs.n8n.io/integrations/builtin/cluster-nodes/' },
      ],
    },
    footer: {
      role: 'AI Product Manager · Solutions Architect',
      copyright: 'All rights reserved.',
    },
  },
} as const

/** Helper to get content for a given language */
export function getN8nContent(lang: N8nLang) {
  return n8nContent[lang]
}

/** Derive the type of a single language's content */
export type N8nContent = (typeof n8nContent)['en']
