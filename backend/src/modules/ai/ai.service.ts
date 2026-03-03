import { AiSuggestion } from '../../shared/types';

/**
 * AI Suggestion Service
 *
 * Uses OpenAI GPT-4o-mini when OPENAI_API_KEY is set.
 * Falls back to rule-based heuristics when no key is available.
 *
 * This keeps the app functional without paid API access,
 * while enabling intelligent suggestions in production.
 */
export class AiService {
  private openaiClient: any = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      // Lazy import to avoid hard dependency
      import('openai').then(({ default: OpenAI }) => {
        this.openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      }).catch(() => {
        // OpenAI not installed — use fallback
      });
    }
  }

  // ── Suggest next dental service based on history ─────────
  async suggestNextService(currentServiceSlug: string): Promise<AiSuggestion[]> {
    if (this.openaiClient) {
      return this.suggestViaOpenAI(currentServiceSlug);
    }
    return this.suggestViaRules(currentServiceSlug);
  }

  // ── Generate SEO suggestions for a service ────────────────
  async generateSeoSuggestions(data: {
    name: string;
    description: string;
  }): Promise<{ title: string; description: string; keywords: string[] }> {
    if (this.openaiClient) {
      return this.seoViaOpenAI(data);
    }
    return {
      title:       `${data.name} — Cosmodent Стоматологічна клініка`,
      description: data.description.slice(0, 155) + (data.description.length > 155 ? '…' : ''),
      keywords:    ['стоматологія', data.name.toLowerCase(), 'київ', 'зуби', 'лікування'],
    };
  }

  // ── OpenAI-powered suggestion ────────────────────────────
  private async suggestViaOpenAI(slug: string): Promise<AiSuggestion[]> {
    try {
      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a dental clinic assistant. Suggest related dental services in Ukrainian. Respond only with valid JSON array.',
          },
          {
            role: 'user',
            content: `Patient visited: "${slug}". Suggest 2-3 complementary dental services as JSON: [{"type":"service","title":"...","description":"...","confidence":0.9}]`,
          },
        ],
        max_tokens: 400,
        temperature: 0.7,
      });

      const text = response.choices[0]?.message?.content ?? '[]';
      return JSON.parse(text) as AiSuggestion[];
    } catch {
      return this.suggestViaRules(slug);
    }
  }

  // ── Rule-based fallback suggestions ──────────────────────
  private suggestViaRules(slug: string): AiSuggestion[] {
    const rules: Record<string, AiSuggestion[]> = {
      'implantology': [
        { type: 'service', title: 'Протезування', description: 'Завершіть відновлення посмішки з протезуванням', confidence: 0.95 },
        { type: 'service', title: 'Хірургічна стоматологія', description: 'Підготовка до імплантації', confidence: 0.85 },
      ],
      'orthodontics': [
        { type: 'service', title: 'Відбілювання зубів', description: 'Підкресліть результат ортодонтії сяючою усмішкою', confidence: 0.90 },
        { type: 'service', title: 'Естетична стоматологія', description: 'Завершіть трансформацію посмішки', confidence: 0.80 },
      ],
      'teeth-whitening': [
        { type: 'service', title: 'Естетична стоматологія', description: 'Комплексне естетичне лікування', confidence: 0.88 },
        { type: 'service', title: 'Ортодонтія', description: 'Ідеальне вирівнювання зубів', confidence: 0.75 },
      ],
      'therapeutic-dentistry': [
        { type: 'service', title: 'Пародонтологія', description: 'Здоровий ясна — основа здорових зубів', confidence: 0.85 },
        { type: 'service', title: 'Лазерне лікування', description: 'Безболісне лікування лазером', confidence: 0.78 },
      ],
    };

    return rules[slug] ?? [
      { type: 'service', title: 'Терапевтична стоматологія', description: 'Комплексний огляд та лікування', confidence: 0.7 },
    ];
  }

  private async seoViaOpenAI(data: { name: string; description: string }): Promise<{
    title: string;
    description: string;
    keywords: string[];
  }> {
    try {
      const response = await this.openaiClient.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert for a Ukrainian dental clinic. Respond only with JSON.',
          },
          {
            role: 'user',
            content: `Generate SEO for service "${data.name}" with description: "${data.description.slice(0, 200)}". Return: {"title":"<70 chars>","description":"<160 chars>","keywords":["...","..."]}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.5,
      });

      const text = response.choices[0]?.message?.content ?? '{}';
      return JSON.parse(text);
    } catch {
      return {
        title:       `${data.name} — Cosmodent`,
        description: data.description.slice(0, 155),
        keywords:    ['стоматологія', data.name.toLowerCase(), 'київ'],
      };
    }
  }
}

export const aiService = new AiService();
