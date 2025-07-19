from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from ...schemas.user import UserCreate, User
from ...crud import user as crud_user
from ...core.database import get_db

router = APIRouter()

@router.post('/register', response_model=User)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = crud_user.get_user_by_email(db, user_in.email)
    if db_user:
        raise HTTPException(status_code=400, detail='Email уже зарегистрирован')
    user = crud_user.create_user(db, user_in)
    return user

@router.post('/add', response_model=User)
def add_user(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = crud_user.get_user_by_email(db, user_in.email)
    if db_user:
        raise HTTPException(status_code=400, detail='Email уже зарегистрирован')
    user = crud_user.create_user(db, user_in)
    return user

@router.put('/{user_id}', response_model=User)
def update_user(user_id: int, user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(crud_user.User).filter(crud_user.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail='Пользователь не найден')
    # Обновляем поля
    db_user.name = user_in.name
    db_user.email = user_in.email
    db_user.role = getattr(user_in, 'role', db_user.role)
    if user_in.password:
        db_user.hashed_password = crud_user.get_password_hash(user_in.password)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get('/', response_model=list[User])
def get_users(db: Session = Depends(get_db)):
    return db.query(crud_user.User).all()

@router.delete('/{user_id}')
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(crud_user.User).filter(crud_user.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail='Пользователь не найден')
    db.delete(db_user)
    db.commit()
    return {"status": "success", "message": "Пользователь удалён"}