import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const RawHeaders =  createParamDecorator((data:string,context:ExecutionContext)=>{
    const req = context.switchToHttp().getRequest();
    const rawHeaders = req.rawHeaders;
    if(!rawHeaders)
        throw new Error('Raw headers not found') 
    
    return rawHeaders
    
})