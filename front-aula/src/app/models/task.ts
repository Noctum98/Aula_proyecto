export class Task{
    constructor(
        public id:number,
        public classroom_id:number,
        public title:string,
        public description:string,
        public content:string,
        public file:string,
        public created_at:any,
        public updated_at:any
    ) {
        
    }
}