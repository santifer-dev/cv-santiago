/**
 * SVG Architecture Diagram — 12 Airtable Bases
 * Vertical layout — CMS on its own row
 */
export default function ArchitectureDiagram({ lang = 'en' }: { lang?: 'es' | 'en' }) {
  const es = lang === 'es'
  const l = {
    title: es ? 'Arquitectura del Business OS' : 'Business OS Architecture',
    subtitle: es ? '12 bases interconectadas · 2.100+ campos · 50+ automatizaciones' : '12 interconnected bases · 2,100+ fields · 50+ automations',
    erp: es ? 'ERP Central' : 'Central ERP',
    erpSub: es ? 'OTS · Inventario · Compras · Reservas · Garantías' : 'OTS · Inventory · Purchasing · Bookings · Warranties',
    erpBadge: es ? '496 campos' : '496 fields',
    crm: 'CRM',
    crmSub: es ? 'Clientes · Scoring · Tiers' : 'Customers · Scoring · Tiers',
    accounting: es ? 'Contabilidad' : 'Accounting',
    accountingSub: es ? 'Facturas · Conciliación · Gastos' : 'Invoices · Reconciliation · Expenses',
    cms: es ? 'CMS Web' : 'Web CMS',
    cmsSub: es ? '1.534 campos · 647 fórmulas' : '1,534 fields · 647 formulas',
    parts: es ? 'Catálogo Piezas' : 'Parts Catalog',
    accessories: es ? 'Catálogo Accesorios' : 'Accessories Catalog',
    feedback: 'Feedback',
    reviews: es ? 'Reseñas' : 'Reviews',
    kwr: es ? 'KWR Auto' : 'Auto KWR',
    gbp: es ? 'Posts GBP' : 'GBP Posts',
    content: es ? 'Contenido' : 'Content',
    gpt: 'Custom GPT',
    automations: es ? '50+ Automatizaciones nativas de Airtable' : '50+ Native Airtable Automations',
    legendHub: es ? 'Hub central' : 'Central hub',
    legendCore: es ? 'Módulos core' : 'Core modules',
    legendData: es ? 'Catálogos' : 'Catalogs',
    legendSatellite: es ? 'Satélites' : 'Satellites',
  }

  const W = 580
  const H = 740
  const cx = W / 2

  // Row Y positions
  const erpY = 80
  const coreY = 210      // CRM + Accounting
  const cmsY = 300       // Web CMS (own row, centered)
  const catY = 390       // Catalogs
  const sat1Y = 475      // Satellites row 1
  const sat2Y = 530      // Satellites row 2
  const autoY = 610      // Automations bar

  // Column positions
  const colL = 155       // left column center
  const colR = W - 155   // right column center

  return (
    <div className="my-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={l.title}
      >
        <defs>
          <linearGradient id="g-erp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
          <linearGradient id="g-core" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="g-data" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
          <linearGradient id="g-cms" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width={W} height={H} rx="12" fill="#0c0c10" />

        {/* Title */}
        <text x={cx} y="34" textAnchor="middle" fill="#f0f0f5" fontSize="16" fontWeight="700" fontFamily="Space Grotesk, system-ui">{l.title}</text>
        <text x={cx} y="54" textAnchor="middle" fill="#666" fontSize="11" fontFamily="Space Grotesk, system-ui">{l.subtitle}</text>

        {/* ═══ CONNECTIONS ═══ */}
        {/* ERP → CRM */}
        <path d={`M ${cx} ${erpY + 90} C ${cx} ${erpY + 115}, ${colL} ${coreY - 15}, ${colL} ${coreY}`}
          fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.3" />
        {/* ERP → Accounting */}
        <path d={`M ${cx} ${erpY + 90} C ${cx} ${erpY + 115}, ${colR} ${coreY - 15}, ${colR} ${coreY}`}
          fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.3" />
        {/* ERP → CMS */}
        <line x1={cx} y1={erpY + 90} x2={cx} y2={cmsY} stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.3" />
        {/* CRM → Catalogs (Parts) */}
        <line x1={colL} y1={coreY + 58} x2={colL} y2={catY} stroke="#14b8a6" strokeWidth="1" strokeDasharray="3 4" opacity="0.2" />
        {/* Accounting → Catalogs (Accessories) */}
        <line x1={colR} y1={coreY + 58} x2={colR} y2={catY} stroke="#14b8a6" strokeWidth="1" strokeDasharray="3 4" opacity="0.2" />
        {/* CRM → Feedback, Reviews */}
        <line x1={colL} y1={coreY + 58} x2={colL - 25} y2={sat1Y} stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 4" opacity="0.2" />
        <line x1={colL} y1={coreY + 58} x2={cx} y2={sat1Y} stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 4" opacity="0.2" />
        {/* CMS → KWR, GBP, Content */}
        <line x1={cx} y1={cmsY + 55} x2={colL - 25} y2={sat2Y} stroke="#d97706" strokeWidth="1" strokeDasharray="3 4" opacity="0.2" />
        <line x1={cx} y1={cmsY + 55} x2={cx} y2={sat2Y} stroke="#d97706" strokeWidth="1" strokeDasharray="3 4" opacity="0.2" />
        <line x1={cx} y1={cmsY + 55} x2={colR + 25} y2={sat2Y} stroke="#d97706" strokeWidth="1" strokeDasharray="3 4" opacity="0.2" />
        {/* ERP → GPT */}
        <path d={`M ${cx + 80} ${erpY + 85} C ${colR + 60} ${erpY + 140}, ${colR + 30} ${sat1Y - 40}, ${colR + 25} ${sat1Y}`}
          fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="3 4" opacity="0.15" />

        {/* ═══ ROW 1: ERP CENTRAL ═══ */}
        <g>
          <rect x={cx - 140} y={erpY} width="280" height="90" rx="12" fill="url(#g-erp)" />
          <rect x={cx - 140} y={erpY} width="280" height="90" rx="12" fill="none" stroke="#a78bfa" strokeWidth="0.5" opacity="0.4" />
          <text x={cx} y={erpY + 30} textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="Space Grotesk, system-ui">{l.erp}</text>
          <text x={cx} y={erpY + 50} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="system-ui">{l.erpSub}</text>
          <rect x={cx - 32} y={erpY + 60} width="64" height="18" rx="9" fill="rgba(0,0,0,0.3)" />
          <text x={cx} y={erpY + 73} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8.5" fontWeight="600" fontFamily="system-ui">{l.erpBadge}</text>
        </g>

        {/* ═══ ROW 2: CRM + ACCOUNTING ═══ */}
        <g>
          <rect x={colL - 100} y={coreY} width="200" height="58" rx="8" fill="url(#g-core)" opacity="0.85" />
          <text x={colL} y={coreY + 24} textAnchor="middle" fill="white" fontSize="14" fontWeight="600" fontFamily="Space Grotesk, system-ui">{l.crm}</text>
          <text x={colL} y={coreY + 42} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9.5" fontFamily="system-ui">{l.crmSub}</text>
        </g>
        <g>
          <rect x={colR - 100} y={coreY} width="200" height="58" rx="8" fill="url(#g-core)" opacity="0.85" />
          <text x={colR} y={coreY + 24} textAnchor="middle" fill="white" fontSize="14" fontWeight="600" fontFamily="Space Grotesk, system-ui">{l.accounting}</text>
          <text x={colR} y={coreY + 42} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9.5" fontFamily="system-ui">{l.accountingSub}</text>
        </g>

        {/* ═══ ROW 3: WEB CMS (centered, own row) ═══ */}
        <g>
          <rect x={cx - 110} y={cmsY} width="220" height="55" rx="8" fill="url(#g-cms)" opacity="0.85" />
          <text x={cx} y={cmsY + 23} textAnchor="middle" fill="white" fontSize="14" fontWeight="600" fontFamily="Space Grotesk, system-ui">{l.cms}</text>
          <text x={cx} y={cmsY + 41} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="9.5" fontFamily="system-ui">{l.cmsSub}</text>
        </g>

        {/* ═══ ROW 4: CATALOGS ═══ */}
        <g>
          <rect x={colL - 100} y={catY} width="200" height="45" rx="7" fill="url(#g-data)" opacity="0.8" />
          <text x={colL} y={catY + 28} textAnchor="middle" fill="white" fontSize="11.5" fontWeight="600" fontFamily="Space Grotesk, system-ui">{l.parts}</text>
        </g>
        <g>
          <rect x={colR - 100} y={catY} width="200" height="45" rx="7" fill="url(#g-data)" opacity="0.8" />
          <text x={colR} y={catY + 28} textAnchor="middle" fill="white" fontSize="11.5" fontWeight="600" fontFamily="Space Grotesk, system-ui">{l.accessories}</text>
        </g>

        {/* ═══ ROW 5a: SATELLITES ═══ */}
        {[
          { x: colL - 25, label: l.feedback },
          { x: cx, label: l.reviews },
          { x: colR + 25, label: l.gpt },
        ].map((n) => (
          <g key={n.label}>
            <rect x={n.x - 60} y={sat1Y} width="120" height="36" rx="6" fill="#16161d" stroke="#27272f" strokeWidth="1" />
            <text x={n.x} y={sat1Y + 22} textAnchor="middle" fill="#999" fontSize="10.5" fontWeight="600" fontFamily="Space Grotesk, system-ui">{n.label}</text>
          </g>
        ))}

        {/* ═══ ROW 5b: SATELLITES ═══ */}
        {[
          { x: colL - 25, label: l.kwr },
          { x: cx, label: l.gbp },
          { x: colR + 25, label: l.content },
        ].map((n) => (
          <g key={n.label}>
            <rect x={n.x - 60} y={sat2Y} width="120" height="36" rx="6" fill="#16161d" stroke="#27272f" strokeWidth="1" />
            <text x={n.x} y={sat2Y + 22} textAnchor="middle" fill="#999" fontSize="10.5" fontWeight="600" fontFamily="Space Grotesk, system-ui">{n.label}</text>
          </g>
        ))}

        {/* ═══ AUTOMATIONS BAR ═══ */}
        <rect x={40} y={autoY} width={W - 80} height="40" rx="10" fill="#7c3aed10" stroke="#7c3aed33" strokeWidth="1" />
        <text x={cx} y={autoY + 25} textAnchor="middle" fill="#a78bfa" fontSize="11.5" fontWeight="600" fontFamily="Space Grotesk, system-ui">
          ⚡ {l.automations}
        </text>

        {/* ═══ LEGEND ═══ */}
        <g>
          {[
            { x: 55, fill: 'url(#g-erp)', label: l.legendHub },
            { x: 180, fill: 'url(#g-core)', label: l.legendCore },
            { x: 315, fill: 'url(#g-data)', label: l.legendData },
            { x: 430, fill: '#16161d', stroke: '#27272f', label: l.legendSatellite },
          ].map((item) => (
            <g key={item.label}>
              <rect x={item.x - 6} y={H - 24} width="12" height="9" rx="2.5" fill={item.fill} stroke={item.stroke || 'none'} strokeWidth={item.stroke ? 1 : 0} />
              <text x={item.x + 12} y={H - 16} fill="#555" fontSize="9.5" fontFamily="system-ui">{item.label}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}
