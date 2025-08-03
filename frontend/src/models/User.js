class User{
    constructor(id,name,email,password)
    {
        if(id)
        {
            this.id = id;
        }
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
export default User;