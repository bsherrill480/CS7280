import json
import os
import csv
from shapely.geometry import shape, Point

# neighborhood
REGION_ID_KEY = 'RegionID'

# zipcode
# REGION_ID_KEY = 'RegionName'

ZHVI_KEY = 'Zhvi'
OUTPUT_FILE_NAME = './Zillow_Zhvi_Neighborhoods_WA_Geo.json'

# neighborhood files
REL_GEO_JSON_FILE_PATH = '../raw_data/Zillow_Neighborhoods_WA_Geo.json'
REL_MEDIAN_HOUSE_FILE_PATH = '../raw_data/Zillow_Neighborhood_Zhvi.csv'

# zipcode files
# REL_GEO_JSON_FILE_PATH = '../raw_data/zip_geo.json'
# REL_MEDIAN_HOUSE_FILE_PATH = '../raw_data/Zip_Zhvi_Summary_AllHomes.csv'


def add_crime_to_json(geo_dict):
    with open('./short_incident.csv') as csv_file:
        csv_data = list(csv.reader(csv_file))
        headers = csv_data[0]
        data = csv_data[1:]
        lon_index = headers.index('Longitude')
        lat_index = headers.index('Latitude')

        points = [Point(float(d[lon_index]), float(d[lat_index])) for d in data]

        for feature in geo_dict['features']:
            polygon = shape(feature['geometry'])
            properties = feature['properties']
            properties['NumCrimes'] = 0
            for point in points:
                if polygon.contains(point):
                    properties['NumCrimes'] += 1

            properties['CrimeOverArea'] = properties['NumCrimes'] / (polygon.area * 100000)


def add_zhvi_to_json(geo_dict):
    with open(median_house_file_path) as csv_file:
        csv_data = list(csv.reader(csv_file))
        headers = csv_data[0]
        csv_data = csv_data[1:]
        region_id_index = headers.index(REGION_ID_KEY)
        zhvi_index = headers.index(ZHVI_KEY)
        region_id_to_zhvi = dict()
        for row in csv_data:
            zhvi = row[zhvi_index]
            region_id = int(row[region_id_index])
            region_id_to_zhvi[region_id] = zhvi

    key_errors = 0

    for feature in geo_dict['features']:
        properties = feature['properties']
        region_id = int(properties[REGION_ID_KEY])
        try:
            zhvi = int(region_id_to_zhvi[region_id])
        except KeyError:
            zhvi = -1
            key_errors += 1
        properties['zhvi'] = zhvi

    print('key errors: {}'.format(key_errors))


# only keep Seattle
def filter_geo_json(geo_dict):
    new_geo_dict = geo_dict.copy()
    new_features = [
        feature for feature in geo_dict['features'] if feature['properties']['City'] == 'Seattle'
        ]
    new_geo_dict['features'] = new_features
    return new_geo_dict


if __name__ == '__main__':
    script_dir = os.path.dirname(__file__)
    geo_json_file_path = os.path.join(script_dir, REL_GEO_JSON_FILE_PATH)
    median_house_file_path = os.path.join(script_dir, REL_MEDIAN_HOUSE_FILE_PATH)

    with open(geo_json_file_path) as json_file:
        geo_dict = json.load(json_file)

    geo_dict = filter_geo_json(geo_dict)

    add_crime_to_json(geo_dict)
    add_zhvi_to_json(geo_dict)

    with open(OUTPUT_FILE_NAME, 'w+') as f:
        json.dump(geo_dict, f, indent=1)





