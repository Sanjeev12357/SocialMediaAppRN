import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { RichEditor, RichToolbar,actions } from 'react-native-pell-rich-editor'
import { theme } from '../constants/theme'

const RichTextEditor = ({
    editorRef,
    onChange,
   
    
}) => {
  return (
    <View style={{minHeight:285}}>
      <RichToolbar 
      actions={[
        actions.insertImage,
        actions.setBold,
        actions.setItalic,
        actions.insertBulletsList,
        actions.insertOrderedList,
        actions.insertLink,
        actions.keyboard,
        actions.setStrikethrough,
        actions.setUnderline,
        actions.removeFormat,
        actions.insertVideo,
        actions.checkboxList,
        actions.undo,
        actions.redo,
        actions.heading1,
        actions.heading4
       
      ]}
      iconMap={{
        [actions.heading1]: ({tintColor})=><Text style={{color:tintColor}}>H1</Text>,
        [actions.heading4]: ({tintColor})=><Text style={{color:tintColor}}>H4</Text>
      }}
      style={styles.richBar}
      flatContainerStyle={styles.listStyle}
      selecedIconTint={theme.colors.primaryDark}
      editor={editorRef}
      disabled={false}
      />

      <RichEditor
      ref={editorRef}
      containerStyle={styles.rich}
      editorStyle={styles.contentStyle}
      placeholder='what is on your mind?'
      onChange={onChange}
      />
    </View>
  )
}

export default RichTextEditor

const styles = StyleSheet.create({

  richBar:{
    borderTopRightRadius:theme.radius.xl,
    borderTopLeftRadius:theme.radius.xl,
    backgroundColor:theme.colors.gray
  },
  rich:{

    
    minHeight:240,
    flex:1,
    borderTopWidth:0,
    borderWidth:1,
    borderBottomLeftRadius:theme.radius.xl,
    borderBottomRightRadius:theme.radius.xl,
    borderColor:theme.colors.gray,
    padding:10,
  },
  contentStyle:{
    color:theme.colors.text,
    placeholderColor:theme.colors.gray,  
   
  },
  flatStyle:{
    paddingHorizontal:10,
    gap:3,
  }
  
})