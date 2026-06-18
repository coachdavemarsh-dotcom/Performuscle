// FIT Workout File Generator
// Outputs a structured .fit workout file readable by Garmin Connect and compatible devices.
// Users download and import into Garmin Connect → syncs to their watch.
//
// FIT Protocol spec: developer.garmin.com/fit/protocol/
// Workout messages: file_id (global 0), workout (global 26), workout_step (global 27)

import { resolveEnduranceTarget } from './calculators.js'

// ─── CRC16 (FIT spec) ─────────────────────────────────────────────────────────

const CRC_TABLE = [
  0x0000, 0xCC01, 0xD801, 0x1400,
  0xF001, 0x3C00, 0x2800, 0xE401,
  0xA001, 0x6C00, 0x7800, 0xB401,
  0x5000, 0x9C01, 0x8801, 0x4400,
]

function fitCrc(bytes) {
  let crc = 0
  for (const b of bytes) {
    let tmp = CRC_TABLE[crc & 0xF]
    crc = (crc >>> 4) & 0x0FFF
    crc ^= CRC_TABLE[(b & 0xF) ^ (tmp >>> 8)]
    tmp = CRC_TABLE[crc & 0xF]
    crc = (crc >>> 4) & 0x0FFF
    crc ^= CRC_TABLE[((b >>> 4) & 0xF) ^ (tmp >>> 8)]
  }
  return crc
}

// ─── Binary writer ────────────────────────────────────────────────────────────

class FitBuf {
  constructor() { this._b = [] }
  u8(v)  { this._b.push(v & 0xFF) }
  u16(v) { this.u8(v); this.u8(v >>> 8) }           // little-endian
  u32(v) { this.u8(v); this.u8(v >>> 8); this.u8(v >>> 16); this.u8(v >>> 24) }
  str(s, len) {
    const enc = new TextEncoder().encode(s.slice(0, len - 1))
    for (let i = 0; i < len; i++) this.u8(i < enc.length ? enc[i] : 0)
  }
  def(localNum, globalNum, fields) {
    this.u8(0x40 | (localNum & 0xF))  // definition record header
    this.u8(0x00)                      // reserved
    this.u8(0x00)                      // architecture: little-endian
    this.u16(globalNum)
    this.u8(fields.length)
    for (const [fn, sz, bt] of fields) { this.u8(fn); this.u8(sz); this.u8(bt) }
  }
  get arr() { return new Uint8Array(this._b) }
}

// ─── FIT sport codes ──────────────────────────────────────────────────────────

const SPORT = { run: 1, bike: 2, swim: 5 }
const FIT_EPOCH_OFFSET = 631065600  // unix seconds between 1970 and 1989-12-31 (FIT epoch)

// ─── Core generator ──────────────────────────────────────────────────────────
// steps: [{ name, durationSec, targetType, targetLow, targetHigh }]
//   targetType: 'open' | 'hr' | 'power'
//   targetLow/High: bpm for hr, watts for power (ignored for 'open')

