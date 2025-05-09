// src/components/HomePage.tsx
import React, { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import ParticlesBackground from './ParticlesBackground'
import { toast } from 'sonner'

interface Outage {
  id: number
  type: string
  date: string
  title: string
  link?: string
  start_date: string
  end_date: string
  address: string
  district: string
}

const monthMap: Record<string, string> = {
  '01': 'января',
  '02': 'февраля',
  '03': 'марта',
  '04': 'апреля',
  '05': 'мая',
  '06': 'июня',
  '07': 'июля',
  '08': 'августа',
  '09': 'сентября',
  '10': 'октября',
  '11': 'ноября',
  '12': 'декабря',
}

const getIconClass = (type: string): string => {
  const t = type.toLowerCase()
  if (t.includes('водоснабжение')) return 'text-utility-water'
  if (t.includes('электроснабжение')) return 'text-utility-electricity'
  if (t.includes('теплоснабжение')) return 'text-utility-heat'
  if (t.includes('газоснабжение')) return 'text-utility-gas'
  if (t.includes('интернет')) return 'text-utility-internet'
  return 'text-gray-400'
}

const formatTime = (input: string): string => {
  if (!input) return ''
  const [day, month, time] = input.replace('-', ':').split(/[\s]+/)
  const formattedDay = day?.replace(/^0/, '') || ''
  const formattedMonth = month || ''
  const formattedTime = time?.replace(/^0/, '') || ''
  return `${formattedDay} ${formattedMonth} ${formattedTime}`.trim()
}

const formatDate = (date: string): string => {
  const [day, month] = date.split('.')
  const dayNum = day?.replace(/^0/, '') || ''
  const monthName = monthMap[month] || month
  return `${dayNum} ${monthName}`
}

const HomePage: React.FC = () => {
  const [news, setNews] = useState<Outage[]>([])
  const [loading, setLoading] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const [expanded, setExpanded] = useState<{ [id: number]: boolean }>({})

  useEffect(() => {
    fetch('/api/news')
      .then(res => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json() as Promise<Outage[]>
      })
      .then(data => setNews(data))
      .catch(err => {
        console.error(err)
        toast.error('❗ Не удалось загрузить события')
      })
      .finally(() => setLoading(false))
  }, [])

  const handleTelegramBotRedirect = () => {
    setIsAnimating(true)
    setTimeout(() => {
      window.open('https://t.me/CityCheckbot', '_blank')
      setTimeout(() => setIsAnimating(false), 2000)
    }, 1000)
  }

  const toggleAddress = (id: number) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="relative min-h-[90vh] py-10">
      <ParticlesBackground />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-float">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Город без сюрпризов
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Централизованная система мониторинга отключений и происшествий в Красноярске.
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleTelegramBotRedirect}
              className={`telegram-btn group relative overflow-hidden rounded-full px-8 py-4 transition-all duration-300 ${
                isAnimating ? 'animate-telegram-btn' : ''
              }`}
              disabled={isAnimating}
            >
              <span className={`flex items-center justify-center gap-2 transition-all duration-300 ${isAnimating ? 'animate-telegram-text' : ''}`}>
                <Bell className="h-5 w-5" />
                Подписаться в Telegram
              </span>
              <span className={`absolute inset-0 flex items-center justify-center ${isAnimating ? 'animate-telegram-check' : 'opacity-0'}`}>
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 gradient-text text-center">
            Последние события
          </h2>

          <div className="space-y-6">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="neo-card p-6 bg-gray-800 border border-white/10 rounded-lg shimmer h-32" />
              ))
            ) : news.length > 0 ? (
              news.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5 }}
                  className="neo-card p-6 bg-gray-800 border border-white/10 hover:border-white/20 transition-all duration-200 rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Bell className={`h-6 w-6 ${getIconClass(item.type)}`} />
                      <div>
                        <h3 className="font-semibold text-white">
                          {item.type} — {item.title}
                        </h3>
                        <p className="text-gray-300 mt-1">
                          {expanded[item.id] || item.address.length < 150
                            ? item.address
                            : item.address.slice(0, 150) + '...'}
                          {item.address.length >= 150 && (
                            <button
                              className="ml-2 text-blue-400 hover:underline text-sm"
                              onClick={() => toggleAddress(item.id)}
                            >
                              {expanded[item.id] ? 'Скрыть' : 'Показать полностью'}
                            </button>
                          )}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400 whitespace-nowrap">{formatDate(item.date)}</span>
                  </div>

                  <div className="mt-4 flex flex-col gap-1 text-gray-200">
                    <span><strong>Начало:</strong> {formatTime(item.start_date)}</span>
                    <span><strong>Конец:</strong> {formatTime(item.end_date)}</span>
                    <span className="text-gray-400 mt-2">Район: {item.district}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">Нет данных для отображения</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
