import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'p', 'br', 'b', 'i', 'em', 'strong', 'u', 's', 'strike',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'a', 'img',
  'blockquote', 'pre', 'code',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'span', 'div',
  'hr',
];

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'title', 'class', 'id',
  'target', 'rel',
  'width', 'height',
  'style',
];

const FORBID_TAGS = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'];
const FORBID_ATTR = ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'];

// Helper to get sanitizer instance safely
const getSanitizer = () => {
  if (typeof window !== 'undefined') {
    return DOMPurify(window);
  }
  return null;
};

export function sanitizeHTML(dirty: string): string {
  if (!dirty) return '';

  const sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(dirty, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      FORBID_TAGS,
      FORBID_ATTR,
      ALLOW_DATA_ATTR: false,
      ADD_ATTR: ['target'],
      FORCE_BODY: true,
    });
  }
  // Fallback for SSR: naive escape or return as is (risk of mismatch if rendered)
  // Returning plain escaped text is safer than raw HTML.
  return escapeHTML(dirty);
}

export function sanitizeText(dirty: string): string {
  if (!dirty) return '';

  const sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(dirty, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
  }
  return dirty.replace(/<[^>]*>/g, ''); // Simple strip tags fallback
}

export function sanitizeMarkdown(dirty: string): string {
  if (!dirty) return '';

  const sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(dirty, {
      ALLOWED_TAGS: [...ALLOWED_TAGS, 'sup', 'sub', 'mark', 'abbr', 'details', 'summary'],
      ALLOWED_ATTR: [...ALLOWED_ATTR, 'data-footnote-ref', 'aria-describedby'],
      FORBID_TAGS,
      FORBID_ATTR,
    });
  }
  return escapeHTML(dirty);
}

export function escapeHTML(str: string): string {
  if (!str) return '';

  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return str.replace(/[&<>"'/]/g, char => escapeMap[char] || char);
}

export function sanitizeUrl(url: string): string {
  if (!url) return '';

  const trimmed = url.trim().toLowerCase();

  if (trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:')) {
    return '';
  }

  return url;
}
