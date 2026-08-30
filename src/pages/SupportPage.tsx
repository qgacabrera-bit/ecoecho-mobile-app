import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Wrench, 
  LifeBuoy, 
  Building2,
  Clock
} from 'lucide-react';
import { SupportTicket } from '../types';

export const SupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TKT-8942',
      farmerName: 'Mang Juan Bautista',
      contactNumber: '0917-555-0192',
      locationSector: 'Sector B-3 (Paddy Cluster 4)',
      issueCategory: 'BATTERY_SOLAR',
      urgency: 'NORMAL',
      description: 'Solar panel bracket requires angle tilt adjustment after typhoon season.',
      createdAt: 'Today, 10:15 AM',
      status: 'IN_PROGRESS'
    }
  ]);

  const [formData, setFormData] = useState({
    farmerName: '',
    contactNumber: '',
    locationSector: '',
    issueCategory: 'HARDWARE_REPAIR' as SupportTicket['issueCategory'],
    urgency: 'NORMAL' as SupportTicket['urgency'],
    description: '',
  });

  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.farmerName || !formData.contactNumber || !formData.description) return;

    const newTicket: SupportTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      ...formData,
      createdAt: 'Just now',
      status: 'PENDING'
    };

    setTickets(prev => [newTicket, ...prev]);
    setSubmittedId(newTicket.id);
    setFormData({
      farmerName: '',
      contactNumber: '',
      locationSector: '',
      issueCategory: 'HARDWARE_REPAIR',
      urgency: 'NORMAL',
      description: '',
    });

    setTimeout(() => setSubmittedId(null), 6000);
  };

  const faqs = [
    {
      question: "How do I know if the ESP32 is actively transmitting ultrasonic waves?",
      answer: "The Dashboard features a live 'Acoustic Sweep' indicator and real-time canvas waveform visualizer. When sweeping or jamming, the frequency will oscillate between 20.0 kHz and 45.0 kHz. You can also trigger an audible human-range test tone in Settings."
    },
    {
      question: "What is the optimal solar panel orientation for 5V charging?",
      answer: "Mount the solar panel facing true South at an angle of 15°–20° tilt. Clean dust and mud from the glass face bi-weekly to sustain the nominal 5.0V output."
    },
    {
      question: "How do I connect the app to a new ESP32 field device?",
      answer: "Navigate to the Settings tab in this app. Enter the local IP address assigned to your ESP32-CAM module (default is 192.168.4.1 when connected to the EcoEcho AP Wi-Fi) and tap 'Save Hardware Configuration'."
    },
    {
      question: "Will the acoustic frequency sweep harm our farm dogs or livestock?",
      answer: "EcoEcho's directional acoustic horns target the lower crop canopy (0.3m–1.2m above soil) where planthoppers congregate. While dogs can perceive lower ultrasonic tones, the focused directional projection and acoustic attenuation prevent disturbance outside the immediate paddy row."
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-6">
      
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-app-border shadow-sm space-y-1.5">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-black text-forest-950">Field Support & Co-op Dispatch</h2>
          <span className="bg-forest-100 text-forest-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
            24/7 Technician Desk
          </span>
        </div>
        <p className="text-xs text-forest-700/80">
          Request hardware maintenance, report field pest anomalies, or connect directly with your local LGU Agricultural Office.
        </p>
      </div>

      {/* 3 Contact Cards (Instructions.md Dummy Contact Details) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        
        {/* Card 1: Local LGU Agricultural Office Hotline */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-app-border shadow-sm flex items-start space-x-3.5 hover:border-forest-400 transition-colors">
          <div className="w-11 h-11 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="space-y-1 min-w-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest-700">
              LGU Agri Support Hotline
            </h3>
            <p className="text-sm font-black text-forest-950 truncate">(044) 940-RICE (7423)</p>
            <p className="text-[11px] text-forest-600 font-mono">Mobile: +63 917 832 6324</p>
            <div className="text-[10px] text-emerald-700 font-bold pt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Mon - Sat (7:00 AM - 6:00 PM)</span>
            </div>
          </div>
        </div>

        {/* Card 2: Farmers' Cooperative Field Dispatch */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-app-border shadow-sm flex items-start space-x-3.5 hover:border-emerald-400 transition-colors">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div className="space-y-1 min-w-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Co-op Field Technician
            </h3>
            <p className="text-sm font-black text-forest-950 truncate">+63 928 456 7890</p>
            <p className="text-[11px] text-forest-600 truncate">dispatch@ecoecho-agri.ph</p>
            <div className="text-[10px] text-forest-600 font-semibold pt-0.5">
              Rapid Sector Maintenance Dispatch
            </div>
          </div>
        </div>

        {/* Card 3: EcoEcho Engineering Tech Support */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-app-border shadow-sm flex items-start space-x-3.5 hover:border-solar-400 transition-colors">
          <div className="w-11 h-11 rounded-2xl bg-solar-100 text-solar-800 flex items-center justify-center shrink-0">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div className="space-y-1 min-w-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-solar-800">
              Hardware & AI Desk
            </h3>
            <p className="text-sm font-black text-forest-950 truncate">support@ecoecho.tech</p>
            <p className="text-[11px] text-forest-600 font-mono">Toll-Free: 1-800-ECO-ECHO</p>
            <div className="text-[10px] text-forest-600 font-semibold pt-0.5">
              Firmware & Cloud Sync Assistance
            </div>
          </div>
        </div>

      </div>

      {/* Main Support Form & Ticket Tracker Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left 7 Cols: Maintenance & Bug Report Form */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-app-border shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-black text-forest-950 flex items-center gap-2">
              <Send className="w-4 h-4 text-forest-700" />
              Submit Field Assistance Ticket
            </h3>
            <p className="text-xs text-forest-700/80 mt-0.5">
              Fill out this form to request on-site maintenance, lens cleaning, or report bug issues.
            </p>
          </div>

          {/* Success Banner */}
          {submittedId && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center space-x-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold">Ticket {submittedId} Submitted Successfully!</p>
                <p className="text-emerald-700 mt-0.5">
                  A local LGU field technician has been dispatched for verification.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  Farmer / Technician Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.farmerName}
                  onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                  placeholder="e.g. Juan Dela Cruz"
                  className="w-full px-3.5 py-2.5 bg-forest-50/60 border border-forest-200 rounded-xl text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  Contact Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="e.g. 0917-123-4567"
                  className="w-full px-3.5 py-2.5 bg-forest-50/60 border border-forest-200 rounded-xl text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  Field Sector
                </label>
                <input
                  type="text"
                  value={formData.locationSector}
                  onChange={(e) => setFormData({ ...formData, locationSector: e.target.value })}
                  placeholder="e.g. Sector A-2"
                  className="w-full px-3.5 py-2.5 bg-forest-50/60 border border-forest-200 rounded-xl text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white transition-all"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  Issue Category
                </label>
                <select
                  value={formData.issueCategory}
                  onChange={(e) => setFormData({ ...formData, issueCategory: e.target.value as SupportTicket['issueCategory'] })}
                  className="w-full px-3 py-2.5 bg-forest-50/60 border border-forest-200 rounded-xl text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white transition-all cursor-pointer font-medium"
                >
                  <option value="HARDWARE_REPAIR">Hardware Repair</option>
                  <option value="BATTERY_SOLAR">Battery & 5V Solar</option>
                  <option value="AI_CAMERA_CLEANING">Camera Lens Cleaning</option>
                  <option value="FIRMWARE_CALIBRATION">Acoustic Calibration</option>
                  <option value="GENERAL_INQUIRY">General Inquiry</option>
                </select>
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  Urgency Level
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value as SupportTicket['urgency'] })}
                  className="w-full px-3 py-2.5 bg-forest-50/60 border border-forest-200 rounded-xl text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white transition-all cursor-pointer font-medium"
                >
                  <option value="NORMAL">Normal Priority</option>
                  <option value="URGENT">Urgent (24 Hours)</option>
                  <option value="EMERGENCY">Emergency Outbreak</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">
                Problem Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the issue observed (e.g. sudden planthopper swarm detected in Sector B, or camera stream offline after heavy rain)..."
                className="w-full px-3.5 py-2.5 bg-forest-50/60 border border-forest-200 rounded-xl text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-forest-900 hover:bg-forest-800 active:scale-[0.99] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 text-solar-400" />
              <span>Submit Maintenance Request</span>
            </button>
          </form>
        </div>

        {/* Right 5 Cols: Active Tickets & FAQ Accordion */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Ticket Status Tracker */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-app-border shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-forest-950 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-forest-700" />
                Submitted Support Tickets
              </h3>
              <span className="text-[10px] font-mono font-bold text-forest-600 bg-forest-50 px-2 py-0.5 rounded">
                {tickets.length} Active
              </span>
            </div>

            <div className="space-y-2 max-h-[160px] overflow-y-auto">
              {tickets.map((t) => (
                <div key={t.id} className="p-3 bg-forest-50/70 rounded-2xl border border-forest-200/80 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-forest-950 font-mono">{t.id}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-sans">
                      {t.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-forest-800 line-clamp-1 font-medium">{t.description}</p>
                  <div className="text-[10px] text-forest-500 flex items-center justify-between pt-0.5">
                    <span>{t.farmerName} • {t.locationSector}</span>
                    <span>{t.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Field FAQ Accordion */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-app-border shadow-sm space-y-3">
            <h3 className="text-sm font-black text-forest-950 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-forest-700" />
              Field Technician FAQ
            </h3>

            <div className="space-y-2">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="border border-forest-100 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full p-3 text-left text-xs font-bold text-forest-900 bg-forest-50/50 hover:bg-forest-50 flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5 shrink-0 text-forest-600" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0 text-forest-600" />}
                    </button>
                    {isOpen && (
                      <div className="p-3 bg-white text-[11px] text-forest-700 leading-relaxed border-t border-forest-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
