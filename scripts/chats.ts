import { config } from 'dotenv';
config({ path: '.env.local' });

const LANGFUSE_PUBLIC_KEY = process.env.LANGFUSE_PUBLIC_KEY!;
const LANGFUSE_SECRET_KEY = process.env.LANGFUSE_SECRET_KEY!;
const LANGFUSE_BASE_URL = process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com';

const AUTH = Buffer.from(`${LANGFUSE_PUBLIC_KEY}:${LANGFUSE_SECRET_KEY}`).toString('base64');

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Trace {
  id: string;
  timestamp: string;
  tags: string[];
  metadata: {
    lang?: string;
    messageCount?: number;
    lastUserMessage?: string;
  };
  observations?: Array<{
    input?: Message[];
    output?: string;
  }>;
}

// Colores ANSI
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgYellow: '\x1b[43m',
};

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

function formatTags(tags: string[]): string {
  return tags.map(tag => {
    if (tag === 'jailbreak-attempt') return `${colors.bgRed}${colors.white} ⚠ JAILBREAK ${colors.reset}`;
    if (tag === 'es') return `${colors.cyan}🇪🇸${colors.reset}`;
    if (tag === 'en') return `${colors.cyan}🇬🇧${colors.reset}`;
    if (tag.startsWith('topic:')) return `${colors.dim}#${tag.replace('topic:', '')}${colors.reset}`;
    return `${colors.dim}${tag}${colors.reset}`;
  }).join(' ');
}

async function fetchTraces(options: {
  jailbreakOnly?: boolean;
  days?: number;
  limit?: number;
}): Promise<Trace[]> {
  const { jailbreakOnly = false, days = 1, limit = 50 } = options;

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  let url = `${LANGFUSE_BASE_URL}/api/public/traces?limit=${limit}&fromTimestamp=${fromDate.toISOString()}`;

  if (jailbreakOnly) {
    url += '&tags=jailbreak-attempt';
  }

  const response = await fetch(url, {
    headers: { Authorization: `Basic ${AUTH}` },
  });

  if (!response.ok) {
    console.log(`${colors.red}Error al conectar con Langfuse: ${response.status}${colors.reset}`);
    return [];
  }

  const text = await response.text();
  try {
    const data = JSON.parse(text);
    return data.data || [];
  } catch {
    console.log(`${colors.red}Error parseando respuesta de Langfuse${colors.reset}`);
    return [];
  }
}

async function fetchTraceDetail(traceId: string): Promise<Trace | null> {
  const response = await fetch(`${LANGFUSE_BASE_URL}/api/public/traces/${traceId}`, {
    headers: { Authorization: `Basic ${AUTH}` },
  });

  if (!response.ok) return null;

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function printSeparator(char = '━', length = 60) {
  console.log(colors.dim + char.repeat(length) + colors.reset);
}

function printTraceSummary(trace: Trace, index: number) {
  const isJailbreak = trace.tags.includes('jailbreak-attempt');
  const prefix = isJailbreak ? colors.red : colors.white;

  console.log(`${prefix}${colors.bold}${index + 1}.${colors.reset} ${colors.yellow}${formatDate(trace.timestamp)}${colors.reset} ${formatTags(trace.tags)}`);

  if (trace.metadata?.lastUserMessage) {
    console.log(`   ${colors.dim}└─${colors.reset} ${truncate(trace.metadata.lastUserMessage, 70)}`);
  }
}

function wrapText(text: string, maxWidth: number, indent: string = ''): string {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine.length + word.length + 1 <= maxWidth) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines.map((line, i) => (i === 0 ? line : indent + line)).join('\n');
}

function printConversation(trace: Trace) {
  console.log();
  console.log(`${colors.bgRed}${colors.white}${colors.bold}                                                              ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  💬 CONVERSACIÓN ${colors.reset}${colors.dim}${trace.id.slice(0, 8)}...${colors.reset}`);
  console.log(`${colors.yellow}  📅 ${formatDate(trace.timestamp)}${colors.reset}  ${formatTags(trace.tags)}`);
  console.log(`${colors.dim}${'─'.repeat(62)}${colors.reset}`);

  const messages = trace.observations?.[0]?.input || [];
  const lastOutput = trace.observations?.[0]?.output;
  let turnNumber = 1;

  for (const msg of messages) {
    if (msg.role === 'user') {
      console.log();
      console.log(`  ${colors.green}${colors.bold}┌─ 👤 USUARIO ${colors.dim}(${turnNumber})${colors.reset}`);
      console.log(`  ${colors.green}│${colors.reset}`);
      const lines = msg.content.split('\n');
      for (const line of lines) {
        const wrapped = wrapText(line, 55, `  ${colors.green}│${colors.reset}  `);
        console.log(`  ${colors.green}│${colors.reset}  ${wrapped}`);
      }
      console.log(`  ${colors.green}│${colors.reset}`);
    } else {
      console.log(`  ${colors.blue}├─ 🤖 SANTI${colors.reset}`);
      console.log(`  ${colors.blue}│${colors.reset}`);
      const lines = msg.content.split('\n');
      for (const line of lines) {
        const wrapped = wrapText(line, 55, `  ${colors.blue}│${colors.reset}  ${colors.dim}`);
        console.log(`  ${colors.blue}│${colors.reset}  ${colors.dim}${wrapped}${colors.reset}`);
      }
      console.log(`  ${colors.blue}└${'─'.repeat(58)}${colors.reset}`);
      turnNumber++;
    }
  }

  if (lastOutput) {
    console.log(`  ${colors.blue}├─ 🤖 SANTI${colors.reset}`);
    console.log(`  ${colors.blue}│${colors.reset}`);
    const lines = lastOutput.split('\n');
    for (const line of lines) {
      const wrapped = wrapText(line, 55, `  ${colors.blue}│${colors.reset}  ${colors.dim}`);
      console.log(`  ${colors.blue}│${colors.reset}  ${colors.dim}${wrapped}${colors.reset}`);
    }
    console.log(`  ${colors.blue}└${'─'.repeat(58)}${colors.reset}`);
  }

  console.log();
  console.log(`${colors.dim}  ✅ Fin de conversación • ${messages.length + (lastOutput ? 1 : 0)} mensajes${colors.reset}`);
  console.log();
}

