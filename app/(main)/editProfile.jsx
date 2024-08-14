import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Header from '../../components/Header'
import { Image } from 'expo-image'
import { getUserImageSrc, uploadFile } from '../../services/imageService'
import { useAuth } from '../../contexts/AuthContexts'
import Camera from '../../assets/icons/Camera'
import Input from '../../components/Input'
import User from '../../assets/icons/User'
import Call from '../../assets/icons/Call'
import Location from '../../assets/icons/Location'
import Button from '../../components/Button'
import { updateUser } from '../../services/userService'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'

const EditProfile = () => {
  const router=useRouter();
  
  const {user:currentUser,setUserData}=useAuth();
  console.log('currentUser',currentUser)
  const [user,setUser]=useState({
    name:'',
    image:null,
    bio:'',
    address:''
  });
  const[loading,setLoading]=useState(false);

  useEffect(()=>{
    if(currentUser){
      setUser({
        name:currentUser.name || '',
      
        image:currentUser.image || null,
        bio:currentUser.bio   || '',
        address:currentUser.address || ''
      })
    }
  },[currentUser])
  const onPickImage=async()=>{
      let result=await ImagePicker.launchImageLibraryAsync({
        mediaTypes:ImagePicker.MediaTypeOptions.Images,
        allowsEditing:true,
        aspect:[4,3],
        quality:0.7
    
      })

      if(!result.cancelled){
        setUser({...user,image:result.assets[0]})
      }
  }

  const onSubmit=async()=>{
    let userData = {...user};
    console.log('userData',userData);
    let {name,phoneNumber,bio,address,image}=userData;
    if(!name  || !bio || !address || !image){
      Alert.alert("Edit Profile","Please fill all fields");
      return;
    }
    setLoading(true);
    if(typeof image =='object'){ 
        let imageRes=await uploadFile('profiles',image?.uri,true);
        if(imageRes.success){
          userData.image=imageRes.data;
        }else{
          userData.image=null;
        }


     }

    const res=await updateUser(currentUser?.id,userData);
    setLoading(false);
    console.log('res',res); 
    if(res.success){
      setUserData({...currentUser,...userData});
      router.back();
    }

  }
  let imageSource=user.image && typeof user.image =='object' ? user.image.uri :  getUserImageSrc(user.image);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <ScrollView style={{flex:1}} >
          <Header title="Edit Profile"/>

          <View style={styles.form}>
            <View style={styles.avatarContainer}>
                <Image source={imageSource} style={styles.avatar}/>
                <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                    <Camera size={20} strokeWidth={2.5} />
                </Pressable>
            </View>
            <Text style={{fontSize:hp(1.5) ,color:theme.colors.text}}>
            Please fill your profile details
            </Text>
            <Input
            icon={<User/>}
            placeholder="Full Name"
            value={user.name}
            onChangeText={(value)=>{setUser({...user,name:value})}}
            />
        
            <Input
            icon={<Location/>}
            placeholder="address"
            value={user.address}
            onChangeText={(value)=>{setUser({...user,address:value})}}
            />
            <Input
            icon={<User/>}
            placeholder="Bio"
            value={user.bio}
            multiline={true}
            containerStyle={styles.bio}
            onChangeText={(value)=>{setUser({...user,bio:value})}}
            />

            <Button title="Update" loading={loading} onPress={onSubmit} />
          </View>
          
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  container:{
    flex:1,
    padddingHorizontal:wp(4)
  },
  avatarContainer:{
    height:hp(14),
    width:hp(14),
    alignSelf:'center',

  },
  form:{
    gap:25
  },
  avatar:{
    width:'100%',
    height:'100%',
    borderRadius:theme.radius.xxl*1.8,
    borderCurve:'continuous',
    borderWidth:1,
    borderColor:theme.colors.darkLight,
  },
  cameraIcon:{
    position:'absolute',
    bottom:0,
    right:-10,
    padding:8,
    borderRadius:50,
    backgroundColor:'white',
    shadowColor:theme.colors.textLight,
    shadowOffset:{width:0,height:4},
    shadowOpacity:0.3,
    shadowRadius:5,
    elevation:7,
  },
  bio:{
    flexDirection:'row',
    height:hp(15),
    alignItems:'flex-start',
    paddingVertica:15
  }
})