import { useState, ChangeEvent, FormEvent, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid'
import { Activity } from "../types"
import { categories } from "../data/categories"
import { useActivity } from "../hooks/useActivity"


function Form() {

    const { state, dispatch } = useActivity()

    const iniState: Activity = {
        id: uuidv4(),
        category: 1,
        name: '',
        calories: 0
    }
    const [activity, setActivity] = useState<Activity>(iniState)

    useEffect(() => {

        if (state.activeId) {
            const selectAtivityId = state.activities.filter(stateAtivity => stateAtivity.id === state.activeId)[0]
            setActivity(selectAtivityId)
        }

    }, [state.activeId])



    const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
        const isNumbersField = ['category', 'calories'].includes(e.target.id)

        setActivity({
            ...activity,
            [e.target.id]: isNumbersField ? +e.target.value : e.target.value
        })
    }

    const isValidAtivity = () => {
        const { calories, name } = activity
        return name.trim() !== '' && calories > 0
    }

    const handleSummit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch({ type: 'save-activity', payload: { newActivity: activity } })

        setActivity({ ...iniState, id: uuidv4() })
    }

    return (
        <form
            className="space-y-5 bg-white shadow p-10 rounded-lg"
            onSubmit={handleSummit}
        >
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="category" className="font-bold">Categoria:</label>
                <select
                    className="border border-slate-300 p-2 rounded-lg w-full bg-white"
                    id="category"
                    value={activity.category}
                    onChange={handleChange}
                >
                    {categories.map(category => (
                        <option
                            key={category.id}
                            value={category.id}

                        >
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="name" className="font-bold">Actividad:</label>
                <input
                    id="name"
                    type="text"
                    className="border border-slate-300 p-2 rounded-lg"
                    placeholder="Ej. Comida, Jugo de Naranja, Ensalada, Ejercicio, Pesas, Bicicleta"
                    value={activity.name}
                    onChange={handleChange}
                />
            </div>
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="calories" className="font-bold">Calorias:</label>
                <input
                    id="calories"
                    type="number"
                    className="border border-slate-300 p-2 rounded-lg"
                    placeholder="Calorias. ej. 300 o 500"
                    value={activity.calories}
                    onChange={handleChange}
                />
                <input
                    type="submit"
                    className="bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10"
                    value={activity.category == + 1 ? 'Guardar Comida' : 'Guardar Ejercicio'}
                    disabled={!isValidAtivity()}
                />
            </div>
        </form>
    )
}

export default Form