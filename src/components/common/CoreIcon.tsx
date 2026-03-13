import React from 'react';
import {
  Check,
  ChevronDown,
  ChevronLeft,
  Circle,
  Globe,
  Heart,
  Info,
  Lock,
  LockOpen,
  Music2,
  Pause,
  Play,
  Settings,
  Smartphone,
  Star,
  TriangleAlert,
  Volume2,
} from 'lucide-react-native';

export type CoreIconName =
  | 'chevron-back'
  | 'chevron-down'
  | 'pause'
  | 'play'
  | 'star'
  | 'lock-closed'
  | 'lock-open'
  | 'checkmark'
  | 'ellipse'
  | 'information-circle'
  | 'heart'
  | 'settings-outline'
  | 'volume-high-outline'
  | 'musical-note-outline'
  | 'phone-portrait-outline'
  | 'globe-outline'
  | 'warning-outline';

type CoreIconProps = {
  name: CoreIconName;
  size?: number;
  color: string;
};

export function CoreIcon({ name, size = 20, color }: CoreIconProps) {
  switch (name) {
    case 'chevron-back':
      return <ChevronLeft size={size} color={color} strokeWidth={2.4} />;
    case 'chevron-down':
      return <ChevronDown size={size} color={color} strokeWidth={2.4} />;
    case 'pause':
      return <Pause size={size} color={color} strokeWidth={2.4} />;
    case 'play':
      return <Play size={size} color={color} strokeWidth={2.4} />;
    case 'star':
      return <Star size={size} color={color} strokeWidth={2.2} />;
    case 'lock-closed':
      return <Lock size={size} color={color} strokeWidth={2.2} />;
    case 'lock-open':
      return <LockOpen size={size} color={color} strokeWidth={2.2} />;
    case 'checkmark':
      return <Check size={size} color={color} strokeWidth={2.8} />;
    case 'ellipse':
      return <Circle size={size} color={color} strokeWidth={2.8} />;
    case 'information-circle':
      return <Info size={size} color={color} strokeWidth={2.2} />;
    case 'heart':
      return <Heart size={size} color={color} strokeWidth={2.2} />;
    case 'settings-outline':
      return <Settings size={size} color={color} strokeWidth={2.2} />;
    case 'volume-high-outline':
      return <Volume2 size={size} color={color} strokeWidth={2.2} />;
    case 'musical-note-outline':
      return <Music2 size={size} color={color} strokeWidth={2.2} />;
    case 'phone-portrait-outline':
      return <Smartphone size={size} color={color} strokeWidth={2.2} />;
    case 'globe-outline':
      return <Globe size={size} color={color} strokeWidth={2.2} />;
    case 'warning-outline':
      return <TriangleAlert size={size} color={color} strokeWidth={2.2} />;
    default:
      return <Circle size={size} color={color} strokeWidth={2.2} />;
  }
}
