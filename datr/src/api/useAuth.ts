import React from 'react'
import { useState } from 'react'
import { useAuthStore } from '../store/AuthStore'

export const useAuth = () => {
  return useAuthStore((state)=>({access:state.access,refresh:state.refresh,updateTokens:state.updateTokens,updateUser:state.updateUser,user:state.user,generalUpdate:state.generalUpdate,updateVerified:state.updateVerified,updateImageUrl:state.updateImage}))
}
