from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2

app = FastAPI()

# Enable CORS so the React frontend can talk to this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def soft_threshold(M, penalty):
    return np.sign(M) * np.maximum(np.abs(M) - penalty, 0)

def rpca_ialm(D, max_iter=100):
    """
    Robust PCA using Inexact ALM
    D = A + E (A: Low-rank background, E: Sparse text)
    """
    Y = D / np.maximum(np.linalg.norm(D, 2), np.linalg.norm(D, np.inf) / 1e-5)
    A_hat = np.zeros_like(D, dtype=float)
    E_hat = np.zeros_like(D, dtype=float)
    mu = 1.25 / np.linalg.norm(D, 2)
    mu_bar = mu * 1e7
    rho = 1.5
    
    # Your optimized parameter for bold text retention
    lam = 0.5 / np.sqrt(np.max(D.shape)) 
    d_norm = np.linalg.norm(D, 'fro')
    
    for i in range(max_iter):
        # Update Sparse Matrix E
        temp_T = D - A_hat + (1/mu) * Y
        E_hat = soft_threshold(temp_T, lam/mu)
        
        # Update Low-Rank Matrix A via SVD
        U, S, V = np.linalg.svd(D - E_hat + (1/mu) * Y, full_matrices=False)
        S_thresh = soft_threshold(S, 1/mu)
        A_hat = np.dot(U, np.dot(np.diag(S_thresh), V))
        
        # Error check
        Z = D - A_hat - E_hat
        Y = Y + mu * Z
        mu = min(mu * rho, mu_bar)
        
        if np.linalg.norm(Z, 'fro') / d_norm < 1e-7:
            break
            
    return A_hat, E_hat

@app.post("/process")
async def process_image(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    
    # Standardize image size for processing speed
    image = cv2.resize(image, (500, 700))
    D = image.astype(float) / 255.0
    
    # Run RPCA
    _, Text = rpca_ialm(D)
    
    # Post-process the Sparse Matrix (E) to look like a clean document
    Text_img = np.clip((1 - np.abs(Text)) * 255, 0, 255).astype(np.uint8)
    
    _, encoded_img = cv2.imencode('.png', Text_img)
    return Response(content=encoded_img.tobytes(), media_type="image/png")