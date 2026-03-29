import { useState, useEffect } from 'react'
import { useAuth } from './useAuth.jsx'
import { getCoachClients, getPendingCheckIns, getCoachPrograms } from '../lib/supabase.js'

export function useCoach() {
  const { user } = useAuth()
  const [clients, setClients] = useState([])
  const [pendingCheckIns, setPendingCheckIns] = useState([])
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    loadCoachData()
  }, [user])

  async function loadCoachData() {
    setLoading(true)
    setError(null)

    const results = await Promise.allSettled([
      getCoachClients(user.id),
      getPendingCheckIns(user.id),
      getCoachPrograms(user.id),
    ])

    const [clientsRes, checkInsRes, programsRes] = results

    if (clientsRes.status === 'fulfilled' && !clientsRes.value.error) {
      setClients(clientsRes.value.data || [])
    }
    if (checkInsRes.status === 'fulfilled' && !checkInsRes.value.error) {
      setPendingCheckIns(checkInsRes.value.data || [])
    }
    if (programsRes.status === 'fulfilled' && !programsRes.value.error) {
      setPrograms(programsRes.value.data || [])
    }

    setLoading(false)
  }

  const activeClients = clients.filter(c => c.status === 'active')
  const overdueCheckIns = pendingCheckIns.filter(ci => {
    const submittedAt = new Date(ci.submitted_at)
    const daysSince = (Date.now() - submittedAt) / (1000 * 60 * 60 * 24)
    return daysSince > 2
  })

  return {
    clients,
    activeClients,
    pendingCheckIns,
    overdueCheckIns,
    programs,
    loading,
    error,
    refresh: loadCoachData,
    setClients,
    setPendingCheckIns,
  }
}
