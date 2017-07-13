import os
import csv
import random

NUM_LINES = 5000
OUTPUT_FILE = './short_incident.csv'

if __name__ == '__main__':
    script_dir = os.path.dirname(__file__)
    incident_csv_path = os.path.join(
        script_dir,
        './short_incident.csv'
    )
    with open(incident_csv_path) as csv_file:
        csv_data = list(csv.reader(csv_file))
        headers = csv_data[0]
        data = csv_data[1:]
        print(headers)
        crime_type_index = headers.index('Event Clearance Group')
        uniq = set()
        for d in data:
            incident_type = d[crime_type_index]
            uniq.add(incident_type)
        print(list(uniq))





