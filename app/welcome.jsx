import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import Button from '../components/Button'
import { useRouter } from 'expo-router'

const Welcome = () => {
    const router=useRouter();
  return (
    <ScreenWrapper bg="white">
        <StatusBar style='dark'/>
        <View style={styles.container}>
            <Image style={styles.welcomeImage}
            resizeMode='contain'
            source={require('../assets/images/welcome.png')}
            />

            <View style={{gap:20}}>
                <Text style={styles.title}>LinkUp!</Text>
                <Text style={styles.punchline}>
                    Where every thought finds an home and every home finds a friend
                </Text>
            </View>
            <View style={styles.footer}>
                <Button
                title='Getting Started'
                buttonStyle={{marginalHorizontal:wp(3)}}
                onPress={()=>{router.push('signUp')}}
                />
                <View style={styles.bottomTextContainer}>
                <Text style={styles.loginText}>
                    Already have an account?
                </Text>
                <Pressable onPress={()=>{router.push('login')}}>
                    <Text style={[styles.loginText,{color:theme.colors.primaryDark,fontWeight:theme.fonts.semibold}]}>Login</Text>
                </Pressable>
                </View>
            </View>
        </View>
    </ScreenWrapper>
  )
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'space-around',
        alignItems:'center',
        backgroundColor:'white',
        paddingHorizontal:wp(4)
    },
    welcomeImage:{
        width:wp(100),
        height:hp(40),
        alignSelf:'center'
    },
    title:{
        color:theme.colors.primatext,
        fontSize:hp(4),
        textAlign:'center',
        fontWeight:theme.fonts.extraBold,
    },
    punchline:{
        textAlign:'center',
        paddingHorizontal:wp(10),
        fontSize:hp(1.7),
        color:theme.colors.text,
    },
    footer:{
        gap:30,
        width:'100%'
    },
    bottomTextContainer:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap:5,

    },
    loginText:{
        textAlign:'center',
        color:theme.colors.text,
        fontSize:hp(1.7),
    }

    
})

export default Welcome