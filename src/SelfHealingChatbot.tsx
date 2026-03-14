import { type N8nLang as Lang } from './n8n-i18n'
import { buildArticleJsonLd } from './articles/json-ld'
import { useArticleSeo } from './articles/use-article-seo'
import {
  ArticleLayout,
  ArticleHeader,
  ArticleFooter,
  FaqSection,
  LessonsSection,
  MetricsGrid,
  StatusBadge,
  CaseStudyCta,
} from './articles/components'
import {
  H2,
  H3,
  Prose,
  Callout,
  CardStack,
  StepList,
  CodeBlock,
  DataTable,
  Timeline,
  StackGrid,
  FloatingToc,
  DiagramZoom,
} from './articles/content-types'
import { chatbotContent } from './chatbot-i18n'

// ---------------------------------------------------------------------------
// Stack icons (inline SVG for each tech)
// ---------------------------------------------------------------------------
const stackIcons: Record<string, React.ReactNode> = {
  'React 19': (
    <svg viewBox="0 0 23 20.464" className="w-8 h-8" fill="#61DAFB">
      <path d="M18.91 6.633q-.367-.126-.74-.234.062-.252.115-.506c.56-2.72.194-4.912-1.058-5.634-1.2-.692-3.162.03-5.144 1.755q-.293.255-.572.525-.187-.18-.38-.352C9.053.344 6.97-.432 5.72.29 4.523.984 4.168 3.045 4.67 5.623q.077.383.17.762c-.293.084-.578.173-.85.268-2.435.85-3.99 2.18-3.99 3.56 0 1.425 1.67 2.855 4.206 3.72q.308.106.622.196-.102.407-.18.82c-.482 2.533-.106 4.545 1.09 5.235 1.234.712 3.306-.02 5.325-1.784q.24-.208.48-.442.302.293.62.568c1.956 1.682 3.886 2.36 5.08 1.67 1.235-.715 1.636-2.876 1.115-5.505q-.06-.3-.138-.614.218-.064.428-.133C21.285 13.07 23 11.657 23 10.213c0-1.386-1.605-2.725-4.09-3.58zM12.73 2.756c1.698-1.478 3.285-2.06 4.01-1.644.77.444 1.068 2.235.584 4.584q-.047.23-.103.457a23.538 23.538 0 0 0-3.076-.486A23.08 23.08 0 0 0 12.2 3.24q.258-.248.528-.484zM6.79 11.39q.313.604.653 1.19.347.6.722 1.183a20.922 20.922 0 0 1-2.12-.34c.204-.657.454-1.34.746-2.032zm0-2.31c-.286-.678-.53-1.345-.73-1.99.655-.147 1.355-.267 2.084-.358q-.366.57-.705 1.16-.34.586-.65 1.188zm.522 1.156q.454-.945.98-1.854.522-.91 1.114-1.775c.684-.052 1.385-.08 2.094-.08.712 0 1.414.028 2.098.08q.585.865 1.108 1.77.526.906.992 1.845-.46.948-.988 1.862-.523.908-1.104 1.78c-.682.05-1.387.074-2.106.074-.716 0-1.412-.022-2.082-.066q-.596-.87-1.124-1.783-.526-.91-.982-1.854zm8.25 2.34q.346-.603.666-1.22A20.867 20.867 0 0 1 17 13.38a20.852 20.852 0 0 1-2.145.365q.364-.578.706-1.17zm.656-3.495q-.318-.604-.66-1.196-.338-.582-.7-1.15c.733.093 1.436.216 2.097.367a20.96 20.96 0 0 1-.737 1.98zM11.51 3.945a21.013 21.013 0 0 1 1.354 1.634q-1.358-.065-2.718 0c.447-.59.905-1.138 1.365-1.634zM6.214 1.14c.77-.445 2.47.19 4.264 1.783.115.102.23.208.345.318a23.545 23.545 0 0 0-1.96 2.426 24.008 24.008 0 0 0-3.068.477q-.088-.352-.158-.71v.002c-.433-2.21-.146-3.876.577-4.294zM5.09 13.183q-.285-.082-.566-.177A8.324 8.324 0 0 1 1.84 11.58a2.03 2.03 0 0 1-.857-1.368c0-.837 1.248-1.905 3.33-2.63q.393-.138.792-.25a23.565 23.565 0 0 0 1.12 2.904 23.922 23.922 0 0 0-1.134 2.946zm5.326 4.48a8.322 8.322 0 0 1-2.575 1.61 2.03 2.03 0 0 1-1.612.062c-.725-.42-1.027-2.034-.616-4.2q.074-.385.168-.764a23.104 23.104 0 0 0 3.1.448 23.91 23.91 0 0 0 1.974 2.44q-.214.207-.438.403zm1.122-1.112c-.466-.502-.93-1.058-1.384-1.656q.66.026 1.346.026.703 0 1.388-.03a20.894 20.894 0 0 1-1.35 1.66zm5.967 1.367a2.03 2.03 0 0 1-.753 1.428c-.725.42-2.275-.126-3.947-1.564q-.287-.246-.578-.526a23.09 23.09 0 0 0 1.928-2.448 22.936 22.936 0 0 0 3.115-.48q.07.284.124.556a8.32 8.32 0 0 1 .11 3.035zm.834-4.907c-.127.042-.256.082-.388.12a23.06 23.06 0 0 0-1.164-2.913 23.05 23.05 0 0 0 1.12-2.87c.234.067.463.14.683.215 2.13.732 3.428 1.816 3.428 2.65 0 .89-1.403 2.044-3.68 2.798z"/>
      <circle cx="11.5" cy="10.211" r="2.054"/>
    </svg>
  ),
  Vite: (
    <svg viewBox="-0.5 0 257 257" className="w-8 h-8">
      <defs>
        <linearGradient x1="-0.83%" y1="7.65%" x2="57.64%" y2="78.41%" id="vite-g1">
          <stop stopColor="#41D1FF" offset="0%"/>
          <stop stopColor="#BD34FE" offset="100%"/>
        </linearGradient>
        <linearGradient x1="43.38%" y1="2.24%" x2="50.32%" y2="89.03%" id="vite-g2">
          <stop stopColor="#FFEA83" offset="0%"/>
          <stop stopColor="#FFDD35" offset="8.33%"/>
          <stop stopColor="#FFA800" offset="100%"/>
        </linearGradient>
      </defs>
      <path d="M255.153 37.938 134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.874 37.958c-2.745-4.814 1.371-10.646 6.828-9.671l120.384 21.518c.768.137 1.554.136 2.322-.004L248.276 28.318c5.438-.991 9.574 4.796 6.877 9.62Z" fill="url(#vite-g1)"/>
      <path d="M185.432.063 96.44 17.501a2.268 2.268 0 0 0-1.634 3.014l-5.474 92.456c-.129 2.178 1.871 3.868 3.996 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.362 36.047c-.495 2.426 1.782 4.5 4.152 3.781l15.303-4.65c2.373-.72 4.652 1.361 4.15 3.789l-11.698 56.621c-.732 3.542 3.979 5.473 5.944 2.437l1.312-2.028 72.516-144.72c1.215-2.422-.879-5.185-3.54-4.672l-25.504 4.922c-2.396.462-4.435-1.77-3.759-4.115l16.646-57.705c.677-2.349-1.37-4.583-3.769-4.113Z" fill="url(#vite-g2)"/>
    </svg>
  ),
  Vercel: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor"><path d="M24 22.525H0l12-21.05z"/></svg>
  ),
  'Claude Sonnet': (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#D97757"><path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/></svg>
  ),
  'Claude Haiku': (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#D97757"><path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/></svg>
  ),
  OpenAI: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>
  ),
  'OpenAI Realtime': (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>
  ),
  Supabase: (
    <svg viewBox="0 0 24 24" className="w-8 h-8"><defs><linearGradient id="sb-a" x1="20.86%" x2="63.35%" y1="20.17%" y2="44.75%"><stop offset="0%" stopColor="#249361"/><stop offset="100%" stopColor="#3ECF8E"/></linearGradient><linearGradient id="sb-b" x1="1.99%" x2="21.4%" y1="-13.36%" y2="34.24%"><stop offset="0%"/><stop offset="100%" stopOpacity="0"/></linearGradient></defs><path fill="url(#sb-a)" d="M13.983 21.616c-.553.694-1.64.313-1.654-.578l-.21-13.046h9.273c1.68 0 2.604 1.95 1.53 3.231z"/><path fill="url(#sb-b)" fillOpacity=".2" d="M13.983 21.616c-.553.694-1.64.313-1.654-.578l-.21-13.046h9.273c1.68 0 2.604 1.95 1.53 3.231z"/><path fill="#3ECF8E" d="M10.017 2.384c.553-.694 1.64-.313 1.654.578l.071 13.046H2.607c-1.68 0-2.604-1.95-1.53-3.231z"/></svg>
  ),
  Langfuse: (
    <svg viewBox="0 0 389 256" className="w-8 h-8" fill="none">
      <path fill="#0a60b5" d="M347.54 204.9c-17.18 23.25-43.5 38.75-73.18 41.02q-1.38.1-2.78.18c-34.81 1.73-61.1-14.15-78.54-28.9-30.85-16.33-55-20.44-69.12-24-10.27-2.58-19.26-7.76-23.1-10.34a43.8 43.8 0 0 1-21.4-38.76 162 162 0 0 1 22.68-1.47c31.17-.03 55.35 1.5 72.94 9.3a104 104 0 0 1 26.19 16.67c10.1 8.82 30.76 22.77 56.22 18q4.86-.9 9.34-2.39a108.7 108.7 0 0 1 80.75 20.7Zm-2.29-160.05c-7.75-10.03-17.16-19.52-28.28-25.99a108 108 0 0 0-45.25-14.44C227.05.5 196.5 25.27 190.94 29.95c-6.93 6.5-34.62 29.5-67.96 42.26a67 67 0 0 0-26.93 17.87 66 66 0 0 0-13.6 22.96q5.97.82 12.32 1.19c32.32 1.8 60.1 1.97 78.27-6.92 12-5.88 22.53-14.24 31.6-24.03 16.37-17.66 40.23-25.53 61.95-20.13a110 110 0 0 0 47.45-3.7c13.87-4.26 24.2-9.6 31.21-14.6ZM42.09 52.3a145 145 0 0 1-28.67-19.47A5.69 5.69 0 0 0 4 37.17v40.19c0 1.75.8 3.4 2.14 4.49l16.47 15.84A92.7 92.7 0 0 1 42.09 52.3ZM307.16 142a64 64 0 0 0 3.09-18.1c.13-4.91-.44-6.74-1.3-11.49a371 371 0 0 0 29.69-6.45c10.54-2.72 18.33-5.88 27.1-9.03 1.27 6.13 2.61 9.1 3.08 13.65a156 156 0 0 1-3.4 51.86 218 218 0 0 0-58.26-20.45ZM13.04 226.85A5.7 5.7 0 0 1 4 222.19v-49.36a5.8 5.8 0 0 1 2.73-4.91l16.31-7c1.2 6.54 3.18 14.37 6.49 22.9a125 125 0 0 0 12.56 24.17q-14.55 9.43-29.05 18.86Z"/>
      <path fill="#e11312" fillRule="evenodd" d="M118.08 11.2c32.62-1.62 57.02 12.05 69.6 21.18-9.53 8.4-35.28 28.7-65.75 40.42a67 67 0 0 0-7.9 3.4 63.6 63.6 0 0 0-35.73 55.62q-.15 5.86.61 11.58l-.16.02c-.1 3.97.24 13.3 5.98 23.06a43.6 43.6 0 0 0 15.4 15.4 76 76 0 0 0 7.73 4.44 66 66 0 0 0 15.36 5.83l5.73 1.38c14.54 3.45 36.56 8.67 63.57 22.87q4.08 3.45 8.81 6.85-1.43 1.29-2.41 2.22c-5.57 4.71-36.13 29.62-80.84 25.67a108 108 0 0 1-45.29-14.52c-19.95-11.66-35.03-30.11-43.25-51.71a155.7 155.7 0 0 1-3.7-100.36c12.1-40.38 47.39-70 89.45-73.17q1.39-.1 2.79-.18m228.5 192.46a110 110 0 0 0-37.3-17.93 109 109 0 0 0-43.27-2.5q-4.5 1.46-9.33 2.37c-25.45 4.72-46.1-9.1-56.2-17.86a104 104 0 0 0-6.06-4.86 103 103 0 0 1 22.41-15.13c18.19-8.93 45.98-8.75 78.33-6.96 44.58 2.5 75.38 23.73 87.67 33.48a5.7 5.7 0 0 1 2.16 4.48v40.07a5.72 5.72 0 0 1-9.48 4.33 145 145 0 0 0-28.93-19.49M203.66 83.92q-4.4 4.77-9.22 9.02a104 104 0 0 0 20.12 11.7c17.58 7.74 41.75 9.26 72.9 9.22 45.7-.07 79.34-17.27 94.78-26.64a5.7 5.7 0 0 0 2.75-4.89V33.14a5.73 5.73 0 0 0-9.09-4.64c-9 6.47-22.36 14.73-39.6 21.23a108 108 0 0 1-23.18 10.23 110 110 0 0 1-47.47 3.72c-21.74-5.42-45.62 2.5-62 20.24" clipRule="evenodd"/>
    </svg>
  ),
  Resend: (
    <svg viewBox="0 0 1800 1800" className="w-8 h-8" fill="currentColor"><path d="M1000.46 450C1174.77 450 1278.43 553.669 1278.43 691.282C1278.43 828.896 1174.77 932.563 1000.46 932.563H912.382L1350 1350H1040.82L707.794 1033.48C683.944 1011.47 672.936 985.781 672.935 963.765C672.935 932.572 694.959 905.049 737.161 893.122L908.712 847.244C973.85 829.812 1018.81 779.353 1018.81 713.298C1018.8 632.567 952.745 585.78 871.095 585.78H450V450H1000.46Z"/></svg>
  ),
  'GitHub Actions': (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
  ),
}

