import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

export const createOrUpdatePost=async(post)=>{
    try {
        //upload image

        if(post.file && typeof post.file =='object'){
            let isImage=post?.file?.type=='image';
            let folderName=isImage?'postImages':'postVideos';
            let fileresult =await uploadFile(folderName,post?.file?.uri,isImage);
            if(fileresult.success) post.file=fileresult.data;
            else {
                return fileresult
            }

        }

        const {data,error}=await supabase.from('posts').upsert(post).select().single();

        if(error){
            console.log("create Post error",error);
        return {success:false,msg:"could not create the post"}
        }

        return {success:true,data:data};
    } catch (error) {
        console.log("create post error",error);
        return {success:false,msg:"could not create the post"}
    }
}

export const fetchPosts=async(limit=10)=>{
    try {
        //upload image

        const {data,error}=await supabase.from('posts').select('*, user:users (id,name,image),postLikes(*)').order('created_at',{ascending:false}).limit(limit);

        if(error){
            console.log("fetch Post error",error);
            return {success:false,msg:"could not fetch the post"}
        }

        return {success:true,data:data};
    } catch (error) {
        console.log("fetch post error",error);
        return {success:false,msg:"could not fetch the post"}
    }
}


export const createPostLike=async(postLike)=>{
    try {
        //upload image  
        const {data,error}=await supabase.from('postLikes').insert(postLike).select().single();



        if(error){
            console.log(" post  like error",error);
        return {success:false,msg:"could not like the post"}
        }

        return {success:true,data:data};

    } catch (error) {
        console.log(" post  like error",error);
        return {success:false,msg:"could not like the post"}
    }
}



export const removePostLike=async(postId,userId)=>{
    try {
        //upload image  
        const {error}=await supabase.from('postLikes').delete().eq('userId',userId).eq('postId',postId);
        


        if(error){
            console.log(" post  like error",error);
        return {success:false,msg:"could not like the post"}
        }

        return {success:true};

    } catch (error) {
        console.log(" post  like error",error);
        return {success:false,msg:"could not like the post"}
    }
}


//fetch post details 

export const fetchPostDetails=async(postId)=>{
    try {
        //upload image

        const {data,error}=await supabase.from('posts').select('*, user:users (id,name,image),postLikes(*)').eq('id',postId).single();

        if(error){
            console.log("fetch Post error",error);
            return {success:false,msg:"could not fetch the post"}
        }

        return {success:true,data:data};
    } catch (error) {
        console.log("fetch post error",error);
        return {success:false,msg:"could not fetch the post"}
    }
}

