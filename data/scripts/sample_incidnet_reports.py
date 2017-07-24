import os
import csv
import random

NUM_LINES = 5000
OUTPUT_FILE = './short_incident.csv'
CRIME_KEY = 'Event Clearance Group'

if __name__ == '__main__':
    script_dir = os.path.dirname(__file__)
    incident_csv_path = os.path.join(
        script_dir,
        '../raw_data/Seattle_Police_Department_911_Incident_Response.csv'
    )
    with open(incident_csv_path) as csv_file:
        csv_data = list(csv.reader(csv_file))
        headers = csv_data[0]
        data = csv_data[1:]
        random.shuffle(data)
        crime_key_index = headers.index(CRIME_KEY)
        shortened_data = data[0:NUM_LINES]
        shortened_data = [l for l in shortened_data if l[crime_key_index]]
        shortened_csv = [headers] + shortened_data

    with open(OUTPUT_FILE, 'w+') as output_file:
        writer = csv.writer(output_file)
        writer.writerows(shortened_csv)


