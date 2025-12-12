import { useEffect } from "react";

interface DocumentMetaOptions {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
}

export function useDocumentMeta(options: DocumentMetaOptions) {
  useEffect(() => {
    const { title, description, ogTitle, ogDescription, ogImage, ogType } = options;
    
    document.title = title;

    const updateMeta = (name: string, content: string | undefined, property = false) => {
      if (!content) return;
      const attr = property ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    updateMeta("description", description);
    updateMeta("og:title", ogTitle || title, true);
    updateMeta("og:description", ogDescription || description, true);
    updateMeta("og:type", ogType || "website", true);
    if (ogImage) {
      updateMeta("og:image", ogImage, true);
    }

    return () => {};
  }, [options.title, options.description, options.ogTitle, options.ogDescription, options.ogImage, options.ogType]);
}
