# nmap-processor

### API
 * An Express.js backend
 * Exposes an endpoint to ingest nmap results in XML format
 * Exposes endpoint to retrieve all host addresses 
 * Exposes endpoint to retrieve one host's detailed report
 * Hosts the pre-built frontend as static content
 * A Postman collection, `nmap-processor.postman_collection.json` has been included for testing

### Frontend
 * A React frontend
 * Displays a list of all available host addresses
 * Upon selection, displays a given host's details

# Startup

### Docker
 * A Dockerfile has been included for convenience
 * To use this method, first run `docker build -t nmap-processor .` in the base project directory
 * Then, run `docker run --rm -p 4200:4200 nmap-processor` 

### Local
 * Assuming Node version 10, from the base project folder, you should be able to run `npm run start`
 * This will install dependencies for API and frontend, build the frontend, and start the API

# Usage

After startup, you should be able to load the UI by visiting [http://localhost:4200](http://localhost:4200). Unless you have already loaded the data, it should appear as a blank page. To load data, you can use the Postman collection (be sure to edit the form data to point to the XML file in the assets folder) or you can tailor the following curl command to load the data: 

```
curl -X PUT \
  http://localhost:4200/xml \
  -H 'Accept: */*' \
  -H 'Accept-Encoding: gzip, deflate' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Length: 47640' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Host: localhost:4200' \
  -H 'cache-control: no-cache' \
  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
  -F file=@/<ACTUAL PATH TO FILE HERE>
```

Once data is loaded and the UI refreshed, you should see a list of hosts on the left. Click one, and a summary of that host and its ports should appear to the right.

# Choices & Assumptions
 * I chose to consume the XML file, because there was a node library to parse XML and I wouldn't have to figure out how to parse the other file types
 * Given limited time, some shortcuts were taken and no unit tests were written
 * I am assuming the API and Frontend will be run from same server

# Additional Thoughts
 * This is far too much to expect someone to be able to do in 3 business days only in their spare time