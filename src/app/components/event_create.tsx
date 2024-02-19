'use client'

import { Student } from "@prisma/client"
import { createEvent } from "../actions/events"
import Button from "./button"

interface IEventCreateProps {
  students: Student[]
}



export default function EventCreate(props: IEventCreateProps) {

  return <div>
    <h2>Schedule a class</h2>
    <form action={createEvent}>
      <div>
        <label>
          Date
          <input type="date" name="scheduledForDate" />
        </label>
      </div>
      <div>
        <label>
          Date
          <input type="time" name="scheduledForTime" />
        </label>
      </div>
      <Button type='submit' text="Submit" flavor="primary"/>
    </form>
  </div>
}