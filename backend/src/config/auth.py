from pydantic_settings import BaseSettings

class AuthSettings(BaseSettings):

    secret_key: str = ""
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 30
    
    # Google OAuth2
    google_client_id: str = ""
    google_client_secret: str =""
    google_redirect_uri: str = ""
    
    # React Native
    react_native_scheme: str = ""

    # CORS
    cors_origins: str = ""
    
    class Config:
        env_file = ".env"
        extra = "ignore"

    
    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",")]

auth_settings = AuthSettings()
