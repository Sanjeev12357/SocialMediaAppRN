import { supabase } from "../lib/supabase";

export const getUserData=async(userId)=>{
    try{ 
        const {data,error}=await supabase.from('users').select().eq('id',userId).single();
        if(error){
            throw new Error(error.message);
        }
        return {success:true,message:"data",data}  
    }catch(error){
        console.log('error',error);
        return {success:false,error:error.message}
    }
}