import React from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Chhaya</h3>
            <p className="text-gray-300 mb-4">
              Empowering people to make a difference through transparent and fee-free crowdfunding.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer" />
              <Twitter className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer" />
              <Instagram className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer" />
              <Linkedin className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer" />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="/how-it-works" className="text-gray-300 hover:text-white">How It Works</a></li>
              <li><a href="/pricing" className="text-gray-300 hover:text-white">Pricing</a></li>
              <li><a href="/success-stories" className="text-gray-300 hover:text-white">Success Stories</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="/faqs" className="text-gray-300 hover:text-white">FAQs</a></li>
              <li><a href="/help" className="text-gray-300 hover:text-white">Help Center</a></li>
              <li><a href="/terms" className="text-gray-300 hover:text-white">Terms of Service</a></li>
              <li><a href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-300 mr-3" />
                <span className="text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-300 mr-3" />
                <span className="text-gray-300">support@chhaya.org</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-300 mr-3" />
                <span className="text-gray-300">Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">© 2025 Chhaya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;