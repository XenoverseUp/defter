export const activeAssignmentKeyFor = (id: string) =>
  `student-active-assignment/${id}` as const

export const pastAssignmentKeyFor = (id: string) =>
  `student-past-assignments/${id}` as const

export const resourcesKeyFor = (id: string) =>
  `students-resources/${id}` as const

export const profileKeyFor = (id: string) => `students-profiles/${id}` as const
