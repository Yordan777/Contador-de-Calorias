import { Activity } from "../types";

export type ActivityAction =
  | { type: "save-activity"; payload: { newActivity: Activity } }
  | { type: "save-activeId"; payload: { id: Activity["id"] } }
  | { type: "deleted-activity"; payload: { id: Activity["id"] } }
  | { type: "reset-app";};

export type ActivityState = {
  activities: Activity[];
  activeId: Activity["id"];
};

const localStoregeActivity = (): Activity[] => {
  const activities = localStorage.getItem("activities");
  return activities ? JSON.parse(activities) : [];
};

export const initialState: ActivityState = {
  activities: localStoregeActivity(),
  activeId: "",
};

export const ActivityReduce = (
  state: ActivityState = initialState,
  action: ActivityAction
) => {
  if (action.type === "save-activity") {
    let updatedActivities: Activity[] = [];

    if (state.activeId) {
      updatedActivities = state.activities.map((activity) =>
        activity.id === state.activeId ? action.payload.newActivity : activity
      );
    } else {
      updatedActivities = [...state.activities, action.payload.newActivity];
    }

    return {
      ...state,
      activities: updatedActivities,
      activeId: "",
    };
  }
  if (action.type === "save-activeId") {
    return {
      ...state,
      activeId: action.payload.id,
    };
  }

  if (action.type === "deleted-activity") {
    return {
      ...state,
      activities: state.activities.filter(
        (activity) => activity.id !== action.payload.id
      ),
    };
  }
  if (action.type === 'reset-app') {
    return{
      activities: [],
      activeId: ""
    }
  }

  return state;
};
