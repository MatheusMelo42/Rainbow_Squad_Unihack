import json

def load_json(path):
    with open(path, 'r') as f:
        return json.load(f)

def save_json(path, data):
    with open(path, 'w') as f:
        json.dump(data, f)

def cleanTimisJson():
    l = load_json('D:\\population.json')
    features = l['features']
    for feature in features:
        geometry = feature['geometry']
        coordinates = geometry['coordinates']
        coordinates = coordinates[0]
        for coordinate in coordinates:   
            coordinate[0], coordinate[1] = coordinate[1], coordinate[0]

    l['features'] = features
    save_json('D:\\population.json', l)

def cleanTrashCanJson():
    l = load_json('D:\\trash_cans.json')
    features = l['features']
    for feature in features:
        geometry = feature['geometry']
        coordinate = geometry['coordinates'] 
        coordinate[0], coordinate[1] = coordinate[1], coordinate[0]

    save_json('D:\\trash_cans.json', features)

