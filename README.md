# Receipt_API


## What do you need to run the code?
  - Docker

## What tech stack did I use?
  - NextJS
  - Redis

## What cases have I taken care of?
  - GET (/receipts/{id}/points)
    - check if the UUID is in the right form (400)
    - check if data can be found in the database (404)
    - return 200 if successful
  - POST (/receipt/process)
    - check if the JSON body is in the right form (400)
    - check if data has been stored into the database (500)
    - return 201 if successful
