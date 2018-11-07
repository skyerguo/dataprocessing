#!/usr/bin/env python
# Name: Tiancheng Guo
# Student number: 12455814
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt
import numpy as np

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
#data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

rating_total_points = [0 for i in range(10)]
movies_count = [0 for i in range(10)]
rating_avg_points = [0 for i in range(10)]

data_dict = []

def line_chart():
    # this line chart is picturing by matplotlib.
    plt.subplot(1, 2, 1)
    plt.title("line chart", fontsize=30)
    my_x_ticks = np.arange(START_YEAR, END_YEAR, 1)
    my_y_ticks = np.arange(8.30, 8.80, 0.05)
    plt.xlabel("year", fontsize=20)
    plt.ylabel("rating", fontsize=20)
    plt.plot([i for i in range(START_YEAR, END_YEAR)], rating_avg_points)
    plt.xticks(my_x_ticks)
    plt.yticks(my_y_ticks)
    # plt.show()


def pie_chart():
    plt.subplot(1, 2, 2)
    plt.title("pie chart", fontsize=30)
    labels = [i for i in range(START_YEAR, END_YEAR)]
    plt.pie(movies_count, labels=labels, autopct='%3.0f%%', shadow=False, startangle=90,  pctdistance=0.6)
    plt.axis('equal')
    # plt.show()


if __name__ == "__main__":
    with open(INPUT_CSV, newline="") as csv_file:
        csv_reader = csv.reader(csv_file)
        cnt = -1
        for item in csv_reader:
            if cnt == -1:
                cnt = 0
                continue
            year = int(item[2]) - START_YEAR
            movies_count[year] = movies_count[year] + 1
            rating_total_points[year] = rating_total_points[year] + float(item[1])

    for i in range(10):
        rating_avg_points[i] = rating_total_points[i] / movies_count[i]
        data_dict.append([START_YEAR + i, rating_avg_points[i]])

    print(data_dict)
    plt.figure(figsize=(16, 9))
    line_chart()
    pie_chart()
    plt.savefig("visualizer.png")
    plt.show()
