'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, ExternalLink, ChevronRight } from "lucide-react"
import Link from "next/link"
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks"

interface Skill {
    id: string
    name: string
    description: string
    category: string
    url?: string
    tags?: string[]
}

export function SkillCard({ skill }: { skill: Skill }) {
    const [saved, setSaved] = useState(isBookmarked(skill.id))

    const handleBookmarkClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        const newState = toggleBookmark(skill.id)
        setSaved(newState)
    }

    return (
        <Card className="group relative hover:shadow-lg hover:border-red-500/50 transition-all cursor-pointer h-full">
            <Link href={`/skill/${skill.id}`} className="absolute inset-0 z-0">
                <span className="sr-only">View {skill.name}</span>
            </Link>
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base group-hover:text-red-600 transition-colors line-clamp-2 flex-1">
                        {skill.name}
                    </CardTitle>
                    <div className="flex gap-1 shrink-0 relative z-10">
                        <Button
                            size="icon"
                            variant="ghost"
                            className={`h-8 w-8 ${saved ? 'text-red-600' : ''}`}
                            onClick={handleBookmarkClick}
                        >
                            <Bookmark className={`w-4 h-4 ${saved ? 'fill-red-600' : ''}`} />
                        </Button>
                        {skill.url && (
                            <Link
                                href={skill.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <ExternalLink className="w-4 h-4" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
                <Badge variant="secondary" className="w-fit text-xs">
                    {skill.category}
                </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {skill.description}
                </p>
                {skill.tags && skill.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {skill.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
                <div className="pt-2 flex items-center text-xs text-red-600 font-medium group-hover:translate-x-1 transition-transform">
                    View Details <ChevronRight className="w-3 h-3 ml-1" />
                </div>
            </CardContent>
        </Card>
    )
}
