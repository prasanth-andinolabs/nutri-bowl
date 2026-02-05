import { CalendarDays, Phone } from 'lucide-react';

export function SubscriptionsPage() {
  return (
    <main className="bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-3">
            <CalendarDays className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold">Fruit Bowl Subscriptions</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Simple daily or weekly plans for healthy mornings. COD only, within 5 km of Rajam city.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-700 mb-8">
            <div className="border border-green-100 rounded-2xl px-4 py-3 bg-green-50/40">
              Fresh bowls, daily
            </div>
            <div className="border border-green-100 rounded-2xl px-4 py-3 bg-green-50/40">
              Pause or skip anytime
            </div>
            <div className="border border-green-100 rounded-2xl px-4 py-3 bg-green-50/40">
              Manual confirmation
            </div>
          </div>
          <a
            href="tel:+919390574240"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-full font-semibold hover:bg-green-700 transition"
          >
            <Phone className="w-4 h-4" />
            Call to Subscribe
          </a>
        </div>
      </div>
    </main>
  );
}
