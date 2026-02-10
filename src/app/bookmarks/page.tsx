'use client'

import { Bookmark, ArrowRight, Loader2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getBookmarkIds } from "@/lib/bookmarks"

interface Skill {
    id: string
    name: string
    description: string
    category: string
    url?: string
    tags?: string[]
}

interface MultiAgentData {
    skills: Skill[]
}

export default function BookmarksPage() {
    const [bookmarkedSkills, setBookmarkedSkills] = useState<Skill[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        // Function to load bookmarks
        const loadBookmarks = () => {
            fetch('/data.json')
                .then(res => res.json())
                .then((data: MultiAgentData) => {
                    const savedIds = getBookmarkIds()
                    const savedSkills = data.skills.filter(s => savedIds.includes(s.id))
                    setBookmarkedSkills(savedSkills)
                    setIsLoading(false)
                })
                .catch(err => {
                    console.error('Failed to load bookmarks:', err)
                    setIsLoading(false)
                })
        }

        loadBookmarks()

        // Listen for updates from other tabs/components
        window.addEventListener('bookmarks-updated', loadBookmarks)
        return () => window.removeEventListener('bookmarks-updated', loadBookmarks)
    }, [])

    return (
        <div className="w-full p-6 space-y-8 bg-gradient-to-br from-background via-background to-red-500/5">
            {/* Header */}
            <div className="text-center space-y-6 pt-8">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
                    <Bookmark className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    Your <span className="text-red-600">Bookmarks</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Access your saved skills and documentation quickly.
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                </div>
            ) : bookmarkedSkills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                    {bookmarkedSkills.map((skill, index) => (
                        <Card
                            key={`${skill.id}-${index}`}
                            className="group hover:shadow-lg hover:border-red-500/50 transition-all"
                        >
                            <CardHeader>
                                <div className="flex justify-between items-start gap-2">
                                    <CardTitle className="text-lg group-hover:text-red-600 transition-colors line-clamp-1" title={skill.name}>
                                        {skill.name}
                                    </CardTitle>
                                    <Badge variant="outline" className="text-xs border-red-500/20 text-muted-foreground">
                                        {skill.category}
                                    </Badge>
                                </div>
                                <CardDescription className="line-clamp-3 leading-relaxed">
                                    {skill.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                {skill.tags && skill.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {skill.tags.slice(0, 3).map((tag, i) => (
                                            <Badge key={i} variant="secondary" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                                {skill.url && (
                                    <Link href={skill.url} target="_blank" rel="noopener noreferrer">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-between hover:bg-red-500/10 group-hover:text-red-600"
                                        >
                                            View Source
                                            <ExternalLink className="h-3 w-3 ml-2" />
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-6">
                    <div className="p-4 rounded-full bg-red-500/10 text-red-500/50">
                        <Bookmark className="w-12 h-12" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold">No bookmarks yet</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            You haven't saved any skills yet. Browse the collection and save skills you want to access quickly.
                        </p>
                    </div>
                    <Link href="/skills">
                        <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white rounded-xl mt-4">
                            Browse Skills
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
