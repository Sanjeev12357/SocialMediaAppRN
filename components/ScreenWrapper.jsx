import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ScreenWrapper = ({children,bg}) => {
    const {top}=useSafeAreaInsets();
    const paddingTop=top>0?top+5 :30;
  return (
    <View style={{flex:1,backgroundColor:bg,paddingTop:paddingTop,paddingHorizontal:8}}>
      {children}
    </View>
  )
}

export default ScreenWrapper