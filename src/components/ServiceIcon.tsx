import React from 'react';
import {
  PhoneCall,
  FileText,
  Home,
  Building2,
  ShieldCheck,
  ScrollText,
  Scale,
  Briefcase,
  AlertTriangle,
  HeartHandshake,
  Building,
  Gavel,
  ShieldAlert,
  HelpCircle,
  LucideProps
} from 'lucide-react';

interface ServiceIconProps extends LucideProps {
  name: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'PhoneCall':
      return <PhoneCall {...props} />;
    case 'FileText':
      return <FileText {...props} />;
    case 'Home':
      return <Home {...props} />;
    case 'Building2':
      return <Building2 {...props} />;
    case 'ShieldCheck':
      return <ShieldCheck {...props} />;
    case 'ScrollText':
      return <ScrollText {...props} />;
    case 'Scale':
      return <Scale {...props} />;
    case 'Briefcase':
      return <Briefcase {...props} />;
    case 'AlertTriangle':
      return <AlertTriangle {...props} />;
    case 'HeartHandshake':
      return <HeartHandshake {...props} />;
    case 'Building':
      return <Building {...props} />;
    case 'Gavel':
      return <Gavel {...props} />;
    case 'ShieldAlert':
      return <ShieldAlert {...props} />;
    default:
      return <Scale {...props} />;
  }
};
