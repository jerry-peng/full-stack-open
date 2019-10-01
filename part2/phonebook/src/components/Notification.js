import React from 'react'

const Notification = ({className, message}) => {
  if (message === null) {
    return null
  }
  return (
    <div className={className}> 
      {message}
    </div>
  )
}

const ConfirmNotification = ({message}) => {
  return <Notification className='confirm' message={message} />
}

const ErrorNotification = ({message}) => {
  return <Notification className='error' message={message} />
}

export {ConfirmNotification, ErrorNotification}
