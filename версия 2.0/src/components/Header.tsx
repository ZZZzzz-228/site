// src/components/Header.tsx
import React, { useState } from 'react'
import { Search, Map, Car, Fuel, Clock, Sun, Moon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import LogoNew from '../assets/logo-new.png'
import { useTheme } from '@/hooks/useTheme'

const Header: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const { theme, toggleTheme } = useTheme()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return

    const target = `/services?search=${encodeURIComponent(q)}`
    navigate(target)
    if (location.pathname === '/services') {
      window.dispatchEvent(new CustomEvent('headerSearch', { detail: q }))
    }
  }

  return (
    <header className="glass-card sticky top-0 z-50 py-4 border-b border-white/5">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Логотип */}
        <Link to="/" className="flex items-center space-x-3 mb-4 md:mb-0">
          <img src={LogoNew} alt="Logo" className="w-12 h-12 rounded-xl" />
          <h1 className="text-2xl font-bold gradient-text">Город без сюрпризов</h1>
        </Link>

        {/* Меню, поиск и переключатель темы */}
        <div className="flex items-center space-x-4 w-full md:w-auto">
          {/* Навигация */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavItem to="/" icon={<Clock size={18} />} label="Главная" active={location.pathname === '/'} />
            <NavItem to="/map" icon={<Map size={18} />} label="Карта отключений" active={location.pathname === '/map'} />
            <NavItem to="/traffic" icon={<Car size={18} />} label="Пробки" active={location.pathname === '/traffic'} />
            <NavItem to="/services" icon={<Fuel size={18} />} label="Автосервисы" active={location.pathname === '/services'} />
          </nav>

          {/* Поиск */}
          <form onSubmit={handleSearch} className="relative ml-4 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
            <Input
              type="text"
              placeholder="Поиск по адресу..."
              className="pl-10 pr-4 py-2 rounded-full bg-muted/50 border-white/5 backdrop-blur-md text-blue-50 transition focus:bg-muted/80 focus:neon-border"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Кнопка смены темы */}
          <button
            onClick={toggleTheme}
            aria-label="Переключить тему"
            className="p-2 rounded-full hover:bg-muted/50 transition"
          >
            {theme === 'dark'
              ? <Sun className="h-5 w-5 text-foreground" />
              : <Moon className="h-5 w-5 text-foreground" />
            }
          </button>
        </div>
      </div>
    </header>
  )
}

interface NavItemProps {
  to: string
  icon: React.ReactNode
  label: string
  active: boolean
}
const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
      active
        ? 'bg-primary/20 text-primary neon-border'
        : 'text-gray-400 hover:text-blue-400 hover:bg-primary/10'
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </Link>
)

export default Header
