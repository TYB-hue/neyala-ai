#!/bin/bash

# Create the directory if it doesn't exist
mkdir -p public/images/attractions

# Download Empire State Building image
curl -o public/images/attractions/empire-state.jpg "https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg"

# Download 9/11 Memorial image
curl -o public/images/attractions/911-memorial.jpg "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Memorial_Day_at_the_9-11_Memorial%2C_New_York_City.jpg/1280px-Memorial_Day_at_the_9-11_Memorial%2C_New_York_City.jpg" 