export function buildFitWorkout(workoutName, modality, steps) {
  const buf  = new FitBuf()
  const sport = SPORT[modality] ?? 0
  const now   = Math.floor(Date.now() / 1000) - FIT_EPOCH_OFFSET

  // ── file_id (local 0, global 0) ──────────────────────────────────────────
  buf.def(0, 0, [
    [0, 1, 0x00],   // type: enum
    [1, 2, 0x84],   // manufacturer: uint16
    [2, 2, 0x84],   // product: uint16
    [4, 4, 0x86],   // time_created: uint32
  ])
  buf.u8(0)          // data header: local 0
  buf.u8(5)          // type = 5 (workout file)
  buf.u16(1)         // manufacturer = Garmin
  buf.u16(0)         // product
  buf.u32(now)       // time_created

  // ── workout (local 1, global 26) ─────────────────────────────────────────
  buf.def(1, 26, [
    [4, 1, 0x00],   // sport: enum
    [6, 2, 0x84],   // num_valid_steps: uint16
    [8, 16, 0x07],  // wkt_name: string[16]
  ])
  buf.u8(1)
  buf.u8(sport)
  buf.u16(steps.length)
  buf.str(workoutName, 16)

  // ── workout_step (local 2, global 27) ────────────────────────────────────
  buf.def(2, 27, [
    [254, 2, 0x84],  // message_index: uint16
    [0,  16, 0x07],  // wkt_step_name: string[16]
    [3,   1, 0x00],  // duration_type: enum  (0 = time)
    [4,   4, 0x86],  // duration_value: uint32 (milliseconds when type=time)
    [6,   1, 0x00],  // target_type: enum  (1=hr, 2=open, 4=power)
    [7,   4, 0x86],  // target_value: uint32
    [8,   4, 0x86],  // target_value_low: uint32
    [9,   4, 0x86],  // target_value_high: uint32
  ])

  steps.forEach((step, idx) => {
    buf.u8(2)
    buf.u16(idx)
    buf.str(step.name.slice(0, 15), 16)
    buf.u8(0)                              // duration_type = time
    buf.u32(step.durationSec * 1000)       // ms

    if (step.targetType === 'hr' && step.targetLow) {
      buf.u8(1)                     // target_type = heart_rate
      buf.u32(0)                    // target_value (0 = custom range)
      buf.u32(step.targetLow)       // low bpm
      buf.u32(step.targetHigh)      // high bpm
    } else if (step.targetType === 'power' && step.targetLow) {
      buf.u8(4)                     // target_type = power
      buf.u32(0)
      buf.u32(step.targetLow)       // low watts
      buf.u32(step.targetHigh)      // high watts
    } else {
      buf.u8(2)                     // target_type = open
      buf.u32(0xFFFFFFFF)
      buf.u32(0xFFFFFFFF)
      buf.u32(0xFFFFFFFF)
    }
  })

  // ── Assemble final file ───────────────────────────────────────────────────
  const dataBytes = buf.arr
  const hdr = new FitBuf()
  hdr.u8(14); hdr.u8(0x10); hdr.u16(2132)  // size, proto ver, profile ver
  hdr.u32(dataBytes.length)                  // data size
  hdr.u8(0x2E); hdr.u8(0x46); hdr.u8(0x49); hdr.u8(0x54)  // ".FIT"
  const hdrArr = hdr.arr
  const hdrCrc = new FitBuf()
  hdrCrc._b = Array.from(hdrArr)
  hdrCrc.u16(fitCrc(hdrArr))

  const dataCrcBuf = new FitBuf()
  dataCrcBuf.u16(fitCrc(dataBytes))

  const out = new Uint8Array(hdrCrc.arr.length + dataBytes.length + 2)
  out.set(hdrCrc.arr, 0)
  out.set(dataBytes, hdrCrc.arr.length)
  out.set(dataCrcBuf.arr, hdrCrc.arr.length + dataBytes.length)
  return out
}

// ─── Convert Performuscle session to FIT steps ────────────────────────────────
// cfg: conditioning_config ({ modality, title, segments })
// latestResults: object from getAllLatestTestResults

export function sessionToFitSteps(cfg, latestResults) {
  const steps = []
  ;(cfg.segments || []).forEach(seg => {
    if (seg.repeat != null) {
      for (let r = 0; r < seg.repeat; r++) {
        if (seg.work)     steps.push(_segStep(seg.work,     `Rep ${r + 1}`, latestResults))
        if (seg.recovery) steps.push(_segStep(seg.recovery, `Rest ${r + 1}`, latestResults))
      }
    } else {
      steps.push(_segStep(seg, seg.label || 'Step', latestResults))
    }
  })
  return steps
}

function _segStep(seg, fallbackName, latestResults) {
  const durationSec = Math.round((seg.duration_min || 0) * 60)
  const name        = (seg.label || fallbackName).slice(0, 15)
  const t           = resolveEnduranceTarget(seg.target, latestResults || {})

  let targetType = 'open', targetLow, targetHigh

  if (t?.available && t.zone) {
    const metric = seg.target?.metric
    if (metric === 'hr') {
      targetType = 'hr'
      targetLow  = t.zone.loBpm
      targetHigh = t.zone.hiBpm
    } else if (metric === 'power') {
      targetType = 'power'
      targetLow  = t.zone.loW
      targetHigh = t.zone.hiW
    }
    // pace and css: fall through to open — target shown in step name
  }

  return { name, durationSec, targetType, targetLow, targetHigh, display: t?.display }
}

// ─── Download helper ──────────────────────────────────────────────────────────

export function downloadFitFile(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/octet-stream' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename.replace(/[^a-z0-9_-]/gi, '_') + '.fit'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
