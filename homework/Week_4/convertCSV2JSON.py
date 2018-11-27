# -*- coding:utf8 -*-
# @author: Tiancheng Guo
# @contact: skyerguo97@gmail.com
# @file: convertCSV2JSON.py
# @time: 11/21/18
# @description:

import csv
import json


def read_csv(file):
    # read csv file

    csv_rows = []
    with open(file) as csvfile:
        reader = csv.DictReader(csvfile)
        # get the data from reader

        title = reader.fieldnames

        for row in reader:
            csv_rows.extend([{title[i]: int(row[title[i]]) for i in range(len(title))}])
            # extract each line and save in the list 'csv_rows'
            # store the data as number

    return csv_rows


def write_json(data, json_file):
    # write to json file

    with open(json_file, "w") as f:
        f.write(json.dumps(data, sort_keys=False, indent=4, separators=(',', ': ')))
        # save json as a readable file


if __name__ == '__main__':
    write_json(read_csv('data.csv'), 'data.json')
