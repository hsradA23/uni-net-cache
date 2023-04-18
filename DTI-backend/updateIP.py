import socket
from requests import put
hostname = socket.gethostname()
ip_address = socket.gethostbyname(hostname)

r = put('https://getpantry.cloud/apiv1/pantry/f61ba144-6247-4450-aeda-08136042b06d/basket/newBasket1',
         json={'ip':ip_address}, headers = {"Content-Type": "application/json"})
print(r.text)