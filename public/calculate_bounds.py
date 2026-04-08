import json
import math

input_file = '/home/jarvis/Downloads/gitclone/India/public/india_state.geojson'

with open(input_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

# India approximate bounds in degrees
INDIA_DX = 30.0
INDIA_DY = 30.0

state_view_config = {}

def get_coords(obj):
    if isinstance(obj, list):
        if len(obj) == 2 and isinstance(obj[0], (int, float)) and isinstance(obj[1], (int, float)):
            yield obj
        else:
            for item in obj:
                yield from get_coords(item)

for feat in data['features']:
    name = feat.get('properties', {}).get('NAME_1') or feat.get('properties', {}).get('name')
    if not name:
        continue
        
    coords = list(get_coords(feat.get('geometry', {}).get('coordinates', [])))
    if not coords:
        continue
        
    lngs = [c[0] for c in coords]
    lats = [c[1] for c in coords]
    
    min_lng, max_lng = min(lngs), max(lngs)
    min_lat, max_lat = min(lats), max(lats)
    
    center_lng = (min_lng + max_lng) / 2
    center_lat = (min_lat + max_lat) / 2
    
    dx = max_lng - min_lng
    dy = max_lat - min_lat
    
    if dx == 0 or dy == 0:
        continue
        
    # Standard 1x zoom fits India's 30x30 roughly. 
    # We want the state to take up 85% of the screen.
    zoom_x = INDIA_DX / dx
    zoom_y = INDIA_DY / dy
    
    # We take the smaller zoom so it fits both width and height
    zoom = 0.85 * min(zoom_x, zoom_y)
    
    # Cap zoom at 10 or 12 so tiny states aren't awkwardly huge
    zoom = min(zoom, 10.0)
    
    state_view_config[name] = {
        "center": [round(center_lng, 4), round(center_lat, 4)],
        "zoom": round(zoom, 2)
    }

print(json.dumps(state_view_config, indent=2))
