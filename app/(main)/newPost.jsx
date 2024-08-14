import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Avatar from '../../components/Avatar'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Header from '../../components/Header'
import { useAuth } from '../../contexts/AuthContexts'
import RichTextEditor from '../../components/RichTextEditor'
import { useRouter } from 'expo-router'
//import Image  from '../../assets/icons/Image'
import Button from '../../components/Button'
//import Video from '../../assets/icons/Video'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker'
import Icon from '../../assets/icons'
import { getSupabaseFileUrl } from '../../services/imageService'
import { Video } from 'expo-av'
import { createOrUpdatePost } from '../../services/postService'
const NewPost = () => {

  const {user}=useAuth();
  const bodyRef=useRef("");
  const editorRef=useRef();
  const router=useRouter();
  const [loading,setLoading]=useState(false);

  const [file,setFile]=useState(null);

  const onPick=async(isImage)=>{
    let mediaConfig={
      mediaTypes:ImagePicker.MediaTypeOptions.Images,
      allowsEditing:true,
      aspect:[4,3],
      quality:0.7
    }
    
    if(!isImage){
      mediaConfig={
        mediaTypes:ImagePicker.MediaTypeOptions.Videos,
        allowsEditing:true,
        
      }
    }
    let result=await ImagePicker.launchImageLibraryAsync(mediaConfig)
    //console.log('result',result.assets[0]);
    if(!result.cancelled){
      setFile(result.assets[0])
    }

  }
  const isLocalFile=(file)=>{
    if(!file) return null;
    if(typeof file=='object') return true;
    return false;

  }

  const getFileType=(file)=>{
    if(!file) return null;
    if(isLocalFile(file)) {
      return file.type;
    } 

    // check image or video for remote files
    if(file.includes('postImage')){
      return 'image';
    }
    return 'video'
  }

  const getFileUri=file=>{
    if(!file) return null;
    if(isLocalFile(file)){
      return file.uri;
    }
    return getSupabaseFileUrl(file)?.uri;
  }
  const onSubmit=async()=>{
   
    if(!bodyRef.current && !file){
      Alert.alert("Create Post","Please add some content or media to post");
      return;
    }

    let data={
      file,
      body:bodyRef.current,
      userId:user?.id
    }
//console.log("data",data);
    setLoading(true);
    let res=await createOrUpdatePost(data);
    setLoading(false);
    //console.log("post res",res);

    // create post
    if(res.success){
      setFile(null);
      bodyRef.current='';
      editorRef.current?.setContentHTML('');
      router.back();
    }else{
      Alert.alert("Post",res.msg);
    }
  }
  return (
    <ScreenWrapper bg='white'>
      <View style={styles.container}>
       <Header title="Create Post"/>
       <ScrollView contentContainerStyle={{gap:20}}>
          <View style={styles.header}>
           
            <Avatar
              uri={user?.image}
              size={hp(6.5)}
              rounded={theme.radius.xl}
            />
            <View style={{gap:2}}>
              <Text style={styles.username}>
                {
              user && user.name
              }
              </Text>
              <Text style={styles.publicText}>
                
             Public
              
              </Text>
            </View>
          </View>
          <View style={styles.textEditor}>
              <RichTextEditor
                editorRef={editorRef}
               
                onChange={body=>bodyRef.current=body}
               
              />
          </View>
          {
            file  && (
              <View style={styles.file}>
              {
                getFileType(file)=='video'?(
                  <Video 
                  style={{flex:1}}
                  source={{uri:getFileUri(file)}}
                  useNativeControls
                  resizeMode='cover'
                  isLooping
                  ></Video>
                ):(
                <Image 
                source={{uri :getFileUri(file)}}
                resizeMode='cover'
                style={{flex:1}}
                ></Image>
                )
              }
                <Pressable style={styles.closeIcon} onPress={()=>setFile(null)}>
                <Icon name="delete" size={20} color="white"/>
                </Pressable>
              </View>
            )
          }

          <View style={styles.media}>
              <Text style={styles.addImageText}>Add to Your Post</Text>
              <View style={styles.mediaIcon}>
                <TouchableOpacity onPress={()=>{onPick(true)}}>
                  <Icon name='image' size={30} color={theme.colors.dark} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{onPick(false)}}>
                  <Icon name='video' size={33} color={theme.colors.dark} />
                </TouchableOpacity>
              </View>
          </View>
       </ScrollView>
       <Button
       buttonStyle={{height:hp(6.2)}}
       title="Post"
      loading={loading}
      hasShadow={false}
      onPress={onSubmit}
       />
      </View>
    </ScreenWrapper>
  )
}

export default NewPost

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginBottom:30,
    paddingHorizontal:wp(4),
    gap:15
  },
  title:{
    fontSize:hp(2.5),
    fontWeight:theme.fonts.semibold,
    color:theme.colors.text,
    textAlign:'center'
  },
  header:{
    flexDirection:'row',
    gap:10,
    alignItems:'center'
  
  },
  media:{
   flexDirection:'row',
   justifyContent:'space-between',
   alignItems:'center',
   borderWidth:1,
   padding:10,
   paddingHorizontal:10,
    borderRadius:theme.radius.xl,
    borderColor:theme.colors.gray,
    borderCurve:'continuous'
  },
  mediaIcon:{
    flexDirection:'row',
    alignItems:'center',
    gap:15
  },
  addImageText:{
  fontSize:hp(2),
  fontWeight:theme.fonts.semibold,
  color:theme.colors.text
  
  },
  username:{
  fontSize:hp(2),
  fontWeight:theme.fonts.semibold,
  color:theme.colors.text
  },
  publicText:{
    fontSize:hp(1.8),
    color:theme.colors.textLight,
    fontWeight:theme.fonts.medium
  },
  file:{
    height:hp(30),
    width:'100%',
    borderRadius:theme.radius.xl,
    overflow:'hidden',
    borderCurve:'continuous',
  },
  closeIcon:{
    position:'absolute',
    top:10,
    right:10,
    backgroundColor:'rgba(255,0,0,0.6)',
    padding:7,
    borderRadius:50,
  }
})