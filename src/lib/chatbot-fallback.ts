import { caregivers, services } from '@/lib/data';
import type { Service } from '@/lib/types';

const STOPWORDS = new Set(['care', 'support', 'light']);

function serviceTokens(service: Service): string[] {
  const raw = [...service.name.toLowerCase().split(/\s+/), ...service.id.split('-')];
  return Array.from(new Set(raw.filter((token) => token.length >= 3 && !STOPWORDS.has(token))));
}

function findServices(text: string): Service[] {
  return services
    .map((service) => ({
      service,
      score: serviceTokens(service).filter((token) => text.includes(token)).length,
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.service);
}

function describeService(service: Service): string {
  return `${service.name} — ${service.price}\n${service.longDescription}`;
}

function serviceList(): string {
  return services
    .map((service) => `• ${service.name} — ${service.price}`)
    .join('\n');
}

function serviceListWithDescriptions(): string {
  return services
    .map((service) => `• ${service.name} (${service.price}): ${service.description}`)
    .join('\n');
}

function caregiverList(): string {
  return caregivers
    .map((caregiver) => `• ${caregiver.name} — ${caregiver.role} (${caregiver.experience}, rated ${caregiver.rating}/5)`)
    .join('\n');
}

/**
 * A local, dependency-free responder used when no AI provider key is configured
 * (or when the AI call fails). It answers using the same static data as the site.
 */
export function getFallbackAnswer(message: string): string {
  const text = message.toLowerCase();
  const words = text.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const wordSet = new Set(words);
  const has = (...keys: string[]) => keys.some((key) => text.includes(key));
  const hasWord = (...keys: string[]) => keys.some((key) => wordSet.has(key));

  const GREETINGS = new Set(['hi', 'hello', 'hey', 'greetings', 'good', 'morning', 'afternoon', 'evening', 'there']);
  if (words.length > 0 && words.length <= 3 && words.every((word) => GREETINGS.has(word))) {
    return "Hi! I'm the CareMatrix Assistant. I can help with questions about our home-care services, pricing, and caregivers. What would you like to know?";
  }

  if (words.length <= 4 && hasWord('thank', 'thanks', 'thanks!', 'thx')) {
    return "You're very welcome! Let me know if you have any other questions about CareMatrix.";
  }

  if (has('career', 'job', 'jobs', 'apply', 'hiring', 'vacanc', 'work for')) {
    return 'CareMatrix is always looking for compassionate caregivers. To apply, visit the Careers page and fill in the application form with your name, email, phone number, and a short cover letter.';
  }

  if (has('book', 'booking', 'appointment', 'schedule', 'reserve')) {
    return 'To book a service, head to the Services page, choose the service you need, and select your preferred date and duration (daily or monthly).';
  }

  if (has('caregiver', 'staff', 'team', 'nurse', 'who will')) {
    return `Our caregivers are vetted and trained professionals:\n${caregiverList()}\n\nYou can be matched with the caregiver whose skills best fit the service you book.`;
  }

  const matched = findServices(text);

  if (matched.length > 0 && !has('what services', 'list of services', 'all services', 'which services')) {
    if (matched.length === 1) {
      return `${describeService(matched[0])}\n\nYou can book this from the Services page.`;
    }

    return `${matched.map(describeService).join('\n\n')}\n\nYou can book any of these from the Services page.`;
  }

  if (has('price', 'pricing', 'cost', 'how much', 'rate', 'charges', 'fees')) {
    return `Here are our current rates:\n${serviceList()}\n\nWould you like more detail on any of these services?`;
  }

  if (has('service', 'offer', 'provide', 'help with', 'what do you do')) {
    return `CareMatrix offers these home-care services:\n${serviceListWithDescriptions()}\n\nAsk me about any service and I'll share more detail, or visit the Services page to book.`;
  }

  if (has('contact', 'phone', 'email', 'address', 'location', 'hours', 'open')) {
    return "I don't have the company's direct contact details on hand. Please explore the Services or Careers pages, or reach out to the CareMatrix team directly.";
  }

  return `I can help with questions about CareMatrix's home-care services, pricing, caregivers, bookings, and job applications.\n\nHere's what we offer:\n${serviceList()}\n\nWhat would you like to know?`;
}
