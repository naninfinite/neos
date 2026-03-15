import type { LandmarkEntry } from './types';

/**
 * Sun Maze M1 greybox landmarks.
 * Metadata-driven registry with authored placement.
 * Follows OPEN_QUESTIONS #13 proposed direction.
 */
export const SUN_MAZE_LANDMARKS: LandmarkEntry[] = [
  {
    landmarkId: 'entry-garden-gate',
    label: 'Entry Garden Gate',
    districtId: 'entry-garden',
    position: [0, 0, 8],
    isMapVisible: true,
    isCalloutRelevant: true,
  },
  {
    landmarkId: 'entry-garden-fountain',
    label: 'Entry Fountain',
    districtId: 'entry-garden',
    position: [0, 0, 0],
    isMapVisible: true,
    isCalloutRelevant: true,
  },
  {
    landmarkId: 'red-arch',
    label: 'Red Arch',
    districtId: 'red-arch',
    position: [0, 0, -12],
    isMapVisible: true,
    isCalloutRelevant: true,
  },
  {
    landmarkId: 'red-arch-pillar-west',
    label: 'West Pillar',
    districtId: 'red-arch',
    position: [-8, 0, -12],
    isMapVisible: false,
    isCalloutRelevant: true,
  },
  {
    landmarkId: 'red-arch-pillar-east',
    label: 'East Pillar',
    districtId: 'red-arch',
    position: [8, 0, -12],
    isMapVisible: false,
    isCalloutRelevant: true,
  },
  {
    landmarkId: 'dry-fountain',
    label: 'Dry Fountain',
    districtId: 'dry-fountain',
    position: [0, 0, -28],
    isMapVisible: true,
    isCalloutRelevant: true,
  },
];
