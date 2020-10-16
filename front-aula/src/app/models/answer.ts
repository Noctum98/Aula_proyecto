export class Answer{
    constructor(
        public id:number,
        public task_id:number,
        public member_id:number,
        public content:string,
        public file:string,
        public created_at:any,
        public updated_at:any
    ) {
        
    }
}