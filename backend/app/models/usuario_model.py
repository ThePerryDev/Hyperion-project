from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base

class Usuario(Base):
    __tablename__ = 'usuarios'
    
    id = Column(Integer, primary_key=True, autoincrement=True)  
    name = Column(String(255), nullable=False)  
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)  
    admin = Column(Boolean, default=False)
    isLogged = Column(Boolean, default=False)  

    def __repr__(self):
        return f'Usuario(id={self.id}, name={self.name}, email={self.email})'
