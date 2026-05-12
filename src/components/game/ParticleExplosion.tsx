import React, { memo } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import type { useParticleSystem } from '@centerhit-game/hooks/useParticleSystem';

const PARTICLE_SIZE = 7;

type ParticleExplosionProps = {
  pool: ReturnType<typeof useParticleSystem>['pool'];
};

export const ParticleExplosion = memo(function ParticleExplosion({
  pool,
}: ParticleExplosionProps) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pool.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              backgroundColor: particle.color,
              opacity: particle.opacity,
              transform: [
                { translateX: Animated.add(particle.x, new Animated.Value(-PARTICLE_SIZE / 2)) },
                { translateY: Animated.add(particle.y, new Animated.Value(-PARTICLE_SIZE / 2)) },
                { scale: particle.scale },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  particle: {
    borderRadius: 999,
    height: PARTICLE_SIZE,
    left: 0,
    position: 'absolute',
    top: 0,
    width: PARTICLE_SIZE,
  },
});
