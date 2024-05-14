import AllCalls from '@/components/AllCalls'
import React from 'react'

const UpcomingMeetings = () => {
  return (
    
    <div>
      <h1 className="text-2xl text-center mb-10">Scheduled Meetings</h1>
    <AllCalls type='upcoming'/>
    </div>
  )
}

export default UpcomingMeetings