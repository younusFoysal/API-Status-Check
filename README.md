
## How to call this API

Open Terminal or CMD or shell or zsh, then hit this command
```
curl https://api-status-check.vercel.app/APIStatus
```
OR
Check Response in Network Tab from your browser.
```
https://api-status-check.vercel.app/APIStatus
```
OR
Use in your React App 
```
fetch('https://api-status-check.vercel.app/APIStatus')
  .then(response => response.text())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```
