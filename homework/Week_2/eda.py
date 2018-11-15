# -*- coding:utf8 -*-
# @author: Tiancheng Guo
# @contact: skyerguo97@gmail.com
# @file: eda.py
# @time: 11/11/18
# @description:

import pandas as pd
import numpy as np
import csv
import json
import re
import matplotlib as plt
import pylab as pl


INFO = ["Country",
        "Region",
        "Pop. Density (per sq. mi.)",
        "Infant mortality (per 1000 births)",
        "GDP ($ per capita) dollars"]
# The formation of DataFrame as suggested


def get_num(st):
    # get the float number from string
    return float(re.findall(r"\d+\,?\d*", st)[0].replace(',', '.'))


def load():
    # Load the input.csv as pandas.DataFrame as required

    #Load in the CSV file
    arr = []
    with open("input.csv", "r") as reader:
        input_file = csv.DictReader(reader)
        for row in input_file:

            # Clean and preprocess the data
            flag = 0
            # flag to mark whether the line is available(0 is available)
            for column in INFO:
                if row[column] == "" or row[column] == "unknown":
                    flag = 1

            # append the line in new array for storing the data
            if flag == 0:
                arr.append([row[INFO[0]].strip(), row[INFO[1]].strip(),
                            get_num(row[INFO[2]]), get_num(row[INFO[3]]), int(get_num(row[INFO[4]]))])

    # deposit the data as pandas.DataFame
    return pd.DataFrame(arr, columns=INFO, index=range(len(arr)))


def central_tendency():
    # Do central tendency's work

    # Compute the mean, median and mode of the GDP data
    gdp_mean = data_file.mean()[INFO[4]]
    gdp_median = data_file.median()[INFO[4]]
    gdp_mode = data_file.mode()[INFO[4]][0]
    print("GDP mean:   %f" % gdp_mean)
    print("GDP median: %f" % gdp_median)
    print("GDP mode:   %f" % gdp_mode)

    # Compute the standard of the GDP data
    gdp_std = data_file.std()[INFO[4]]
    print("GDP standard: %f" % gdp_std)

    # Produce a histogram of the GDP data
    gdp_hist = data_file[INFO[4]].plot.hist(color='green', bins=20, alpha=0.5).get_figure()
    gdp_hist.savefig("GDP histogram.png")


def five_number_summary():
    # Do five number summary's work

    # Compute the Five Number Summary of the Infant Mortality data
    infant_q0 = data_file.min()[INFO[3]]
    infant_q1 = data_file.quantile(q=0.25)[INFO[3]]
    infant_q2 = data_file.median()[INFO[3]]
    infant_q3 = data_file.quantile(q=0.75)[INFO[3]]
    infant_q4 = data_file.max()[INFO[3]]
    print("infant mortality Minimum: %f" % infant_q0)
    print("infant mortality First Quartile: %f" % infant_q1)
    print("infant mortality Median: %f" % infant_q2)
    print("infant mortality Third Quartile: %f" % infant_q3)
    print("infant mortality Maximum: %f" % infant_q4)

    # Produce a box plot of the Infant Mortality data
    infant_box = data_file[INFO[3]].plot.box().get_figure()
    infant_box.savefig("infant mortality box.png")

    # Write a .json file in the correct format
    infant_dict = data_file.set_index(INFO[0]).to_dict('index')
    with open("infant mortality.json", "w") as file:
        json.dump(infant_dict, file, indent=4)


if __name__ == '__main__':
    data_file = load()
    central_tendency()
    five_number_summary()