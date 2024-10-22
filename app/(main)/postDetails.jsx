import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { fetchPostDetails } from '../../services/postService';
import { hp, wp } from '../../helpers/common';
import { theme } from '../../constants/theme';
import { ScrollView } from 'react-native';
import PostCard from '../../components/PostCard';
import { useAuth } from '../../contexts/AuthContexts';
import Loading from '../../components/Loading';

const PostDetails = () => {


    const {postId}=useLocalSearchParams();

    const {user}=useAuth();

    const router=useRouter();
    console.log('post id',postId);
    const [startLoading,setStartLaoding]=React.useState(true);
    const [post,setPost]=React.useState(null);

    useEffect(()=>{
        getPostDetails();
    },[])

    const getPostDetails=async()=>{
        let res=await fetchPostDetails(postId);
        console.log('post details1',res);
        if(res.success){
            setPost({item:res.data});
        }

        setStartLaoding(false);
    }

    if(startLoading){
        return (
            <View style={styles.center}>
                <Loading/>
            </View>
        )
    }
    console.log("cm",post);

    

  return (
    <View style={styles.container}>
     <ScrollView showsVertcialScrollIndicator={false} contentContainerStyle={styles.list}>
       <PostCard item={post} currentUser={user} router={router}/>
     </ScrollView>
    </View>
  )
}

export default PostDetails

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
        paddingVertical:wp(7),
    },
    inputContainer:{
        flexDirection:'row',
        alignItems:'center',
        gap:10,
    },
    list:{
        paddingHorizontal:wp(5),
        
    },
    sendIcon:{
        alginItems:'center',
        justifyContent:'center',
        borderWidth:0.8,
        borderColor:theme.colors.primary,
        borderRadius:theme.radius.lg,
        borderCurve:'continuous',
        height:hp(5.8),
        width:hp(5.8),

    },
    center:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    notFound:{
        fontSize:hp(2.5),
        color:theme.colors.text,
        fontWeight:theme.fonts.medium
    },
    loading:{
        height:hp(5.8),
        width:hp(5.8),
        justifyContent:'center',
        alignItems:'center',
        transform:[{scale:1.3}]
    }
})