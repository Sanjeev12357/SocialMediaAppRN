import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import Avatar from './Avatar'
import { hp, wp } from '../helpers/common'
import moment from 'moment'
import Icon from '../assets/icons'
import RenderHTML from 'react-native-render-html'
import { Image } from 'expo-image'
import { getSupabaseFileUrl } from '../services/imageService'
import { Video } from 'expo-av'



const PostCard = ({
    item,
    currentUser,
    router,
    hasShadow=true,
}) => {
        const textStyles={
         
                color:theme.colors.dark,
                fontSize:hp(1.75)
            }
        
        const tagStyles={
            div:textStyles,
            p:textStyles,
            ol:textStyles,
            h1:{
                color:theme.colors.dark,

            },
            h4:{
                color:theme.colors.dark,
                
            }
        }
       // console.log('item',item);
       const shadowStyle={
        shadowOffset:{
            width:0,
            height:2,

        },
        shadowOpacity:0.06,
        ShadowRadius:6,
        elevation:1
    }

    //console.log('item',item.item.user.name);
    const createAt=moment(item?.created_at).format('MMM D');
    const liked=false;
    const likes=[]
    const openPostDetails=()=>{
    }
  return (
    <View style={[styles.container, hasShadow && shadowStyle]}>
  
      <View style={styles.header}>
        <View style={styles.userInfo}>
            <Avatar
                size={hp(4.5)}
                uri={item?.item?.user?.image}
                rounded={theme.radius.md}
            />
            <View style={{gap:2 }}>
                <Text style={styles.username} >
                    {item?.item?.user?.name}
                </Text>
                <Text style={styles.postTime} >
                {createAt}
            </Text>
            </View>
        </View>
        <TouchableOpacity onPress={openPostDetails}>
            <Icon name="threeDotsHorizontal" size={hp(3.4)} strokeWidth={3} color={theme.colors.text}/>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.postBody}>
           {
            item?.item?.body && (
                <RenderHTML
                    contentWidth={wp(100)}
                    source={{html:item?.item?.body}}
                    tagsStyles={tagStyles}
                />
            )
           }
        </View>
        {
            item?.item?.file && item?.item?.file?.includes('postImages')&&(
                <Image
                source={getSupabaseFileUrl(item?.item?.file)}
                transition={100}
                style={styles.postMedia}
                contentFit='cover'
                />
            )
        }

        {
                item?.item?.file && item?.item?.file?.includes('postVideos')&&(
                    <Video
                    source={{uri:getSupabaseFileUrl(item?.item?.file)}}
                    style={styles.postMedia}
                    resizeMode='cover'
                    useNativeControls
                    isLooping
                    />
                )

        
        }

       
      </View>
      <View style={styles.footer}>
                <View style={styles.footerButton}>
                        <TouchableOpacity>
                            <Icon name="heart" size={hp(2.5)} fill={liked? theme.colors.rose : 'transparent'} color={liked? theme.colors.rose :theme.colors.textLight}/>
                        </TouchableOpacity>
                        <Text style={styles.count} >
                            {
                                likes?.length
                            }
                        </Text>
                </View>
                <View style={styles.footerButton}>
                        <TouchableOpacity>
                            <Icon name="comment" size={hp(2.5)} color={theme.colors.textLight}/>
                        </TouchableOpacity>
                        <Text style={styles.count} >
                            {
                                0
                            }
                        </Text>
                </View>
                <View style={styles.footerButton}>
                        <TouchableOpacity>
                            <Icon name="share" size={hp(2.5)} color={theme.colors.textLight}/>
                        </TouchableOpacity>
                        
                </View>
      </View>
    </View>
  )
}

export default PostCard
const styles = StyleSheet.create({
    container: {
      gap: 10,
      marginBottom: 15,
      borderRadius: theme.radius.xxl * 1.1,
      borderCurve: 'continuous',
      padding: 10,
      paddingVertical: 12,
      backgroundColor: 'white',
      borderWidth: 0.5,
      borderColor: theme.colors.gray,
      shadowColor: '#000',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    username: {
      color: theme.colors.dark,
      fontSize: hp(2),
      fontWeight: '600',
    },
    postTime: {
      color: theme.colors.gray,
      fontSize: hp(1.5),
    },
    content: {
      marginTop: 10,
    },
    postBody: {
      marginTop: 10,
    },
    postMedia:{
    height:hp(40),
    width:'100%',
    borderRadius:theme.radius.xl,
    borderCurve:'continuous',

    },
    footer:{
       flexDirection:'row' ,
       alignItems:'center',
       gap:15,
       },

       footerButton:{
       marginLeft:5,
       flexDirection:'row',
       alignItems:'center',
       gap:4,
       },
       actions:{
       flexDirection:'row',
       alignItems:'center',
       gap:18
       },
       count:{
       color:theme.colors.text,
       fontSize:hp(1.8),
       }
  });
  