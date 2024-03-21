import { Student } from "@prisma/client";
import { createTimeString, parseDuration } from "@/util/calendar";

type SelectedStudent = {
  student: Student;
  cost: number;
  costModified?: boolean;
};

export enum EventCreateActionType {
  INIT = "INIT",
  UPDATE_DATE = "UPDATE_DATE",
  UPDATE_TIME = "UPDATE_TIME",
  UPDATE_EVENT_TYPE = "UPDATE_EVENT_TYPE",
  UPDATE_DURATION = "UPDATE_DURATION",
  ADD_STUDENT = "ADD_STUDENT",
  REMOVE_STUDENT = "REMOVE_STUDENT",
  UPDATE_STUDENT_COST = "UPDATE_STUDENT_COST",
  UPDATE_NOTES = "UPDATE_NOTES",
  SET_VALIDATION_ERRORS = "SET_VALIDATION_ERRORS",
}

type InitAction = {
  type: EventCreateActionType.INIT;
};

type UpdateEventAction = {
  type: EventCreateActionType.UPDATE_EVENT_TYPE;
  payload: "class" | "consultation";
};

type UpdateDateAction = {
  type: EventCreateActionType.UPDATE_DATE;
  payload: string;
};

type UpdateTimeAction = {
  type: EventCreateActionType.UPDATE_TIME;
  payload: string;
};

type UpdateDurationAction = {
  type: EventCreateActionType.UPDATE_DURATION;
  payload: string;
};

type AddStudentAction = {
  type: EventCreateActionType.ADD_STUDENT;
  payload: Student | undefined;
};

type RemoveStudentAction = {
  type: EventCreateActionType.REMOVE_STUDENT;
  payload: Student | undefined;
};

type UpdateStudentCostAction = {
  type: EventCreateActionType.UPDATE_STUDENT_COST;
  payload: { studentId: string; newCost: string };
};

type UpdateNotesAction = {
  type: EventCreateActionType.UPDATE_NOTES;
  payload: string;
};

type UpdateSetValidationErrorsAction = {
  type: EventCreateActionType.SET_VALIDATION_ERRORS;
  payload: { fieldName: string; message: string }[];
};

type EventCreateAction =
  | InitAction
  | UpdateEventAction
  | UpdateDurationAction
  | UpdateDateAction
  | UpdateTimeAction
  | UpdateDurationAction
  | AddStudentAction
  | RemoveStudentAction
  | UpdateStudentCostAction
  | UpdateNotesAction
  | UpdateSetValidationErrorsAction;

export interface IEventCreateState {
  date?: string;
  time?: string;
  eventType?: "class" | "consultation";
  duration?: string;
  students: SelectedStudent[];
  basePrice: number;
  notes: string;
  validationErrors: Array<{ fieldName: string; message: string }>;
}

export function createInitialState(presetDate: { date?: Date; time?: Date } | undefined, basePrice: number): IEventCreateState {
  return {
    date: presetDate?.date ? presetDate.date.toISOString().split("T")[0] : undefined,
    time: presetDate?.time ? createTimeString(presetDate.time) : undefined,
    eventType: "class",
    duration: undefined,
    students: [],
    basePrice: Number(basePrice),
    notes: "",
    validationErrors: [],
  };
}

export function eventCreateReducer(state: IEventCreateState, action: EventCreateAction): IEventCreateState {
  switch (action.type) {
    case EventCreateActionType.UPDATE_EVENT_TYPE: {
      return { ...state, eventType: action.payload };
    }
    case EventCreateActionType.UPDATE_DATE: {
      return { ...state, date: action.payload };
    }
    case EventCreateActionType.UPDATE_TIME: {
      return { ...state, time: action.payload };
    }
    case EventCreateActionType.UPDATE_DURATION: {
      const minutes = parseDuration(action.payload);
      const defaultHourlyPrice = Number(state.basePrice) * (minutes / 60);
      const individualHourlyPrice = defaultHourlyPrice / state.students.length;
      const roundedPrice = Number(individualHourlyPrice.toFixed(2));
      const adjustedStudents = state.students.map((s) => ({ ...s, cost: s.costModified ? s.cost : roundedPrice }));

      return { ...state, duration: action.payload, students: adjustedStudents };
    }
    case EventCreateActionType.ADD_STUDENT: {
      const newStudent = action.payload;
      if (newStudent) {
        const durationInMinutes = state.duration ? parseDuration(state.duration) : 0;
        const defaultHourlyPrice = Number(state.basePrice) * (durationInMinutes ? durationInMinutes / 60 : 1);
        const individualHourlyPrice = defaultHourlyPrice / (state.students.length + 1);
        const roundedPrice = Number(individualHourlyPrice.toFixed(2));
        const adjustedOtherStudents = state.students.map((s) => ({
          ...s,
          cost: s.costModified ? s.cost : roundedPrice,
        }));
        return { ...state, students: [...adjustedOtherStudents, { student: newStudent, cost: roundedPrice }] };
      } else return state;
    }
    case EventCreateActionType.REMOVE_STUDENT: {
      const newStudent = action.payload;
      if (newStudent) {
        const durationInMinutes = state.duration ? parseDuration(state.duration) : 0;
        const newSelectedStudents = state.students.filter((s) => s.student.id !== newStudent.id);
        const defaultHourlyPrice = Number(state.basePrice) * ((durationInMinutes || 60) / 60);
        const individualHourlyPrice = defaultHourlyPrice / newSelectedStudents.length;
        const roundedPrice = Number(individualHourlyPrice.toFixed(2));
        const adjustedStudents = newSelectedStudents.map((s) => ({
          ...s,
          cost: s.costModified ? s.cost : roundedPrice,
        }));
        return { ...state, students: adjustedStudents };
      } else return state;
    }
    case EventCreateActionType.UPDATE_STUDENT_COST: {
      const { studentId, newCost } = action.payload;
      const adjustedStudents = state.students.map((s) => {
        if (s.student.id === studentId) {
          return { ...s, cost: Number(newCost), costModified: true };
        } else {
          return s;
        }
      });
      return { ...state, students: adjustedStudents };
    }
    case EventCreateActionType.UPDATE_NOTES: {
      return { ...state, notes: action.payload };
    }
    case EventCreateActionType.SET_VALIDATION_ERRORS: {
      return { ...state, validationErrors: action.payload };
    }
    default:
      return state;
  }
}
