# bolide-wallet-profiler-server

The Purpose of wallet profiler is to create an instrument to find best alternatives for user's current portfolio

# The user journey:

- User opens the website (bolide.fi/optimize)
- enter/connect wallet
- wait couple of seconds to loads results
- see the list of protocols and user's positions in this protocol
- User will see the alternatives for their position

# What is position

User makes deposits to aave 10 USDT and 2 ETH, so she has
1 protocol: AAVE
2 positions:

- 10 USDT
- 2 ETH
  User makes a deposit to Uniswap with ETH-USDC, so she has
  1 protocol: Uniswap
  1 position: ETH-USDC

# How to collect user's data:

We use debank to
retrieve all user's deposits into protocol's and positions
retrieve user's wallet info (we might treat it as Protocol = 'wallet')
retrieve user's transactions

# How to calculate User's earnings and rewards and APR:

- we retrieve user's data every X hours
- after retrieving data we need to compare state of positions between 2 dates (date1, date2)
  - for all protocols that user has now
    - retrieve the latest date when user made interaction with the protocol.
    - if the latest date > date1, then skip this comparison
    - for all positions inside the protocol (on date2)
      - find the same position on date1
        - for each token in the position
          - calculate diff: positionOnDate2.amount - positionOnDate1.amount
          - calculate time diff: time2-time1
          - store the data (PositionComparison): user, protocol, position, positionDiffAmount, timeDiff, time1, time2, amountUSDUSD
- To calculate earnings for user for position for 1 week from now we need to
  - take all data from PositionComparison table that have time1>week ago and time2<now
  - calculate sum of positionDiffAmount -> earnings
  - calculate sum of timeDiff -> timeOfPosition (days)
  - calculate sum of amountUSDUSD -> sumAmount
  - calculate (earnings*amountUSDUSD / timeOfPosition)*365/ sumAmount -> APR
  - store this data: user, protocol, position, earnings, avgAmount, APR
- This earnings needs to be recalculated freaquently, ever hour. It might be like:
  - calculate APY from the last monday 00:00 till now
  - so on saturday at 23:00 we calculate the latest APY for this week and it will store forever

# Command

- npm run start
- npm run build
- npm run dev


# Local Development Setup with Docker Compose

### Prerequisites

- Docker and Docker Compose installed on your machine.
- Clone this repository to your local machine.

### Steps to Run the Services

1. **Environment Variables**: Ensure that you have set all the required environment variables for your project. These might be specified in an `.env` file at the root of your project.

    ```bash
    # Create and fill out the .env file with required variables.
    cp .env.example .env
    ```

    **Important**: In the `.env` file, you need to add your Debank access key:

    ```plaintext
    DEBANK_ACCESS_KEY=your_debank_access_key_here
    ```

2. **Build and Start Containers**: Navigate to the root directory of the project where `docker-compose.yml` is located and run:

    ```bash
    docker-compose up --build
    ```

    This command will build and start all the services defined in `docker-compose.yml`.

3. **Check Services**: Open another terminal and run:

    ```bash
    docker ps
    ```

    You should see containers for your services running.

### Access Grafana

1. Open your web browser and navigate to `http://localhost:3001`.

2. You'll be greeted with Grafana's login page. Use the default credentials to log in:

    - **Username**: admin
    - **Password**: admin

3. Upon first login, Grafana will ask you to change your password. This is optional and you can skip it if you are running a local development environment.

4. Once logged in, you should be able to see your pre-configured dashboard and make queries to your PostgreSQL database, if you've set up Grafana provisioning in your Docker Compose setup.

