'use client'

import { useState, useEffect } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Terminal as TerminalIcon, Search as SearchIcon, ArrowLeft, Copy, Check } from "lucide-react"
import Link from "next/link"

interface Command {
    id: string
    name: string
    description: string
    usage?: string
}

interface MultiAgentData {
    commands: Command[]
}

export default function CommandsPage() {
    const [data, setData] = useState<MultiAgentData | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [copiedId, setCopiedId] = useState<string | null>(null)

    useEffect(() => {
        fetch('/data.json')
            .then(res => res.json())
            .then(jsonData => setData(jsonData))
            .catch(err => console.error('Failed to load data:', err))
    }, [])

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const filteredCommands = data.commands.filter(command => {
        return searchQuery === '' ||
            command.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            command.description.toLowerCase().includes(searchQuery.toLowerCase())
    })

    return (
        <div className="w-full p-6 space-y-8 bg-gradient-to-br from-background via-background to-red-500/5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/molt-companion">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        Slash <span className="text-red-600">Commands</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {data.commands.length} powerful commands to supercharge your workflow
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Search commands..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Commands List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredCommands.map((command) => (
                    <Card key={command.id} className="group hover:shadow-lg hover:border-red-500/50 transition-all">
                        <CardHeader>
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 group-hover:bg-red-500/20 transition-colors">
                                    <TerminalIcon className="w-5 h-5 text-red-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-lg group-hover:text-red-600 transition-colors">
                                                {command.name}
                                            </CardTitle>
                                            <CardDescription className="mt-2">
                                                {command.description}
                                            </CardDescription>
                                        </div>
                                        {command.usage && (
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant="secondary"
                                                    className="font-mono text-xs cursor-pointer hover:bg-red-500/10 transition-colors"
                                                    onClick={() => copyToClipboard(command.usage!, command.id)}
                                                >
                                                    {command.usage}
                                                </Badge>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => copyToClipboard(command.usage!, command.id)}
                                                >
                                                    {copiedId === command.id ? (
                                                        <Check className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            {filteredCommands.length === 0 && (
                <div className="text-center py-12">
                    <TerminalIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No commands found matching your search</p>
                </div>
            )}

            {/* Stats */}
            <div className="text-center text-sm text-muted-foreground py-8 border-t">
                Showing {filteredCommands.length} of {data.commands.length} commands
            </div>
        </div>
    )
}
