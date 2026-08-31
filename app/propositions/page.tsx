'use client'

import { useEffect, useState } from 'react'
import StatsCard from '@/app/components/StatsCard'
import ProspectsTable from '@/app/components/ProspectsTable'

interface Stats {
  activeProspects: number
  noConvention: number
  toFollow: number
  totalValue: number
}

export default function PropositionsPage() {
  const [stats, setStats] = useState<Stats>({
    activeProspects: 0,
    noConvention: 0,
    toFollow: 0,
    totalValue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [prospects, consultations] = await Promise.all([
          fetch('/api/internal/prospects').then(res => res.json()),
          fetch('/api/internal/consultations').then(res => res.json()),
        ])

        const activeCount = prospects.filter((p: any) => p.status !== 'closed').length
        const noConventionCount = prospects.filter((p: any) => !p.convention_id).length
        const toFollowCount = prospects.filter((p: any) => p.status === 'to_follow').length

        let totalValue = 0
        consultations.forEach((c: any) => {
          if (c.amount) {
            totalValue += Number(c.amount)
          }
        })

        setStats({
          activeProspects: activeCount,
          noConvention: noConventionCount,
          toFollow: toFollowCount,
          totalValue: totalValue,
        })
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Propositions</h1>
          <p className="text-gray-600 mt-2">Manage all client proposals and prospects</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            label="PROSPECTS ACTIFS"
            value={stats.activeProspects}
            change="+12 cette semaine"
            changeType="positive"
          />
          <StatsCard
            label="SANS CONVENTION"
            value={stats.noConvention}
            change="19% du portefeuille"
            changeType="neutral"
          />
          <StatsCard
            label="À RELANCER"
            value={stats.toFollow}
            change="8 en retard"
            changeType="warning"
          />
          <StatsCard
            label="VALEUR EN COURS"
            value={`$${(stats.totalValue / 1000).toFixed(0)}k`}
            change="HTT, 58 conventions"
            changeType="positive"
          />
        </div>

        {/* Prospects Table */}
        <ProspectsTable />
      </div>
    </div>
  )
}
