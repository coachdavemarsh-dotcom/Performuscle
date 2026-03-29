import { useState, useEffect } from 'react'
import { useAuth } from './useAuth.jsx'
import {
  getActiveProgram,
  getClientRecord,
  getActiveNutritionPlan,
  getClientCheckIns,
} from '../lib/supabase.js'

export function useClient() {
  const { user } = useAuth()
  const [program, setProgram] = useState(null)
  const [clientRecord, setClientRecord] = useState(null)
  const [nutritionPlan, setNutritionPlan] = useState(null)
  const [recentCheckIns, setRecentCheckIns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    loadClientData()
  }, [user])

  async function loadClientData() {
    setLoading(true)
    setError(null)

    const results = await Promise.allSettled([
      getActiveProgram(user.id),
      getClientRecord(user.id),
      getActiveNutritionPlan(user.id),
      getClientCheckIns(user.id, 5),
    ])

    const [programRes, clientRes, nutritionRes, checkInsRes] = results

    if (programRes.status === 'fulfilled' && !programRes.value.error) {
      setProgram(programRes.value.data)
    }
    if (clientRes.status === 'fulfilled' && !clientRes.value.error) {
      setClientRecord(clientRes.value.data)
    }
    if (nutritionRes.status === 'fulfilled' && !nutritionRes.value.error) {
      setNutritionPlan(nutritionRes.value.data)
    }
    if (checkInsRes.status === 'fulfilled' && !checkInsRes.value.error) {
      setRecentCheckIns(checkInsRes.value.data || [])
    }

    setLoading(false)
  }

  return {
    program,
    clientRecord,
    nutritionPlan,
    recentCheckIns,
    loading,
    error,
    refresh: loadClientData,
  }
}
