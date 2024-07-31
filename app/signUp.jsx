import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'

import { theme } from '../constants/theme'
import Icon from '../assets/icons'
import { StatusBar } from 'expo-status-bar'
import BackButton from '../components/BackButton'
import { useRouter } from 'expo-router'
import { hp, wp } from '../helpers/common'
import Input from '../components/Input'
import Button from '../components/Button'
import { supabase } from '../lib/supabase'

const signUp = () => {
    const emailRef=useRef("");
    const passwordRef=useRef("");
    const nameRef=useRef("");

    const [loading,setLoading]=useState(false);
    const [showPassword,setShowPassword]=useState(false);

    

    const router=useRouter();
    const onSubmit=async()=>{
        if(!emailRef.current || !passwordRef.current){
            Alert.alert("Sign up","Please fill all fields");
            return;
        }
        let name=nameRef.current.trim();
        let email=emailRef.current.trim();
        let password=passwordRef.current.trim();
        setLoading(true);
        //supabase auth
        const {data:{session},error}=await supabase.auth.signUp({
            email,
            password,
            options:{
                data:{
                    name
                }
            }

        });
        setLoading(false);

        // console.log('session',session);
        // console.log('error',error); 
        if(error){
            Alert.alert("Sign up",error.message);
            setLoading(false);
        }

        //good to go

    }
  return (
    <ScreenWrapper bg="white">
      <StatusBar style='dark' />
      <View style={styles.container}>
        <BackButton router={router}/>

        <View>
            <Text style={styles.welcomeText}>Let's,</Text>
            <Text style={styles.welcomeText}>Get Started</Text>
        </View>

        <View style={styles.form}>
            <Text style={{fontSize:hp(1.5),color:theme.colors.text}}>
            Please fill the details to create an account
            </Text>
            <Input
            icon={<Icon name="user" size={26} strokeWidth={1.6}/>}
            placeholder='Enter Your Name'
            onChangeText={(value)=>nameRef.current=value}
            />
            <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6}/>}
            placeholder='Email Address'
            onChangeText={(value)=>emailRef.current=value}
            />
            <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6}/>}
            placeholder='Enter Your Password'
            secureTextEntry={!showPassword}
            onChangeText={(value) => passwordRef.current = value}
            
            />
            <Text style={styles.forgotPassword}>
            Forgot Password ?

            </Text>

            <Button
            
            title={'Sign up'}
            loading={loading}
            onPress={onSubmit}
            />
        </View>

        <View style={styles.footer}>
        <Text style={styles.footerText} > Already have an account</Text>
        <Pressable onPress={()=>router.push('login')}>
            <Text style={[styles.footerText,{color:theme.colors.primaryDark,fontWeight:theme.fonts.semibold}]}>Login</Text>
        </Pressable>
        </View>
      </View>
      
    </ScreenWrapper>
  )
}

export default signUp

const styles = StyleSheet.create({
    container:{
        flex:1,
        gap:45,
        paddingHorizontal:wp(5),
    },
    welcomeText:{
        fontSize:hp(4),
        fontWeight:theme.fonts.bold,
        color:theme.colors.text
    },
    form:{
        gap:25,
    },
    forgotPassword:{
        textAlign:'right',
        fontWeight:theme.fonts.semibold,
        color:theme.colors.text,

    },
    footer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap:5,
    },
    footerText:{
        textAlign:'center',
        color:theme.colors.text,
        fontSize:hp(1.7),
    }
})