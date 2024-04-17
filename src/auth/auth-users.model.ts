export interface IAuthUsers {
    id:string;
    email:string;
    password:string;
    fullName:string;
    isActive:boolean;
    roles:string[];

}
export interface IResponseAuthUsers {
    count : number
    users: IAuthUsers[];


}