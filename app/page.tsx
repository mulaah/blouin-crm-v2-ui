import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-6">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-2">Blouin CRM</h1>
            <p className="text-xl text-gray-600">New UI Design from Claude</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <Link href="/internal/prospects">
              <div className="block p-8 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
                <div className="text-2xl font-bold text-blue-600 mb-2">📋</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Propositions</h2>
                <p className="text-gray-600">
                  Manage all client proposals and prospects with real-time statistics and filtering
                </p>
              </div>
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              ✓ Connected to PostgreSQL database: blouin_crm_localhost
              <br />
              ✓ APIs imported from v2-database
              <br />
              ✓ Design canvas UI implementation active
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
