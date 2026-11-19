import { useEffect, useState } from 'react'

interface Skin {
    id: number
    name: string
    icon?: string
}

export default function App() {
    const [skins, setSkins] = useState<Skin[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch('https://api.guildwars2.com/v2/skins?ids=1,2,3,4,5')
            .then((r) => {
                if (!r.ok) throw new Error(`Erreur ${r.status}`)
                return r.json()
            })
            .then(setSkins)
            .catch((e) => setError(e.message))
    }, [])

    if (error) return <p>{error}</p>

    return (
        <ul>
            {skins.map((s) => (
                <li key={s.id}>{s.name}</li>
            ))}
        </ul>
    )
}