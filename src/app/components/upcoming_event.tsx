import { pluralize } from '@/util/string'
import { Class } from '@prisma/client'
import dayjs from 'dayjs'


interface IUpcomingEventProps {
  event: Class
}

export default function UpcomingEvent(props: IUpcomingEventProps) {
  return (
    <div className='flex items-center py-3'>
      <div className='text-1xl text-slate-500 rounded-full bg-purple-200 flex items-center justify-center w-7 h-7 flex-shrink-0 mx-3'>
        {props.event.classType === 'GROUP' ? 'G' : 'P'}
      </div>
      <div className='border-b pb-2 grow'>
        <div className='text-sm'>
          {props.event.classType === 'GROUP' ? 'Group' : 'Private'} class from {dayjs(props.event.scheduledFor).format("MM/DD/YYYY")} to {dayjs(props.event.scheduledFor).format("MM/DD/YYYY")}
        </div>
        <div className='text-xs'>
          {pluralize('student', Math.floor(Math.random() * 10), true)} scheduled
        </div>
      </div>
    </div>
  )
}