# Instructions
1. clone/fork this repo
2. rename `wrangler.toml.example` to `wrangler.toml` and modify the Account/Zone IDs, script name, and routes.
3. make sure you have a DNS entry on your worker to catch the new API.  With workers, just create an A record for your subdomain with a dummy IP (e.g. 1922.0.2.1):
  ![image](https://user-images.githubusercontent.com/865416/154818431-f142d7e7-3b1f-40f0-822f-ff9cf6e47bf6.png)

5. run `yarn` to install dependencies (minimal)
6. run `wrangler publish`

# Testing
Once deployed, run the following snippet from your browser console (from a domain OTHER than the one you deployed it to):
```js
fetch('https://cors.itty-router.dev/test')
  .then(r => r.json())
  .then(console.warn)
```

You should see the following:  
![image](https://user-images.githubusercontent.com/865416/154818412-96bce361-7bd0-4a72-9390-34fe14d5fac9.png)
