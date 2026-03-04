import * as THREE from 'three'

export type GeometryCreator = (radius?: number, detail?: number) => THREE.BufferGeometry

const geometries: GeometryCreator[] = [
  (radius = 2.5, detail = 1) => new THREE.IcosahedronGeometry(radius, detail),
  (radius = 2.5, detail = 0) => new THREE.DodecahedronGeometry(radius, detail), // Less detail for blockier look
  (radius = 2.5, detail = 0) => new THREE.OctahedronGeometry(radius, detail),
  (radius = 2.5, detail = 0) => new THREE.TetrahedronGeometry(radius, detail),
  (radius = 2.5, detail = 64, tubularSegments = 8, radialSegments = 3, p = 2, q = 3) => new THREE.TorusKnotGeometry(radius, tubularSegments, radialSegments, p, q), // TorusKnot
  (radius = 2.5, widthSegments = 8, heightSegments = 6) => new THREE.SphereGeometry(radius, widthSegments, heightSegments), // Low poly sphere
  (radius = 2.5, detail = 2) => new THREE.IcosahedronGeometry(radius, detail), // Slightly more complex Icosahedron
  (radius = 2.5, segments = 8) => new THREE.BoxGeometry(radius, radius, radius, segments, segments, segments), // Low poly cube
];

export function getRandomGeometry(specimenId: string): GeometryCreator {
  const hash = specimenId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % geometries.length;
  return geometries[index];
}
