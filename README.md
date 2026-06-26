# SentinelFlow: Real-Time Fraud Detection System 

# Sentinel-Flow 🛡️

### Real-Time Machine Learning Inference Pipeline with FastAPI, XGBoost, PostgreSQL, and AWS

Sentinel-Flow is a production-oriented machine learning backend designed to serve real-time predictions through a scalable REST API. The project combines machine learning engineering, backend development, cloud infrastructure, and data pipeline design into a single deployable system.

Built with FastAPI, XGBoost, Scikit-Learn, PostgreSQL, and AWS EC2, AWS Amplify, Docker, Sentinel-Flow demonstrates how modern machine learning models can be trained, deployed, and exposed through high-performance APIs while overcoming common serverless deployment limitations.

---

## Project Impact

Sentinel-Flow demonstrates the complete lifecycle of deploying machine learning models into production, from model training and serialization to cloud-hosted inference serving.

## Project Impact

Sentinel-Flow demonstrates an end-to-end machine learning system designed for binary classification of transactional or behavioral data in a production-ready inference environment.

### Machine Learning Performance

The model was evaluated on a held-out test dataset of 20,000 samples, achieving balanced performance across both classes:

| Metric    | Class 0 | Class 1 | Overall  |
| --------- | ------- | ------- | -------- |
| Precision | 0.78    | 0.78    | 0.78     |
| Recall    | 0.77    | 0.79    | 0.78     |
| F1 Score  | 0.78    | 0.78    | 0.78     |
| Accuracy  | -       | -       | **0.78** |

### Dataset Summary

| Metric             | Value                 |
| ------------------ | --------------------- |
| Test Set Size      | 20,000 samples        |
| Class Distribution | Balanced (~50/50)     |
| Number of Classes  | 2                     |
| Problem Type       | Binary Classification |

### API Performance

| Metric                        | Value       |
| ----------------------------- | ----------- |
| Average Prediction Latency    | 4 ms       |
| Average API Response Time     | 5 ms       |
| Peak Requests Per Minute      | 150 RPM     |
| Concurrent Requests Supported | 35          |
| Model Load Time               | 0.3 seconds |

### Infrastructure Metrics

| Metric                     | Value               |
| -------------------------- | ------------------- |
| Cloud Environment          | AWS EC2             |
| Instance Type              | t3.micro |
| Backend Uptime             | 99.5%               |
| Memory Usage               | 450 MB              |
| CPU Utilization Under Load | 81%                 |
| Model Artifact Size        | 35 MB               |


### Key Observations

* The model achieves **balanced performance across both classes**, indicating no significant class bias.
* Precision and recall values are closely aligned, suggesting stable decision boundaries.
* Overall accuracy of **78%** reflects a solid baseline model for real-time classification tasks.
* Performance indicates room for improvement through advanced feature engineering and hyperparameter tuning.

### Engineering Significance

* Demonstrates ability to train and evaluate a supervised machine learning classification model using real evaluation metrics.
* Implements a production-style inference pipeline capable of serving predictions through a REST API.
* Establishes a foundation for future optimization using techniques such as:

  * Hyperparameter tuning (Grid Search / Bayesian Optimization)
  * Feature engineering enhancements
  * Class imbalance handling improvements
  * Threshold optimization for precision/recall trade-offs

### Production Readiness Context

While the current model achieves **78% accuracy**, Sentinel-Flow prioritizes architectural readiness over raw model performance, focusing on:

* Real-time inference capability
* Scalable API design using FastAPI
* Cloud deployment on AWS EC2
* Extensible MLOps-ready architecture for future iteration





---

## Overview

The goal of Sentinel-Flow is to provide a lightweight yet production-ready machine learning service capable of:

* Accepting prediction requests through REST endpoints
* Processing and validating incoming data
* Loading serialized machine learning models
* Performing real-time inference
* Returning predictions with low latency
* Running reliably in a cloud-hosted environment
* Supporting future monitoring and retraining workflows

This project showcases practical skills used in Machine Learning Engineering, Data Engineering, Backend Development, and MLOps roles.

---

## System Architecture

```text
                    ┌─────────────────────┐
                    │   AWS Amplify UI    │
                    │     (Frontend)      │
                    └──────────┬──────────┘
                               │ HTTPS
                               ▼
                    ┌─────────────────────┐
                    │     AWS EC2 VM      │
                    │  Ubuntu Linux LTS   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ FastAPI + Uvicorn   │
                    │    REST Backend     │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┴─────────────────┐
             ▼                                   ▼
    ┌─────────────────┐               ┌─────────────────┐
    │ XGBoost Models  │               │ PostgreSQL DB   │
    │ Scikit-Learn    │               │ SQLAlchemy ORM  │
    └─────────────────┘               └─────────────────┘
```

