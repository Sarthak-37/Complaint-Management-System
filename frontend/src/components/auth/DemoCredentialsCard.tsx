import React, { useState } from 'react';
import { Copy, Check, Lock, Mail } from 'lucide-react';

type UserRole = 'USER' | 'AUTHORITY' | 'ADMIN';

interface DemoCredentials {
  role: UserRole;
  email: string;
  password: string;
  label: string;
}

interface DemoCredentialsCardProps {
  onCredentialSelect: (email: string, password: string) => void;
}

const demoCredentials: DemoCredentials[] = [
  { role: 'USER', email: 'mhatresarthak03@gmail.com', password: 'Sarthak@123', label: 'User' },
  { role: 'AUTHORITY', email: 'mhatresarthakwork37@gmail.com', password: 'Sarthak@123', label: 'Authority' },
  { role: 'ADMIN', email: 'admin@test.com', password: 'Admin@123', label: 'Admin' }
];

const DemoCredentialsCard: React.FC<DemoCredentialsCardProps> = ({ onCredentialSelect }) => {
  const [activeTab, setActiveTab] = useState<UserRole>('USER');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const activeCredential = demoCredentials.find(c => c.role === activeTab)!;

  return (
    <div className="mt-8 bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 overflow-hidden">
      <div className="p-4 bg-white/50 border-b border-blue-200">
        <h3 className="text-sm font-semibold text-gray-700">Demo Credentials</h3>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-blue-200 bg-white/30">
        {demoCredentials.map((cred) => (
          <button
            key={cred.role}
            onClick={() => setActiveTab(cred.role)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
              activeTab === cred.role
                ? 'text-[#4756ca] border-b-2 border-[#4756ca] bg-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            {cred.label}
          </button>
        ))}
      </div>

      {/* Credentials Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-md border border-blue-100">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Mail className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-sm text-gray-700 truncate">{activeCredential.email}</span>
          </div>
          <button
            onClick={() => handleCopy(activeCredential.email, 'email')}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors shrink-0"
            aria-label="Copy email"
          >
            {copiedField === 'email' ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-md border border-blue-100">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Lock className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-sm text-gray-700 font-mono">{activeCredential.password}</span>
          </div>
          <button
            onClick={() => handleCopy(activeCredential.password, 'password')}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors shrink-0"
            aria-label="Copy password"
          >
            {copiedField === 'password' ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>

        <button
          onClick={() => onCredentialSelect(activeCredential.email, activeCredential.password)}
          className="w-full py-2 px-4 bg-linear-to-r from-[#3186b2] to-[#4756ca] text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
        >
          Use These Credentials
        </button>
      </div>
    </div>
  );
};

export default DemoCredentialsCard;