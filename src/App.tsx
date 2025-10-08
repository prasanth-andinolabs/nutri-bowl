import { ShoppingCart, Leaf, Heart, Activity, Baby, Instagram, Phone, MessageCircle } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-green-600">Nutri Bowl</h1>
              <p className="text-xs text-gray-600">Fresh & Healthy</p>
            </div>
          </div>
          <a href="https://wa.me/9390574240?text=I'd%20like%20to%20order%20a%20Nutri%20Bowl%20subscription.%20Please%20send%20me%20details." target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Order Now
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                Stay Fit, Stay Healthy...
              </h2>
              <p className="text-2xl text-green-600 mb-6">
                Choose Nutri Bowl
              </p>
              <p className="text-xl text-gray-700 mb-8 font-medium">
                A Perfect Place For Healthy Breakfast
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Fresh fruit, vibrant vegetables, and power-packed sprouts—delivered straight to your doorstep.
                Handcrafted nutrition for busy, health-conscious individuals who refuse to compromise on wellness.
              </p>
              <div className="flex gap-4">
                <a href="https://wa.me/9390574240?text=I'd%20like%20to%20order%20a%20Nutri%20Bowl%20subscription.%20Please%20send%20me%20details." target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition shadow-lg hover:shadow-xl">
                  Order Now
                </a>
                <a href="https://wa.me/9390574240?text=I'd%20like%20to%20see%20the%20Nutri%20Bowl%20menu.%20Please%20share%20details." target="_blank" rel="noopener noreferrer" className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-50 transition">
                  View Menu
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Fresh fruit and vegetable bowl"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border-4 border-green-100">
                <p className="text-sm text-gray-600 mb-1">Fresh Delivery</p>
                <p className="text-2xl font-bold text-green-600">Every Morning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Packages</h2>
            <p className="text-xl text-gray-600">Choose the perfect plan for your health journey</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Basic Package */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition border-2 border-green-100 flex flex-col">
              <div className="flex justify-between items-start mb-6 min-h-[72px]">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic Package</h3>
                  <p className="text-gray-600">Essential daily nutrition</p>
                </div>
                <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Popular
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-green-600">₹1999</span>
                  <span className="text-2xl text-gray-400 line-through">₹2199</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">per month</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  </div>
                  <span className="text-gray-700">Fresh seasonal fruits daily</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  </div>
                  <span className="text-gray-700">Carrot, beetroot & cucumber</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  </div>
                  <span className="text-gray-700">Protein-rich sprouts</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  </div>
                  <span className="text-gray-700">Door delivery before 7 AM</span>
                </li>
              </ul>

              <a href="https://wa.me/9390574240?text=I'm%20interested%20in%20the%20Basic%20Package.%20Tell%20me%20more%20about%20the%20packages." target="_blank" rel="noopener noreferrer" className="w-full bg-green-600 text-white py-4 rounded-full font-semibold hover:bg-green-700 transition block text-center">
                Subscribe Now
              </a>
            </div>

            {/* Premium Package */}
            <div className="bg-gradient-to-br from-amber-50 via-green-50 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition border-4 border-green-200 relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 bg-green-600 text-white px-6 py-2 rounded-bl-3xl font-bold">
                BEST VALUE
              </div>

              <div className="flex justify-between items-start mb-6 mt-4 min-h-[72px]">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Package</h3>
                  <p className="text-gray-600">Includes exotic fruits</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-green-600">₹2399</span>
                  <span className="text-2xl text-gray-400 line-through">₹2999</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">per month</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  </div>
                  <span className="text-gray-700 font-semibold">Everything in Basic +</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                  </div>
                  <span className="text-gray-700 font-medium">Exotic Kiwi & Strawberry</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                  </div>
                  <span className="text-gray-700 font-medium">Dragon Fruit</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  </div>
                  <span className="text-gray-700">Premium packaging</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                  </div>
                  <span className="text-gray-700">Priority delivery</span>
                </li>
              </ul>

              <a href="https://wa.me/9390574240?text=I'm%20interested%20in%20the%20Premium%20Package.%20Tell%20me%20more%20about%20the%20packages." target="_blank" rel="noopener noreferrer" className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-full font-semibold hover:from-green-700 hover:to-green-800 transition shadow-lg block text-center">
                Subscribe Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Special Packages */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Specialized Packages</h2>
            <p className="text-xl text-gray-600">Nutrition tailored to your unique needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pregnant Women */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Baby className="w-10 h-10 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Pregnancy Care</h3>
              <p className="text-gray-600 mb-6">
                Nutrient-rich bowls designed for expecting mothers with folate, iron, and essential vitamins
              </p>
              <a href="https://wa.me/9390574240?text=I'm%20interested%20in%20the%20Pregnancy%20Care%20package.%20Please%20send%20me%20details." target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold hover:text-green-700 transition">
                Learn More →
              </a>
            </div>

            {/* Diabetic */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Diabetic Friendly</h3>
              <p className="text-gray-600 mb-6">
                Low-GI fruits and vegetables carefully selected to help manage blood sugar levels naturally
              </p>
              <a href="https://wa.me/9390574240?text=I'm%20interested%20in%20the%20Diabetic%20Friendly%20package.%20Please%20send%20me%20details." target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold hover:text-green-700 transition">
                Learn More →
              </a>
            </div>

            {/* Gym Enthusiasts */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Gym Performance</h3>
              <p className="text-gray-600 mb-6">
                High-protein sprouts and energy-boosting fruits to fuel your workouts and recovery
              </p>
              <a href="https://wa.me/9390574240?text=I'm%20interested%20in%20the%20Gym%20Performance%20package.%20Please%20send%20me%20details." target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold hover:text-green-700 transition">
                Learn More →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Catering Service */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-12 md:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              }}></div>
            </div>

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Nutri Bowl Catering</h2>
              <p className="text-xl md:text-2xl mb-8 text-green-50">
                We take bulk orders for Fruit Bowls & Ice Creams for Marriages and Functions
              </p>
              <p className="text-lg mb-8 text-green-100">
                Make your special occasions healthier and more memorable with our premium catering service.
                Perfect for weddings, corporate events, and celebrations of all sizes.
              </p>
              <a href="https://wa.me/9390574240?text=I%20need%20a%20catering%20quote%20for%20a%20marriage/function.%20Please%20contact%20me." target="_blank" rel="noopener noreferrer" className="bg-white text-green-600 px-10 py-4 rounded-full text-lg font-bold hover:bg-green-50 transition shadow-lg inline-flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Get a Quote
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="text-2xl font-bold text-white">Nutri Bowl</h3>
                  <p className="text-sm text-gray-400">Fresh & Healthy</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Delivering fresh, nutritious breakfast bowls to your doorstep every morning.
                Your health, our priority.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <div className="space-y-3">
                <a href="tel:+919642338692" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
                  <Phone className="w-5 h-5 text-green-500" />
                  <span>+91 96423 38692</span>
                </a>
                <a href="https://wa.me/919390574240" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  <span>+91 93905 74240 (WhatsApp)</span>
                </a>
                <a href="https://instagram.com/nutribowl_rajam" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white transition">
                  <Instagram className="w-5 h-5 text-green-500" />
                  <span>@nutribowl_rajam</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#packages" className="text-gray-400 hover:text-white transition">Our Packages</a></li>
                <li><a href="#special" className="text-gray-400 hover:text-white transition">Specialized Plans</a></li>
                <li><a href="#catering" className="text-gray-400 hover:text-white transition">Catering Services</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 Nutri Bowl. All rights reserved. | Stay Fit, Stay Healthy
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
