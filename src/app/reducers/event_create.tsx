import { EventType, Student } from "@prisma/client";
import { DayOfWeek, RecurrencePattern } from "@/app/types";
import { createTimeString, parseDateString, parseDuration } from "@/util/calendar";

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
  UPDATE_RECURRENCE_ENABLED = "UPDATE_RECURRENCE_ENABLED",
  UPDATE_WEEKLY_DAYS = "UPDATE_WEEKLY_DAYS",
  UPDATE_PERIOD_WEEKS = "UPDATE_PERIOD_WEEKS",
  UPDATE_RECURRENCE_END_DATE = "UPDATE_RECURRENCE_END_DATE",
  UPDATE_INCLUDE_CURRENT_DATE = "UPDATE_INCLUDE_CURRENT_DATE",
  UPDATE_RECURRENCE_TYPE = "UPDATE_RECURRENCE_TYPE",
}

type InitAction = {
  type: EventCreateActionType.INIT;
};

type UpdateEventAction = {
  type: EventCreateActionType.UPDATE_EVENT_TYPE;
  payload: EventType;
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

type UpdateSetRecurrenceEnabledAction = {
  type: EventCreateActionType.UPDATE_RECURRENCE_ENABLED;
  payload: boolean;
};

type UpdateWeeklyDaysAction = {
  type: EventCreateActionType.UPDATE_WEEKLY_DAYS;
  payload: Array<DayOfWeek>;
};

type UpdatePeriodWeeksAction = {
  type: EventCreateActionType.UPDATE_PERIOD_WEEKS;
  payload: number;
};

type UpdateRecurrenceEndDateAction = {
  type: EventCreateActionType.UPDATE_RECURRENCE_END_DATE;
  payload: Date;
};

type UpdateIncludeCurrentDateAction = {
  type: EventCreateActionType.UPDATE_INCLUDE_CURRENT_DATE;
  payload: boolean;
};

type UpdateRecurrenceTypeAction = {
  type: EventCreateActionType.UPDATE_RECURRENCE_TYPE;
  payload: "weekly" | "monthly";
};

export type EventCreateAction =
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
  | UpdateSetValidationErrorsAction
  | UpdateSetRecurrenceEnabledAction
  | UpdateWeeklyDaysAction
  | UpdatePeriodWeeksAction
  | UpdateRecurrenceEndDateAction
  | UpdateIncludeCurrentDateAction
  | UpdateRecurrenceTypeAction;

export interface IEventCreateState {
  date?: string;
  time?: string;
  eventType?: EventType;
  duration?: string;
  students: SelectedStudent[];
  basePrice: number;
  notes: string;
  validationErrors: Array<{ fieldName: string; message: string }>;
  recurrenceEnabled: boolean;
  recurrencePattern: Partial<RecurrencePattern>;
}

export function createInitialState(
  presetDate: { date?: Date; time?: Date } | undefined,
  basePrice: number,
): IEventCreateState {
  return {
    date: presetDate?.date ? presetDate.date.toISOString().split("T")[0] : undefined,
    time: presetDate?.time ? createTimeString(presetDate.time) : undefined,
    eventType: EventType.CLASS,
    duration: undefined,
    students: [],
    basePrice: Number(basePrice),
    notes: "",
    validationErrors: [],
    recurrenceEnabled: false,
    recurrencePattern: {
      weeklyDays: [],
      endDate: undefined,
      includeSelectedDate: false,
      recurrenceType: "weekly",
      period: 1,
    },
  };
}

export function eventCreateReducer(state: IEventCreateState, action: EventCreateAction): IEventCreateState {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
  }
  switch (action.type) {
    case EventCreateActionType.UPDATE_EVENT_TYPE: {
      return { ...state, eventType: action.payload, validationErrors: [] };
    }
    case EventCreateActionType.UPDATE_DATE: {
      return {
        ...state,
        date: action.payload,
        recurrencePattern: { ...state.recurrencePattern, startDate: parseDateString(action.payload) },
        validationErrors: [],
      };
    }
    case EventCreateActionType.UPDATE_TIME: {
      return { ...state, time: action.payload, validationErrors: [] };
    }
    case EventCreateActionType.UPDATE_DURATION: {
      const minutes = parseDuration(action.payload);
      const defaultHourlyPrice = Number(state.basePrice) * (minutes / 60);
      const individualHourlyPrice = defaultHourlyPrice / state.students.length;
      const roundedPrice = Number(individualHourlyPrice.toFixed(2));
      const adjustedStudents = state.students.map((s) => ({ ...s, cost: s.costModified ? s.cost : roundedPrice }));

      return { ...state, duration: action.payload, students: adjustedStudents, validationErrors: [] };
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
        return {
          ...state,
          students: [...adjustedOtherStudents, { student: newStudent, cost: roundedPrice }],
          validationErrors: state.validationErrors.filter((e) => e.fieldName !== "students"),
        };
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
        return { ...state, students: adjustedStudents, validationErrors: [] };
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
      return { ...state, students: adjustedStudents, validationErrors: [] };
    }
    case EventCreateActionType.UPDATE_NOTES: {
      return { ...state, notes: action.payload, validationErrors: [] };
    }
    case EventCreateActionType.SET_VALIDATION_ERRORS: {
      return { ...state, validationErrors: action.payload };
    }
    case EventCreateActionType.UPDATE_RECURRENCE_ENABLED: {
      return { ...state, recurrenceEnabled: action.payload, validationErrors: [] };
    }
    case EventCreateActionType.UPDATE_WEEKLY_DAYS: {
      return {
        ...state,
        recurrencePattern: { ...state.recurrencePattern, weeklyDays: action.payload },
        validationErrors: state.validationErrors.filter((e) => e.fieldName !== "recurrence"),
      };
    }
    case EventCreateActionType.UPDATE_PERIOD_WEEKS: {
      return { ...state, recurrencePattern: { ...state.recurrencePattern, period: action.payload } };
    }
    case EventCreateActionType.UPDATE_RECURRENCE_END_DATE: {
      return {
        ...state,
        recurrencePattern: { ...state.recurrencePattern, endDate: action.payload },
        validationErrors: [],
      };
    }
    case EventCreateActionType.UPDATE_INCLUDE_CURRENT_DATE: {
      return {
        ...state,
        recurrencePattern: { ...state.recurrencePattern, includeSelectedDate: action.payload },
        validationErrors: [],
      };
    }
    case EventCreateActionType.UPDATE_RECURRENCE_TYPE: {
      return {
        ...state,
        recurrencePattern: { ...state.recurrencePattern, recurrenceType: action.payload },
        validationErrors: [],
      };
    }

    default:
      return state;
  }
}
