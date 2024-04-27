# Blockchain Price Tracker

A NestJS application that tracks Ethereum and Polygon prices, provides price history APIs, and sends email alerts for significant price changes.

## Features

- 🕒 Automatically tracks Ethereum and Polygon prices every 5 minutes
- 📈 Sends email alerts for >3% price increases within an hour
- 📊 API endpoint for retrieving hourly prices (last 24 hours)
- ⚡ Price alert system for specific target prices
- 🐳 Fully dockerized application

## Prerequisites

Before running this application, make sure you have the following installed:
- Docker
- Docker Compose
- Node.js 20.11.0 or higher (for local development)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
MORALIS_API_KEY=your_moralis_api_key
RESEND_API=your_resend_api_key
EMAIL_FROM=
```

## Quick Start

- docker-compose up --build

The application will be available at:

- API: [http://localhost:3456](http://localhost:3456)
- Swagger Documentation: [http://localhost:3456/api](http://localhost:3456/api)