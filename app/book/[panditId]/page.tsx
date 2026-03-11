'use client'
import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { getPandit, getServices, createBooking } from '@/lib/api'
import AddressInput from '@/components/AddressInput'
import SacredLoader from '@/components/ui/SacredLoader'

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

function BookingContent() {
  const { panditId } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedService = searchParams.get('service') || ''
  const preSelectedPrice = parseInt(searchParams.get('price') || '0')

  const [pandit, setPandit] = useState<any>(null)
  const [services, setServices] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [negotiating, setNegotiating] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)

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
  const [wantsSamagri, setWantsSamagri] = useState<boolean | null>(null)
  const [samagriItems, setSamagriItems] = useState<any[]>([])
  const [samagriLoading, setSamagriLoading] = useState(false)
  const [samagriError, setSamagriError] = useState('')

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  // Fetch pandit, services, and current user
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
          getServices(),
        ])
        setPandit(panditRes.data.pandit)
        const allServices = servicesRes.data.services || []
        setServices(allServices)
        if (preSelectedService) {
          const match = allServices.find((s: any) =>
            s.name.toLowerCase().includes(preSelectedService.toLowerCase())
          )
          if (match) { setSelectedService(match.id); setStep(1.5) }
        }

        // Fetch current logged-in user
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (userRes.ok) {
          const userData = await userRes.json()
          setCurrentUser(userData.user || userData)
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

  useEffect(() => {
    if (pandit) setAgreedPrice(preSelectedPrice || pandit.priceMin || 2000)
  }, [pandit, preSelectedPrice])

  const handleAddressSelect = (details: any) => {
    setAddress(details.fullAddress)
    setAddressCity(details.city)
    setAddressState(details.state)
    setAddressPincode(details.pincode)
  }

  const fetchSamagri = async (ceremonyName: string) => {
    setSamagriLoading(true)
    setSamagriError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/samagri/generate?ceremony=${encodeURIComponent(ceremonyName)}`)
      const data = await res.json()
      setSamagriItems(data.items.map((item: any) => ({ ...item, selected: true, qty: 1 })))
    } catch {
      setSamagriError('Failed to load samagri list. You can skip this step.')
    }
    setSamagriLoading(false)
  }

  const handlePayment = async () => {
    setPaymentLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const finalAmount = agreedPrice - (wantsSamagri ? Math.round(agreedPrice * 0.05) : 0) + (wantsSamagri ? samagriTotal : 0)

      // Step 1: Create Razorpay order
      const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: finalAmount, bookingId: 'pending' })
      })
      const orderData = await orderRes.json()
      console.log('Razorpay order data:', orderData)
      if (!orderData.orderId) {
        setError('Failed to initiate payment. Please try again.')
        setPaymentLoading(false)
        return
      }

      // Step 2: Open Razorpay checkout
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: orderData.amount,
  currency: 'USD',
        name: 'Aarambh',
        description: `${preSelectedService || selectedServiceData?.name} with ${panditName}`,
        order_id: orderData.orderId,
        prefill: {
          name: `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim(),
          email: currentUser?.email || '',
          contact: currentUser?.phone || ''
        },
        theme: { color: 'var(--accent)' },
        modal: { ondismiss: () => setPaymentLoading(false) },
        handler: async (response: any) => {
          try {
            // Step 3: Verify payment
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: 'pending'
              })
            })
            const verifyData = await verifyRes.json()
            if (!verifyData.success) {
              setError('Payment verification failed. Please contact support.')
              setPaymentLoading(false)
              return
            }

            // Step 4: Create booking only after payment verified
            await createBooking({
              panditId,
              serviceId: selectedService,
              bookingDate: selectedDate,
              startTime: selectedTime,
              address,
              city: addressCity || 'Indore',
              totalAmount: finalAmount,
              specialRequests: notes || undefined,
              choghadiya: selectedChoghadiya || undefined,
              paymentId: response.razorpay_payment_id,
            })

            setStep(5)
          } catch (err: any) {
            setError(`Booking failed after payment. Please contact support with payment ID: ${response.razorpay_payment_id}`)
            setPaymentLoading(false)
          }
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (err: any) {
      setError('Payment failed. Please try again.')
      setPaymentLoading(false)
    }
  }

  if (loading) return <SacredLoader message="Preparing your booking..." size="lg" />
  if (!pandit) return (
    <div className="min-h-screen pt-24 text-center" style={{ color: 'var(--text-on-light2)' }}>
      Pandit not found
    </div>
  )

  const panditName = `Pt. ${pandit.user?.firstName} ${pandit.user?.lastName}`
  const selectedServiceData = services.find((s: any) => s.id === selectedService)
  const today = new Date().toISOString().split('T')[0]
  const dayPeriods = choghadiya.filter(c => c.isDay)
  const goodPeriods = dayPeriods.filter(c => c.type === 'best' || c.type === 'good')
  const samagriTotal = samagriItems.filter(i => i.selected).reduce((sum, i) => sum + i.estimatedPrice * i.qty, 0)
  const discount = wantsSamagri ? Math.round(agreedPrice * 0.05) : 0
  const stepLabels = preSelectedService
    ? ['Samagri', 'Date & Time', 'Address', 'Confirm', 'Done']
    : ['Ceremony', 'Samagri', 'Date & Time', 'Address', 'Confirm', 'Done']

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()}
          className="text-sm font-semibold mb-6 hover:underline"
          style={{ color: 'var(--accent)', fontFamily: 'Outfit, sans-serif', background: 'none', border: 'none', cursor: 'pointer' }}>
          ← Back
        </button>

        {step < 5 && (
          <div className="flex justify-center gap-2 sm:gap-6 mb-8">
            {stepLabels.slice(0, -1).map((label, i) => {
              const stepNum = preSelectedService ? i + 1.5 : i + 1
              const isComplete = step > stepNum
              const isCurrent = step === stepNum
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: isComplete ? 'var(--green)' : isCurrent ? 'var(--accent)' : 'rgba(44,26,8,0.08)',
                      color: isComplete || isCurrent ? '#fff' : 'var(--text-on-light3)',
                      fontFamily: 'Outfit, sans-serif',
                    }}>
                    {isComplete ? '✓' : i + 1}
                  </div>
                  <span className="text-xs hidden sm:block font-medium"
                    style={{ color: isCurrent ? 'var(--accent)' : 'var(--text-on-light3)', fontFamily: 'Outfit, sans-serif' }}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {step < 5 && (
          <div className="card-light p-4 mb-6 flex items-center gap-4" style={{ boxShadow: 'var(--shadow)' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--gold))' }}>
              {pandit.user?.firstName?.[0]}{pandit.user?.lastName?.[0]}
            </div>
            <div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, color: 'var(--text-on-light)', fontSize: '1rem' }}>
                {panditName}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-on-light2)', fontFamily: 'Outfit, sans-serif' }}>
                {pandit.city} · {pandit.experienceYears} yrs · {pandit.rating > 0 ? pandit.rating.toFixed(1) + '★' : 'New'}
              </p>
            </div>
            <div className="ml-auto text-right flex-shrink-0">
              <div style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem' }}>
                {preSelectedService ? preSelectedService : `₹${pandit.priceMin?.toLocaleString()} - ₹${pandit.priceMax?.toLocaleString()}`}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-on-light3)', fontFamily: 'Outfit, sans-serif' }}>
                {preSelectedPrice ? `₹${preSelectedPrice.toLocaleString()}` : 'per ceremony'}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg text-sm mb-4"
            style={{ background: 'var(--red-s)', color: 'var(--red)', border: '1px solid rgba(184,50,50,0.2)', borderRadius: 'var(--r-sm)', fontFamily: 'Outfit, sans-serif' }}>
            {error}
          </div>
        )}

        {/* ─── STEP 1: CEREMONY ─── */}
        {step === 1 && !preSelectedService && (
          <div className="card-light p-6" style={{ boxShadow: 'var(--shadow)' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.35rem', color: 'var(--text-on-light)', marginBottom: 4 }}>
              Select Ceremony
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-on-light2)', marginBottom: 20, fontFamily: 'Outfit, sans-serif' }}>
              Choose the puja or ceremony you need
            </p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {services.map((s: any) => (
                <label key={s.id} className="flex items-center gap-4 p-4 cursor-pointer transition-all"
                  style={{
                    border: `2px solid ${selectedService === s.id ? 'var(--accent)' : 'var(--card-border)'}`,
                    background: selectedService === s.id ? 'var(--accent-bg)' : 'transparent',
                    borderRadius: 'var(--r-sm)',
                  }}>
                  <input type="radio" name="service" value={s.id} checked={selectedService === s.id}
                    onChange={() => setSelectedService(s.id)} style={{ accentColor: 'var(--accent)' }} />
                  <div className="flex-1">
                    <div style={{ fontWeight: 600, color: 'var(--text-on-light)', fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem' }}>{s.name}</div>
                    {s.nameHindi && <div style={{ fontSize: '0.75rem', color: 'var(--text-on-light3)', fontFamily: 'Outfit, sans-serif' }}>{s.nameHindi}</div>}
                  </div>
                  <span className="badge" style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>
                    {s.category}
                  </span>
                </label>
              ))}
            </div>
            <button onClick={() => selectedService && setStep(1.5)} disabled={!selectedService}
              className="btn-primary btn-shimmer w-full mt-6">
              Continue →
            </button>
          </div>
        )}

        {/* ─── STEP 1.5: SAMAGRI ─── */}
        {step === 1.5 && (
          <div className="card-light p-6" style={{ boxShadow: 'var(--shadow)' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.35rem', color: 'var(--text-on-light)', marginBottom: 4 }}>
              Samagri Kit
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-on-light2)', marginBottom: 20, fontFamily: 'Outfit, sans-serif' }}>
              Would you like us to arrange the puja items?
            </p>

            {wantsSamagri === null && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div onClick={() => setWantsSamagri(false)}
                  className="p-5 text-center cursor-pointer transition-all hover:opacity-90"
                  style={{ border: '2px solid var(--card-border)', background: 'var(--accent-bg)', borderRadius: 'var(--r)' }}>
                  <div className="text-4xl mb-3">🙏</div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 4, color: 'var(--text-on-light)', fontFamily: 'Outfit, sans-serif' }}>Pandit Only</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-on-light2)', fontFamily: 'Outfit, sans-serif' }}>I'll arrange samagri myself</div>
                </div>
                <div onClick={() => { setWantsSamagri(true); fetchSamagri(preSelectedService || selectedServiceData?.name || '') }}
                  className="p-5 text-center cursor-pointer transition-all hover:opacity-90 relative"
                  style={{ border: '2px solid var(--accent)', background: 'var(--accent-bg)', borderRadius: 'var(--r)' }}>
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-1 rounded-full text-white"
                    style={{ background: 'var(--accent)', fontFamily: 'Outfit, sans-serif' }}>
                    RECOMMENDED
                  </div>
                  <div className="text-4xl mb-3">🛒</div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 4, color: 'var(--text-on-light)', fontFamily: 'Outfit, sans-serif' }}>Pandit + Samagri</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-on-light2)', fontFamily: 'Outfit, sans-serif' }}>We deliver everything to you</div>
                  <div className="mt-2 text-xs font-bold px-2 py-1 rounded-full"
                    style={{ background: 'var(--green-s)', color: 'var(--green)', fontFamily: 'Outfit, sans-serif' }}>
                    🎁 Free delivery + 5% off
                  </div>
                </div>
              </div>
            )}

            {wantsSamagri === true && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-on-light)', fontFamily: 'Outfit, sans-serif' }}>
                    AI-Generated Samagri List
                  </span>
                  <button onClick={() => setWantsSamagri(null)}
                    style={{ fontSize: '0.75rem', color: 'var(--text-on-light2)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                    Change
                  </button>
                </div>
                <div className="p-3 rounded-lg mb-4 text-xs font-semibold"
                  style={{ background: 'var(--green-s)', color: 'var(--green)', borderRadius: 'var(--r-sm)', fontFamily: 'Outfit, sans-serif' }}>
                  🎁 Free delivery + 5% off pandit fee applied!
                </div>
                {samagriLoading && (
                  <div className="text-center py-8" style={{ color: 'var(--text-on-light2)', fontFamily: 'Outfit, sans-serif' }}>
                    <div className="text-2xl mb-2">🕉️</div>
                    <div className="text-sm">AI is generating your samagri list...</div>
                  </div>
                )}
                {samagriError && (
                  <div className="text-sm p-3 mb-3"
                    style={{ background: 'var(--red-s)', color: 'var(--red)', borderRadius: 'var(--r-sm)', fontFamily: 'Outfit, sans-serif' }}>
                    {samagriError}
                  </div>
                )}
                {!samagriLoading && samagriItems.length > 0 && (
                  <div className="space-y-2 max-h-72 overflow-y-auto mb-4">
                    {samagriItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 transition-all"
                        style={{
                          border: `1.5px solid ${item.selected ? 'var(--accent-border)' : 'var(--card-border)'}`,
                          background: item.selected ? 'var(--accent-bg)' : 'transparent',
                          borderRadius: 'var(--r-sm)',
                          opacity: item.selected ? 1 : 0.5,
                        }}>
                        <input type="checkbox" checked={item.selected} style={{ accentColor: 'var(--accent)' }}
                          onChange={() => setSamagriItems(prev => prev.map((it, idx) => idx === i ? { ...it, selected: !it.selected } : it))} />
                        <div className="flex-1">
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-on-light)', fontFamily: 'Outfit, sans-serif' }}>{item.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-on-light3)', fontFamily: 'Outfit, sans-serif' }}>{item.nameHindi} · {item.quantity} {item.unit}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setSamagriItems(prev => prev.map((it, idx) => idx === i ? { ...it, qty: Math.max(1, it.qty - 1) } : it))}
                            className="w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center"
                            style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: 'none', cursor: 'pointer' }}>−</button>
                          <span style={{ fontSize: '0.875rem', fontWeight: 700, width: 20, textAlign: 'center', color: 'var(--text-on-light)', fontFamily: 'Outfit, sans-serif' }}>{item.qty}</span>
                          <button onClick={() => setSamagriItems(prev => prev.map((it, idx) => idx === i ? { ...it, qty: it.qty + 1 } : it))}
                            className="w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center"
                            style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: 'none', cursor: 'pointer' }}>+</button>
                        </div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent)', fontFamily: 'Cormorant Garamond, serif' }}>
                          ₹{(item.estimatedPrice * item.qty).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {!samagriLoading && samagriItems.length > 0 && (
                  <div className="p-3 flex justify-between items-center"
                    style={{ background: 'var(--accent-bg)', borderRadius: 'var(--r-sm)', border: '1px solid var(--accent-border)' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-on-light)', fontFamily: 'Outfit, sans-serif' }}>Samagri Total</span>
                    <span className="price-serif" style={{ fontSize: '1rem' }}>₹{samagriTotal.toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}

            {wantsSamagri === false && (
              <div>
                <div className="p-4 text-center mb-4"
                  style={{ background: 'var(--accent-bg)', border: '1.5px solid var(--accent-border)', borderRadius: 'var(--r)' }}>
                  <div className="text-2xl mb-1">🙏</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-on-light)', fontFamily: 'Outfit, sans-serif' }}>Pandit Only selected</div>
                  <div style={{ fontSize: '0.75rem', marginTop: 4, color: 'var(--text-on-light2)', fontFamily: 'Outfit, sans-serif' }}>You'll arrange samagri yourself</div>
                </div>
                <button onClick={() => setWantsSamagri(null)}
                  className="w-full text-sm py-2"
                  style={{ border: '1px solid var(--card-border)', color: 'var(--text-on-light2)', background: 'transparent', borderRadius: 'var(--r-sm)', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                  ← Change selection
                </button>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(preSelectedService ? 1.5 : 1)} className="btn-outline flex-1">← Back</button>
              <button onClick={() => wantsSamagri !== null && setStep(2)} disabled={wantsSamagri === null}
                className="btn-primary flex-1">
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 2: DATE & CHOGHADIYA ─── */}
        {step === 2 && (
          <div className="card-light p-6" style={{ boxShadow: 'var(--shadow)' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.35rem', color: 'var(--text-on-light)', marginBottom: 4 }}>
              Select Date &amp; Muhurat
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-on-light2)', marginBottom: 20, fontFamily: 'Outfit, sans-serif' }}>
              Pick a date and we&apos;ll show auspicious timings
            </p>
            <div className="mb-6">
              <label className="label-field block mb-1.5">Ceremony Date</label>
              <input type="date" value={selectedDate} min={today} onChange={e => setSelectedDate(e.target.value)}
                className="w-full" style={{ padding: '11px 16px' }} />
            </div>
            {selectedDate && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🕉️</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-on-light)', fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem' }}>Din ka Choghadiya</span>
                  <span className="ml-auto badge"
                    style={{ background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>
                    {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {dayPeriods.map((c, i) => (
                    <label key={i} className="flex items-center gap-3 p-3 cursor-pointer transition-all"
                      style={{
                        border: `2px solid ${selectedTime === c.startTime ? 'var(--accent)' : c.type === 'bad' ? 'rgba(184,50,50,0.12)' : 'var(--card-border)'}`,
                        background: selectedTime === c.startTime ? 'var(--accent-bg)' : c.type === 'bad' ? 'rgba(184,50,50,0.03)' : 'transparent',
                        borderRadius: 'var(--r-sm)',
                        opacity: c.type === 'bad' ? 0.5 : 1,
                      }}>
                      <input type="radio" name="time" value={c.startTime} checked={selectedTime === c.startTime}
                        onChange={() => { setSelectedTime(c.startTime); setSelectedChoghadiya(c.name) }}
                        style={{ accentColor: 'var(--accent)' }} />
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                      <span style={{ fontWeight: 600, fontSize: '0.875rem', flex: 1, color: 'var(--text-on-light)', fontFamily: 'Outfit, sans-serif' }}>
                        {c.startTime} — {c.endTime}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: c.color, fontFamily: 'Outfit, sans-serif' }}>{c.name}</span>
                      {(c.type === 'best' || c.type === 'good') && (
                        <span className="badge" style={{ background: 'var(--green-s)', color: 'var(--green)', fontSize: '0.65rem' }}>
                          {c.type === 'best' ? 'BEST' : 'GOOD'}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
                {goodPeriods.length > 0 && !selectedTime && (
                  <div className="mt-3 p-3 text-sm"
                    style={{ background: 'var(--green-s)', color: 'var(--green)', borderRadius: 'var(--r-sm)', border: '1px solid rgba(46,125,82,0.2)', fontFamily: 'Outfit, sans-serif' }}>
                    💡 <strong>Suggestion:</strong> {goodPeriods[0].name} ({goodPeriods[0].startTime}) is the most auspicious time.
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(1.5)} className="btn-outline flex-1">← Back</button>
              <button onClick={() => selectedDate && selectedTime && setStep(3)} disabled={!selectedDate || !selectedTime}
                className="btn-primary flex-1">
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: ADDRESS ─── */}
        {step === 3 && (
          <div className="card-light p-6" style={{ boxShadow: 'var(--shadow)' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.35rem', color: 'var(--text-on-light)', marginBottom: 4 }}>
              Ceremony Location
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-on-light2)', marginBottom: 20, fontFamily: 'Outfit, sans-serif' }}>
              Where should the pandit come?
            </p>
            <div className="space-y-4">
              <div>
                <label className="label-field block mb-1.5">Address *</label>
                <AddressInput value={address} onChange={setAddress} onAddressSelect={handleAddressSelect} placeholder="Start typing your address..." />
                <p style={{ fontSize: '0.75rem', marginTop: 6, color: 'var(--text-on-light3)', fontFamily: 'Outfit, sans-serif' }}>
                  📍 Google will suggest addresses as you type
                </p>
              </div>
              {(addressCity || addressState || addressPincode) && (
                <div className="p-3"
                  style={{ background: 'var(--green-s)', borderRadius: 'var(--r-sm)', border: '1px solid rgba(46,125,82,0.2)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 8, color: 'var(--green)', fontFamily: 'Outfit, sans-serif' }}>✓ Auto-filled from Google</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {addressCity && <div><span style={{ color: 'var(--text-on-light2)' }}>City:</span> <strong style={{ color: 'var(--text-on-light)' }}>{addressCity}</strong></div>}
                    {addressState && <div><span style={{ color: 'var(--text-on-light2)' }}>State:</span> <strong style={{ color: 'var(--text-on-light)' }}>{addressState}</strong></div>}
                    {addressPincode && <div><span style={{ color: 'var(--text-on-light2)' }}>Pin:</span> <strong style={{ color: 'var(--text-on-light)' }}>{addressPincode}</strong></div>}
                  </div>
                </div>
              )}
              <div>
                <label className="label-field block mb-1.5">Special Instructions (optional)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Any special requirements for the pandit..." rows={3}
                  className="w-full" style={{ padding: '11px 16px', resize: 'none' }} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(2)} className="btn-outline flex-1">← Back</button>
              <button onClick={() => address && setStep(4)} disabled={!address}
                className="btn-primary flex-1">
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 4: CONFIRM ─── */}
        {step === 4 && (
          <div className="card-light p-6" style={{ boxShadow: 'var(--shadow)' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.35rem', color: 'var(--text-on-light)', marginBottom: 4 }}>
              Review &amp; Confirm
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-on-light2)', marginBottom: 20, fontFamily: 'Outfit, sans-serif' }}>
              Everything looks good? Pay to confirm your booking.
            </p>

            {/* Booking Summary */}
            <div className="p-4 mb-5"
              style={{ background: 'var(--accent-bg)', borderRadius: 'var(--r-sm)', border: '1px solid var(--accent-border)' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-on-light)', fontFamily: 'Outfit, sans-serif' }}>
                Booking Summary
              </h4>
              <div className="space-y-2 text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {[
                  ['Ceremony', selectedServiceData?.name || preSelectedService],
                  ['Pandit', panditName],
                  ['Date', new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })],
                  ['Time', selectedTime],
                  ['Muhurat', selectedChoghadiya],
                  ['Location', address],
                  ...(addressCity ? [['City', addressCity]] : []),
                  ...(wantsSamagri ? [['Samagri', '✓ Included (free delivery)']] : []),
                ].map(([label, value], i) => (
                  <div key={i} className="flex justify-between">
                    <span style={{ color: 'var(--text-on-light2)' }}>{label}</span>
                    <span style={{
                      fontWeight: 600,
                      textAlign: 'right',
                      maxWidth: 200,
                      color: label === 'Muhurat' ? CHOGHADIYA_INFO[selectedChoghadiya]?.color : label === 'Samagri' ? 'var(--green)' : 'var(--text-on-light)',
                    }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 mb-5"
              style={{ background: 'transparent', border: '2px solid var(--accent-border)', borderRadius: 'var(--r-sm)' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-on-light)', fontFamily: 'Outfit, sans-serif' }}>
                💰 Price Breakdown
              </h4>
              <div className="space-y-2 text-sm mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-on-light2)' }}>Pandit Fee</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-on-light)' }}>₹{agreedPrice.toLocaleString()}</span>
                </div>
                {wantsSamagri && (
                  <>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-on-light2)' }}>Samagri Kit</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-on-light)' }}>₹{samagriTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--green)' }}>5% Discount on Pandit Fee</span>
                      <span style={{ fontWeight: 600, color: 'var(--green)' }}>- ₹{discount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--green)' }}>Delivery</span>
                      <span style={{ fontWeight: 600, color: 'var(--green)' }}>FREE</span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-3">
                <div className="flex-1 p-3 text-center cursor-pointer transition-all hover:opacity-80"
                  style={{
                    background: negotiating ? 'var(--accent-bg)' : 'transparent',
                    border: `1.5px solid ${negotiating ? 'var(--accent)' : 'var(--accent-border)'}`,
                    borderRadius: 'var(--r-sm)',
                  }}
                  onClick={() => setNegotiating(!negotiating)}>
                  <div className="text-xl mb-1">💬</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', fontFamily: 'Outfit, sans-serif' }}>Negotiate</div>
                  <div style={{ fontSize: '0.7rem', marginTop: 2, color: 'var(--text-on-light3)', fontFamily: 'Outfit, sans-serif' }}>Enter your offer</div>
                </div>
                <a href={`tel:${pandit.user?.phone || ''}`}
                  className="flex-1 p-3 text-center transition-all hover:opacity-80 no-underline"
                  style={{ background: 'var(--green-s)', border: '1.5px solid rgba(46,125,82,0.25)', borderRadius: 'var(--r-sm)' }}>
                  <div className="text-xl mb-1">📞</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--green)', fontFamily: 'Outfit, sans-serif' }}>Call Pandit</div>
                  <div style={{ fontSize: '0.7rem', marginTop: 2, color: 'var(--text-on-light3)', fontFamily: 'Outfit, sans-serif' }}>Discuss directly</div>
                </a>
              </div>
              {negotiating && (
                <div className="flex items-center gap-2 p-3 mt-3"
                  style={{ background: 'var(--input-bg)', border: '1.5px solid var(--accent)', borderRadius: 'var(--r-sm)' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-on-light)', fontFamily: 'Outfit, sans-serif' }}>Your offer: ₹</span>
                  <input type="number" autoFocus
                    defaultValue={agreedPrice}
                    placeholder={`${pandit.priceMin} - ${pandit.priceMax}`}
                    onChange={e => setAgreedPrice(parseInt(e.target.value) || 0)}
                    className="flex-1 bg-transparent text-lg font-bold text-center outline-none"
                    style={{ color: 'var(--accent)', fontFamily: 'Cormorant Garamond, serif', border: 'none', background: 'transparent' }} />
                  <button onClick={() => setNegotiating(false)}
                    className="btn-primary"
                    style={{ padding: '6px 14px', fontSize: '0.78rem' }}>Done</button>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center p-4 mb-5"
              style={{ background: 'var(--card-dark)', borderRadius: 'var(--r-sm)' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-on-dark)', fontFamily: 'Outfit, sans-serif' }}>Total Payable</span>
              <div className="text-right">
                {wantsSamagri && (
                  <div style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: 'var(--text-on-dark3)', fontFamily: 'Outfit, sans-serif' }}>
                    ₹{(agreedPrice + samagriTotal).toLocaleString()}
                  </div>
                )}
                <div className="price-serif" style={{ fontSize: '1.6rem' }}>
                  ₹{(agreedPrice - discount + (wantsSamagri ? samagriTotal : 0)).toLocaleString()}
                </div>
                {wantsSamagri && (
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-on-dark2)', fontFamily: 'Outfit, sans-serif' }}>
                    You save ₹{discount.toLocaleString()}!
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="btn-outline flex-1">← Back</button>
              <button onClick={handlePayment} disabled={!agreedPrice || paymentLoading}
                className="btn-primary btn-shimmer flex-1">
                {paymentLoading ? 'Processing...' : '💳 Pay & Confirm'}
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 5: CONFIRMATION ─── */}
        {step === 5 && (
          <div className="card-light p-8 text-center" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <div className="text-5xl mb-4">🎉</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, fontSize: '1.7rem', color: 'var(--text-on-light)', marginBottom: 8 }}>
              Booking Confirmed!
            </h2>
            <p style={{ fontSize: '0.875rem', marginBottom: 24, color: 'var(--text-on-light2)', fontFamily: 'Outfit, sans-serif' }}>
              {wantsSamagri ? 'Your ceremony is booked and samagri will be delivered before the ceremony.' : 'Your ceremony has been booked. The pandit will be notified.'}
            </p>
            <div className="p-4 mb-6 text-left"
              style={{ background: 'var(--accent-bg)', border: '1px solid var(--accent-border)', borderRadius: 'var(--r-sm)' }}>
              <div className="space-y-2 text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {[
                  ['Ceremony', selectedServiceData?.name || preSelectedService],
                  ['Pandit', panditName],
                  ['Date', new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })],
                  ['Time', selectedTime],
                  ['Muhurat', selectedChoghadiya],
                  ['Address', address],
                  ...(wantsSamagri ? [['Samagri', '✓ Will be delivered']] : []),
                  ['Amount Paid', `₹${(agreedPrice - discount + (wantsSamagri ? samagriTotal : 0)).toLocaleString()}`],
                ].map(([label, value], i, arr) => (
                  <div key={i} className="flex justify-between">
                    <span style={{ color: 'var(--text-on-light2)' }}>{label}</span>
                    <span style={{
                      fontWeight: 600,
                      color: i === arr.length - 1 ? 'var(--accent)' : label === 'Samagri' ? 'var(--green)' : 'var(--text-on-light)',
                    }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => router.push('/dashboard')} className="btn-primary btn-shimmer flex-1">
                View My Bookings
              </button>
              <button onClick={() => router.push('/')} className="btn-outline flex-1">
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<SacredLoader message="Loading..." size="lg" />}>
      <BookingContent />
    </Suspense>
  )
}
