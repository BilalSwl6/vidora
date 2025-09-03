"""Starting File - Main Fie to start App"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
# from fastapi.security import HTTPBearer
from src.config.auth import auth_settings
from src.api import auth, videos, recommendations, channels # ,users -> used later


# Create FastAPI app
app = FastAPI(
    title="Video Platform API",
    description="A secure video platform API with JWT and OAuth2 authentication",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Security middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure based on your deployment
)

# CORS middleware for React Native
app.add_middleware(
    CORSMiddleware,
    allow_origins=auth_settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)


# # Include routers
app.include_router(auth.router)
app.include_router(videos.router)
app.include_router(channels.router, prefix="", tags=["channels"])
# app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])


# Include routers
# app.include_router(auth.router)
# app.include_router(videos.router)
# app.include_router(channels.router)
# app.include_router(recommendations.router)

# Health check endpoint
@app.get("/")
async def root():
    """To see app is working or not?"""
    return {
        "message": "Video Platform API",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    """Check Health of app"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
