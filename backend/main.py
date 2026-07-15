from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
import routes
import models


# Create the database tables on startup if they don't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)