// ---------------------------------------------------------------------------
// buildJsonLd
// ---------------------------------------------------------------------------
function buildJsonLd(lang: Lang) {
  const t = chatbotContent[lang]
  return buildArticleJsonLd({
    lang,
    url: `https://santifer.io/${t.slug}`,
    altUrl: `https://santifer.io/${t.altSlug}`,
    headline: t.header.h1,
    alternativeHeadline: t.seo.title,
    description: t.seo.description,
    datePublished: '2026-03-11',
    dateModified: '2026-03-14',
    keywords: [
      'LLMOps', 'self-healing chatbot', 'agentic RAG', 'jailbreak defense', 'prompt injection',
      'LLM evaluation', 'closed loop LLM', 'Langfuse', 'prompt versioning', 'adversarial testing',
      'trace-to-eval', 'hybrid search pgvector', 'AI portfolio', 'chatbot evals', 'CI gate LLM',
      'voice mode chatbot', 'OpenAI Realtime API', 'speech-to-speech AI',
      'agentic observability', 'developer feedback loop', 'AI maintaining AI',
    ],
    images: ['https://santifer.io/chatbot/og-self-healing-chatbot.png'],
    breadcrumbHome: t.nav.breadcrumbHome,
    breadcrumbCurrent: t.nav.breadcrumbCurrent,
    faq: t.faq.items,
    articleType: 'TechArticle',
    about: [
      { '@type': 'SoftwareApplication', name: 'Langfuse', url: 'https://langfuse.com', applicationCategory: 'LLM Observability' },
      { '@type': 'SoftwareApplication', name: 'Supabase', url: 'https://supabase.com', applicationCategory: 'Database' },
      { '@type': 'Thing', name: 'LLMOps' },
      { '@type': 'Thing', name: 'Retrieval-Augmented Generation' },
    ],
    extra: { proficiencyLevel: 'Expert', dependencies: 'Claude, Langfuse, Supabase, Vercel, OpenAI, Resend, GitHub Actions' },
  })
}

