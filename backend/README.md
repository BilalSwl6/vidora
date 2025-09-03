# FastAPI Video Management Backend

This project is a FastAPI backend for a video management application, allowing users to add, view, and manage videos, similar to YouTube. The backend is designed with future integration in mind for cloud services like Google or Supabase and includes an open-source recommendation system.

## Project Structure

- **src/**: Contains the main application code.
  - **main.py**: Entry point of the FastAPI application.
  - **config/**: Configuration files for the application.
  - **models/**: Database models for users, videos, channels, and recommendations.
  - **schemas/**: Pydantic schemas for data validation and serialization.
  - **api/**: API routes for authentication, videos, channels, and recommendations.
  - **services/**: Business logic for authentication, video management, channel management, and recommendations.
  - **middleware/**: Middleware for handling authentication.
  - **utils/**: Utility functions for security and other helper functions.

- **alembic/**: Contains migration scripts for database schema changes.
- **tests/**: Unit tests for various functionalities of the application.
- **requirements.txt**: Lists the dependencies required for the project.
- **alembic.ini**: Configuration file for Alembic migrations.
- **.env.example**: Example of environment variables needed for the application.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd backend
   ```

2. **Create a virtual environment**:
   ```
   python -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```
   pip install -r requirements.txt
   ```

4. **Set up the database**:
   - Configure your database settings in `src/config/settings.py`.
   - Run migrations using Alembic:
     ```
     alembic upgrade head
     ```

5. **Run the application**:
   ```
   uvicorn src.main:app --reload
   ```

6. **Access the API**:
   - The API will be available at `http://localhost:8000`.
   - You can view the interactive API documentation at `http://localhost:8000/docs`.

## Future Enhancements

- Integration with cloud services for video storage and processing.
- Implementation of an open-source recommendation system to enhance user experience.
- Additional features for user engagement and content management.

## License

This project is licensed under the MIT License. See the LICENSE file for details.



