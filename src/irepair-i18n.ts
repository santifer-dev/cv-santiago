export type IRepairLang = 'es' | 'en'

interface IRepairMetric {
  value: string
  label: string
}

interface IRepairContent {
  slug: string
  altSlug: string
  seo: {
    title: string
    description: string
  }
  nav: {
    breadcrumbHome: string
    breadcrumbCurrent: string
  }
  hero: {
    headline: string
    sub: string
  }
  metrics: IRepairMetric[]
  cards: {
    shop: {
      title: string
      body: string
      cta: string
      mapLabel: string
    }
    founder: {
      title: string
      body: string
      cta: string
    }
  }
  businessOsCta: {
    heading: string
    body: string
    ctaLabel: string
  }
  jacoboCta: {
    heading: string
    body: string
    ctaLabel: string
  }
  pseoCta: {
    heading: string
    body: string
    ctaLabel: string
  }
}

export const irepairContent: Record<IRepairLang, IRepairContent> = {
  es: {
    slug: 'santifer-irepair',
    altSlug: 'santifer-irepair-founder',
    seo: {
      title: 'Santifer iRepair Sevilla | Reparación de Móviles desde 2009',
      description: 'La tienda de reparación de móviles fundada por Santiago en 2009 sigue abierta en Sevilla. 30.000+ reparaciones. Encuentra la tienda o conoce al fundador.',
    },
    nav: {
      breadcrumbHome: 'Inicio',
      breadcrumbCurrent: 'Santifer iRepair',
    },
    hero: {
      headline: 'Abrí esta tienda con 25 años.\n16 años después, la vendí. Sigue funcionando.',
      sub: 'El comprador mantuvo la marca, los sistemas y el equipo. No cambió nada.',
    },
    metrics: [
      { value: '16', label: 'Años' },
      { value: '30K+', label: 'Reparaciones' },
      { value: '2009', label: 'Fundada' },
      { value: '2025', label: 'Vendida' },
    ],
    cards: {
      shop: {
        title: '¿Buscas Santifer iRepair?',
        body: 'Sigue abierta, sigue reparando. Con el mismo equipo y mi nombre en el cristal.',
        cta: 'Ir a santiferirepair.es',
        mapLabel: 'Ver ubicación y horarios',
      },
      founder: {
        title: '¿Buscas a Santiago?',
        body: 'Un agente IA que atendía el teléfono. Un ERP de 2.100 campos. Miles de landing pages generadas con SEO programático. El comprador no cambió nada. Ahora diseño sistemas de IA y automatización para empresas.',
        cta: 'Ver portfolio',
      },
    },
    businessOsCta: {
      heading: 'El sistema detrás de 30.000 reparaciones',
      body: 'Un ERP completo en Airtable que gestionó el negocio durante años. Automatizaciones, IA y 170 horas al mes ahorradas.',
      ctaLabel: 'Ver el Business OS',
    },
    jacoboCta: {
      heading: 'El agente que atendía el teléfono',
      body: 'Un agente IA con voz que gestionaba citas, presupuestos y consultas. 90% autoservicio.',
      ctaLabel: 'Ver el caso Jacobo',
    },
    pseoCta: {
      heading: 'La web que se construye sola',
      body: '4.700+ landing pages generadas desde el ERP. 2M+ impresiones orgánicas. Cero contenido IA.',
      ctaLabel: 'Ver el SEO Programático',
    },
  },
  en: {
    slug: 'santifer-irepair-founder',
    altSlug: 'santifer-irepair',
    seo: {
      title: 'Santifer iRepair Seville | Phone Repair since 2009',
      description: 'The phone repair shop founded by Santiago in 2009 is still open in Seville, Spain. 30,000+ repairs. Find the shop or meet the founder.',
    },
    nav: {
      breadcrumbHome: 'Home',
      breadcrumbCurrent: 'Santifer iRepair',
    },
    hero: {
      headline: 'I opened this shop at 25.\nSold it 16 years later. It\'s still running.',
      sub: 'The buyer kept the brand, the systems, and the team. Changed nothing.',
    },
    metrics: [
      { value: '16', label: 'Years' },
      { value: '30K+', label: 'Repairs' },
      { value: '2009', label: 'Founded' },
      { value: '2025', label: 'Sold' },
    ],
    cards: {
      shop: {
        title: 'Looking for Santifer iRepair?',
        body: 'Still open, still fixing phones. Same team and my name still on the glass.',
        cta: 'Go to santiferirepair.es',
        mapLabel: 'View location & hours',
      },
      founder: {
        title: 'Looking for Santiago?',
        body: 'An AI agent that answered the phone. A 2,100-field ERP. Thousands of landing pages generated with programmatic SEO. The buyer changed nothing. Now I design AI and automation systems for companies.',
        cta: 'View portfolio',
      },
    },
    businessOsCta: {
      heading: 'The system behind 30,000 repairs',
      body: 'A full ERP built in Airtable that ran the business for years. Automations, AI, and 170 hours/month saved.',
      ctaLabel: 'See the Business OS',
    },
    jacoboCta: {
      heading: 'The agent that answered the phone',
      body: 'An AI voice agent that handled bookings, quotes, and inquiries. 90% self-service.',
      ctaLabel: 'See the Jacobo case study',
    },
    pseoCta: {
      heading: 'The website that builds itself',
      body: '4,700+ landing pages generated from the ERP. 2M+ organic impressions. Zero AI content.',
      ctaLabel: 'See the Programmatic SEO',
    },
  },
}
