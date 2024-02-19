'use server'

import { prisma } from "@/db"
import { ClassType } from "@prisma/client"

export async function createEvent(formData: FormData) {
  const scheduledFor = new Date(`${formData.get('scheduledForDate')}T${formData.get('scheduledForTime')}`)
  await prisma.class.create({
    data: {
      scheduledFor,
      durationMinutes: 60,
      classType: ClassType.PRIVATE,
      cost: 80,
    }
  })
}