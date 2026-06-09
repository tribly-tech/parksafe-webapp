'use client'

import { useState } from 'react'
import { AdminInventory } from '@/components/admin/AdminInventory'
import { AdminTagGenerator } from '@/components/admin/AdminTagGenerator'
import { AdminTabs, type AdminTabId } from '@/components/admin/AdminTabs'

/** Tabbed admin workspace — Generate and Inventory. */
export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTabId>('generate')

  return (
    <div className="flex flex-col gap-6">
      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div role="tabpanel">
        {activeTab === 'generate' ? <AdminTagGenerator /> : <AdminInventory />}
      </div>
    </div>
  )
}
