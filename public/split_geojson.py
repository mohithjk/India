import json
import os
import sys

input_file = '/home/jarvis/Downloads/gitclone/India/public/india_districts.geojson'
output_dir = '/home/jarvis/Downloads/gitclone/India/public/districts'

os.makedirs(output_dir, exist_ok=True)

print("Loading JSON...")
with open(input_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Loaded {len(data['features'])} features.")

state_features = {}
for feat in data['features']:
    props = feat.get('properties', {})
    state_name = props.get('NAME_1')
    if not state_name:
        continue
    
    if state_name not in state_features:
        state_features[state_name] = []
    
    state_features[state_name].append(feat)

print(f"Found {len(state_features)} states. Saving files...")

for state, feats in state_features.items():
    safe_name = state.replace(' ', '_')
    out_path = os.path.join(output_dir, f"{safe_name}.geojson")
    out_data = {
        "type": "FeatureCollection",
        "features": feats
    }
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(out_data, f)

print("Done splitting GeoJSON.")
