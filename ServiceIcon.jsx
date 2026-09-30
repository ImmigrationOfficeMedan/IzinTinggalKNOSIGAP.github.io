import React from 'react';
import {
    Plane,
    Briefcase,
    Home,
    RefreshCw,
    ArrowLeftRight,
    FileEdit,
    Baby,
    Handshake,
    FileText,
} from 'lucide-react';

const ICONS = {
    Plane,
    Briefcase,
    Home,
    RefreshCw,
    ArrowLeftRight,
    FileEdit,
    Baby,
    Handshake,
    FileText,
};

const ServiceIcon = ({ name, className = 'h-6 w-6', strokeWidth = 1.8 }) => {
    const Icon = ICONS[name] || FileText;
    return <Icon className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
};

export default ServiceIcon;
