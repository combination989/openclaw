"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Copy, Check, ExternalLink, Bookmark, Github, Zap, Shield, Box, Tag, Download, Calendar, FileText } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { isBookmarked, toggleBookmark as toggleBookmarkLocal } from "@/lib/bookmarks"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Skill {
    id: string;
    name: string;
    category: string;
    description: string;
    url: string;
}

interface SkillDetailClientProps {
    skill: Skill;
    content: string;
}

export default function SkillDetailClient({ skill, content }: SkillDetailClientProps) {
    const [copied, setCopied] = useState(false)
    const [installCopied, setInstallCopied] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const router = useRouter()
    const [isLoadingBookmark, setIsLoadingBookmark] = useState(true)

    // Extract author from URL
    const getAuthor = (url: string) => {
        try {
            if (!url) return "community";
            const parts = url.split('/');
            const lastSkillsIndex = parts.lastIndexOf('skills');

            if (lastSkillsIndex !== -1 && parts.length > lastSkillsIndex + 1) {
                return parts[lastSkillsIndex + 1];
            }
            return "community";
        } catch (e) {
            return "community";
        }
    }

    const author = getAuthor(skill.url)
    const installCommand = `npx clawhub@latest install ${skill.id}`

    // Check initial bookmark status
    useEffect(() => {
        setIsLoadingBookmark(true);
        setIsSaved(isBookmarked(skill.id));
        setIsLoadingBookmark(false);
    }, [skill.id]);

    const toggleBookmark = async () => {
        const newState = toggleBookmarkLocal(skill.id);
        setIsSaved(newState);
    }

    const handleCopyContent = () => {
        navigator.clipboard.writeText(content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleCopyInstall = () => {
        navigator.clipboard.writeText(installCommand)
        setInstallCopied(true)
        setTimeout(() => setInstallCopied(false), 2000)
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Top Bar */}
            <div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="pl-0 hover:pl-2 transition-all"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Browse
                </Button>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">{skill.name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm flex-wrap">
                        <span>by <span className="text-red-600 hover:underline cursor-pointer">{author}</span></span>
                        <span className="text-muted-foreground/40">•</span>
                        <span>{skill.category}</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        disabled={isLoadingBookmark}
                        className={`transition-all ${isSaved ? 'bg-red-500/20 text-red-600 border-red-500/50' : ''}`}
                        onClick={toggleBookmark}
                    >
                        <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? 'fill-red-600' : ''}`} />
                        {isSaved ? 'Saved' : 'Save'}
                    </Button>
                    <Link href={skill.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline">
                            <Github className="w-4 h-4 mr-2" />
                            GitHub
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column (Main Info) */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Installation */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">INSTALLATION</h3>
                        <div className="relative group">
                            <div className="bg-card border rounded-xl p-4 flex items-center justify-between font-mono text-sm text-red-600">
                                <span className="break-all">{installCommand}</span>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 shrink-0 ml-2"
                                    onClick={handleCopyInstall}
                                >
                                    {installCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Button className="w-full h-14 text-lg font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl">
                        <Zap className="w-5 h-5 mr-2 fill-current" />
                        Test Drive Skill
                    </Button>

                    {/* About & Capabilities */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold">About this Skill</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {skill.description || "No description provided for this skill."}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Capabilities</h3>
                            <ul className="grid sm:grid-cols-2 gap-4">
                                <li className="flex items-start gap-3 bg-card p-4 rounded-xl border hover:border-red-500/50 transition-colors">
                                    <Box className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <span className="text-sm text-muted-foreground">Optimized for low-latency execution environments.</span>
                                </li>
                                <li className="flex items-start gap-3 bg-card p-4 rounded-xl border hover:border-red-500/50 transition-colors">
                                    <Shield className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                    <span className="text-sm text-muted-foreground">Sandboxed execution with strict permission boundaries.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <Separator />

                    {/* Documentation Tabs */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Documentation</h2>
                        <Tabs defaultValue="preview" className="w-full">
                            <TabsList className="w-full justify-start">
                                <TabsTrigger value="preview">Preview</TabsTrigger>
                                <TabsTrigger value="raw">Raw Source</TabsTrigger>
                            </TabsList>

                            <TabsContent value="preview">
                                <Card className="border-red-500/20 overflow-hidden bg-card">
                                    <CardContent className="p-6 md:p-8 text-foreground break-words">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4 first:mt-0 tracking-tight" {...props} />,
                                                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-8 mb-4 tracking-tight border-b pb-2" {...props} />,
                                                h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-6 mb-3 tracking-tight" {...props} />,
                                                p: ({ node, ...props }) => <p className="leading-7 mb-4 text-muted-foreground" {...props} />,
                                                a: ({ node, ...props }) => <a className="text-red-600 font-medium hover:underline decoration-red-600/30 underline-offset-4 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="my-4 ml-6 list-disc [&>li]:mt-2 text-muted-foreground" {...props} />,
                                                ol: ({ node, ...props }) => <ol className="my-4 ml-6 list-decimal [&>li]:mt-2 text-muted-foreground" {...props} />,
                                                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-red-500 pl-4 italic my-6 text-muted-foreground/90 bg-red-500/5 py-2 rounded-r" {...props} />,
                                                code: ({ node, inline, className, children, ...props }: any) => {
                                                    const match = /language-(\w+)/.exec(className || '')
                                                    return !inline && match ? (
                                                        <div className="relative my-6 rounded-lg overflow-hidden border bg-[#1e1e1e]">
                                                            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#404040]">
                                                                <span className="text-xs font-mono text-gray-400">{match[1]}</span>
                                                            </div>
                                                            <SyntaxHighlighter
                                                                style={vscDarkPlus}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '0.875rem' }}
                                                                {...props}
                                                            >
                                                                {String(children).replace(/\n$/, '')}
                                                            </SyntaxHighlighter>
                                                        </div>
                                                    ) : (
                                                        <code className="bg-muted px-[0.3rem] py-[0.2rem] rounded text-sm font-mono font-medium text-red-600" {...props}>
                                                            {children}
                                                        </code>
                                                    )
                                                },
                                                pre: ({ children }) => <>{children}</>,
                                                table: ({ node, ...props }) => (
                                                    <div className="my-6 w-full overflow-y-auto rounded-lg border">
                                                        <table className="w-full text-sm" {...props} />
                                                    </div>
                                                ),
                                                thead: ({ node, ...props }) => <thead className="bg-muted/50 border-b font-medium" {...props} />,
                                                tbody: ({ node, ...props }) => <tbody className="[&>tr:last-child]:border-0" {...props} />,
                                                tr: ({ node, ...props }) => <tr className="border-b transition-colors hover:bg-muted/50" {...props} />,
                                                th: ({ node, ...props }) => <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0" {...props} />,
                                                td: ({ node, ...props }) => <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0" {...props} />,
                                                img: ({ node, ...props }) => <img className="rounded-lg border shadow-sm my-6 max-w-full h-auto" {...props} />,
                                                hr: ({ node, ...props }) => <hr className="my-8 border-border" {...props} />,
                                            }}
                                        >
                                            {content || "*No content available for this skill.*"}
                                        </ReactMarkdown>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="raw">
                                <div className="bg-card border rounded-xl overflow-hidden relative group">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCopyContent}
                                        className="absolute top-2 right-2 border opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    >
                                        {copied ? <Check className="w-3 h-3 mr-2 text-green-500" /> : <Copy className="w-3 h-3 mr-2" />}
                                        {copied ? "Copied" : "Copy"}
                                    </Button>
                                    <pre className="font-mono text-sm overflow-x-auto p-6 text-muted-foreground leading-relaxed max-h-[600px]">
                                        {content}
                                    </pre>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="space-y-6">
                    <Card className="border-red-500/20 sticky top-6">
                        <CardHeader className="pb-4 border-b">
                            <CardTitle className="text-lg font-semibold">Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-6">
                            <div className="space-y-1.5">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Version</span>
                                <span className="font-medium flex items-center gap-2 text-sm">
                                    <Tag className="w-4 h-4 text-red-500" />
                                    1.0.0
                                </span>
                            </div>
                            <Separator />
                            <div className="space-y-1.5">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">License</span>
                                <span className="font-medium flex items-center gap-2 text-sm">
                                    <FileText className="w-4 h-4 text-red-500" />
                                    MIT
                                </span>
                            </div>
                            <Separator />
                            <div className="space-y-1.5">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Updated</span>
                                <span className="font-medium flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-red-500" />
                                    2 days ago
                                </span>
                            </div>
                            <Separator />
                            <div className="space-y-1.5">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Downloads</span>
                                <span className="font-medium flex items-center gap-2 text-sm">
                                    <Download className="w-4 h-4 text-red-500" />
                                    1.2k
                                </span>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tags</span>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline" className="hover:bg-red-500/20 hover:border-red-500/50 cursor-pointer transition-colors">
                                        ai
                                    </Badge>
                                    <Badge variant="outline" className="hover:bg-red-500/20 hover:border-red-500/50 cursor-pointer transition-colors">
                                        automation
                                    </Badge>
                                    <Badge variant="outline" className="hover:bg-red-500/20 hover:border-red-500/50 cursor-pointer transition-colors">
                                        {skill.category.split(' ')[0].toLowerCase()}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}
