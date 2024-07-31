import { Button, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../contexts/AuthContexts';
import { supabase } from '../../lib/supabase';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import Heart from '../../assets/icons/Heart';
import Plus from '../../assets/icons/Plus';
import User from '../../assets/icons/User';
import { useRouter } from 'expo-router';
import Avatar from '../../components/Avatar';


const Home = () => {
  const router=useRouter();
    const {setAuth,user}=useAuth();

    
  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>LinkUp</Text>
          <View style={styles.icons}>
            <Pressable onPress={()=>router.push('notification')}>
              <Heart size={hp(3.2)} strokeWidth={2} color={theme.colors.text}/>
            </Pressable>
            <Pressable onPress={()=>router.push('newPost')} >
              <Plus size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={()=>router.push('profile')}>
              <Avatar
              uri={user?.image}
              size={hp(4.3)}
              rounded={theme.radius.sm}
              style={{borderWidth:2}}
              />
            </Pressable>
          </View>
        </View>
      
      </View>
 
    </ScreenWrapper>
  )
}

export default Home

const styles = StyleSheet.create({
  container :{
    flex:1,

  },
  header:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginBottom:10,
    marginHorizontal:wp(4)
  },
  title:{
    color:theme.colors.text,
    fontSize:hp(3.2),
    fontWeight:theme.fonts.bold
  },
  avatarImage:{
    height:hp(4.3),
    width:hp(4.3),
    borderRadius:theme.radius.sm,
    borderCurve:'continuous',
    borderColor:theme.colors.primary,
    borderWidth:3,
  },
  icons:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    gap:18,

  },
  listStyle:{
    paddingTop:20,
    paddingHorizontal:wp(4),

  },
  noPosts:{
    fontSize:hp(2),
    textAlign:'center',
    color:theme.colors.text,
  },
  pill:{
    position:'absolute',
    right:-10,
    top:-4,
    hegiht:hp(2.2),
    width:hp(2.2),
    justifyContent:'center',
    alignItems:'center',
    borderRadius:20,
    backgroundColor:theme.colors.roseLight,

  },
  pillText:{
    color:'white',
    fontSize:hp(1.5),
    fontWeight:theme.fonts.bold
  }
})