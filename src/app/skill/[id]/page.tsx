import data from "@/../public/data.json"
import SkillDetailClient from "./SkillDetailClient"
import { notFound } from "next/navigation"

// Enable Incremental Static Regeneration (ISR)
export const revalidate = 3600 // Revalidate every hour
export const dynamicParams = true // Allow dynamic generation for IDs not in generateStaticParams

// Pre-build the top 20 skills to avoid hitting GitHub API rate limits during build
// The rest will be generated on-demand when requested
export async function generateStaticParams() {
    return (data as any).skills.slice(0, 20).map((skill: any) => ({
        id: skill.id,
    }))
}

async function getSkillContent(url: string) {
    if (!url) return "";

    let rawUrl = url;
    // Convert GitHub UI URLs to Raw content URLs
    if (url.includes('github.com')) {
        // Handle tree/main -> main
        if (url.includes('/tree/')) {
            rawUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/tree/', '/');
        }
        // Handle blob/main -> main
        else if (url.includes('/blob/')) {
            rawUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
        }
    }

    try {
        const res = await fetch(rawUrl, { next: { revalidate: 3600 } });

        if (!res.ok) {
            if (res.status === 404) {
                return `# Content Not Found\n\nThe documentation for this skill could not be found at the source repository.\n\n[View Original Repository](${url})`;
            }
            return `# Error fetching content\n\nCould not fetch content from the repository (Status: ${res.status}).\n\n[View Original Repository](${url})`;
        }

        return await res.text();
    } catch (e) {
        console.error("Error fetching skill content:", e);
        return `# Error\n\nFailed to load content for this skill.`;
    }
}

export default async function SkillPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Find skill in data.json
    const skill = (data as any).skills.find((s: any) => s.id === id);

    if (!skill) return notFound();

    // Fetch the markdown content from GitHub
    const content = await getSkillContent(skill.url);

    return <SkillDetailClient skill={skill} content={content} />
}
