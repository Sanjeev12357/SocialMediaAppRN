import * as FileSystem from 'expo-file-system';
import { supabase } from '../lib/supabase';
import { decode } from 'base64-arraybuffer';
import { supabaseUrl } from '../constants';

export const getUserImageSrc=imagePath=>{
    if(imagePath) {
        return getSupabaseFileUrl(imagePath);
    }else{
        return require('../assets/images/defaultUser.png')
    }
}

export const getSupabaseFileUrl=filePath=>{
    if(filePath){
        return `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`;
    }
    return null;
}

export const uploadFile=async(folderName,fileUri,isImage=true)=>{
    try{
        let fileName=getFilePath(folderName,isImage);
        const fileBase64=await FileSystem.readAsStringAsync(fileUri,
            {encoding:FileSystem.EncodingType.Base64});

        let imageData= decode(fileBase64);

        let {data,error}=await supabase.storage.from('uploads').upload(fileName,imageData,{
            cacheControl:'3600',
            upsert:false,
            contentType:isImage?'image/*':'video/*'
        });
        if(error){
            throw new Error(error.message);
        }

       // console.log('data',data);

        return {success:true,message:"file uploaded",data:data.path}



    }catch(error){
        console.log('error',error);
        return {success:false,error:error.message}
    }
}

export const getFilePath=(folderName,isImage)=>{
    return `/${folderName}/${(new Date()).getTime()}${isImage?'.png':'.mp4'}`;
    // profiles/1234567890.png
    // images/1234567890.png
}