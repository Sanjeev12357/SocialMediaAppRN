import { StyleSheet, Text, Touchable, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { createComment, fetchPostDetails, removeComment } from '../../services/postService';
import { hp, wp } from '../../helpers/common';
import Input from '../../components/Input'
import { theme } from '../../constants/theme';
import { ScrollView } from 'react-native';
import PostCard from '../../components/PostCard';
import { useAuth } from '../../contexts/AuthContexts';
import Loading from '../../components/Loading';
import { TouchableOpacity } from 'react-native';
import Icon from '../../assets/icons';
import Send from '../../assets/icons/Send';
import CommentItem from '../../components/CommentItem';
import { supabase } from '../../lib/supabase';
import { getUserData } from '../../services/userService';

const PostDetails = () => {


    const {postId}=useLocalSearchParams();
    
    const inputref=useRef(null);
    const commentref=useRef('null');

    const {user}=useAuth();

    const router=useRouter();
   // console.log('post id',postId);
    const [startLoading,setStartLaoding]=React.useState(true);
    const [post,setPost]=React.useState(null);
    const [loading,setLoading]=React.useState(false);
    //console.log('post details',post?.item?.comments);


    const handleNewComment = async (payload) => {
      // Add debugging
      console.log('Payload received:', payload);
      
      try {
        console.log('got a new comment', payload.new);
        
        if (payload.new) {
          let newComment = { ...payload.new };
          let res = await getUserData(newComment.userId);
          newComment.user = res.success ? res.data : {};
          
          setPost(prevPost => ({
            ...prevPost,
            item: {
              ...prevPost.item,
              comments: [newComment, ...prevPost.item.comments]
            }
          }));
        }
      } catch (error) {
        console.error("Error handling new comment:", error);
      }
    };
    
    useEffect(() => {
      // Add debugging
      console.log('Setting up subscription for postId:', postId);
      
      const channel = supabase.channel(`comments-${postId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'comments',
            filter: `post_id=eq.${postId}`,
          },
          handleNewComment
        );
    
      // Add subscription status logging
      channel
        .subscribe((status) => {
          console.log('Subscription status:', status);
        });
    
      getPostDetails();
    
      return () => {
        console.log('Cleaning up subscription');
        supabase.removeChannel(channel);
      };
    }, [postId]);
    const getPostDetails=async()=>{
        let res=await fetchPostDetails(postId);
      //  console.log('post details1',res);
        if(res.success){
            setPost({item:res.data});
        }

        setStartLaoding(false);
    }

    const onDeleteComment=async(comment)=>{
      console.log('delete comment',comment);
      let res=await removeComment(comment?.id);
      if(res.success){
        setPost(prevPost=>{
          let updatedPost ={...prevPost};
          updatedPost.item.comments=updatedPost.item.comments.filter(c=>c.id!=comment.id);
          return updatedPost;
        })
      }else{
        Alert.alert('could not delete the comment');
      }
    }

    const oneNewcomment=async()=>{

        if(!commentref.current) return null;

        let data={
            userId:user?.id,
            postId:post?.item?.id,
            text:commentref.current
        }

        console.log('new comment',data);


        setLoading(true);
        let res=await  createComment(data);

        setLoading(false);

        if(res.success){
            inputref?.current?.clear();
            commentref.current='';

    }else{
        Alert.alert('could not add comment');

    }
}
    if(startLoading){
        return (
            <View style={styles.center}>
                <Loading/>
            </View>
        )
    }
   // console.log("cm",post);

   if(!post){
         return (
              <View style={styles.center} >
                <Text style={styles.notFound}>Post not found</Text>
              </View>
         )
   }

    

  return (
    <View style={styles.container}>
     <ScrollView showsVertcialScrollIndicator={false} contentContainerStyle={styles.list}>
       <PostCard item={{...post,comments:[{count:post?.item?.comments.length}]}} currentUser={user} showMoreIcon={false} router={router}/>

       {/**comment input */}

       <View style={styles.inputContainer}>
            <Input
                inputRef={inputref}
                onChangeText={value=>commentref.current=value}
                placeholder="Add a comment"
                placeholderTextColor={theme.colors.textLight}
                containerStyle={{
                    flex:1,
                    height:hp(6.2),
                    borderRadius:theme.radius.xl
                }}
            />
                {

                    loading?(

                        <View style={styles.loading}> 
                        <Loading size="small" />
                        </View>
                    ):(
                        <TouchableOpacity style={styles.sendIcon} onPress={oneNewcomment}>
                        <Send size={20} color={theme.colors.primary}
                        
                        
                        />
                    </TouchableOpacity>
                    )
                }
           
       </View>

       <View style={{marginVertical:15,gap:17}}>
                {
       post?.item?.comments?.map(comment=><CommentItem
       key={comment?.id?.toString()}
       canDelete={comment?.user?.id==user?.id}
       onDelete={onDeleteComment}
       item={comment}
       />)}

        {
       post?.item?.comments?.length ==0 &&(
           <Text style={styles.notFound}>No comments found</Text>
       )}
       
       </View>
     </ScrollView>

    </View>
  )
}

export default PostDetails

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      paddingVertical: wp(7),
    },
    inputContainer: {
      flexDirection: 'row', // Changed to row to align Input and sendIcon horizontally
      alignItems: 'center',
      gap:10
    },
    list: {
      paddingHorizontal: wp(5),
    },
    sendIcon: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 0.8,
      borderColor: theme.colors.primary,
      borderRadius: theme.radius.lg,
      height: hp(5.8),
      width: hp(5.8),
      marginLeft: wp(2), // Added margin to create space between Input and sendIcon
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notFound: {
      fontSize: hp(2.5),
      color: theme.colors.text,
      fontWeight: theme.fonts.medium,
    },
    loading: {
      height: hp(5.8),
      width: hp(5.8),
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ scale: 1.3 }],
    },
  });
  