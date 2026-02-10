'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TerminalLanding() {
  const router = useRouter()
  const [lines, setLines] = useState<string[]>([])
  const [showCursor, setShowCursor] = useState(true)
  const [isBooting, setIsBooting] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  const bootSequence = [
    "Initializing Molt Companion System... / システム初期化中...",
    "Loading core modules... [OK] / コアモジュール読み込み... [完了]",
    "Mounting neural pathways... [OK] / ニューラルパスウェイマウント... [完了]",
    "Connecting to Orchestration Layer... [CONNECTED] / オーケストレーションレイヤー接続... [接続完了]",
    "Loading agent protocols... / エージェントプロトコル読み込み中...",
    "  → Multi-Agent Orchestrator... [READY] / マルチエージェント... [準備完了]",
    "  → AI Skills Manager... [READY] / AIスキルマネージャー... [準備完了]",
    "  → Command Processor... [READY] / コマンドプロセッサー... [準備完了]",
    "  → Documentation Agent... [READY] / ドキュメントエージェント... [準備完了]",
    "System check complete. / システムチェック完了。",
    " ",
    "═══════════════════════════════════════════════════",
    "   MOLT COMPANION v2.0.0",
    "   Intelligent Multi-Agent AI Assistant",
    "   知的マルチエージェントAIアシスタント",
    "═══════════════════════════════════════════════════",
    " ",
    "Type 'start' or press ENTER to launch dashboard...",
    "ダッシュボードを起動するには 'start' と入力するか ENTER キーを押してください...",
  ]

  useEffect(() => {
    // Start boot sequence
    let delay = 300
    bootSequence.forEach((line, index) => {
      delay += Math.random() * 200 + 80
      setTimeout(() => {
        setLines(prev => [...prev, line])
        if (index === bootSequence.length - 1) {
          setIsBooting(false)
        }
      }, delay)
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [lines])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isBooting && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault()
      router.push("/molt-companion")
    }
  }

  useEffect(() => {
    const handleWindowKeyDown = (e: KeyboardEvent) => {
      if (!isBooting && e.key === "Enter") {
        e.preventDefault()
        router.push("/molt-companion")
      }
    }

    window.addEventListener("keydown", handleWindowKeyDown)
    return () => window.removeEventListener("keydown", handleWindowKeyDown)
  }, [isBooting, router])

  return (
    <div
      className="min-h-screen bg-black text-white font-mono p-4 md:p-8 flex items-center justify-center relative overflow-hidden"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      autoFocus
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        letterSpacing: "0.3px",
        lineHeight: "1.7",
        fontWeight: 400,
        fontSize: "13px",
      }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-950/20 to-black" />

      <div className="w-full max-w-6xl bg-black/90 border border-red-500/20 rounded-lg overflow-hidden flex flex-col md:flex-row gap-8 relative z-10 shadow-2xl shadow-red-900/20">

        {/* Logo Column */}
        <div className="hidden md:flex w-[420px] flex-shrink-0 border-r border-red-500/20 items-center justify-center p-8 bg-gradient-to-br from-black to-red-950/10">
          <div className="relative w-full aspect-square max-w-[320px] rounded-full overflow-hidden border-2 border-red-500/30 shadow-2xl shadow-red-900/40">
            <img
              src="/iddle.png"
              alt="Molt Companion"
              className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
            />
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent" />
            <div className="absolute inset-0 ring-1 ring-inset ring-red-500/20" />
          </div>
        </div>

        {/* Terminal Content Column */}
        <div className="flex-1 flex flex-col">
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-black/50 border-b border-red-500/20 mb-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-medium uppercase tracking-widest text-red-500">MOLT_COMPANION_TERMINAL</span>
              <span className="text-[8px] text-white/30 tracking-wide">端末アクセスポイント</span>
            </div>
            <div className="flex items-center gap-3 text-white/30">
              <span className="text-[10px] font-medium">v2.0.0</span>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
              </div>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-4 h-[70vh] md:h-[85vh] overflow-y-auto custom-scrollbar">
            {lines.map((line, i) => (
              <div key={i} className="mb-1 animate-in fade-in duration-200">
                <span className="text-red-500 mr-3 opacity-80">›</span>
                <span className={
                  line.includes("[OK]") || line.includes("[READY]") || line.includes("[CONNECTED]") ||
                    line.includes("[完了]") || line.includes("[準備完了]") || line.includes("[接続完了]")
                    ? "text-red-400"
                    : line.includes("═") || line.includes("MOLT") || line.includes("Molt")
                      ? "text-white font-bold"
                      : line.includes("→")
                        ? "text-gray-400"
                        : "text-gray-500"
                }>
                  {line}
                </span>
              </div>
            ))}
            {!isBooting && (
              <div className="flex items-center mt-4">
                <span className="text-red-500 mr-3 opacity-80">›</span>
                <span className={`inline-block w-2.5 h-4 bg-red-500 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`} />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Footer Hint */}
          {!isBooting && (
            <div className="mt-auto p-4 border-t border-red-500/20 bg-black/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <div className="text-[10px] text-red-500/70 uppercase tracking-[0.3em] font-medium animate-pulse">
                    Press Enter to Initialize Dashboard
                  </div>
                  <div className="text-[9px] text-white/30 tracking-wide mt-1">
                    ENTERキーを押してダッシュボードを初期化
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href="/chat">
                    <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md transition-all hover:shadow-lg hover:shadow-red-500/50">
                      Start Chat
                    </button>
                  </Link>
                  <Link href="/molt-companion">
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-md border border-red-500/30 transition-all">
                      Dashboard
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(239, 68, 68, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(239, 68, 68, 0.5);
        }
      `}</style>
    </div>
  )
}