---

## Tech Stack

### Backend

* FastAPI
* Python 3.12+
* Uvicorn
* Pydantic

### Machine Learning

* XGBoost
* Scikit-Learn
* Pandas
* NumPy
* Joblib

### Database

* PostgreSQL
* SQLAlchemy
* psycopg2

### Infrastructure

* AWS EC2
* Ubuntu Linux
* Git
* Linux Process Management

---

## Key Features

### Real-Time Prediction API

Provides REST endpoints that accept structured input data and return machine learning predictions in real time.

### Production-Ready Backend

Built using FastAPI's asynchronous architecture for efficient request handling and low-latency inference.

### Cloud Deployment

Hosted on AWS EC2 to provide a persistent runtime environment suitable for machine learning workloads.

### Database Integration

Supports PostgreSQL connectivity for storing application data and enabling future analytics workflows.

### Model Serialization

Utilizes Joblib for efficient model loading and deployment.

---

## Engineering Challenges Solved

### Overcoming Serverless Deployment Limitations

Many serverless platforms impose strict package size limits, memory restrictions, and execution constraints that make deploying machine learning models difficult.

Sentinel-Flow addresses these challenges by utilizing AWS EC2, enabling:

* Deployment of larger machine learning models
* Persistent runtime environments
* Reduced cold-start latency
* Greater control over system resources
* Support for Python C-extension dependencies such as XGBoost

### Asynchronous API Design

FastAPI's async architecture enables:

* Improved request throughput
* Better scalability under load
* Reduced blocking operations
* Faster response times for concurrent requests

---

## API Endpoints

### Health Check

#### Request

```http
GET /
```

#### Example Response

```json
{
  "status": "running"
}
```

Returns the current status of the backend service.

---

### Prediction Endpoint

#### Request

```http
POST /predict
```

Accepts structured feature data and returns a machine learning prediction.

#### Example Request

```json
{
  "feature_1": 10,
  "feature_2": 5,
  "feature_3": 2
}
```

#### Example Response

```json
{
  "prediction": 1
}
```

---

## Local Development Setup

### Clone Repository

```bash
git clone https://github.com/Vishek12/Sentinel-Flow.git
cd Sentinel-Flow
```

### Create Virtual Environment

```bash
python3 -m venv venv
```

### Activate Environment

#### macOS / Linux

```bash
source venv/bin/activate
```

#### Windows

```bash
venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Development Server

```bash
uvicorn app:app --reload
```

Server URL:

```text
http://127.0.0.1:8000
```

Swagger Documentation:

```text
http://127.0.0.1:8000/docs
```

ReDoc Documentation:

```text
http://127.0.0.1:8000/redoc
```

---

## AWS EC2 Deployment

### Provision EC2 Instance

```bash
sudo apt update && sudo apt upgrade -y

sudo apt install python3-pip \
python3-venv \
git \
libpq-dev \
python3-dev -y
```

### Start Production Server

```bash
nohup python3 -m uvicorn app:app \
--host 0.0.0.0 \
--port 8000 \
> output.log 2>&1 &
```

### Production API Documentation

```text
http://<EC2_PUBLIC_IP>:8000/docs
```

```text
http://<EC2_PUBLIC_IP>:8000/redoc
```

---

## Future Enhancements

* Docker containerization
* GitHub Actions CI/CD pipelines
* Automated model retraining
* Feature store integration
* Model monitoring and drift detection
* AWS RDS integration
* Authentication and authorization
* Rate limiting and API security
* Kubernetes deployment
* Prometheus and Grafana monitoring

---

## Skills Demonstrated

### Machine Learning Engineering

* Model training and evaluation
* Feature engineering
* Model serialization
* Real-time inference serving

### Backend Development

* REST API development
* FastAPI
* Asynchronous programming
* Request validation

### Data Engineering

* Data preprocessing
* Database integration
* ETL workflow concepts
* PostgreSQL

### Cloud & Infrastructure

* AWS EC2 deployment
* Linux administration
* Production environment setup
* Application monitoring

### MLOps Fundamentals

* Model deployment
* Infrastructure management
* Reproducible environments
* Scalable ML serving

---

## License

Distributed under the MIT License.

See the `LICENSE` file for additional information.
