import { EventType } from "@prisma/client";
import { EventCreateActionType, createInitialState, eventCreateReducer } from "@/app/reducers/event_create";
import { createTimeString } from "@/util/calendar";
import { student } from "@/util/mock";

describe("event_create reducer", () => {
  it("should initialize with the correct initial state", () => {
    const state = eventCreateReducer(createInitialState({ date: undefined, time: undefined }, 100), {
      type: EventCreateActionType.INIT,
    });
    expect(state).toEqual({
      date: undefined,
      time: undefined,
      eventType: EventType.CLASS,
      duration: undefined,
      students: [],
      recurrenceEnabled: false,
      recurrencePattern: {
        endDate: undefined,
        weeklyDays: [],
        includeSelectedDate: false,
        period: 1,
        recurrenceType: "weekly",
      },
      basePrice: 100,
      notes: "",
      validationErrors: [],
    });
  });

  it("should initialize with the correct initial state when initial date and time are provided", () => {
    const date = new Date();
    const state = eventCreateReducer(createInitialState({ date, time: date }, 100), {
      type: EventCreateActionType.INIT,
    });
    expect(state).toEqual({
      date: date.toISOString().split("T")[0],
      time: createTimeString(date),
      eventType: EventType.CLASS,
      duration: undefined,
      students: [],
      basePrice: 100,
      recurrenceEnabled: false,
      recurrencePattern: {
        endDate: undefined,
        weeklyDays: [],
        includeSelectedDate: false,
        period: 1,
        recurrenceType: "weekly",
      },
      notes: "",
      validationErrors: [],
    });
  });

  it("should update fields when actions are dispatched", () => {
    const mockStudent = student();
    const basePrice = 100;

    let state = eventCreateReducer(createInitialState({ date: undefined, time: undefined }, basePrice), {
      type: EventCreateActionType.INIT,
    });
    state = eventCreateReducer(state, { type: EventCreateActionType.UPDATE_DATE, payload: "2000-01-01" });
    expect(state.date).toEqual("2000-01-01");

    state = eventCreateReducer(state, { type: EventCreateActionType.UPDATE_TIME, payload: "4:20" });
    expect(state.time).toEqual("4:20");

    state = eventCreateReducer(state, { type: EventCreateActionType.UPDATE_DURATION, payload: "1:00" });
    expect(state.duration).toEqual("1:00");

    state = eventCreateReducer(state, {
      type: EventCreateActionType.UPDATE_EVENT_TYPE,
      payload: EventType.CONSULTATION,
    });
    expect(state.eventType).toEqual(EventType.CONSULTATION);

    state = eventCreateReducer(state, { type: EventCreateActionType.ADD_STUDENT, payload: mockStudent });
    expect(state.students).toEqual([{ student: mockStudent, cost: basePrice }]);

    state = eventCreateReducer(state, {
      type: EventCreateActionType.UPDATE_STUDENT_COST,
      payload: { studentId: mockStudent.id, newCost: "500" },
    });
    expect(state.students).toEqual([{ student: mockStudent, cost: 500, costModified: true }]);

    state = eventCreateReducer(state, { type: EventCreateActionType.REMOVE_STUDENT, payload: mockStudent });
    expect(state.students).toEqual([]);

    state = eventCreateReducer(state, { type: EventCreateActionType.UPDATE_NOTES, payload: "Child prodigy" });
    expect(state.notes).toEqual("Child prodigy");

    expect(state).toEqual({
      date: "2000-01-01",
      time: "4:20",
      eventType: EventType.CONSULTATION,
      duration: "1:00",
      students: [],
      basePrice: 100,
      recurrenceEnabled: false,
      recurrencePattern: {
        includeSelectedDate: false,
        period: 1,
        recurrenceType: "weekly",
        startDate: new Date("2000-01-01T05:00:00.000Z"),
        endDate: undefined,
        weeklyDays: [],
      },
      notes: "Child prodigy",
      validationErrors: [],
    });
  });

  it("should update student cost when students are added and removed to maintain the total cost", () => {
    const mockStudent = student();
    const mockStudent2 = student();
    const basePrice = 100;

    let state = eventCreateReducer(createInitialState({ date: undefined, time: undefined }, basePrice), {
      type: EventCreateActionType.INIT,
    });

    // Add one student
    state = eventCreateReducer(state, { type: EventCreateActionType.UPDATE_DURATION, payload: "1:00" });
    state = eventCreateReducer(state, { type: EventCreateActionType.ADD_STUDENT, payload: mockStudent });
    expect(state.students).toEqual([{ student: mockStudent, cost: basePrice }]);

    // Add a second student
    state = eventCreateReducer(state, { type: EventCreateActionType.ADD_STUDENT, payload: mockStudent2 });
    expect(state.students).toEqual([
      { student: mockStudent, cost: basePrice / 2 },
      { student: mockStudent2, cost: basePrice / 2 },
    ]);

    // Remove the first student
    state = eventCreateReducer(state, { type: EventCreateActionType.REMOVE_STUDENT, payload: mockStudent });
    expect(state.students).toEqual([{ student: mockStudent2, cost: basePrice }]);
  });

  it("should never update student cost when it has been modified from its default", () => {
    const mockStudent = student();
    const mockStudent2 = student();
    const mockStudent3 = student();
    const basePrice = 300;

    let state = eventCreateReducer(createInitialState({ date: undefined, time: undefined }, basePrice), {
      type: EventCreateActionType.INIT,
    });

    // Add one student
    state = eventCreateReducer(state, { type: EventCreateActionType.UPDATE_DURATION, payload: "1:00" });
    state = eventCreateReducer(state, { type: EventCreateActionType.ADD_STUDENT, payload: mockStudent });
    expect(state.students).toEqual([{ student: mockStudent, cost: basePrice }]);

    // Add a second student
    state = eventCreateReducer(state, { type: EventCreateActionType.ADD_STUDENT, payload: mockStudent2 });
    expect(state.students).toEqual([
      { student: mockStudent, cost: basePrice / 2 },
      { student: mockStudent2, cost: basePrice / 2 },
    ]);

    // Modify the cost of the second student
    state = eventCreateReducer(state, {
      type: EventCreateActionType.UPDATE_STUDENT_COST,
      payload: { studentId: mockStudent2.id, newCost: "50" },
    });
    expect(state.students).toEqual([
      { student: mockStudent, cost: basePrice / 2 },
      { student: mockStudent2, cost: 50, costModified: true },
    ]);

    // Add a third student
    state = eventCreateReducer(state, { type: EventCreateActionType.ADD_STUDENT, payload: mockStudent3 });
    expect(state.students).toEqual([
      { student: mockStudent, cost: basePrice / 3 },
      { student: mockStudent2, cost: 50, costModified: true },
      { student: mockStudent3, cost: basePrice / 3 },
    ]);
  });

  it("should base default student cost on 1 hour duration if no duration is set", () => {
    const mockStudent = student();
    const mockStudent2 = student();
    const basePrice = 100;

    let state = eventCreateReducer(createInitialState({ date: undefined, time: undefined }, basePrice), {
      type: EventCreateActionType.INIT,
    });

    // Add one student
    state = eventCreateReducer(state, { type: EventCreateActionType.ADD_STUDENT, payload: mockStudent });
    expect(state.students).toEqual([{ student: mockStudent, cost: basePrice }]);

    // Add a second student
    state = eventCreateReducer(state, { type: EventCreateActionType.ADD_STUDENT, payload: mockStudent2 });
    expect(state.students).toEqual([
      { student: mockStudent, cost: basePrice / 2 },
      { student: mockStudent2, cost: basePrice / 2 },
    ]);
  });

  it("should base default student cost on selected duration", () => {
    const mockStudent = student();
    const mockStudent2 = student();
    const basePrice = 100;

    let state = eventCreateReducer(createInitialState({ date: undefined, time: undefined }, basePrice), {
      type: EventCreateActionType.INIT,
    });
    state = eventCreateReducer(state, { type: EventCreateActionType.UPDATE_DURATION, payload: "2:00" });

    // Add one student
    state = eventCreateReducer(state, { type: EventCreateActionType.ADD_STUDENT, payload: mockStudent });
    expect(state.students).toEqual([{ student: mockStudent, cost: basePrice * 2 }]);

    // Add a second student
    state = eventCreateReducer(state, { type: EventCreateActionType.ADD_STUDENT, payload: mockStudent2 });
    expect(state.students).toEqual([
      { student: mockStudent, cost: basePrice },
      { student: mockStudent2, cost: basePrice },
    ]);
  });

  it("should update student costs when duration is changed", () => {
    const mockStudent = student();
    const mockStudent2 = student();
    const basePrice = 100;

    let state = eventCreateReducer(createInitialState({ date: undefined, time: undefined }, basePrice), {
      type: EventCreateActionType.INIT,
    });

    // Add one student
    state = eventCreateReducer(state, { type: EventCreateActionType.ADD_STUDENT, payload: mockStudent });
    expect(state.students).toEqual([{ student: mockStudent, cost: basePrice }]);

    // Add a second student
    state = eventCreateReducer(state, { type: EventCreateActionType.ADD_STUDENT, payload: mockStudent2 });
    expect(state.students).toEqual([
      { student: mockStudent, cost: basePrice / 2 },
      { student: mockStudent2, cost: basePrice / 2 },
    ]);

    // Update duration to 2 hours
    state = eventCreateReducer(state, { type: EventCreateActionType.UPDATE_DURATION, payload: "2:00" });
    expect(state.students).toEqual([
      { student: mockStudent, cost: basePrice },
      { student: mockStudent2, cost: basePrice },
    ]);
  });

  it("should update reccurence settings", () => {
    const basePrice = 100;

    let state = eventCreateReducer(createInitialState({ date: undefined, time: undefined }, basePrice), {
      type: EventCreateActionType.INIT,
    });

    state = eventCreateReducer(state, { type: EventCreateActionType.UPDATE_RECURRENCE_ENABLED, payload: true });
    expect(state.recurrenceEnabled).toEqual(true);

    state = eventCreateReducer(state, { type: EventCreateActionType.UPDATE_RECURRENCE_ENABLED, payload: false });
    expect(state.recurrenceEnabled).toEqual(false);

    state = eventCreateReducer(state, { type: EventCreateActionType.UPDATE_RECURRENCE_ENABLED, payload: true });
    state = eventCreateReducer(state, { type: EventCreateActionType.UPDATE_PERIOD_WEEKS, payload: 3 });
    expect(state.recurrenceEnabled).toEqual(true);
    expect(state.recurrencePattern).toBeDefined();
    expect(state.recurrencePattern?.period).toEqual(3);

    state = eventCreateReducer(state, {
      type: EventCreateActionType.UPDATE_WEEKLY_DAYS,
      payload: ["monday", "thursday", "sunday"],
    });
    expect(state.recurrencePattern?.weeklyDays).toEqual(["monday", "thursday", "sunday"]);

    state = eventCreateReducer(state, {
      type: EventCreateActionType.UPDATE_RECURRENCE_END_DATE,
      payload: new Date(2024, 4, 5),
    });
    expect(state.recurrencePattern?.endDate).toEqual(new Date(2024, 4, 5));

    state = eventCreateReducer(state, { type: EventCreateActionType.UPDATE_INCLUDE_CURRENT_DATE, payload: true });
    expect(state.recurrencePattern?.includeSelectedDate).toEqual(true);

    state = eventCreateReducer(state, { type: EventCreateActionType.UPDATE_INCLUDE_CURRENT_DATE, payload: false });
    expect(state.recurrencePattern?.includeSelectedDate).toEqual(false);
  });
});
