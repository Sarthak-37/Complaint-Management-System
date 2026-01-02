import React from 'react';
import { 
  ShieldCheck, 
  Mail, 
  MapPin, 
  Phone,
  Clock,
  Globe
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto border-t border-gray-800">
      <div className="container mx-auto px-6">
        
        {/* Main Footer Content: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold tracking-tight">CMS Platform</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              A secure, Role-Based Access Control system dedicated to bridging the gap between citizens and administration. We ensure transparency, efficiency, and immutable complaint tracking.
            </p>
          </div>

          {/* Column 2: Citizen Services (Static List) */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Citizen Services</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                File a New Complaint
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Track Complaint Status
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                View Public Analytics
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                User Guidelines & Help
              </li>
            </ul>
          </div>

          {/* Column 3: Governance & Authority (Static List) */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Governance</h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-white transition-colors cursor-default">Authority Portal Access</li>
              <li className="hover:text-white transition-colors cursor-default">Admin Dashboard</li>
              <li className="hover:text-white transition-colors cursor-default">Official Code of Conduct</li>
              <li className="hover:text-white transition-colors cursor-default">Escalation Protocols</li>
            </ul>
          </div>

          {/* Column 4: Contact Info (Static) */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Contact Support</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                <span>
                  Administrative Block B,<br />
                  Civic Center, Tech City
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                <span>support@cms-platform.gov</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                <span>Mon-Fri: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {currentYear} Complaint Management System. All Secure Rights Reserved.</p>
          
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" /> English (US)
            </span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Audit</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;