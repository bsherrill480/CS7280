import json
import os
import csv

REGION_ID_KEY = 'RegionID'
ZHVI_KEY = 'Zhvi'
OUTPUT_FILE_NAME = './Zillow_Zhvi_Neighborhoods_WA_Geo.json'

if __name__ == '__main__':
    script_dir = os.path.dirname(__file__)
    geo_json_file_path = os.path.join(script_dir, '../raw_data/Zillow_Neighborhoods_WA_Geo.json')
    median_house_file_path = os.path.join(script_dir, '../raw_data/Zillow_Neighborhood_Zhvi.csv')
    with open(geo_json_file_path) as json_file:
        geo_dict = json.load(json_file)
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
    with open(OUTPUT_FILE_NAME, 'w+') as f:
        json.dump(geo_dict, f, indent=1)





