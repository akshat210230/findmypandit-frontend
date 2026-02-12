import Link from 'next/link'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Find My Pandit 🙏
          </h1>
          <p className="text-xl mb-8 text-orange-100">
            Book verified pandits for weddings, pujas, and religious ceremonies
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/search"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-orange-50 transition shadow-lg"
            >
              Find a Pandit
            </Link>
            <Link
              href="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:text-orange-600 transition"
            >
              Register as Pandit
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">1. Search</h3>
            <p className="text-gray-600">
              Browse verified pandits by city, ceremony type, language, and budget
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-bold mb-2">2. Book</h3>
            <p className="text-gray-600">
              Choose your date, time, and share ceremony details with your pandit
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="text-xl font-bold mb-2">3. Review</h3>
            <p className="text-gray-600">
              After the ceremony, leave a review to help other families
            </p>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Popular Ceremonies
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Wedding Ceremony', emoji: '💍', hindi: 'विवाह संस्कार' },
              { name: 'Griha Pravesh', emoji: '🏠', hindi: 'गृह प्रवेश' },
              { name: 'Satyanarayan Katha', emoji: '🙏', hindi: 'सत्यनारायण कथा' },
              { name: 'Mundan Ceremony', emoji: '👶', hindi: 'मुंडन संस्कार' },
              { name: 'Ganesh Puja', emoji: '🐘', hindi: 'गणेश पूजा' },
              { name: 'Lakshmi Puja', emoji: '✨', hindi: 'लक्ष्मी पूजा' },
              { name: 'Engagement', emoji: '💑', hindi: 'सगाई' },
              { name: 'Diwali Puja', emoji: '🪔', hindi: 'दिवाली पूजा' },
            ].map((s) => (
              <Link
                key={s.name}
                href={`/search?service=${encodeURIComponent(s.name)}`}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center"
              >
                <div className="text-4xl mb-2">{s.emoji}</div>
                <h3 className="font-bold text-gray-800">{s.name}</h3>
                <p className="text-sm text-orange-600">{s.hindi}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Are You a Pandit?</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Join our platform and connect with families looking for your services
        </p>
        <Link
          href="/register"
          className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-orange-700 transition shadow-lg"
        >
          Register Now — It&apos;s Free
        </Link>
      </section>
    </div>
  )
}