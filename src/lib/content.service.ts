export interface ModuleContent {
    content: string;
    frontmatter?: {
        title?: string;
        description?: string;
    };
}

export class ContentService {
    private contentCache = new Map<string, string>();

    async loadModuleContent(slug: string): Promise<string> {
        // Check cache first
        if (this.contentCache.has(slug)) {
            return this.contentCache.get(slug)!;
        }

        try {
            // Load MDX file
            const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
            const response = await fetch(`${basePath}/content/modules/${slug}.mdx`);

            if (!response.ok) {
                throw new Error(`Failed to load content for ${slug}`);
            }

            const content = await response.text();

            // Cache it
            this.contentCache.set(slug, content);

            return content;
        } catch (error) {
            console.error('Error loading module content:', error);
            return this.getPlaceholderContent();
        }
    }

    private getPlaceholderContent(): string {
        return `# Konten Belum Tersedia

Materi untuk modul ini sedang dalam pengembangan.

Silakan cek kembali nanti atau hubungi administrator.`;
    }

    clearCache() {
        this.contentCache.clear();
    }
}

export const contentService = new ContentService();
