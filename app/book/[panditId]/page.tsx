'use client'
import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { getPandit, getServices, createBooking } from '@/lib/api'
import AddressInput from '@/components/AddressInput'

// ─── CHOGHADIYA CALCULATOR ─────────────────────────
const CHOGHADIYA_DAY = ['Udveg', 'Chal', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog']

const CHOGHADIYA_INFO: Record<string, { type: string; color: string; label: string }> = {
  Amrit: { type: 'best', color: '#16a34a', label: '🟢 Best — Amrit' },
  Shubh: { type: 'good', color: '#22c55e', label: '🟢 Good — Shubh' },
  Labh: { type: 'good', color: '#65a30d', label: '🟡 Good — Labh' },
  Chal: { type: 'neutral', color: '#ca8a04', label: '🟡 Okay — Chal' },
  Rog: { type: 'bad', color: '#dc2626', label: '🔴 Avoid — Rog' },
  Kaal: { type: 'bad', color: '#dc2626', label: '🔴 Avoid — Kaal' },
  Udveg: { type: 'bad', color: '#dc2626', label: '🔴 Avoid — Udveg' },
}

function getChoghadiyaForDate(date: Date) {
  const day = date.getDay()
  const dayStartIndex = [4, 1, 5, 2, 6, 3, 0][day]
  const sunrise = 6, sunset = 18
  const dayDuration = (sunset - sunrise) / 8
  const periods = []
  for (let i = 0; i < 8; i++) {
    const startHour = sunrise + i * dayDuration
    const endHour = startHour + dayDuration
    const name = CHOGHADIYA_DAY[(dayStartIndex + i) % 7]
    periods.push({ name, startTime: fmtHr(startHour), endTime: fmtHr(endHour), startHour, isDay: true, ...CHOGHADIYA_INFO[name] })
  }
  return periods
}

function fmtHr(h: number): string {
  const hours = Math.floor(h) % 24
  const mins = Math.round((h - Math.floor(h)) * 60)
  const p = hours >= 12 ? 'PM' : 'AM'
  const d = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
  return `${d}:${mins.toString().padStart(2, '0')} ${p}`
}

// ─── BOOKING PAGE ──────────────────────────────────
function BookingContent() {
  const { panditId } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedService = searchParams.get('service') || ''

  const [pandit, setPandit] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedChoghadiya, setSelectedChoghadiya] = useState('')
  const [address, setAddress] = useState('')
  const [addressCity, setAddressCity] = useState('')
  const [addressState, setAddressState] = useState('')
  const [addressPincode, setAddressPincode] = useState('')
  const [notes, setNotes] = useState('')
  const [agreedPrice, setAgreedPrice] = useState(0)
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
        const allServices = servicesRes.data.services || []
        setServices(allServices)
        if (preSelectedService) {
          const match = allServices.find((s: any) =>
            s.name.toLowerCase().includes(preSelectedService.toLowerCase())
          )
          if (match) { setSelectedService(match.id); setStep(2) }
        }
      } catch (err) { console.error('Failed to load data') }
      setLoading(false)
    }
    fetchData()
  }, [panditId, router, preSelectedService])

  useEffect(() => {
    if (selectedDate) {
      setChoghadiya(getChoghadiyaForDate(new Date(selectedDate)))
      setSelectedTime(''); setSelectedChoghadiya('')
    }
  }, [selectedDate])

  useEffect(() => { if (pandit) setAgreedPrice(pandit.priceMin || 2000) }, [pandit])

  const handleAddressSelect = (details: any) => {
    setAddress(details.fullAddress)
    setAddressCity(details.city)
    setAddressState(details.state)
    setAddressPincode(details.pincode)
  }

  const handleSubmit = async () => {
    setError(''); setSubmitting(true)
    try {
      await createBooking({
        panditId,
        serviceId: selectedService,
        bookingDate: selectedDate,
        startTime: selectedTime,
        address: address,
        city: addressCity || 'Indore',
        totalAmount: agreedPrice,
        specialRequests: notes || undefined,
        choghadiya: selectedChoghadiya || undefined,
      })
      setStep(5)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.')
    }
    setSubmitting(false)
  }

  if (loading) return <div className="min-h-screen pt-24 text-center" style={{ color: '#B09980' }}>Loading...</div>
  if (!pandit) return <div className="min-h-screen pt-24 text-center" style={{ color: '#7A6350' }}>Pandit not found</div>

  const panditName = `Pt. ${pandit.user?.firstName} ${pandit.user?.lastName}`
  const selectedServiceData = services.find((s: any) => s.id === selectedService)
  const today = new Date().toISOString().split('T')[0]
  const dayPeriods = choghadiya.filter(c => c.isDay)
  const goodPeriods = dayPeriods.filter(c => c.type === 'best' || c.type === 'good')

  const stepLabels = preSelectedService
    ? ['Date & Time', 'Address', 'Price & Confirm', 'Confirmed']
    : ['Ceremony', 'Date & Time', 'Address', 'Price & Confirm', 'Confirmed']

  return (
    <div className="min-h-screen pt-20 pb-12 px-4" style={{ background: '#FFFAF5' }}>
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="text-sm font-semibold mb-6 hover:underline" style={{ color: '#D4651E' }}>← Back</button>

        {/* Progress */}
        {step < 5 && (
          <div className="flex justify-center gap-2 sm:gap-6 mb-8">
            {stepLabels.slice(0, -1).map((label, i) => {
              const stepNum = preSelectedService ? i + 2 : i + 1
              const isComplete = step > stepNum
              const isCurrent = step === stepNum
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: isComplete ? '#2D8F4E' : isCurrent ? '#D4651E' : 'rgba(180,130,80,0.1)', color: isComplete || isCurrent ? '#fff' : '#B09980' }}>
                    {isComplete ? '✓' : i + 1}
                  </div>
                  <span className="text-xs hidden sm:block font-medium" style={{ color: isCurrent ? '#D4651E' : '#B09980' }}>{label}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Pandit banner */}
        {step < 5 && (
          <div className="p-4 rounded-2xl mb-6 flex items-center gap-4" style={{ background: '#FFFFFF', border: '1px solid rgba(180,130,80,0.08)' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, #D4651E, #B8860B)' }}>
              {pandit.user?.firstName?.[0]}{pandit.user?.lastName?.[0]}
            </div>
            <div>
              <h3 className="font-bold" style={{ color: '#2C1810' }}>{panditName}</h3>
              <p className="text-sm" style={{ color: '#7A6350' }}>{pandit.city} · {pandit.experienceYears} yrs · {pandit.rating > 0 ? pandit.rating.toFixed(1) + '★' : 'New'}</p>
            </div>
            <div className="ml-auto text-right">
              <div className="font-bold" style={{ color: '#D4651E' }}>₹{pandit.priceMin?.toLocaleString()} - ₹{pandit.priceMax?.toLocaleString()}</div>
              <div className="text-xs" style={{ color: '#B09980' }}>per ceremony</div>
            </div>
          </div>
        )}

        {error && <div className="p-3 rounded-xl text-sm mb-4" style={{ background: '#FEE8E8', color: '#C53030' }}>{error}</div>}

        {/* ─── STEP 1: CEREMONY ─── */}
        {step === 1 && !preSelectedService && (
          <div className="p-6 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(180,130,80,0.08)' }}>
            <h2 className="text-xl font-bold mb-1" style={{ color: '#2C1810' }}>Select Ceremony</h2>
            <p className="text-sm mb-5" style={{ color: '#7A6350' }}>Choose the puja or ceremony you need</p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {services.map((s: any) => (
                <label key={s.id} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                  style={{ border: `2px solid ${selectedService === s.id ? '#D4651E' : 'rgba(180,130,80,0.08)'}`, background: selectedService === s.id ? 'rgba(212,101,30,0.04)' : '#FFFFFF' }}>
                  <input type="radio" name="service" value={s.id} checked={selectedService === s.id}
                    onChange={() => setSelectedService(s.id)} style={{ accentColor: '#D4651E' }} />
                  <div className="flex-1">
                    <div className="font-semibold" style={{ color: '#2C1810' }}>{s.name}</div>
                    {s.nameHindi && <div className="text-xs" style={{ color: '#B09980' }}>{s.nameHindi}</div>}
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: 'rgba(212,101,30,0.06)', color: '#D4651E' }}>{s.category}</span>
                </label>
              ))}
            </div>
            <button onClick={() => selectedService && setStep(2)} disabled={!selectedService}
              className="w-full mt-6 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #D4651E, #C05818)' }}>Continue →</button>
          </div>
        )}

        {/* ─── STEP 2: DATE & CHOGHADIYA ─── */}
        {step === 2 && (
          <div className="p-6 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(180,130,80,0.08)' }}>
            <h2 className="text-xl font-bold mb-1" style={{ color: '#2C1810' }}>Select Date & Muhurat</h2>
            <p className="text-sm mb-5" style={{ color: '#7A6350' }}>Pick a date and we&apos;ll show auspicious timings</p>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#4A3728' }}>Ceremony Date</label>
              <input type="date" value={selectedDate} min={today} onChange={e => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-base" style={{ background: '#FFF5EC', border: '1.5px solid rgba(180,130,80,0.1)', color: '#2C1810' }} />
            </div>
            {selectedDate && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🕉️</span>
                  <span className="font-bold" style={{ color: '#2C1810' }}>Din ka Choghadiya</span>
                  <span className="ml-auto text-xs px-3 py-1 rounded-full font-semibold" style={{ background: 'rgba(212,101,30,0.08)', color: '#D4651E' }}>
                    {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {dayPeriods.map((c, i) => (
                    <label key={i} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                      style={{
                        border: `2px solid ${selectedTime === c.startTime ? '#D4651E' : c.type === 'bad' ? 'rgba(197,48,48,0.08)' : 'rgba(180,130,80,0.06)'}`,
                        background: selectedTime === c.startTime ? 'rgba(212,101,30,0.04)' : c.type === 'bad' ? 'rgba(197,48,48,0.02)' : '#fff',
                        opacity: c.type === 'bad' ? 0.5 : 1,
                      }}>
                      <input type="radio" name="time" value={c.startTime} checked={selectedTime === c.startTime}
                        onChange={() => { setSelectedTime(c.startTime); setSelectedChoghadiya(c.name) }} style={{ accentColor: '#D4651E' }} />
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                      <span className="font-semibold text-sm flex-1" style={{ color: '#2C1810' }}>{c.startTime} — {c.endTime}</span>
                      <span className="text-xs" style={{ color: c.color }}>{c.name}</span>
                      {(c.type === 'best' || c.type === 'good') && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: '#E8F5EC', color: '#2D8F4E' }}>
                          {c.type === 'best' ? 'BEST' : 'GOOD'}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
                {goodPeriods.length > 0 && !selectedTime && (
                  <div className="mt-3 p-3 rounded-xl text-sm" style={{ background: '#E8F5EC', color: '#2D8F4E', border: '1px solid rgba(45,143,78,0.1)' }}>
                    💡 <strong>Suggestion:</strong> {goodPeriods[0].name} ({goodPeriods[0].startTime}) is the most auspicious time.
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(preSelectedService ? 2 : 1)} className="flex-1 py-3 rounded-xl font-semibold" style={{ border: '1.5px solid rgba(180,130,80,0.15)', color: '#7A6350' }}>← Back</button>
              <button onClick={() => selectedDate && selectedTime && setStep(3)} disabled={!selectedDate || !selectedTime}
                className="flex-1 py-3 rounded-xl font-bold text-white disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #D4651E, #C05818)' }}>Continue →</button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: ADDRESS (Google Places) ─── */}
        {step === 3 && (
          <div className="p-6 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(180,130,80,0.08)' }}>
            <h2 className="text-xl font-bold mb-1" style={{ color: '#2C1810' }}>Ceremony Location</h2>
            <p className="text-sm mb-5" style={{ color: '#7A6350' }}>Where should the pandit come?</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#4A3728' }}>Address *</label>
                <AddressInput
                  value={address}
                  onChange={setAddress}
                  onAddressSelect={handleAddressSelect}
                  placeholder="Start typing your address..."
                />
                <p className="text-xs mt-1.5" style={{ color: '#B09980' }}>
                  📍 Google will suggest addresses as you type
                </p>
              </div>

              {/* Auto-filled fields from Google Places */}
              {(addressCity || addressState || addressPincode) && (
                <div className="p-3 rounded-xl" style={{ background: '#E8F5EC', border: '1px solid rgba(45,143,78,0.1)' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#2D8F4E' }}>✓ Auto-filled from Google</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {addressCity && <div><span style={{ color: '#7A6350' }}>City:</span> <strong style={{ color: '#2C1810' }}>{addressCity}</strong></div>}
                    {addressState && <div><span style={{ color: '#7A6350' }}>State:</span> <strong style={{ color: '#2C1810' }}>{addressState}</strong></div>}
                    {addressPincode && <div><span style={{ color: '#7A6350' }}>Pin:</span> <strong style={{ color: '#2C1810' }}>{addressPincode}</strong></div>}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: '#4A3728' }}>Special Instructions (optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Any special requirements for the pandit..." rows={3}
                  className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                  style={{ background: '#FFF5EC', border: '1.5px solid rgba(180,130,80,0.1)', color: '#2C1810' }} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl font-semibold" style={{ border: '1.5px solid rgba(180,130,80,0.15)', color: '#7A6350' }}>← Back</button>
              <button onClick={() => address && setStep(4)} disabled={!address}
                className="flex-1 py-3 rounded-xl font-bold text-white disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #D4651E, #C05818)' }}>Continue →</button>
            </div>
          </div>
        )}

        {/* ─── STEP 4: PRICE CONFIRMATION ─── */}
        {step === 4 && (
          <div className="p-6 rounded-2xl" style={{ background: '#FFFFFF', border: '1px solid rgba(180,130,80,0.08)' }}>
            <h2 className="text-xl font-bold mb-1" style={{ color: '#2C1810' }}>Review & Confirm</h2>
            <p className="text-sm mb-5" style={{ color: '#7A6350' }}>Review your booking and confirm the price</p>

            <div className="p-4 rounded-xl mb-6" style={{ background: '#FFF5EC' }}>
              <h4 className="text-sm font-bold mb-3" style={{ color: '#4A3728' }}>Booking Summary</h4>
              <div className="space-y-2 text-sm">
                {[
                  ['Ceremony', selectedServiceData?.name || preSelectedService],
                  ['Pandit', panditName],
                  ['Date', new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })],
                  ['Time', selectedTime],
                  ['Muhurat', selectedChoghadiya],
                  ['Location', address],
                  ...(addressCity ? [['City', addressCity]] : []),
                ].map(([label, value], i) => (
                  <div key={i} className="flex justify-between">
                    <span style={{ color: '#7A6350' }}>{label}</span>
                    <span className="font-semibold text-right max-w-[200px]" style={{ color: label === 'Muhurat' ? CHOGHADIYA_INFO[selectedChoghadiya]?.color : '#2C1810' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl mb-6" style={{ background: '#FFFFFF', border: '2px solid rgba(212,101,30,0.15)' }}>
              <h4 className="text-sm font-bold mb-2" style={{ color: '#4A3728' }}>💰 Confirm Price</h4>
              <p className="text-xs mb-3" style={{ color: '#7A6350' }}>
                Pandit&apos;s range: <strong style={{ color: '#D4651E' }}>₹{pandit.priceMin?.toLocaleString()} - ₹{pandit.priceMax?.toLocaleString()}</strong>
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold" style={{ color: '#4A3728' }}>Your offer: ₹</span>
                <input type="number" value={agreedPrice} onChange={e => setAgreedPrice(parseInt(e.target.value) || 0)}
                  min={pandit.priceMin || 0} max={pandit.priceMax || 100000}
                  className="flex-1 px-4 py-2.5 rounded-xl text-lg font-bold text-center"
                  style={{ background: '#FFF5EC', border: '1.5px solid rgba(180,130,80,0.15)', color: '#D4651E' }} />
              </div>
              <div className="flex gap-2 mt-3">
                {[pandit.priceMin, Math.round((pandit.priceMin + pandit.priceMax) / 2), pandit.priceMax].filter(Boolean).map((p, i) => (
                  <button key={i} onClick={() => setAgreedPrice(p)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                    style={{
                      background: agreedPrice === p ? 'rgba(212,101,30,0.08)' : 'rgba(180,130,80,0.04)',
                      color: agreedPrice === p ? '#D4651E' : '#7A6350',
                      border: `1px solid ${agreedPrice === p ? 'rgba(212,101,30,0.2)' : 'rgba(180,130,80,0.08)'}`,
                    }}>₹{p?.toLocaleString()}{i === 0 ? ' (Min)' : i === 2 ? ' (Max)' : ''}</button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center p-4 rounded-xl mb-6" style={{ background: 'rgba(212,101,30,0.04)', border: '1px solid rgba(212,101,30,0.1)' }}>
              <span className="font-bold" style={{ color: '#2C1810' }}>Total Amount</span>
              <span className="text-2xl font-extrabold" style={{ color: '#D4651E' }}>₹{agreedPrice.toLocaleString()}</span>
            </div>

            <p className="text-xs text-center mb-4" style={{ color: '#B09980' }}>By confirming, the pandit will be notified. Payment will be collected later.</p>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-xl font-semibold" style={{ border: '1.5px solid rgba(180,130,80,0.15)', color: '#7A6350' }}>← Back</button>
              <button onClick={handleSubmit} disabled={!agreedPrice || submitting}
                className="flex-1 py-3 rounded-xl font-bold text-white disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #D4651E, #C05818)', boxShadow: '0 4px 16px rgba(212,101,30,0.15)' }}>
                {submitting ? 'Booking...' : '✓ Confirm Booking'}</button>
            </div>
          </div>
        )}

        {/* ─── STEP 5: CONFIRMATION ─── */}
        {step === 5 && (
          <div className="p-8 rounded-2xl text-center" style={{ background: '#FFFFFF', border: '1px solid rgba(180,130,80,0.08)' }}>
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#2C1810' }}>Booking Confirmed!</h2>
            <p className="text-sm mb-6" style={{ color: '#7A6350' }}>Your ceremony has been booked. The pandit will be notified.</p>
            <div className="p-4 rounded-xl mb-6 text-left" style={{ background: '#FFF5EC' }}>
              <div className="space-y-2 text-sm">
                {[
                  ['Ceremony', selectedServiceData?.name || preSelectedService],
                  ['Pandit', panditName],
                  ['Date', new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })],
                  ['Time', selectedTime], ['Muhurat', selectedChoghadiya],
                  ['Address', address], ['Amount', `₹${agreedPrice.toLocaleString()}`],
                ].map(([label, value], i) => (
                  <div key={i} className="flex justify-between">
                    <span style={{ color: '#7A6350' }}>{label}</span>
                    <span className="font-semibold" style={{ color: i === 6 ? '#D4651E' : '#2C1810' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => router.push('/dashboard')} className="flex-1 py-3 rounded-xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #D4651E, #C05818)' }}>View My Bookings</button>
              <button onClick={() => router.push('/')} className="flex-1 py-3 rounded-xl font-semibold" style={{ border: '1.5px solid rgba(180,130,80,0.15)', color: '#7A6350' }}>Back to Home</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center" style={{ color: '#B09980' }}>Loading...</div>}>
      <BookingContent />
    </Suspense>
  )
}