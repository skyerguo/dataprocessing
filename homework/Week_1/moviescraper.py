#!/usr/bin/env python
# Name: Tiancheng Guo
# Student number: 12455814
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import re
# use re to match stars

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED MOVIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    result = [[0 for j in range(5)] for i in range(51)]

    result[0] = ["Title", "Rating", "Year", "Actors", "Runtime"]

    movie_containers = dom.find_all("div", class_="lister-item mode-advanced")

    for i in range(50):
        ith_movie = movie_containers[i]

        #Title
        title = ith_movie.h3.a.text
        # print(title)

        #rating
        rating = ith_movie.strong.text
        # print(rating)

        #Year of release
        year = ith_movie.h3.find("span", class_="lister-item-year text-muted unbold").text
        list_digit_year = filter(str.isdigit, year)
        year = ''.join(x for x in list_digit_year)
        # print(year)

        #Actors/actresses
        actors = []
        for j in range(10):
            actor_name = ith_movie.find("a", {"href": re.compile(r'.*adv_li_st_' + str(j))})
            if actor_name is None:
                break
            actors.append(actor_name.text)
        # print(actors)


        #Runtime
        runtime = ith_movie.p.find("span", class_="runtime").text
        list_digit_runtime = filter(str.isdigit, runtime)
        runtime = ''.join(x for x in list_digit_runtime)
        # print(runtime)

        result[i + 1][0] = title
        result[i + 1][1] = rating
        result[i + 1][2] = year
        result[i + 1][3] = actors
        result[i + 1][4] = runtime

    return result

def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    # ADD SOME CODE OF YOURSELF HERE TO WRITE THE MOVIES TO DISK


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """port numpy
numpy.savetxt("new.csv", my_matrix, delimiter=','
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
    #    save_csv(output_file, movies)
        csv_writer = csv.writer(output_file)
        for i in range(51):
            csv_writer.writerow(movies[i])
