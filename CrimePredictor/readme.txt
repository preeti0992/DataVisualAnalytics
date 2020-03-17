Description:
This package consists of the CrimeMapper tool that predicts the probability of different type of crime on ward level in the city of Chicago.The tool employs Naive Bayes Classifier as its base model that uses variables like a month, the day of the week and time (divided into 4-hour windows based on the shifts of police department) of the past occurrences of crimes and ‘ward’ from the crime database for Chicago city. It outputs the probabilities for the different classes of crime namely theft, other offences, child offence, sexual crime, vehicle theft, deceptive practice, assault, narcotics and criminal damage for individual wards in the city.
We are using the openly available data-sets from the city of Chicago Data Portal. It is about 6.4GB in total size and can be freely accessed at https://data.cityofchicago.org/. We are also using the 311-request dataset from the same portal which lists the various non-emergency requests that are raised.
The user interface of the application encompasses a dashboard view with a calendar view date selector and digital clock view time selector and a drop down for selecting different crime types to see the probability result on a map. The a choropleth map on the dashboard provides an easy way to visualize how a probability varies across the wards of Chicago using colour saturation. A Heatmap is also used to represent the correlation between different types of 311 requests and crime types in each ward on hovering on a ward on the map.
The application uses python3 and flask as its core technology and need a browser and internet connection(to load libraries) to work.

System and software requirements:
    python 3.6,
    flask 1.0.2,
    network connection for bootstrap, leaflet and d3 libraries,
    browser to render application web page.
    
Installation:
    Extract the project zip folder to get Project folder.
    
Execution:
    Run the following command on console to start the application server:
        python PATH_TO_PROJECT_FOLDER\Project\app.py flask run --reload
        OR
        python3 PATH_TO_PROJECT_FOLDER\Project\app.py flask run --reload     
    On browser open http://127.0.0.1:5000/
