import { Button, FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
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
import { fetchPosts } from '../../services/postService';
import PostCard from '../../components/PostCard';
import Loading from '../../components/Loading';
import { getUserData } from '../../services/userService';

var limit=0;
const Home = () => {
  const router=useRouter();
    const {setAuth,user}=useAuth();
    const [posts,setPosts]=React.useState([]);
    const [hasMore,sethasMore]=React.useState(true);

    const handlePostEvent =async(payload)=>{
      //console.log('got post event:',payload);
      if(payload.eventType == 'INSERT' && payload?.new?.id){
        let newPost={...payload.new}
        let res=await getUserData(newPost.user_id);
        newPost.user=res.success ? res.data : {};
        setPosts(prevPosts=>[newPost,...prevPosts]);
      } 
    }
    useEffect(()=>{
      let postChannel=supabase.channel('posts').on('postgres_changes',{
        event :'*',
        schema:'public',
        table:'posts'
      }, handlePostEvent).subscribe();
    //  getPosts();

      return ()=>{
        supabase.removeChannel(postChannel);
      }
    },[])
    const getPosts=async()=>{
      if(!hasMore) return;
      limit=limit+4;
      console.log('fetching piosts',limit);
        let res=await fetchPosts(limit);
       // console.log('post result',res.data[0].user);

       if(res.success){
        if(posts.length==res.data.length){
          sethasMore(false);
        }
        console.log('posts',res.data);
        setPosts(res.data);
       }
    }
    
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

        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={item=>item.id.toString()}
          renderItem={(item)=><PostCard
              item={item}
              currentUser={user}
              router={router}
            />}
            onEndReached={()=>{
              getPosts();
              console.log('end reached');
            }}
            onEndReachedThreshold={0}
            ListFooterComponent={hasMore?(
              <View style={{marginVertical:posts.length==0 ?200 :30}}>

                <Loading/>
              </View>):(
                <Text style={styles.noPosts}>No more posts to show</Text>
              )
            }
        />
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