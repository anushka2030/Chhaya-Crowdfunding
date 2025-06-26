import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle, MessageCircle, Phone, Mail } from 'lucide-react';

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqData = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I start a fundraising campaign?',
      answer: 'Starting a campaign is simple. Click on "Start Fundraising" button, fill in your campaign details, upload photos, set your funding goal, and publish. Our team will review and approve your campaign within 24 hours.'
    },
    {
      id: 2,
      category: 'payments',
      question: 'What are the payment gateway fees?',
      answer: 'We charge a 7% payment gateway fee on all donations received. This covers the cost of secure payment processing, fraud protection, and transaction handling. Platform fees may apply depending on your campaign type.'
    },
    {
      id: 3,
      category: 'payments',
      question: 'How do I receive the funds raised?',
      answer: 'Funds are transferred to your registered bank account after successful verification. For medical campaigns, funds are released directly to the hospital. Regular campaigns receive funds within 7-10 business days after campaign completion.'
    },
    {
      id: 4,
      category: 'getting-started',
      question: 'What documents do I need to verify my campaign?',
      answer: 'You need to provide: Valid government ID (Aadhaar/PAN), bank account details, campaign-related documents (medical reports for health campaigns, registration for NGOs), and proof of address.'
    },
    {
      id: 5,
      category: 'campaigns',
      question: 'Can I edit my campaign after publishing?',
      answer: 'Yes, you can edit your campaign description, add updates, and upload new photos. However, the funding goal and beneficiary details cannot be changed once the campaign is live and has received donations.'
    },
    {
      id: 6,
      category: 'campaigns',
      question: 'How long can my campaign run?',
      answer: 'Campaigns can run for up to 365 days. You can close your campaign early if you reach your goal, or extend it if needed. Medical emergency campaigns can be extended beyond the standard duration with proper justification.'
    },
    {
      id: 7,
      category: 'donations',
      question: 'Is there a minimum donation amount?',
      answer: 'The minimum donation amount is ₹10. There is no maximum limit for donations. All donations are secure and processed through encrypted payment gateways.'
    },
    {
      id: 8,
      category: 'donations',
      question: 'Can I donate anonymously?',
      answer: 'Yes, you can choose to donate anonymously. Your name will not be displayed on the campaign page, but for tax and legal purposes, your details will be recorded in our system.'
    },
    {
      id: 9,
      category: 'tax',
      question: 'Are donations tax-deductible?',
      answer: 'Donations to registered NGOs and charitable organizations are eligible for tax deduction under Section 80G. You will receive a tax receipt for eligible donations. Personal campaigns are not eligible for tax benefits.'
    },
    // {
    //   id: 10,
    //   category: 'tax',
    //   question: 'How do I get my tax receipt?',
    //   answer: 'Tax receipts are automatically generated for eligible donations and sent to your registered email address within 48 hours. You can also download them from your donor dashboard.'
    // },
    {
      id: 11,
      category: 'support',
      question: 'How can I promote my campaign?',
      answer: 'Share your campaign on social media, send personal messages to friends and family, create compelling updates, use relevant hashtags, and engage with your donor community. Our team also provides promotional tips and guidelines.'
    },
    {
      id: 12,
      category: 'support',
      question: 'What if my campaign doesn\'t reach its goal?',
      answer: 'You keep all the funds raised, even if you don\'t reach your goal. Every contribution helps. You can also extend your campaign duration or adjust your strategy based on our recommendations.'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Topics', icon: HelpCircle },
    { id: 'getting-started', name: 'Getting Started', icon: MessageCircle },
    { id: 'payments', name: 'Payments & Fees', icon: Phone },
    { id: 'campaigns', name: 'Campaign Management', icon: HelpCircle },
    { id: 'donations', name: 'Donations', icon: Mail },
    // { id: 'tax', name: 'Tax & Receipts', icon: MessageCircle },
    { id: 'support', name: 'Support & Tips', icon: Phone }
  ];

  const filteredFAQs = useMemo(() => {
    return faqData.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? 
        <span key={index} className="bg-yellow-200 px-1 rounded">{part}</span> : 
        part
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-[#077A7D] to-[#06202B]">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <HelpCircle className="w-12 h-12 text-[#7AE2CF]" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-light text-white mb-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-white/80 font-light max-w-2xl mx-auto">
            Find answers to common questions about fundraising, payments, and platform features
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-[#7AE2CF]/20 sticky top-8">
              <h3 className="text-lg font-semibold text-[#06202B] mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-[#7AE2CF] text-[#06202B] font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      <span className="text-sm">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-[#7AE2CF]/20 mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#077A7D] w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-[#7AE2CF] focus:ring-4 focus:ring-[#7AE2CF]/10 outline-none transition-all duration-300"
                />
              </div>
              {searchQuery && (
                <p className="text-sm text-gray-600 mt-3">
                  Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              )}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFAQs.length === 0 ? (
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-[#7AE2CF]/20 text-center">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No results found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search terms or selecting a different category
                  </p>
                </div>
              ) : (
                filteredFAQs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-[#7AE2CF]/20 overflow-hidden transition-all duration-300 hover:shadow-2xl"
                  >
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50/50 transition-colors duration-200"
                    >
                      <span className="text-lg font-medium text-[#06202B] pr-4">
                        {highlightText(faq.question, searchQuery)}
                      </span>
                      {openItems.has(faq.id) ? (
                        <ChevronUp className="w-5 h-5 text-[#077A7D] flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#077A7D] flex-shrink-0" />
                      )}
                    </button>
                    
                    {openItems.has(faq.id) && (
                      <div className="px-6 pb-6 animate-in slide-in-from-top duration-300">
                        <div className="h-px bg-gradient-to-r from-[#7AE2CF] to-transparent mb-4"></div>
                        <p className="text-gray-700 leading-relaxed">
                          {highlightText(faq.answer, searchQuery)}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-[#7AE2CF] to-[#7AE2CF]/80 rounded-2xl p-8 mt-12 text-center">
              <h3 className="text-2xl font-semibold text-[#06202B] mb-4">
                Still have questions?
              </h3>
              <p className="text-[#06202B]/80 mb-6">
                Our support team is here to help you with any additional questions
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:chhaya.hope.rests.here@example.com">
  <button className="bg-[#06202B] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#06202B]/90 transition-colors flex items-center justify-center">
    <Mail className="w-4 h-4 mr-2" />
    Email Support
  </button>
</a>

                <a href="tel:+9569808702">
  <button className="bg-white text-[#06202B] px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center">
    <Phone className="w-4 h-4 mr-2" />
    Call Support
  </button>
</a>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;