// ===========================================================================
// MAIN COMPONENT
// ===========================================================================
export default function SelfHealingChatbot({ lang = 'en' }: { lang?: Lang }) {
  const t = chatbotContent[lang]

  useArticleSeo({
    lang,
    slug: t.slug,
    altSlug: t.altSlug,
    title: t.seo.title,
    description: t.seo.description,
    image: 'https://santifer.io/chatbot/og-self-healing-chatbot.png',
    publishedTime: '2026-03-11',
    modifiedTime: '2026-03-14',
    articleTags: 'LLMOps,self-healing chatbot,agentic RAG,jailbreak defense,Langfuse,evals,closed-loop,prompt injection',
    jsonLd: buildJsonLd(lang),
    xDefaultSlug: 'chatbot-que-se-cura-solo',
  })

  const s = t.sections

  return (
    <ArticleLayout lang={lang}>
      <FloatingToc />
      <ArticleHeader
        kicker={t.header.kicker}
        h1={t.header.h1}
        subtitle={t.header.subtitle}
        date={t.header.date}
        readingTime={t.readingTime}
      />

      <img
        src="/chatbot/hero-self-healing-chatbot.webp"
        alt={t.header.h1}
        className="w-full rounded-2xl mb-8"
        width={1400}
        height={782}
        fetchPriority="high"
      />

      <StatusBadge text={t.header.badge} />
      <MetricsGrid items={t.heroMetrics} columns={4} compact />
      <Callout className="bg-accent/10 border-accent/40">{t.tldr}</Callout>
      <Callout>{t.metaCallout}</Callout>

      <article className="prose-custom">
        {/* ================================================================ */}
        {/*  GENESIS                                                         */}
        {/* ================================================================ */}
        <H2 id="genesis">{s.genesis.heading}</H2>
        <Prose variant="hook">{s.genesis.hook}</Prose>
        <Prose>{s.genesis.firstCommit}</Prose>
        <Prose className="text-sm text-muted-foreground mb-2">{s.genesis.codeCaption}</Prose>
        <CodeBlock>
          {s.genesis.code}
        </CodeBlock>
        <Callout>{s.genesis.punchline}</Callout>

        {/* ================================================================ */}
        {/*  EVOLUTION                                                       */}
        {/* ================================================================ */}
        <H2 id="evolution">{s.evolution.heading}</H2>
        <Timeline items={s.evolution.timeline.map(item => ({
          year: item.date,
          event: item.title,
          detail: item.detail,
        }))} />
        <Callout>{s.evolution.callout}</Callout>

        <H3>{s.evolution.beforeAfter.heading}</H3>
        <img
          src="/chatbot/diagram-before-after.webp"
          alt={lang === 'es' ? 'Día 1 vs Hoy: 80 líneas → sistema completo, 0 capas → 6, 0 tests → 71, sin observabilidad → Langfuse full stack' : 'Day 1 vs Today: 80 lines → full system, 0 layers → 6, 0 tests → 71, no observability → Langfuse full stack'}
          className="w-full rounded-xl my-8"
          width={1400}
          height={782}
          loading="lazy"
        />

        {/* ================================================================ */}
        {/*  ARCHITECTURE                                                    */}
        {/* ================================================================ */}
        <H2 id="architecture">{s.architecture.heading}</H2>
        <Prose>{s.architecture.body}</Prose>
        <img
          src="/chatbot/diagram-architecture.webp"
          alt={lang === 'es' ? 'Diagrama de arquitectura: User → Edge Function → Langfuse → Trace-to-Eval, Red Team, CI Gate' : 'Architecture diagram: User → Edge Function → Langfuse → Trace-to-Eval, Red Team, CI Gate'}
          className="w-full max-w-lg mx-auto rounded-xl my-8"
          width={1400}
          height={1875}
          loading="lazy"
        />
        <CardStack items={s.architecture.layers.map(l => ({
          title: l.title,
          detail: l.detail,
        }))} />

        <H3>{s.architecture.lifecycleHeading}</H3>
        <img
          src="/chatbot/diagram-request-lifecycle.webp"
          alt={lang === 'es' ? 'Request lifecycle: Message → Decide (Sonnet) → Search (pgvector) → Rerank (Haiku) → Generate (Sonnet) → Score (Haiku, 0ms added)' : 'Request lifecycle: Message → Decide (Sonnet) → Search (pgvector) → Rerank (Haiku) → Generate (Sonnet) → Score (Haiku, 0ms added)'}
          className="w-full rounded-xl my-8"
          width={1400}
          height={594}
          loading="lazy"
        />
        <DataTable
          headers={[...s.architecture.lifecycle.headers]}
          rows={s.architecture.lifecycle.rows.map(r => [...r])}
        />

        <H3>{s.stack.heading}</H3>
        <StackGrid items={s.stack.items.map(item => ({
          icon: stackIcons[item.name] ?? <span className="w-8 h-8 flex items-center justify-center text-lg font-bold text-primary">{item.name[0]}</span>,
          name: item.name,
          desc: item.role,
        }))} />

        {/* ================================================================ */}
        {/*  AGENTIC OBSERVABILITY                                           */}
        {/* ================================================================ */}
        <H2 id="agentic-observability">{s.agenticObservability.heading}</H2>
        <Prose>{s.agenticObservability.body}</Prose>

        <DiagramZoom
          src="/chatbot/dashboard-evals.webp"
          hdSrc="/chatbot/dashboard-evals.webp"
          alt={lang === 'es' ? 'Dashboard LLMOps: tab Evals — 95.8% pass rate, 71 tests, 10 categorías con barras de progreso por categoría' : 'LLMOps Dashboard: Evals tab — 95.8% pass rate, 71 tests, 10 categories with per-category progress bars'}
          caption={lang === 'es' ? 'Tab Evals: 95.8% pass rate en 71 tests, desglose por categoría' : 'Evals tab: 95.8% pass rate across 71 tests, breakdown by category'}
        />
        <DiagramZoom
          src="/chatbot/dashboard-conversations.webp"
          hdSrc="/chatbot/dashboard-conversations.webp"
          alt={lang === 'es' ? 'Dashboard LLMOps: tab Conversations — lista de conversaciones reales con coste, tags, idioma y detalle de traza con spans' : 'LLMOps Dashboard: Conversations tab — real conversation list with cost, tags, language, and trace detail with spans'}
          caption={lang === 'es' ? 'Tab Conversations: conversaciones reales con coste por traza, tags automáticos y spans de latencia' : 'Conversations tab: real conversations with per-trace cost, auto-tags, and latency spans'}
        />
        <DiagramZoom
          src="/chatbot/dashboard-security.webp"
          hdSrc="/chatbot/dashboard-security.webp"
          alt={lang === 'es' ? 'Dashboard LLMOps: tab Security — 96.7% safety, funnel de seguridad, intentos de jailbreak recientes con detalle' : 'LLMOps Dashboard: Security tab — 96.7% safety, security funnel, recent jailbreak attempts with detail'}
          caption={lang === 'es' ? 'Tab Security: funnel de seguridad, 96.7% safety score, jailbreak attempts en tiempo real' : 'Security tab: security funnel, 96.7% safety score, real-time jailbreak attempts'}
        />

        {/* ================================================================ */}
        {/*  HOW IT WAS BUILT                                                */}
        {/* ================================================================ */}
        <H2 id="how-it-was-built">{s.howItWasBuilt.heading}</H2>
        <Prose variant="hook">{s.howItWasBuilt.intro}</Prose>
        <Prose>{s.howItWasBuilt.narrative}</Prose>
        <img
          src="/chatbot/diagram-mma-phases.webp"
          alt={lang === 'es' ? 'The MMA Loop: Measure (Cost, Score, CI Gate) → Manage (Prompt Registry, Regression Test) → Automate (Red Team, Trace-to-Eval)' : 'The MMA Loop: Measure (Cost, Score, CI Gate) → Manage (Prompt Registry, Regression Test) → Automate (Red Team, Trace-to-Eval)'}
          className="w-full rounded-xl my-8"
          width={1400}
          height={782}
          loading="lazy"
        />
        {s.howItWasBuilt.phases.map((phase, i) => (
          <div key={i}>
            <H3>{`${phase.title} — ${phase.subtitle}`}</H3>
            <StepList items={phase.items.map(item => ({
              label: item.label,
              detail: item.detail,
            }))} />
          </div>
        ))}

        {/* ================================================================ */}
        {/*  RAG                                                             */}
        {/* ================================================================ */}
        <H2 id="rag">{s.rag.heading}</H2>

        <H3>{s.rag.whyAgentic.heading}</H3>
        <Prose>{s.rag.whyAgentic.body}</Prose>

        <H3>{s.rag.hybridSearch.heading}</H3>
        <Prose>{s.rag.hybridSearch.body}</Prose>

        <H3>{s.rag.reranking.heading}</H3>
        <Prose>{s.rag.reranking.body}</Prose>

        <H3>{s.rag.gracefulDegradation.heading}</H3>
        <StepList items={s.rag.gracefulDegradation.steps.map(s => ({
          label: s.label,
          detail: s.detail,
        }))} />
        <Callout>{s.rag.callout}</Callout>
        <Callout className="bg-accent/10 border-accent/40">{s.rag.recursivityCallout}</Callout>
        <Prose>{s.rag.indexedArticles}</Prose>

        {/* ================================================================ */}
        {/*  DEFENSE                                                         */}
        {/* ================================================================ */}
        <H2 id="defense">{s.defense.heading}</H2>
        <img
          src="/chatbot/diagram-defense-layers.webp"
          alt={lang === 'es' ? '6 capas de defensa: Keywords (50+ patrones) → Canary Tokens (UUID trap) → Fingerprinting (12 frases) → Anti-Extract → Safety Score (Haiku real-time) → Red Team (ataques evolutivos)' : '6 defense layers: Keywords (50+ patterns) → Canary Tokens (UUID trap) → Fingerprinting (12 phrases) → Anti-Extract → Safety Score (Haiku real-time) → Red Team (evolving attacks)'}
          className="w-full max-w-2xl mx-auto rounded-xl my-8"
          width={5504}
          height={3072}
          loading="lazy"
        />
        <CardStack items={s.defense.layers.map(l => ({
          title: l.title,
          detail: l.detail,
        }))} />
        <a href={s.defense.linkedInPostUrl} target="_blank" rel="noopener noreferrer" className="block no-underline">
          <Callout className="bg-accent/10 border-accent/40 hover:border-accent/60 transition-colors cursor-pointer">{s.defense.linkedInCallout}</Callout>
        </a>
        <Callout>{s.defense.callout}</Callout>

        {/* ================================================================ */}
        {/*  EVALS                                                           */}
        {/* ================================================================ */}
        <H2 id="evals">{s.evals.heading}</H2>
        <MetricsGrid items={s.evals.metricsItems.map(m => ({
          value: m.value,
          label: m.label,
        }))} columns={4} compact />

        <H3>{s.evals.tableHeading}</H3>
        <DataTable
          headers={[...s.evals.table.headers]}
          rows={s.evals.table.rows.map(r => [...r])}
        />

        <img
          src="/chatbot/diagram-evals-donut.webp"
          alt={lang === 'es' ? '71 tests: RAG 16, Factual 9, Boundaries 7, Quality 7, Safety 7, Voice 6, Language 5, Multi-turn 5, Source Badges 5, Persona 4' : '71 tests: RAG 16, Factual 9, Boundaries 7, Quality 7, Safety 7, Voice 6, Language 5, Multi-turn 5, Source Badges 5, Persona 4'}
          className="w-full max-w-lg mx-auto rounded-xl my-8"
          width={1400}
          height={1400}
          loading="lazy"
        />

        <H3>{s.evals.assertionTypes.heading}</H3>
        <Prose>{s.evals.assertionTypes.body}</Prose>

        {/* ================================================================ */}
        {/*  CLOSED LOOP                                                     */}
        {/* ================================================================ */}
        <H2 id="closed-loop">{s.closedLoop.heading}</H2>
        <Prose variant="hook">{s.closedLoop.hook}</Prose>

        <H3>{s.closedLoop.stagesHeading}</H3>
        <StepList items={s.closedLoop.stages.map(st => ({
          label: st.label,
          detail: st.detail,
        }))} />
        <Callout>{s.closedLoop.keyCallout}</Callout>

        <img
          src="/chatbot/diagram-closed-loop.webp"
          alt={lang === 'es' ? 'Closed-loop: Deploy → Score → Detect → Generate Test → CI Gate → Push → Deploy' : 'Closed-loop: Deploy → Score → Detect → Generate Test → CI Gate → Push → Deploy'}
          className="w-full rounded-xl my-8"
          width={1400}
          height={782}
          loading="lazy"
        />
        <Prose className="text-sm text-muted-foreground mt-2">{s.closedLoop.diagramCaption}</Prose>

        <H3>{s.closedLoop.promptVersioning.heading}</H3>
        <Prose>{s.closedLoop.promptVersioning.body}</Prose>

        <H3>{s.closedLoop.developerLoop.heading}</H3>
        <Prose>{s.closedLoop.developerLoop.body}</Prose>

        {/* ================================================================ */}
        {/*  COST                                                            */}
        {/* ================================================================ */}
        <H2 id="cost">{s.cost.heading}</H2>
        <MetricsGrid items={s.cost.metricsItems} columns={4} />

        <H3>{s.cost.tableHeading}</H3>
        <DataTable
          headers={[...s.cost.table.headers]}
          rows={s.cost.table.rows.map(r => [...r])}
        />
        <Callout>{s.cost.callout}</Callout>

        {/* ================================================================ */}
        {/*  VOICE                                                           */}
        {/* ================================================================ */}
        <H2 id="voice">{s.voice.heading}</H2>
        <Prose variant="hook">{s.voice.hook}</Prose>

        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto my-8">
          <figure>
            <img
              src="/chatbot/voice-mode-ui.webp"
              alt={lang === 'es'
                ? 'Modo voz: VoiceOrb animado, timer 1:45, source badges enlazando a Agente IA Jacobo y Business OS'
                : 'Voice mode: animated VoiceOrb, 1:45 timer, source badges linking to AI Agent Jacobo and Business OS'}
              className="rounded-2xl w-full"
              width={390}
              height={560}
              loading="lazy"
            />
            <figcaption className="mt-2 text-xs text-muted-foreground text-center">
              {lang === 'es' ? 'Modo voz' : 'Voice mode'}
            </figcaption>
          </figure>
          <figure>
            <img
              src="/chatbot/text-mode-ui.webp"
              alt={lang === 'es'
                ? 'Modo texto: respuesta sobre Jacobo con source badges, botón de micrófono para cambiar a voz'
                : 'Text mode: response about Jacobo with source badges, microphone button to switch to voice'}
              className="rounded-2xl w-full"
              width={390}
              height={560}
              loading="lazy"
            />
            <figcaption className="mt-2 text-xs text-muted-foreground text-center">
              {lang === 'es' ? 'Modo texto' : 'Text mode'}
            </figcaption>
          </figure>
        </div>

        <H3>{s.voice.architectureHeading}</H3>
        <StepList items={s.voice.pipeline.map(item => ({
          label: item.label,
          detail: item.detail,
        }))} />

        <H3>{s.voice.sharedHeading}</H3>
        <Prose>{s.voice.sharedBody}</Prose>

        <H3>{s.voice.constraintsHeading}</H3>
        <StepList items={s.voice.constraints.map(item => ({
          label: item.label,
          detail: item.detail,
        }))} />

        <Callout>{s.voice.callout}</Callout>

        {/* ================================================================ */}
        {/*  LESSONS                                                         */}
        {/* ================================================================ */}
        <Callout className="bg-accent/10 border-accent/40">{s.lessons.saveTrigger}</Callout>
        <LessonsSection heading={s.lessons.heading} items={s.lessons.items} />

        {/* ================================================================ */}
        {/*  FAQ                                                             */}
        {/* ================================================================ */}
        <FaqSection heading={t.faq.heading} items={t.faq.items} />

        {/* Easter egg */}
        <details className="mx-auto mt-12 max-w-md cursor-pointer text-center text-sm text-muted-foreground">
          <summary className="select-none hover:text-foreground transition-colors">
            {lang === 'es' ? '¿Escuchaste eso?' : 'Did you hear that?'}
          </summary>
          <img
            src="/chatbot/yo-dawg-rag.jpg"
            alt="Yo Dawg, I heard you like RAG, so I put RAG in my chat so it can RAG while you RAG"
            className="mt-4 rounded-lg"
            loading="lazy"
          />
        </details>

        {/* ================================================================ */}
        {/*  CTA                                                             */}
        {/* ================================================================ */}
        <CaseStudyCta
          heading={t.cta.heading}
          body={t.cta.body}
          ctaLabel={t.cta.label}
          ctaHref="https://linkedin.com/in/santifer"
          external
          secondaryLabel={t.cta.labelSecondary}
          secondaryHref="mailto:hola@santifer.io"
        />
      </article>

      <ArticleFooter lang={lang} utmCampaign="self-healing-chatbot" />
    </ArticleLayout>
  )
}
