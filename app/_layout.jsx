import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { AuthProvider, useAuth } from '../contexts/AuthContexts'
import { supabase } from '../lib/supabase'
import { getUserData } from '../services/userService'


const _layout=()=>{
  return (
    <AuthProvider>
      <MainLayout/>
    </AuthProvider>
  )
}

const MainLayout = () => {
  const {setAuth,setUserData,user} = useAuth();
  const router=useRouter();

  useEffect(()=>{
    supabase.auth.onAuthStateChange((event,session)=>{
      //console.log('session user',session?.user);
      
      if(session){
        //set auth
        //move to home screen
      setAuth(session?.user);
      updateUserData(session?.user,session.user.email);
     // console.log(user);
      router.replace("/home");

      }else{
        //set auth to null 
        //move to welcome screen
        setAuth(null);
        router.replace("/welcome");
      }
    })
  },[])

  const updateUserData=async(user,email)=>{
    let res=await getUserData(user?.id);
    if(res.success){
    setUserData({...res.data,email});
     // console.log('user data',user?.user_metadata);
    }
  }
  return (
    <Stack
        screenOptions={{
            headerShown:false
        }}
    />
  )
}

export default _layout