// src/hooks/useOutages.ts
import { useQuery } from '@tanstack/react-query'

export interface Outage {
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

export function useOutages() {
  return useQuery<Outage[], Error>({
    queryKey: ['outages'],
    queryFn: () =>
      fetch('/api/news')
        .then(res => {
          if (!res.ok) throw new Error(res.statusText)
          return res.json() as Promise<Outage[]>
        }),
    placeholderData: [],       // сразу массив, без загрузки
    staleTime: 30_000,         // 30сек данные считаются свежими
    refetchOnWindowFocus: false
  })
}
