import { useState, useEffect } from 'react'
import {
  deriveHRZones, deriveLTHRZones, derivePaceZones,
  deriveFTPZones, deriveSwimZones, formatTime,
} from '../../lib/calculators.js'
import { getAllLatestTestResults } from '../../lib/supabase.js'
import ZoneTable from './ZoneTable.jsx'

function fmtDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function ZoneSection({ title, accentColor, available, emptyTitle, emptyText, headline, subline, testedDate, zoneTable }) {
  if (!available) {
    return (
      <div className="card" style={{ padding: '16px 20px', marginBottom: 16, borderLeft: '3px solid var(--s5)' }}>
        <div className="label" style={{ marginBottom: 10 }}>{title}</div>
        <div className="empty-state" style={{ height: 100 }}>
          <div className="empty-state-title">{emptyTitle}</div>
          <div className="empty-state-text">{emptyText}</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="card" style={{ padding: '20px 22px', marginBottom: 16, borderLeft: `3px solid ${accentColor}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="label" style={{ marginBottom: 4 }}>{title}</div>
            {headline}
            {subline}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="label" style={{ marginBottom: 4 }}>Last Tested</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--sub)' }}>
              {fmtDate(testedDate)}
            </div>
          </div>
        </div>
      </div>
      {zoneTable}
    </div>
  )
}

export default function TrainingZonesPanel({ clientId }) {
  const [latest, setLatest] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!clientId) return
    let active = true
    setLoading(true)
    getAllLatestTestResults(clientId).then(results => {
      if (active) {
        setLatest(results)
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [clientId])

  if (loading) {
    return <div className="flex-center" style={{ height: 160 }}><div className="spinner" /></div>
  }

  // ─── Heart Rate / LTHR zones ─────────────────────────────────────────────────
  const ltRow = latest?.lactate_threshold
  const vo2Row = latest?.vo2_rhr
  const lthr = ltRow?.results?.lthr
  const restingHr = vo2Row?.results?.restingHr
  const maxHr = vo2Row?.results?.maxHr

  let hrZones = null, hrSourceRow = null, hrHeadline = null, hrSubline = null
  if (lthr) {
    hrZones = deriveLTHRZones(lthr)
    hrSourceRow = ltRow
    hrHeadline = (
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--warn)', lineHeight: 1 }}>{lthr}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--muted)' }}>bpm LTHR</div>
      </div>
    )
    hrSubline = <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>Based on your Lactate Threshold test</div>
  } else if (restingHr && maxHr) {
    hrZones = deriveHRZones(restingHr, maxHr)
    hrSourceRow = vo2Row
    hrHeadline = (
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--warn)', lineHeight: 1 }}>{restingHr}–{maxHr}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--muted)' }}>bpm (rest–max)</div>
      </div>
    )
    hrSubline = <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>Based on your Resting/Max HR (Karvonen)</div>
  }

  // ─── Running pace / VDOT zones ───────────────────────────────────────────────
  const ttRow = latest?.tt_5km
  const vdot = ttRow?.results?.vdot
  const paceZones = vdot ? derivePaceZones(vdot) : null
  const predictions = ttRow?.results?.predictions

  // ─── Cycling FTP / power zones ───────────────────────────────────────────────
  const ftpRow = latest?.ftp_cycling
  const ftp = ftpRow?.results?.ftp
  const ftpPerKg = ftpRow?.results?.ftpPerKg
  const ftpZones = ftp ? deriveFTPZones(ftp) : null

  // ─── Swim CSS zones ───────────────────────────────────────────────────────────
  const swimRow = latest?.css_swim
  const cssPer100 = swimRow?.results?.cssPer100
  const swimZones = cssPer100 ? deriveSwimZones(cssPer100) : null

  return (
    <div>
      <ZoneSection
        title="Heart Rate Zones"
        accentColor="var(--warn)"
        available={!!hrZones}
        emptyTitle="No heart rate data yet"
        emptyText="Ask your coach to log a Lactate Threshold or VO₂ Max (RHR) test to unlock your HR zones."
        headline={hrHeadline}
        subline={hrSubline}
        testedDate={hrSourceRow?.tested_date}
        zoneTable={
          <ZoneTable
            title={lthr ? 'Your Lactate Threshold Zones' : 'Your Heart Rate Zones'}
            zones={hrZones}
            renderRange={z => <>{z.loBpm}–{z.hiBpm} <span style={{ fontSize: 10, color: 'var(--muted)' }}>bpm</span></>}
          />
        }
      />

      <ZoneSection
        title="Running Pace Zones"
        accentColor="var(--accent)"
        available={!!paceZones}
        emptyTitle="No 5K time trial yet"
        emptyText="Ask your coach to log a 5K time trial to unlock your pace zones and race predictions."
        headline={
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--accent)', lineHeight: 1 }}>{vdot}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--muted)' }}>VDOT</div>
          </div>
        }
        subline={
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>
            From your 5K time trial{ttRow?.results?.timeSec ? ` (${formatTime(ttRow.results.timeSec)})` : ''}
          </div>
        }
        testedDate={ttRow?.tested_date}
        zoneTable={
          <>
            {predictions && (
              <div className="card" style={{ padding: '16px 20px', marginBottom: 16 }}>
                <div className="label" style={{ marginBottom: 12 }}>Predicted Race Times</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {[
                    { label: '10K', value: predictions['10km'] },
                    { label: 'Half Marathon', value: predictions.half_marathon },
                    { label: 'Marathon', value: predictions.marathon },
                  ].map(p => (
                    <div key={p.label} style={{ padding: '10px 14px', background: 'var(--s3)', borderRadius: 6, border: '1px solid var(--border)' }}>
                      <div className="label" style={{ fontSize: 8, marginBottom: 4 }}>{p.label}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--white)' }}>
                        {formatTime(p.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <ZoneTable
              title="Your Daniels Training Pace Zones"
              zones={paceZones}
              renderRange={z => <>{z.pacePerKm} <span style={{ fontSize: 10, color: 'var(--muted)' }}>/km</span></>}
            />
          </>
        }
      />

      <ZoneSection
        title="Cycling Power Zones"
        accentColor="var(--info)"
        available={!!ftpZones}
        emptyTitle="No FTP test yet"
        emptyText="Ask your coach to log an FTP test to unlock your cycling power zones."
        headline={
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--info)', lineHeight: 1 }}>{ftp}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--muted)' }}>W FTP</div>
          </div>
        }
        subline={ftpPerKg ? <div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>{ftpPerKg} W/kg</div> : null}
        testedDate={ftpRow?.tested_date}
        zoneTable={
          <ZoneTable
            title="Your Coggan Power Zones"
            zones={ftpZones}
            renderRange={z => <>{z.loW}–{z.hiW} <span style={{ fontSize: 10, color: 'var(--muted)' }}>W</span></>}
          />
        }
      />

      <ZoneSection
        title="Swim Pace Zones"
        accentColor="var(--info)"
        available={!!swimZones}
        emptyTitle="No CSS swim test yet"
        emptyText="Ask your coach to log a Critical Swim Speed (CSS) test to unlock your swim pace zones."
        headline={
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--info)', lineHeight: 1 }}>{formatTime(cssPer100)}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--muted)' }}>/100m CSS</div>
          </div>
        }
        subline={<div style={{ marginTop: 8, fontSize: 12, color: 'var(--muted)' }}>Critical Swim Speed</div>}
        testedDate={swimRow?.tested_date}
        zoneTable={
          <ZoneTable
            title="Your Swim Training Zones"
            zones={swimZones}
            renderRange={z => <>{formatTime(z.loPer100)}–{formatTime(z.hiPer100)} <span style={{ fontSize: 10, color: 'var(--muted)' }}>/100m</span></>}
          />
        }
      />
    </div>
  )
}
