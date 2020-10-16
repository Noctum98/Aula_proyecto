export class User{
    constructor(
        public id:number,
        public name:string,
        public surname:string,
        public email:string,
        public password:string,
        public image:string,
        public created_at:any,
        public updated_at:any,
        public remember_token:string
    ){}
}