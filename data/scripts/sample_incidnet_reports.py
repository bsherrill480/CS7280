import os
import csv
import random

NUM_LINES = 5000
OUTPUT_FILE = './short_incident.csv'

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
        shortened_csv = [headers] + data[0:NUM_LINES]

    with open(OUTPUT_FILE, 'w+') as output_file:
        writer = csv.writer(output_file)
        writer.writerows(shortened_csv)


