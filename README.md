# RapidQuest - Full Stack Developer Evaluation Task

## Goal

Your mission, should you choose to accept it, will be to build a data visualization web application that can analyze e-commerce data from a sample Shopify store stored in MongoDB. You will build an API layer that reads the data from the database and performs the necessary queries to manipulate data and serve it to the front end through a REST API. The front end should connect to your API and visualize the data using Chart.js or a similar JavaScript visualization library.

## Features

- **API Development**: REST APIs to fetch and process e-commerce data from MongoDB.
- **Data Visualization**: Interactive charts and graphs using Chart.js.
- **Hosting & Deployment**: Instructions for deploying the application.

## MongoDB Collections

The application utilizes the following MongoDB collections from the `RQ_Analytics` database:

- **shopifyCustomers**: Contains customer data.
- **shopifyProducts**: Contains product data.
- **shopifyOrders**: Contains order data.

## Tasks

### 1. API Development

Develop REST APIs to handle the following data queries:

- **Total Sales Over Time**: Aggregate sales data from `shopifyOrders.total_price_set` by daily, monthly, quarterly, and yearly intervals.
- **Sales Growth Rate Over Time**: Calculate and return the growth rate of sales over different time periods.
- **New Customers Added Over Time**: Track new customers based on the `created_at` field in the `shopifyCustomers` collection.
- **Number of Repeat Customers**: Identify and count customers with more than one purchase, grouped by daily, monthly, quarterly, and yearly intervals.
- **Geographical Distribution of Customers**: Visualize customer distribution on a map using the `customers.default_address.city` field.
- **Customer Lifetime Value by Cohorts**: Group customers by the month of their first purchase and visualize their lifetime value.

### 2. Frontend Development

Create a frontend to visualize the data:

- **Chart Types**: Implement charts for total sales, sales growth rate, new customers, repeat customers, geographical distribution, and customer lifetime value.
- **JavaScript Framework**: Use React.js or a similar framework for the frontend.
- **Chart Library**: Utilize Chart.js or an equivalent library for data visualization.

### 3. Hosting & Deployment

Deploy the application to a hosting service to make it publicly accessible. Follow best practices for deployment to ensure the application is reliable and performs well.

## Installation & Setup

### Clone the Repository

    ````bash
    git clone https://github.com/hzratali/RapidQuest-Task.git
    ```


**2**. **Frontend Setup:**

- Navigate to the frontend directory:
    ```bash
    cd ../Frontend
    ```

- Install dependencies:
    ```bash
    npm install
    ```

- Start the frontend development server:
    ```bash
    npm run dev
    ```

**3**. **Backend Setup:**

- Navigate to the backend directory:
    ```bash
    cd ../Backend
    ```

- Install dependencies:
    ```bash
    npm install
    ```

- Create a .env file in the Backend directory with the following content:
    ```bash
    MONGODB_URI = mongodb+srv://db_user_read:LdmrVA5EDEv4z3Wr@cluster0.n10ox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0PORT=5000
    PORT = 5000
    ```

- Start the frontend development server:
    ```bash
    npm start
    ```
