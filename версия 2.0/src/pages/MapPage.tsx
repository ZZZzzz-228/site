// src/pages/MapPage.tsx
import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { Card } from '@/components/ui/card'
import FilterPanel from '@/components/FilterPanel'
import MapView from '@/components/MapView'
import { UtilityOutage, UtilityType } from '../types/utility'
import { mockOutages } from '../data/mockData'

const MapPage: React.FC = () => {
  // теперь строго UtilityType[]
  const [selectedTypes, setSelectedTypes] = useState<UtilityType[]>([])
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [showActive, setShowActive] = useState(true)
  const [showScheduled, setShowScheduled] = useState(true)
  const [showResolved, setShowResolved] = useState(false)
  const [filteredOutages, setFilteredOutages] = useState<UtilityOutage[]>(mockOutages)

  useEffect(() => {
    let filtered = [...mockOutages]

    if (selectedTypes.length) {
      filtered = filtered.filter(o => selectedTypes.includes(o.type))
    }
    if (selectedDistricts.length) {
      filtered = filtered.filter(o => selectedDistricts.includes(o.district))
    }

    const statusFilters: string[] = []
    if (showActive)    statusFilters.push('active')
    if (showScheduled) statusFilters.push('scheduled')
    if (showResolved)  statusFilters.push('resolved')

    filtered = filtered.filter(o => statusFilters.includes(o.status))
    setFilteredOutages(filtered)
  }, [selectedTypes, selectedDistricts, showActive, showScheduled, showResolved])

  return (
    <div className="min-h-screen bg-background transition-all duration-300 grid-bg">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold gradient-text mb-6">Карта отключений</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Панель фильтров */}
          <div className="lg:col-span-1">
            <Card className="neo-card p-4">
              <h2 className="text-xl font-medium text-blue-100 mb-4">Фильтры</h2>
              <FilterPanel
                // теперь передаём UtilityType[]
                selectedTypes={selectedTypes}
                onTypeChange={(type: UtilityType) =>
                  setSelectedTypes(prev =>
                    prev.includes(type)
                      ? prev.filter(t => t !== type)
                      : [...prev, type]
                  )
                }
                districts={Array.from(new Set(mockOutages.map(o => o.district))).map(name => ({
                  id: name,
                  name,
                  active: selectedDistricts.includes(name),
                }))}
                onDistrictChange={(id: string) =>
                  setSelectedDistricts(prev =>
                    prev.includes(id)
                      ? prev.filter(d => d !== id)
                      : [...prev, id]
                  )
                }
                showActive={showActive}
                showScheduled={showScheduled}
                showResolved={showResolved}
                onStatusChange={(status) => {
                  if (status === 'active')    setShowActive(prev => !prev)
                  if (status === 'scheduled') setShowScheduled(prev => !prev)
                  if (status === 'resolved')  setShowResolved(prev => !prev)
                }}
              />
            </Card>
          </div>

          {/* Карта */}
          <div className="lg:col-span-3">
            <Card className="neo-card h-[70vh] overflow-hidden">
              <MapView />
            </Card>
            <div className="mt-4 text-sm text-blue-400 animate-pulse-soft text-center">
              Найдено отключений:{' '}
              <span className="text-white font-semibold">{filteredOutages.length}</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="neo-card py-8 mt-12 border-t border-white/5">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <div className="gradient-text mb-2">Город без сюрпризов</div>
          © 2025 Система контроля отключений коммунальных услуг
        </div>
      </footer>
    </div>
  )
}

export default MapPage
