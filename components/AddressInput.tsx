'use client'
import { useRef, useEffect, useState } from 'react'

interface AddressDetails {
  fullAddress: string
  city: string
  state: string
  pincode: string
  lat: number | null
  lng: number | null
}

interface AddressInputProps {
  value: string
  onChange: (val: string) => void
  onAddressSelect?: (details: AddressDetails) => void
  placeholder?: string
}

export default function AddressInput({ value, onChange, onAddressSelect, placeholder }: AddressInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const initAutocomplete = () => {
      if (typeof window === 'undefined' || !inputRef.current) return
      if (!(window as any).google?.maps?.places) return
      if (autocompleteRef.current) return // Already initialized

      autocompleteRef.current = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'in' },
        types: ['address'],
        fields: ['formatted_address', 'address_components', 'geometry'],
      })

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace()
        if (!place?.formatted_address) return

        // Extract address components
        const components = place.address_components || []
        let city = '', state = '', pincode = ''

        for (const comp of components) {
          const types = comp.types
          if (types.includes('locality')) city = comp.long_name
          if (types.includes('administrative_area_level_1')) state = comp.long_name
          if (types.includes('postal_code')) pincode = comp.long_name
        }

        const details: AddressDetails = {
          fullAddress: place.formatted_address,
          city: city,
          state: state,
          pincode: pincode,
          lat: place.geometry?.location?.lat() || null,
          lng: place.geometry?.location?.lng() || null,
        }

        onChange(place.formatted_address)
        if (onAddressSelect) onAddressSelect(details)
      })

      setIsLoaded(true)
    }

    // Try immediately
    initAutocomplete()

    // Also retry every 500ms for up to 10 seconds (Google script may load late)
    if (!autocompleteRef.current) {
      const timer = setInterval(() => {
        if ((window as any).google?.maps?.places) {
          initAutocomplete()
          clearInterval(timer)
        }
      }, 500)
      const timeout = setTimeout(() => clearInterval(timer), 10000)
      return () => { clearInterval(timer); clearTimeout(timeout) }
    }
  }, [onChange, onAddressSelect])

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'Start typing your address...'}
        className="w-full px-4 py-3 rounded-xl text-sm"
        style={{
          background: '#FFF5EC',
          border: '1.5px solid rgba(180,130,80,0.1)',
          color: '#2C1810',
        }}
      />
      {isLoaded && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B09980" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
      )}
    </div>
  )
}