async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  const jailbreakOnly = args.includes('--jailbreak') || args.includes('-j');
  const fullMode = args.includes('--full') || args.includes('-f');
  const daysArg = args.find(a => a.startsWith('--days='));
  const days = daysArg ? parseInt(daysArg.split('=')[1]) : 1;
  const limitArg = args.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : (fullMode ? 10 : 50);
  const viewArg = args.find(a => a.startsWith('--view='));
  const viewValue = viewArg ? viewArg.split('=')[1] : null;
  const showHelp = args.includes('--help') || args.includes('-h');

  if (showHelp) {
    console.log(`
${colors.bold}${colors.cyan}📊 Chat History Viewer${colors.reset}

${colors.bold}Uso:${colors.reset}
  npm run chats                    Lista resumen de conversaciones
  npm run chats -- --full          Conversaciones completas (últimas 10)
  npm run chats -- --jailbreak     Solo intentos de jailbreak
  npm run chats -- --view=5        Ver conversación #5

${colors.bold}Opciones:${colors.reset}
  -f, --full         Mostrar conversaciones completas (no solo preview)
  -j, --jailbreak    Filtrar solo jailbreaks
  --days=N           Conversaciones de los últimos N días
  --limit=N          Número de conversaciones a mostrar
  --view=N           Ver conversación número N de la lista
  -h, --help         Mostrar esta ayuda

${colors.bold}Ejemplos:${colors.reset}
  npm run chats -- -f              Ver últimas 10 conversaciones completas
  npm run chats -- -f -j           Ver jailbreaks con hilo completo
  npm run chats -- -f --limit=5    Ver últimas 5 conversaciones completas
  npm run chats -- --view=3        Ver solo la conversación #3
`);
    return;
  }

  // Always fetch traces first (needed for both list and view by number)
  const traces = await fetchTraces({ jailbreakOnly, days, limit });

  // View specific conversation by number
  if (viewValue) {
    const viewNum = parseInt(viewValue);

    if (!isNaN(viewNum) && viewNum >= 1 && viewNum <= traces.length) {
      // View by list number
      const traceId = traces[viewNum - 1].id;
      const trace = await fetchTraceDetail(traceId);
      if (trace) {
        printConversation(trace);
      }
    } else if (isNaN(viewNum)) {
      // View by UUID (legacy support)
      const trace = await fetchTraceDetail(viewValue);
      if (trace) {
        printConversation(trace);
      } else {
        console.log(`${colors.red}No se encontró la conversación ${viewValue}${colors.reset}`);
      }
    } else {
      console.log(`${colors.red}Número inválido. Usa un número entre 1 y ${traces.length}${colors.reset}`);
    }
    return;
  }

  // List conversations
  console.log(`\n${colors.bold}${colors.cyan}📊 Historial de Chats${colors.reset}`);
  console.log(`${colors.dim}Últimos ${days} día(s)${jailbreakOnly ? ' • Solo jailbreaks' : ''}${fullMode ? ' • Modo completo' : ''}${colors.reset}\n`);

  if (traces.length === 0) {
    console.log(`${colors.yellow}No hay conversaciones en este período${colors.reset}`);
    return;
  }

  // Stats
  const jailbreaks = traces.filter(t => t.tags.includes('jailbreak-attempt')).length;
  const total = traces.length;

  console.log(`${colors.dim}Total: ${total} conversaciones • ${jailbreaks} jailbreaks detectados${colors.reset}\n`);

  if (fullMode) {
    // Full mode: show complete conversations
    for (let i = 0; i < traces.length; i++) {
      console.log(`${colors.dim}───── ${i + 1}/${traces.length} ─────${colors.reset}`);
      const traceDetail = await fetchTraceDetail(traces[i].id);
      if (traceDetail) {
        printConversation(traceDetail);
      }
    }
  } else {
    // Summary mode
    printSeparator();
    for (let i = 0; i < traces.length; i++) {
      printTraceSummary(traces[i], i);
    }
    printSeparator();
    console.log(`\n${colors.dim}💡 Usa --full para ver conversaciones completas${colors.reset}`);
    console.log(`${colors.dim}   Ejemplo: npm run chats -- --full${colors.reset}\n`);
  }
}

main().catch(console.error);
