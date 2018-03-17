# Scatterplot with tooltip

An interactive scatterplot implemented with D3.js version 4.12.2. Based on Mike Bostock's [Scatterplot](https://bl.ocks.org/mbostock/3887118) block, this
visualization allows the following interaction possibilities:

* Hovering over a circle causes a tooltip containing stats to be shown.

* Hovering over legend elements highlights Eastern or Western Conference circles.  

## Getting started

* Clone or download the repository. 

* Run a local web server<sup>1</sup> so that the external data file can be loaded.

* Interact with the scatterplot in your web browser.

<sup>1</sup> If Python is installed on the computer, execute one of the following to run a web server locally on port 8000: 

* ```python -m SimpleHTTPServer 8000 ``` for Python 2.x
* ```python -m http.server 8000 ``` for Python 3.x

## Data source

The [Basketball Reference](https://www.basketball-reference.com/leagues/NBA_2017.html) website.