# src/services/google_auth.py
import httpx
from typing import Optional, Dict, Any
from google.auth.transport import requests
from google.oauth2 import id_token
from src.config.auth import auth_settings

class GoogleAuthService:
    """Handle Google OAuth2 authentication."""
    
    def __init__(self):
        self.client_id = auth_settings.google_client_id
    
    async def verify_google_token(self, access_token: str) -> Optional[Dict[str, Any]]:
        """
        Verify Google access token and get user info.
        This method works with tokens from React Native Google Sign-In.
        """
        try:
            # Get user info from Google using the access token
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://www.googleapis.com/oauth2/v2/userinfo",
                    headers={"Authorization": f"Bearer {access_token}"}
                )
                
                if response.status_code == 200:
                    user_info = response.json()
                    return {
                        "google_id": user_info.get("id"),
                        "email": user_info.get("email"),
                        "full_name": user_info.get("name"),
                        "avatar_url": user_info.get("picture"),
                        "verified_email": user_info.get("verified_email", False)
                    }
                return None
        except Exception as e:
            print(f"Error verifying Google token: {e}")
            return None
    
    async def verify_google_id_token(self, id_token_str: str) -> Optional[Dict[str, Any]]:
        """
        Verify Google ID token (alternative method).
        Use this if you're receiving ID tokens instead of access tokens.
        """
        try:
            # Verify the ID token
            idinfo = id_token.verify_oauth2_token(
                id_token_str, 
                requests.Request(), 
                self.client_id
            )
            
            # Validate issuer
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                return None
                
            return {
                "google_id": idinfo.get("sub"),
                "email": idinfo.get("email"),
                "full_name": idinfo.get("name"),
                "avatar_url": idinfo.get("picture"),
                "verified_email": idinfo.get("email_verified", False)
            }
            
        except ValueError as e:
            print(f"Invalid Google ID token: {e}")
            return None
        except Exception as e:
            print(f"Error verifying Google ID token: {e}")
            return None

google_auth_service = GoogleAuthService()