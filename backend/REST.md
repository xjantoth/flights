
### Get Bearer JWT access token 

```python
import requests

def get_access_token(_url, _user, _pass):
    respond = requests.post(
    _url, 
    data={'username': _user, 
            'password': _pass})
    return respond.json()['access_token']
    
    
def get_all_unique_days(_access_token):



login_url = 'http://127.0.0.1:5000/api/login'

```

```python
auth_token = get_access_token(login_url)
hed = {'Authorization': 'Bearer ' + auth_token}
data = {'app' : 'aaaaa'}

url = 'https://api.xy.com'
response = requests.post(url, json=data, headers=hed)
print(response)
print(response.json())

```