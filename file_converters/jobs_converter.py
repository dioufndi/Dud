from cmath import exp
import csv
import json
from mapbox import Geocoder

MAPBOX_TOKEN = "p.eyJ1IjoiZGlvdWZuZGkiLCJhIjoiY2w5bjMwMnc5MDJ4NzN4cGt0NTl0amcwOCJ9.Y3irDbXW1z6XHLnCtGodhQ"
geocoder = Geocoder(access_token=MAPBOX_TOKEN)
data = []
headers = []

with open("Sample Handshake Data Set.csv") as file_obj:

        reader_obj = csv.reader(file_obj)

        headers = next(reader_obj)

        headers[0] = "Id"

        row = next(reader_obj)

        while row:
            try:
                temp = dict()
                i = 0
                for col in row:
                    temp[headers[i]] = col
                    i += 1
                data.append(temp)
            
            except IndexError:
                pass

            try:
                row = next(reader_obj)
            except UnicodeDecodeError:
                row = next(reader_obj)
            except StopIteration:
                break     
            
data2 = []
for i in range(0, len(data)):
    try: #Before you go ahead, look a line 84...
        temp_main = dict() 
        temp_in_geometry = dict()
        temp_in_prop = dict()
        
        response = geocoder.forward(data[i]["Job Location"])
        ans = response.json()["features"][0]["geometry"]["coordinates"] #Coordinates
        
        #Adds info to geometry dictionary
        temp_in_geometry["type"] = "Point" 
        temp_in_geometry["coordinates"] = ans
        
        #Adds info to property dictionary 
        #temp_in_prop["id"] = data[i]["Job Id"]
        
        temp_in_prop["job_title"] =  data[i]["Title"]
        temp_in_prop["job_type"] = data[i]["Job Type"]
        temp_in_prop["employment_type"] = data[i]["Employment Type"] 
        temp_in_prop["industry"] = data[i]["Employer Industry"]
        temp_in_prop["employer"] = data[i]["Employer"] 
        temp_in_prop["in_us"] = data[i]["Located In US"]
        temp_in_prop["location_name"] = data[i]["Job Location"]

        temp_in_prop["accepts_internationals"] = data[i]["Accepts OPT/CPT Candidates"]
        temp_in_prop["gives_sponsorships"] = data[i]["Willing To Sponsor Candidate"]
        
        #Adds info from geometry and property dictionary into the main dictionary
        temp_main["type"] = "Feature"
        temp_main["properties"] = temp_in_prop
        temp_main["geometry"] = temp_in_geometry

        data2.append(temp_main) #Adds individual main dictionaries to data2 list
       
    except: #Basically skips invalid file lines
        continue

#Adds everything to the biggest dictionary, alpha and formats it properly 

alpha = {"type": "FeatureCollection", "crs": "FillerText", "features": data2} 

with open("geojson\jobs.geojson", "w") as f:
    json.dump(alpha,f)



    

#GeoJson breakdown:

# It's basically a dictionary of lists of what is below

# {
#     "type": "FeatureCollection",
#     "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
#     "features": [
#     { "type": "Feature", "geometry": { "type": "Point", "coordinates": [ -84.525239999781, 44.9337458924535, 0.0 ] }, "info": {"name" : "Ndiaga", "job" : "unemployed"} }
#     ]
# }

#So the code above is going from the bottom to the top starting with the inner most data