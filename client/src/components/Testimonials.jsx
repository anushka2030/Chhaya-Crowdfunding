import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Campaign Creator",
      content: "Chhaya helped me raise ₹5 lakhs for my daughter's surgery. The platform is incredibly user-friendly and the support team was amazing.",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Donor",
      content: "I love that there are no platform fees. Every rupee I donate goes directly to help people in need. Chhaya is truly transparent.",
      rating: 5
    },
    {
      name: "Dr. Amit Kumar",
      role: "Medical Professional",
      content: "I've seen many of my patients successfully raise funds through Chhaya. It's a reliable platform that actually helps save lives.",
      rating: 5
    }
  ];

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What People Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;