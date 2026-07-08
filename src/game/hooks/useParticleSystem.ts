import { useCallback, useRef } from 'react';
import { Animated, Easing } from 'react-native';

export type ParticleTone = 'perfect' | 'good' | 'miss' | 'blocked';

type Particle = {
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  active: boolean;
  color: string;
};

const PERFECT_COUNT = 12;
const OTHER_COUNT = 6;
const POOL_SIZE = PERFECT_COUNT;

const COLORS: Record<ParticleTone, string[]> = {
  perfect: ['#E9FFFF', '#3CE6FF', '#E9FFFF', '#47CFFF', '#E9FFFF', '#3CE6FF', '#E9FFFF', '#47CFFF', '#E9FFFF', '#3CE6FF', '#E9FFFF', '#3CE6FF'],
  good: ['#47CFFF', '#3CE6FF', '#47CFFF', '#3CE6FF', '#47CFFF', '#3CE6FF'],
  miss: ['#FF7C8F', '#F46A82', '#FF7C8F', '#F46A82', '#FF7C8F', '#F46A82'],
  blocked: ['#FFC978', '#FFB648', '#FFC978', '#FFB648', '#FFC978', '#FFB648'],
};

function createPool(): Particle[] {
  return Array.from({ length: POOL_SIZE }, () => ({
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    opacity: new Animated.Value(0),
    scale: new Animated.Value(1),
    active: false,
    color: '#E9FFFF',
  }));
}

export function useParticleSystem() {
  const poolRef = useRef<Particle[]>(createPool());

  const trigger = useCallback((centerX: number, centerY: number, tone: ParticleTone) => {
    const pool = poolRef.current;
    const count = tone === 'perfect' ? PERFECT_COUNT : OTHER_COUNT;
    const colors = COLORS[tone];
    const duration = tone === 'perfect' ? 600 : tone === 'good' ? 450 : 320;
    const distance = tone === 'perfect' ? 48 : 32;

    const angleStep = (2 * Math.PI) / count;

    for (let i = 0; i < count; i++) {
      const p = pool[i % POOL_SIZE];
      if (!p) {
        continue;
      }

      p.color = colors[i % colors.length] ?? '#E9FFFF';
      p.active = true;

      p.x.setValue(centerX);
      p.y.setValue(centerY);
      p.opacity.setValue(1);
      p.scale.setValue(1);

      const angle = angleStep * i - Math.PI / 2;
      const jitter = 0.7 + Math.random() * 0.6;
      const targetX = centerX + Math.cos(angle) * distance * jitter;
      const targetY = centerY + Math.sin(angle) * distance * jitter;

      Animated.parallel([
        Animated.timing(p.x, {
          toValue: targetX,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(p.y, {
          toValue: targetY,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(p.opacity, {
          toValue: 0,
          duration,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(p.scale, {
            toValue: tone === 'perfect' ? 1.6 : 1.3,
            duration: duration * 0.3,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(p.scale, {
            toValue: 0.4,
            duration: duration * 0.7,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        p.active = false;
      });
    }
  }, []);

  return { pool: poolRef.current, trigger };
}
