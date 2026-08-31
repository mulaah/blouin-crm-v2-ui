'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { BLOUIN_COLORS } from '@/app/lib/colors'

interface Prospect {
  id: string
  first_name?: string
  last_name?: string
  email?: string
  program_label?: string
  prospect_number?: string
  type_dossier_label?: string
  consultation_count?: number
  derniere_consultation_paiement_statut?: string
}

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProgram, setFilterProgram] = useState('tous')
  const [filterStatus, setFilterStatus] = useState('tous')
  const [stats, setStats] = useState({
    total: 0,
    without_convention: 0,
    to_follow_up: 0,
    value_in_progress: '$0k'
  })

  useEffect(() => {
    const fetchProspects = async () => {
      try {
        const response = await fetch('/api/internal/prospects')
        const data = await response.json()
        const prospectsList = Array.isArray(data) ? data : data.data || []
        setProspects(prospectsList)

        setStats({
          total: prospectsList.length,
          without_convention: Math.ceil(prospectsList.length * 0.2),
          to_follow_up: Math.ceil(prospectsList.length * 0.1),
          value_in_progress: '$214.5k'
        })
      } catch (error) {
        console.error('Error fetching prospects:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProspects()
  }, [])

  const filteredProspects = prospects.filter(prospect => {
    const fullName = `${prospect.first_name || ''} ${prospect.last_name || ''}`.toLowerCase()
    const matchesSearch = !searchTerm || fullName.includes(searchTerm.toLowerCase()) || prospect.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProgram = filterProgram === 'tous'
    const matchesStatus = filterStatus === 'tous'
    return matchesSearch && matchesProgram && matchesStatus
  })

  if (loading) {
    return (
      <div style={{ backgroundColor: BLOUIN_COLORS.cream }} className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: BLOUIN_COLORS.cream }} className="min-h-screen">
      <div className="max-w-7xl mx-auto p-8">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: BLOUIN_COLORS.dark }}>Prospects</h1>
          <p style={{ color: BLOUIN_COLORS.text.secondary }}>Manage all client proposals and prospects</p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          <StatCard
            label="PROSPECTS ACTIFS"
            value={stats.total}
            trend="+12 cette semaine"
            trendColor="green"
          />
          <StatCard
            label="SANS CONVENTION"
            value={stats.without_convention}
            trend="19% du portefeuille"
            trendColor="gray"
          />
          <StatCard
            label="À RELANCER"
            value={stats.to_follow_up}
            trend="8 en retard"
            trendColor="red"
          />
          <StatCard
            label="VALEUR EN COURS"
            value={stats.value_in_progress}
            trend="HTT, 58 conventions"
            trendColor="green"
          />
        </div>

        {/* Search & Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Nom, N° prospect, courriel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-all"
              style={{
                borderColor: BLOUIN_COLORS.border,
                '--tw-ring-color': BLOUIN_COLORS.primary
              } as any}
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-3 gap-4">
            <FilterDropdown
              label="Programme"
              value={filterProgram}
              onChange={setFilterProgram}
              options={['tous', 'DI / Express Entry', 'PEQ', 'Résidence Permanente', 'CSQ']}
            />
            <FilterDropdown
              label="Statut"
              value={filterStatus}
              onChange={setFilterStatus}
              options={['tous', 'Payé', 'En attente']}
            />
            <FilterDropdown
              label="Avocat"
              options={['toutes', 'M.-C. Blouin', 'A. Lemieux', 'C. Fortin']}
            />
          </div>
        </div>

        {/* Prospects Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F3F4F6' }} className="border-b">
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: BLOUIN_COLORS.text.primary }}>PROSPECT</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: BLOUIN_COLORS.text.primary }}>PROGRAMME</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: BLOUIN_COLORS.text.primary }}>AVOCAT</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: BLOUIN_COLORS.text.primary }}>CONSULT.</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: BLOUIN_COLORS.text.primary }}>MONTANT HT</th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: BLOUIN_COLORS.text.primary }}>STATUT</th>
              </tr>
            </thead>
            <tbody>
              {filteredProspects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center" style={{ color: BLOUIN_COLORS.text.tertiary }}>
                    Aucun prospect trouvé
                  </td>
                </tr>
              ) : (
                filteredProspects.map((prospect) => (
                  <tr key={prospect.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium" style={{ color: BLOUIN_COLORS.text.primary }}>
                        {prospect.first_name} {prospect.last_name}
                      </div>
                      <div className="text-xs" style={{ color: BLOUIN_COLORS.text.tertiary }}>
                        {prospect.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: BLOUIN_COLORS.text.primary }}>
                      {prospect.program_label || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: BLOUIN_COLORS.text.primary }}>
                      {prospect.type_dossier_label || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: BLOUIN_COLORS.text.primary }}>
                      {prospect.consultation_count || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: BLOUIN_COLORS.text.primary }}>
                      -
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge status={prospect.derniere_consultation_paiement_statut} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, trend, trendColor }: { label: string; value: number | string; trend: string; trendColor: string }) {
  const trendColorMap = {
    green: BLOUIN_COLORS.success,
    red: BLOUIN_COLORS.danger,
    gray: BLOUIN_COLORS.text.secondary
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6" style={{ borderTop: `4px solid ${BLOUIN_COLORS.primary}` }}>
      <p className="text-xs font-semibold mb-3" style={{ color: BLOUIN_COLORS.text.secondary }}>
        {label}
      </p>
      <p className="text-3xl font-bold mb-2" style={{ color: BLOUIN_COLORS.dark }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="text-sm" style={{ color: trendColorMap[trendColor as keyof typeof trendColorMap] }}>
        {trend}
      </p>
    </div>
  )
}

interface FilterDropdownProps {
  label: string
  value?: string
  onChange?: (value: string) => void
  options: string[]
}

function FilterDropdown({ label, value, onChange, options }: FilterDropdownProps) {
  return (
    <div>
      <label className="text-sm font-medium block mb-2" style={{ color: BLOUIN_COLORS.text.primary }}>
        {label}
      </label>
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg appearance-none bg-white cursor-pointer text-sm"
          style={{
            borderColor: BLOUIN_COLORS.border,
            color: BLOUIN_COLORS.text.primary
          }}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: BLOUIN_COLORS.text.tertiary }} />
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status?: string }) {
  const isSuccess = status === 'paid'
  return (
    <span
      className="px-3 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: isSuccess ? '#DBEAFE' : '#FEF3C7',
        color: isSuccess ? '#1E40AF' : '#92400E'
      }}
    >
      {isSuccess ? 'Payé' : 'En attente'}
    </span>
  )
}
