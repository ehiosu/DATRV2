import React from 'react'
import { useState } from 'react'
import { useAuthStore } from '../store/AuthStore'

export const useAuth = () => {
  return useAuthStore((state)=>state)
}
