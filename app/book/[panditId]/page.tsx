'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getPandit, getServices, createBooking } from '@/lib/api'

// ─── CHOGHADIYA CALCULATOR ─────────────────────────
const CHOGHADIYA_DAY = ['Udveg', 'Chal', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog']
const CHOGHADIYA_NIGHT = ['Shubh', 'Amrit', 'Chal', 'Rog', 'Kaal', 'Labh', 'Udveg']

const CHOGHADIYA_INFO: Record<string, { type: string; color: string; label: string }> = {
  Amrit: { type: 'best', color: '#16a34a', label: '🟢 Best — Amrit (Most Auspicious)' },
  Shubh: { type: 'good', color: '#22c55e', label: '🟢 Good — Shubh (Auspicious)' },
  Labh: { type: 'good', color: '#65a30d', label: '🟡 Good — Labh (Profitable)' },
  Chal: { type: 'neutral', color: '#ca8a04', label: '🟡 Okay — Chal (Moving)' },
  Rog: { type: 'bad', color: '#dc2626', label: '🔴 Avoid — Rog (Illness)' },
  Kaal: { type: 'bad', color: '#dc2626', label: '🔴 Avoid — Kaal (Death)' },
  Udveg: { type: 'bad', color: '#dc2626', label: '🔴 Avoid — Udveg (Anxiety)' },
}

function getDayOfWeek(date: Date): number {
  return date.getDay()
}

function getChoghadiyaForDate(date: Date) {
  const day = getDayOfWeek(date)
  // Each day of the week starts with a different Choghadiya
  // Sunday=0: Sun, Monday=1: Moon, etc.
  const dayStartIndex = [4, 1, 5, 2, 6, 3, 0][day] // Traditional starting positions
  const nightStartIndex = [3, 0, 4, 1, 5, 2, 6][day]

  // Approximate sunrise 6:00 AM, sunset 6:00 PM (Indore)
  const sunrise = 6
  const sunset = 18
  const dayDuration = (sunset - sunrise) / 8  // 8 periods in day
  const nightDuration = (24 - sunset + sunrise) / 8  // 8 periods in night

  const periods = []

  // Day periods (sunrise to sunset)
  for (let i = 0; i < 8; i++) {
    const startHour = sunrise + i * dayDuration
    const endHour = startHour + dayDuration
    const name = CHOGHADIYA_DAY[(dayStartIndex + i) % 7]
    periods.push({
      name,
      startTime: formatHour(startHour),
      endTime: formatHour(endHour),
      startHour,
      endHour,
      isDay: true,
      ...CHOGHADIYA_INFO[name],
    })
  }

  // Night periods (sunset to next sunrise)
  for (let i = 0; i < 8; i++) {
    const startHour = sunset + i * nightDuration
    const adjustedStart = startHour >= 24 ? startHour - 24 : startHour
    const endHour = startHour + nightDuration
    const adjustedEnd = endHour >= 24 ? endHour - 24 : endHour
    const name = CHOGHADIYA_NIGHT[(nightStartIndex + i) % 7]
    periods.push({
      name,
      startTime: formatHour(adjustedStart),
      endTime: formatHour(adjustedEnd),
      startHour: adjustedStart,
      endHour: adjustedEnd,
      isDay: false,
      ...CHOGHADIYA_INFO[name],
    })
  }

  return periods
}

function formatHour(h: number): string {
  const hours = Math.floor(h) % 24
  const minutes = Math.round((h - Math.floor(h)) * 60)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

// ─── BOOKING PAGE ──────────────────────────────────
export default function BookingPage() {
  const { panditId } = useParams()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [pandit, setPandit] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [bookingResult, setBookingResult] = useState<any>(null)

  // Form state
  const [selectedService, setSelectedService] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedChoghadiya, setSelectedChoghadiya] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [attendees, setAttendees] = useState('10')

  // Choghadiya data
  const [choghadiya, setChoghadiya] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login first to book a pandit')
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        const [panditRes, servicesRes] = await Promise.all([
          getPandit(panditId as string),
          getServices()
        ])
        setPandit(panditRes.data.pandit)
        setServices(servicesRes.data.services || [])
      } catch (err) {
        console.error('Failed to load data')
      }
      setLoading(false)
    }
    fetchData()
  }, [panditId, router])

  // Update Choghadiya when date changes
  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate)
      const periods = getChoghadiyaForDate(date)
      setChoghadiya(periods)
      setSelectedTime('')
      setSelectedChoghadiya('')
    }
  }, [selectedDate])

  const handleSubmit = async () => {
    setError('')
    setSubmitting(true)
    try {
      const res = await createBooking({
        panditId,
        serviceId: selectedService,
        bookingDate: selectedDate,
        startTime: selectedTime,
        address: address,
        city: 'Indore',
        totalAmount: pandit.priceMin || 2000,
        specialRequests: notes || undefined,
        choghadiya: selectedChoghadiya || undefined,
      })
      setBookingResult(res.data)
      setStep(4)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.')
    }
    setSubmitting(false)
  }

  if (loading) return <div className="min-h-screen bg-orange-50 pt-24 text-center text-gray-400">Loading...</div>
  if (!pandit) return <div className="min-h-screen bg-orange-50 pt-24 text-center text-gray-500">Pandit not found</div>

  const panditName = `Pt. ${pandit.user?.firstName} ${pandit.user?.lastName}`
  const selectedServiceData = services.find((s: any) => s.id === selectedService)
  const today = new Date().toISOString().split('T')[0]

  // Filter only good Choghadiya periods for day time (ceremony hours)
  const dayPeriods = choghadiya.filter(c => c.isDay)
  const goodPeriods = dayPeriods.filter(c => c.type === 'best' || c.type === 'good')

  return (
    <div className="min-h-screen bg-orange-50 pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Back button */}
        <button onClick={() => router.back()} className="text-sm text-orange-600 font-semibold mb-6 hover:underline">
          ← Back
        </button>

        {/* Progress Steps */}
        <div className="flex justify-center gap-2 sm:gap-8 mb-8">
          {['Ceremony', 'Date & Time', 'Details', 'Confirmed'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                step > i + 1 ? 'bg-green-500 border-green-500 text-white' :
                step === i + 1 ? 'bg-orange-600 border-orange-600 text-white' :
                'border-gray-300 text-gray-400'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${step === i + 1 ? 'text-orange-600 font-semibold' : 'text-gray-400'}`}>{label}</span>
            </div>
          ))}
        </div>

        {/* Pandit Info Banner */}
        {step < 4 && (
          <div className="bg-white rounded-xl p-4 mb-6 flex items-center gap-4 border border-orange-100">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold">
              {pandit.user?.firstName?.[0]}{pandit.user?.lastName?.[0]}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{panditName}</h3>
              <p className="text-sm text-gray-500">{pandit.city} · {pandit.experienceYears} yrs exp · {pandit.rating > 0 ? pandit.rating.toFixed(1) + '★' : 'New'}</p>
            </div>
          </div>
        )}

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>}

        {/* ─── STEP 1: SELECT CEREMONY ─── */}
        {step === 1 && (
          <div className="bg-white rounded-xl p-6 border border-orange-100">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Select Ceremony</h2>
            <p className="text-sm text-gray-500 mb-5">Choose the puja or ceremony you need</p>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {services.map((s: any) => (
                <label
                  key={s.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition ${
                    selectedService === s.id ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-orange-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="service"
                    value={s.id}
                    checked={selectedService === s.id}
                    onChange={() => setSelectedService(s.id)}
                    className="accent-orange-600"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{s.name}</div>
                    {s.nameHindi && <div className="text-xs text-gray-400">{s.nameHindi}</div>}
                    {s.description && <div className="text-xs text-gray-500 mt-1">{s.description}</div>}
                  </div>
                  <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full font-medium">{s.category}</span>
                </label>
              ))}
            </div>

            <button
              onClick={() => selectedService && setStep(2)}
              disabled={!selectedService}
              className="w-full mt-6 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        )}

        {/* ─── STEP 2: DATE & CHOGHADIYA ─── */}
        {step === 2 && (
          <div className="bg-white rounded-xl p-6 border border-orange-100">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Select Date & Muhurat</h2>
            <p className="text-sm text-gray-500 mb-5">Pick a date and we'll show you the auspicious timings</p>

            {/* Date picker */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ceremony Date</label>
              <input
                type="date"
                value={selectedDate}
                min={today}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base bg-orange-50 focus:outline-none focus:border-orange-400"
              />
            </div>

            {/* Choghadiya Display */}
            {selectedDate && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold text-gray-900">🕉️ Din ka Choghadiya</h3>
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                    {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Select an auspicious time for your ceremony. Green = Best, Yellow = Okay, Red = Avoid</p>

                {/* Day periods */}
                <div className="mb-3">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">☀️ Day Timings (Sunrise to Sunset)</div>
                  <div className="space-y-1.5">
                    {dayPeriods.map((c, i) => (
                      <label
                        key={i}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                          selectedTime === c.startTime ? 'border-orange-500 bg-orange-50' :
                          c.type === 'bad' ? 'border-red-100 bg-red-50/30 opacity-60' :
                          'border-gray-100 hover:border-orange-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="time"
                          value={c.startTime}
                          checked={selectedTime === c.startTime}
                          onChange={() => { setSelectedTime(c.startTime); setSelectedChoghadiya(c.name); }}
                          className="accent-orange-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-gray-900">{c.startTime} — {c.endTime}</span>
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: c.color }}>{c.label}</div>
                        </div>
                        {(c.type === 'best' || c.type === 'good') && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Recommended</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Suggestion */}
                {goodPeriods.length > 0 && !selectedTime && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                    💡 <strong>Suggestion:</strong> {goodPeriods[0].label} ({goodPeriods[0].startTime} — {goodPeriods[0].endTime}) is the most auspicious time for this day.
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(1)} className="flex-1 border-2 border-gray-200 py-3 rounded-lg font-semibold text-gray-600 hover:border-orange-300 transition">
                ← Back
              </button>
              <button
                onClick={() => selectedDate && selectedTime && setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: ADDRESS & CONFIRM ─── */}
        {step === 3 && (
          <div className="bg-white rounded-xl p-6 border border-orange-100">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Ceremony Details</h2>
            <p className="text-sm text-gray-500 mb-5">Where should the pandit come?</p>

            {/* Summary */}
            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-bold text-gray-700 mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Ceremony</span><span className="font-semibold">{selectedServiceData?.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-semibold">{new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-semibold">{selectedTime}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Muhurat</span><span className="font-semibold" style={{ color: CHOGHADIYA_INFO[selectedChoghadiya]?.color }}>{selectedChoghadiya}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Pandit</span><span className="font-semibold">{panditName}</span></div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Ceremony Address *</label>
                <textarea
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter your full address (flat no, building, street, area, city, pincode)"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-orange-50 focus:outline-none focus:border-orange-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Expected Attendees</label>
                <input
                  type="number"
                  value={attendees}
                  onChange={e => setAttendees(e.target.value)}
                  min="1"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-orange-50 focus:outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Special Instructions (optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any special requirements or instructions for the pandit..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-orange-50 focus:outline-none focus:border-orange-400 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(2)} className="flex-1 border-2 border-gray-200 py-3 rounded-lg font-semibold text-gray-600 hover:border-orange-300 transition">
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!address || submitting}
                className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 4: CONFIRMATION ─── */}
        {step === 4 && (
          <div className="bg-white rounded-xl p-8 border border-orange-100 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-6">Your ceremony has been booked successfully. The pandit will be notified.</p>

            <div className="bg-orange-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Ceremony</span><span className="font-semibold">{selectedServiceData?.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Pandit</span><span className="font-semibold">{panditName}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-semibold">{new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-semibold">{selectedTime}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Muhurat</span><span className="font-semibold text-green-600">{selectedChoghadiya}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Address</span><span className="font-semibold text-right max-w-xs">{address}</span></div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => router.push('/dashboard')} className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition">
                View My Bookings
              </button>
              <button onClick={() => router.push('/')} className="flex-1 border-2 border-gray-200 py-3 rounded-lg font-semibold text-gray-600 hover:border-orange-300 transition">
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}