import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { cn } from '../../app/utils'


interface User {
  name: string
  image?: string
}

interface AvatarGroupProps {
  users?: User[]
  max?: number
  size?: 'sm' | 'md' | 'lg'
}

export default function AvatarGroup({ users = [], max = 4, size = 'md' }: AvatarGroupProps) {
  const visibleUsers = users.slice(0, max)
  const remainingUsers = Math.max(users.length - max, 0)

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }

  if (users.length === 0) {
    return null
  }

  return (
    <div className="flex -space-x-4">
      {visibleUsers.map((user, index) => (
        <Avatar
          key={index}
          className={cn(
            sizeClasses[size],
            "border-2 border-background",
            index > 0 && "-ml-4"
          )}
        >
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name} />
          ) : null}
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      ))}
      {remainingUsers > 0 && (
        <Avatar
          className={cn(
            sizeClasses[size],
            "border-2 border-background bg-muted -ml-4"
          )}
        >
          <AvatarFallback>+{remainingUsers}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}