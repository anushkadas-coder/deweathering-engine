from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2

app = FastAPI()

# Enable CORS for React frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def soft_threshold(M, penalty):
    """
    Apply the shrinkage operator for L1-norm optimization.
    """
    return np.sign(M) * np.maximum(np.abs(M) - penalty, 0)

def rpca_adaptive(D_mat, k_val, max_iter=100):
    """
    Solves D = A + E using the Inexact Augmented Lagrange Multiplier (IALM).
    A: Low-rank (stains), E: Sparse (text).
    """
    # Initialize variables
    Y = D_mat / np.maximum(np.linalg.norm(D_mat, 2), np.linalg.norm(D_mat, np.inf) / 1e-5)
    A_hat = np.zeros_like(D_mat, dtype=float)
    E_hat = np.zeros_like(D_mat, dtype=float)
    mu = 1.25 / np.linalg.norm(D_mat, 2)
    mu_bar = mu * 1e7
    rho = 1.5
    
    # Adaptive Lambda based on the noise density k-value passed from the endpoint
    lam = k_val / np.sqrt(np.max(D_mat.shape))
    d_norm = np.linalg.norm(D_mat, 'fro')
    
    for i in range(max_iter):
        # 1. Update Sparse Matrix E (Text)
        temp_T = D_mat - A_hat + (1/mu) * Y
        E_hat = soft_threshold(temp_T, lam/mu)
        
        # 2. Update Low-Rank Matrix A (Background Stains) via SVD
        # We use full_matrices=False for speed (Economic SVD)
        U, S, V = np.linalg.svd(D_mat - E_hat + (1/mu) * Y, full_matrices=False)
        S_thresh = soft_threshold(S, 1/mu)
        A_hat = np.dot(U, np.dot(np.diag(S_thresh), V))
        
        # 3. Update Lagrange Multiplier and Penalty Parameter
        Z = D_mat - A_hat - E_hat
        Y = Y + mu * Z
        mu = min(mu * rho, mu_bar)
        
        # Convergence check
        if np.linalg.norm(Z, 'fro') / d_norm < 1e-7:
            break
            
    return E_hat

@app.post("/process")
async def process_image(file: UploadFile = File(...)):
    # Read image from upload
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    
    # Standardize image size for consistent matrix math performance
    # 500x700 is a good balance between detail and SVD speed
    image = cv2.resize(image, (500, 700))
    D = image.astype(float) / 255.0
    
    # --- INTELLIGENT ADAPTIVE LOGIC ---
    # Calculate noise density using standard deviation.
    # A cleaner image has lower variance; a heavily stained one has higher variance.
    noise_density = np.std(D)
    
    # Scale k between 0.4 (clean documents) and 0.8 (extremely weathered)
    # This prevents the algorithm from being too aggressive on light handwriting.
    k = 0.4 + (noise_density * 0.5)
    # ----------------------------------
    
    # Run the adaptive optimization
    Sparse_Text = rpca_adaptive(D, k)
    
    # Convert Sparse Matrix back to a viewable "Clean Document"
    # (1 - abs(Sparse)) flips the data so text is black and paper is white.
    Text_img = np.clip((1 - np.abs(Sparse_Text)) * 255, 0, 255).astype(np.uint8)
    
    # Encode and return as PNG
    _, encoded_img = cv2.imencode('.png', Text_img)
    return Response(content=encoded_img.tobytes(), media_type="image/png")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)