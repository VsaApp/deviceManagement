## Authentication

To use the API you have to create a ```authentication string```.  
It consist of a ```username``` and a ```password```.  
First hash the password with Sha-256. Then concat the ```username``` and the ```password``` with a ```:```.
Then encode the created string with Base64.    

### Example:  
Username: test  
Password: 123  
=>```dGVzdDphNjY1YTQ1OTIwNDIyZjlkNDE3ZTQ4NjdlZmRjNGZiOGEwNGExZjNmZmYxZmEwN2U5OThlODZmN2Y3YTI3YWUz```