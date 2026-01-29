import { config } from 'dotenv';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
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

// ANSI escape codes
const ESC = '\x1b';
const CLEAR = `${ESC}[2J${ESC}[H`;
const HIDE_CURSOR = `${ESC}[?25l`;
const SHOW_CURSOR = `${ESC}[?25h`;
const BOLD = `${ESC}[1m`;
const DIM = `${ESC}[2m`;
const RESET = `${ESC}[0m`;
const RED = `${ESC}[31m`;
const GREEN = `${ESC}[32m`;
const YELLOW = `${ESC}[33m`;
const BLUE = `${ESC}[34m`;
const CYAN = `${ESC}[36m`;
const BG_RED = `${ESC}[41m`;
const WHITE = `${ESC}[37m`;
const INVERT = `${ESC}[7m`;

function getTerminalSize(): { cols: number; rows: number } {
  return {
    cols: process.stdout.columns || 80,
    rows: process.stdout.rows || 24,
  };
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTags(tags: string[]): string {
  return tags.map(tag => {
    if (tag === 'jailbreak-attempt') return `${BG_RED}${WHITE} ⚠ JAILBREAK ${RESET}`;
    if (tag === 'es') return '🇪🇸';
    if (tag === 'en') return '🇬🇧';
    if (tag.startsWith('topic:')) return `${DIM}#${tag.replace('topic:', '')}${RESET}`;
    return `${DIM}${tag}${RESET}`;
  }).join(' ');
}

function wrapText(text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  const paragraphs = text.split('\n');

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') {
      lines.push('');
      continue;
    }

    const words = paragraph.split(' ');
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
  }

  return lines;
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

  if (!response.ok) return [];

  const text = await response.text();
  try {
    const data = JSON.parse(text);
    return data.data || [];
  } catch {
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

function formatTagsPlain(tags: string[]): string {
  return tags.map(tag => {
    if (tag === 'jailbreak-attempt') return '[⚠ JAILBREAK]';
    if (tag === 'es') return '[ES]';
    if (tag === 'en') return '[EN]';
    if (tag.startsWith('topic:')) return `#${tag.replace('topic:', '')}`;
    return tag;
  }).join(' ');
}

function traceToPlainText(trace: Trace, index: number): string {
  const lines: string[] = [];
  const separator = '='.repeat(60);
  const subSeparator = '-'.repeat(60);

  lines.push(separator);
  lines.push(`CONVERSACIÓN ${index + 1} | ${trace.id}`);
  lines.push(`Fecha: ${formatDate(trace.timestamp)} | Tags: ${formatTagsPlain(trace.tags)}`);
  lines.push(subSeparator);

  const messages = trace.observations?.[0]?.input || [];
  const lastOutput = trace.observations?.[0]?.output;
  let turnNumber = 1;

  for (const msg of messages) {
    if (msg.role === 'user') {
      lines.push('');
      lines.push(`👤 USUARIO (${turnNumber}):`);
      lines.push(msg.content);
    } else {
      lines.push('');
      lines.push(`🤖 SANTI:`);
      lines.push(msg.content);
      lines.push('');
      turnNumber++;
    }
  }

  if (lastOutput) {
    lines.push('');
    lines.push(`🤖 SANTI:`);
    lines.push(lastOutput);
  }

  lines.push('');
  lines.push(`[${messages.length + (lastOutput ? 1 : 0)} mensajes]`);
  lines.push('');

  return lines.join('\n');
}

async function exportAllChats(traces: Trace[], jailbreakOnly: boolean, days: number): Promise<string> {
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const suffix = jailbreakOnly ? '-jailbreaks' : '';
  const filename = `chats-${timestamp}${suffix}.txt`;
  const filepath = path.join(logsDir, filename);

  const header = [
    '╔══════════════════════════════════════════════════════════╗',
    '║          HISTORIAL DE CONVERSACIONES - SANTI BOT        ║',
    '╚══════════════════════════════════════════════════════════╝',
    '',
    `Exportado: ${now.toLocaleString('es-ES')}`,
    `Período: últimos ${days} día(s)${jailbreakOnly ? ' (solo jailbreaks)' : ''}`,
    `Total: ${traces.length} conversaciones`,
    `Jailbreaks: ${traces.filter(t => t.tags.includes('jailbreak-attempt')).length}`,
    '',
  ].join('\n');

  let content = header;

  for (let i = 0; i < traces.length; i++) {
    const detail = await fetchTraceDetail(traces[i].id);
    if (detail) {
      content += traceToPlainText(detail, i);
    }
  }

  fs.writeFileSync(filepath, content, 'utf-8');
  return filepath;
}

function renderConversation(trace: Trace, index: number, total: number, scrollOffset: number = 0): string[] {
  const { cols, rows } = getTerminalSize();
  const contentWidth = Math.min(cols - 4, 80);
  const lines: string[] = [];

  // Header bar
  const isJailbreak = trace.tags.includes('jailbreak-attempt');
  const headerBg = isJailbreak ? BG_RED : INVERT;
  const navInfo = `${index + 1}/${total}`;
  const headerText = ` 💬 CONVERSACIÓN ${trace.id.slice(0, 8)}... `;
  const padding = cols - headerText.length - navInfo.length - 2;
  lines.push(`${headerBg}${headerText}${' '.repeat(Math.max(0, padding))}${navInfo} ${RESET}`);

  // Subheader
  lines.push(`${YELLOW}📅 ${formatDate(trace.timestamp)}${RESET}  ${formatTags(trace.tags)}`);
  lines.push(`${DIM}${'─'.repeat(contentWidth)}${RESET}`);
  lines.push('');

  // Messages
  const messages = trace.observations?.[0]?.input || [];
  const lastOutput = trace.observations?.[0]?.output;
  let turnNumber = 1;

  for (const msg of messages) {
    if (msg.role === 'user') {
      lines.push(`${GREEN}${BOLD}┌─ 👤 USUARIO (${turnNumber})${RESET}`);
      lines.push(`${GREEN}│${RESET}`);
      const wrapped = wrapText(msg.content, contentWidth - 4);
      for (const line of wrapped) {
        lines.push(`${GREEN}│${RESET}  ${line}`);
      }
      lines.push(`${GREEN}│${RESET}`);
    } else {
      lines.push(`${BLUE}├─ 🤖 SANTI${RESET}`);
      lines.push(`${BLUE}│${RESET}`);
      const wrapped = wrapText(msg.content, contentWidth - 4);
      for (const line of wrapped) {
        lines.push(`${BLUE}│${RESET}  ${DIM}${line}${RESET}`);
      }
      lines.push(`${BLUE}└${'─'.repeat(contentWidth - 1)}${RESET}`);
      lines.push('');
      turnNumber++;
    }
  }

  if (lastOutput) {
    lines.push(`${BLUE}├─ 🤖 SANTI${RESET}`);
    lines.push(`${BLUE}│${RESET}`);
    const wrapped = wrapText(lastOutput, contentWidth - 4);
    for (const line of wrapped) {
      lines.push(`${BLUE}│${RESET}  ${DIM}${line}${RESET}`);
    }
    lines.push(`${BLUE}└${'─'.repeat(contentWidth - 1)}${RESET}`);
  }

  lines.push('');
  lines.push(`${DIM}✅ ${messages.length + (lastOutput ? 1 : 0)} mensajes${RESET}`);

  return lines;
}

function renderScreen(lines: string[], scrollOffset: number, showHelp: boolean = true) {
  const { cols, rows } = getTerminalSize();
  const availableRows = rows - (showHelp ? 3 : 1);

  process.stdout.write(CLEAR);

  // Render visible lines
  const visibleLines = lines.slice(scrollOffset, scrollOffset + availableRows);
  for (let i = 0; i < availableRows; i++) {
    if (i < visibleLines.length) {
      process.stdout.write(visibleLines[i].slice(0, cols) + '\n');
    } else {
      process.stdout.write('\n');
    }
  }

  // Scroll indicator
  if (lines.length > availableRows) {
    const scrollPercent = Math.round((scrollOffset / (lines.length - availableRows)) * 100);
    const scrollBar = `${DIM}[${scrollOffset > 0 ? '▲' : ' '}${scrollPercent}%${scrollOffset + availableRows < lines.length ? '▼' : ' '}]${RESET}`;
    process.stdout.write(`${scrollBar}\n`);
  } else {
    process.stdout.write('\n');
  }

  // Help bar
  if (showHelp) {
    const helpText = `${INVERT} ← → ${RESET} Nav  ${INVERT} ↑ ↓ ${RESET} Scroll  ${INVERT} j ${RESET} Jailbreaks  ${INVERT} q ${RESET} Salir`;
    process.stdout.write(`${helpText}\n`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  let jailbreakOnly = args.includes('--jailbreak') || args.includes('-j');
  const daysArg = args.find(a => a.startsWith('--days='));
  const days = daysArg ? parseInt(daysArg.split('=')[1]) : 1;

  process.stdout.write(HIDE_CURSOR);
  process.stdout.write(CLEAR);
  process.stdout.write(`${CYAN}${BOLD}Cargando conversaciones...${RESET}\n`);

  let traces = await fetchTraces({ jailbreakOnly, days, limit: 100 });
  let traceDetails: (Trace | null)[] = [];

  if (traces.length === 0) {
    process.stdout.write(SHOW_CURSOR);
    console.log(`${YELLOW}No hay conversaciones${jailbreakOnly ? ' de jailbreak' : ''} en los últimos ${days} día(s)${RESET}`);
    process.exit(0);
  }

  // Export all chats to txt
  process.stdout.write(`${DIM}Exportando conversaciones a logs/...${RESET}\n`);
  const exportPath = await exportAllChats(traces, jailbreakOnly, days);
  process.stdout.write(`${GREEN}✅ Guardado: ${exportPath}${RESET}\n`);

  // Prefetch first trace
  process.stdout.write(`${DIM}Cargando TUI...${RESET}\n`);
  traceDetails[0] = await fetchTraceDetail(traces[0].id);

  let currentIndex = 0;
  let scrollOffset = 0;
  let currentLines: string[] = [];

  // Setup keyboard input
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  const render = async () => {
    if (!traceDetails[currentIndex]) {
      traceDetails[currentIndex] = await fetchTraceDetail(traces[currentIndex].id);
    }

    const trace = traceDetails[currentIndex];
    if (trace) {
      currentLines = renderConversation(trace, currentIndex, traces.length, scrollOffset);
      renderScreen(currentLines, scrollOffset);
    }
  };

  const cleanup = () => {
    process.stdout.write(SHOW_CURSOR);
    process.stdout.write(CLEAR);
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  process.stdin.on('keypress', async (str, key) => {
    if (!key) return;

    const { rows } = getTerminalSize();
    const availableRows = rows - 3;

    if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
      cleanup();
    }

    // Navigation between conversations
    if (key.name === 'left' || key.name === 'h') {
      if (currentIndex > 0) {
        currentIndex--;
        scrollOffset = 0;
        await render();
      }
    }

    if (key.name === 'right' || key.name === 'l') {
      if (currentIndex < traces.length - 1) {
        currentIndex++;
        scrollOffset = 0;
        await render();
      }
    }

    // Scroll within conversation
    if (key.name === 'up' || key.name === 'k') {
      if (scrollOffset > 0) {
        scrollOffset--;
        renderScreen(currentLines, scrollOffset);
      }
    }

    if (key.name === 'down' || key.name === 'j') {
      if (scrollOffset < currentLines.length - availableRows) {
        scrollOffset++;
        renderScreen(currentLines, scrollOffset);
      }
    }

    // Page up/down
    if (key.name === 'pageup') {
      scrollOffset = Math.max(0, scrollOffset - availableRows);
      renderScreen(currentLines, scrollOffset);
    }

    if (key.name === 'pagedown') {
      scrollOffset = Math.min(currentLines.length - availableRows, scrollOffset + availableRows);
      if (scrollOffset < 0) scrollOffset = 0;
      renderScreen(currentLines, scrollOffset);
    }

    // Home/End
    if (key.name === 'home') {
      currentIndex = 0;
      scrollOffset = 0;
      await render();
    }

    if (key.name === 'end') {
      currentIndex = traces.length - 1;
      scrollOffset = 0;
      await render();
    }

    // Toggle jailbreak filter
    if (str === 'J') {
      jailbreakOnly = !jailbreakOnly;
      process.stdout.write(CLEAR);
      process.stdout.write(`${CYAN}Recargando${jailbreakOnly ? ' (solo jailbreaks)' : ''}...${RESET}\n`);
      traces = await fetchTraces({ jailbreakOnly, days, limit: 100 });
      traceDetails = [];
      currentIndex = 0;
      scrollOffset = 0;

      if (traces.length === 0) {
        process.stdout.write(`${YELLOW}No hay conversaciones${jailbreakOnly ? ' de jailbreak' : ''}${RESET}\n`);
        process.stdout.write(`${DIM}Pulsa J para cambiar filtro, q para salir${RESET}\n`);
      } else {
        await render();
      }
    }
  });

  // Initial render
  await render();

  // Prefetch next traces in background
  (async () => {
    for (let i = 1; i < Math.min(5, traces.length); i++) {
      if (!traceDetails[i]) {
        traceDetails[i] = await fetchTraceDetail(traces[i].id);
      }
    }
  })();
}

main().catch(err => {
  process.stdout.write(SHOW_CURSOR);
  console.error(err);
  process.exit(1);
});
