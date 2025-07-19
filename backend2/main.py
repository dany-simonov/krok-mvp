from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine
from app.models import Base
from app.api import api_router
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.crud import user as crud_user
from app.schemas.user import UserCreate

# Создаем таблицы в базе данных
Base.metadata.create_all(bind=engine)

# Создаем mock-пользователя, если его нет
with SessionLocal() as db:
    admin_email = 'admin@krokos.com'
    if not crud_user.get_user_by_email(db, admin_email):
        admin_user = UserCreate(
            name='Администратор',
            email=admin_email,
            password='admin123'  # Можно поменять на более безопасный
        )
        crud_user.create_user(db, admin_user)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def read_root():
    return {"message": "Krok Nodes API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)