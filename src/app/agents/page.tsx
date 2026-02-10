'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Search as SearchIcon, ChevronRight, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Agent {
    id: string
    name: string
    description: string
    capabilities?: string[]
}

interface MultiAgentData {
    agents: Agent[]
}

export default function AgentsPage() {
    const [data, setData] = useState<MultiAgentData | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetch('/data.json')
            .then(res => res.json())
            .then(jsonData => setData(jsonData))
            .catch(err => console.error('Failed to load data:', err))
    }, [])

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    const filteredAgents = data.agents.filter(agent => {
        return searchQuery === '' ||
            agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.description.toLowerCase().includes(searchQuery.toLowerCase())
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
                        Specialized <span className="text-red-600">Agents</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {data.agents.length} intelligent agents ready to assist
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Search agents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Agents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAgents.map((agent) => (
                    <Card key={agent.id} className="group hover:shadow-lg hover:border-red-500/50 transition-all">
                        <CardHeader>
                            <div className="flex items-start gap-3">
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 group-hover:bg-red-500/20 transition-colors">
                                    <Bot className="w-6 h-6 text-red-500" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="group-hover:text-red-600 transition-colors">
                                        {agent.name}
                                    </CardTitle>
                                    <CardDescription className="mt-2">{agent.description}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        {agent.capabilities && agent.capabilities.length > 0 && (
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-muted-foreground">Capabilities:</p>
                                    <ul className="space-y-2">
                                        {agent.capabilities.map((cap, i) => (
                                            <li key={i} className="text-sm flex items-start gap-2">
                                                <ChevronRight className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                                <span>{cap}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>

            {filteredAgents.length === 0 && (
                <div className="text-center py-12">
                    <Bot className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No agents found matching your search</p>
                </div>
            )}

            {/* Stats */}
            <div className="text-center text-sm text-muted-foreground py-8 border-t">
                Showing {filteredAgents.length} of {data.agents.length} agents
            </div>
        </div>
    )
}
