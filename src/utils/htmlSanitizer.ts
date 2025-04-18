import DOMPurify from 'dompurify';
import axios from '../config/axios';
import { API_ROUTES } from '../config/api';

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'a', 'ul', 'ol',
      'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'blockquote',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'figure', 'figcaption',
      'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'title', 'rel', 'src', 'alt', 'class', 'id', 'name',
      'style', 'width', 'height', 'align'
    ],
    FORBID_TAGS: ['script', 'iframe', 'form', 'input', 'textarea'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    FORBID_CONTENTS: ['script']
  });
};