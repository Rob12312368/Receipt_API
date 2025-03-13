# Receipt_API


## What do you need to run the code?
  - Docker

## What command do you need?
  ```
  git clone https://github.com/Rob12312368/Receipt_API.git
  cd ./Receipt_API
  docker compose up
  ```

## What tech stack did I use?
  - NextJS
  - Redis

## What cases have I taken care of?
  - GET (/receipts/{id}/points)
    - if the UUID is not in the right form (400)
    - if data can not be found in the database (404)
    - Otherwise, considered as successful (200)
  - POST (/receipt/process)
    - if the JSON body is not in the right form (400)
    - if data has not been stored into the database (500)
    - Otherwise, considered as successful (201)
   
## How to test my code?
  - send GET request `http://localhost:3000/receipts/{id}/points`
  - send POST request to `http://localhost:3000/receipts/process`
