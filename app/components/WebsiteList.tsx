'use client'

import { useState } from 'react'
import WebsiteCard from './WebsiteCard'
import AddWebsiteForm from './AddWebsiteForm'

export default function WebsiteList({ initialSearches }) {
  const [websites, setWebsites] = useState(initialSearches)

  const handleWebsiteAdded = async (newWebsite) => {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newWebsite),
    })

    if (response.ok) {
      const savedSearch = await response.json()
      setWebsites([savedSearch, ...websites])
    }
  }

  return (
    <div>
      <AddWebsiteForm onWebsiteAdded={handleWebsiteAdded} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {websites.map((website) => (
          <WebsiteCard key={website.id} website={website} />
        ))}
      </div>
    </div>
  )
}
