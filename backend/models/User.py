from pydantic import BaseModel,Field

class User(BaseModel):
    name:str=Field(description="Name of user")
    email:str=Field(description="Email of user")
    password:str=Field(description="password for user's account")