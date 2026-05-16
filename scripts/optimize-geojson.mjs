import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()
const STATE_FILE = path.join(ROOT, 'public', 'india_state.geojson')
const DISTRICTS_DIR = path.join(ROOT, 'public', 'districts')

const ALLOWED_PROPERTIES = new Set(['NAME_1', 'NAME_2'])
const DECIMALS = 3

function roundNumber(value) {
  return Number(value.toFixed(DECIMALS))
}

function optimizeCoordinates(value) {
  if (Array.isArray(value)) {
    return value.map(optimizeCoordinates)
  }

  if (typeof value === 'number') {
    return roundNumber(value)
  }

  return value
}

function optimizeGeometry(geometry) {
  if (!geometry) return geometry

  if (geometry.type === 'GeometryCollection' && Array.isArray(geometry.geometries)) {
    return {
      type: geometry.type,
      geometries: geometry.geometries.map(optimizeGeometry),
    }
  }

  return {
    type: geometry.type,
    coordinates: optimizeCoordinates(geometry.coordinates),
  }
}

function optimizeFeature(feature) {
  const properties = {}

  for (const [key, value] of Object.entries(feature.properties || {})) {
    if (ALLOWED_PROPERTIES.has(key) && value != null) {
      properties[key] = value
    }
  }

  return {
    type: 'Feature',
    properties,
    geometry: optimizeGeometry(feature.geometry),
  }
}

function optimizeGeojson(raw) {
  const data = JSON.parse(raw)

  if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
    return data
  }

  return {
    type: 'FeatureCollection',
    features: data.features.map(optimizeFeature),
  }
}

async function optimizeFile(filePath) {
  const raw = await readFile(filePath, 'utf8')
  const optimized = optimizeGeojson(raw)
  await writeFile(filePath, JSON.stringify(optimized))
}

async function main() {
  await optimizeFile(STATE_FILE)

  const files = await readdir(DISTRICTS_DIR)
  await Promise.all(
    files
      .filter((file) => file.endsWith('.geojson'))
      .map((file) => optimizeFile(path.join(DISTRICTS_DIR, file)))
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
