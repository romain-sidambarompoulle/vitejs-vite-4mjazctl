declare module 'dompurify' {
  interface DOMPurifyOptions {
    ALLOWED_TAGS?: string[];
    ALLOWED_ATTR?: string[];
    FORBID_TAGS?: string[];
    FORBID_ATTR?: string[];
    FORBID_CONTENTS?: string[];
    [key: string]: any;
  }

  interface DOMPurifyI {
    sanitize(html: string, options?: DOMPurifyOptions): string;
  }

  const DOMPurify: DOMPurifyI;
  export default DOMPurify;
} 