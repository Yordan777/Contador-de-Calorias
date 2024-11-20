import { createContext, Dispatch, ReactNode, useMemo, useReducer } from "react"
import { ActivityAction, ActivityReduce, ActivityState, initialState } from "../reducers/activityReduce"
import { Activity } from "../types"
import { categories } from "../data/categories"

type ActivityProviderProps = {
    children: ReactNode
}

type ActivityContextProps = {
    state: ActivityState
    dispatch: Dispatch<ActivityAction>
    caloriesCosumed: number
    caloriesBurned: number
    netCalories: number
    categoryName: (category: Activity["category"]) => string[]
    isEmpityActivity: boolean
}

export const ActivityContext = createContext<ActivityContextProps>(null!)

export const ActivityProvider = ({ children }: ActivityProviderProps) => {

    const [state, dispatch] = useReducer(ActivityReduce, initialState)

    // Contadores
    const caloriesCosumed = useMemo(() => state.activities.reduce((total, activity) => activity.category === 1 ?
        total + activity.calories : total, 0), [state.activities])
    const caloriesBurned = useMemo(() => state.activities.reduce((total, activity) => activity.category === 2 ?
        total + activity.calories : total, 0), [state.activities])
    const netCalories = useMemo(() => caloriesCosumed - caloriesBurned, [state.activities])


    const categoryName = useMemo(() => (category: Activity['category']) => categories.map(cat => cat.id === category ? cat.name : '')
        , [state.activities])

    const isEmpityActivity = useMemo(() => state.activities.length === 0, [state.activities])

    return (
        <ActivityContext.Provider value={{
            state,
            dispatch,
            caloriesCosumed,
            caloriesBurned,
            netCalories,
            categoryName,
            isEmpityActivity
        }}>
            {children}
        </ActivityContext.Provider>
    )
}
