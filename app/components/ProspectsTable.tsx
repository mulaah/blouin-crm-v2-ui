'use client'

import { useEffect, useState } from 'react'

interface Prospect {
  id: string
  name: string
  program?: string
  advocate?: string
  consultation_count?: number
  amount?: number
  status?: string
}

export default function ProspectsTable() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProgram, setFilterProgram] = useState('tous')
  const [filterStatus, setFilterStatus] = useState('tous')
  const [filterAdvocate, setFilterAdvocate] = useState('tous')

  useEffect(() => {
    async function fetchProspects() {
      try {
        const response = await fetch('/api/internal/prospects')
        const data = await response.json()
        setProspects(data)
      } catch (error) {
        console.error('Failed to fetch prospects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProspects()
  }, [])

  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = !searchTerm ||
      prospect.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesProgram = filterProgram === 'tous' || prospect.program === filterProgram
    const matchesStatus = filterStatus === 'tous' || prospect.status === filterStatus
    const matchesAdvocate = filterAdvocate === 'tous' || prospect.advocate === filterAdvocate

    return matchesSearch && matchesProgram && matchesStatus && matchesAdvocate
  })

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Chargement...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Filters */}
      <div className="p-6 border-b border-gray-200 space-y-4">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Nom, N° prospect, courriel..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Programme
            </label>
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tous">tous</option>
              <option value="PR">PR</option>
              <option value="IEC">IEC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tous">tous</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avocat
            </label>
            <select
              value={filterAdvocate}
              onChange={(e) => setFilterAdvocate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tous">toutes</option>
              <option value="M.-C. Blouin">M.-C. Blouin</option>
              <option value="A. Lemieux">A. Lemieux</option>
              <option value="C. Fortin">C. Fortin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Prospect
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Programme
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Avocat
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Consult.
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Montant HT
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Statut
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProspects.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Aucun prospect trouvé
                </td>
              </tr>
            ) : (
              filteredProspects.map((prospect) => (
                <tr key={prospect.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{prospect.name}</div>
                    <div className="text-sm text-gray-500">{prospect.id}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {prospect.program || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {prospect.advocate || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {prospect.consultation_count || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {prospect.amount ? `$${prospect.amount.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={prospect.status || 'pending'} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusMap = {
    active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Acceptée' },
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En préparation' },
    closed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Fermée' },
    to_follow: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'À relancer' },
  } as const

  const style = statusMap[status as keyof typeof statusMap] || statusMap.pending

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  )
}
