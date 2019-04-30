import json
import pandas

inlets_raw = pandas.read_csv(
    r'../inlets.csv')
inlets = inlets_raw.drop(
    ['symbolgroup', 'objectid', 'monthday_installed', 'year_installed', 'owner', 'rotation', 'subtype', 'system', 'inlettype', 'gps', 'operator', 'hydraulicid', 'facilityid'], axis=1)

# inlets_head = inlets.head(n=20)
inlets_dict = inlets.to_dict('split')
x_y_nested_list = inlets_dict['data']

coordinate_list = []
for point in x_y_nested_list:
    coordinate_point = {
        'xCoordinate': point[0],
        'yCoordinate': point[1]
    }
    coordinate_list.append(coordinate_point)

with open('../inlets.json', 'w') as write_file:
  json.dump(coordinate_list, write_file)
