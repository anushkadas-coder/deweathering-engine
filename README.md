# 📄 Document Deweathering Engine
![Document Deweathering Demo](./assets/demo.jpeg)
An unsupervised machine learning application designed to restore weathered, stained, or degraded documents. This project implements **Robust Principal Component Analysis (RPCA)** using the **Inexact Augmented Lagrange Multiplier (IALM)** algorithm.

## 🚀 The Core Engineering
This engine uses **Pure Matrix Optimization** to solve document degradation. It treats an image as a matrix $D$ and decomposes it into:
- **Low-Rank Matrix (A):** The background interference and stains.
- **Sparse Matrix (E):** The sharp text and handwriting.

The system solves the following optimization problem:
$$\min_{A,E} \|A\|_* + \lambda \|E\|_1 \quad \text{s.t.} \quad A + E = D$$

## 🛠️ Technical Stack
- **Backend:** Python, FastAPI, NumPy, OpenCV (SVD-based optimization)
- **Frontend:** React, Vite, Tailwind CSS (Glassmorphism UI)
- **Version Control:** Git & GitHub

## 📂 Project Structure
- `/backend`: The Python math engine and FastAPI server.
- `/frontend`: The React web application interface.

## ⚙️ How to Run
1. **Start the Backend:**
   ```bash
   cd backend
   uvicorn main:app --reload
