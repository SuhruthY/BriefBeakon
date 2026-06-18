import { useState } from 'react'
import { Save, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../types'
import type { Category } from '../types'

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[]

export default function Preferences() {
  const [selected, setSelected] = useState<Category[]>(ALL_CATEGORIES)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggle(cat: Category) {
    setSelected(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    )
  }

  async function save() {
    setSaving(true)
    const userId = crypto.randomUUID()
    await supabase.from('user_preferences').upsert({
      user_id: userId,
      categories: selected,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
        <h1 className="text-3xl font-bold text-white mb-2">Your Interests</h1>
        <p className="text-slate-400">Select topics you care about. Your feed will be customized.</p>
      </div>

      <div className="grid gap-3 mb-8">
        {ALL_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => toggle(cat)}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
              selected.includes(cat)
                ? `bg-gradient-to-r ${CATEGORY_COLORS[cat]} bg-opacity-10 border-transparent text-white`
                : 'border-slate-800 text-slate-500 hover:border-slate-700'
            }`}
          >
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
              selected.includes(cat)
                ? 'border-white bg-white'
                : 'border-slate-600'
            }`}>
              {selected.includes(cat) && (
                <div className="w-2 h-2 rounded-sm bg-slate-900" />
              )}
            </div>
            <span className="text-sm font-medium">{CATEGORY_LABELS[cat]}</span>
          </button>
        ))}
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors disabled:opacity-50 mx-auto"
      >
        <Save className="w-4 h-4" />
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Preferences'}
      </button>
    </div>
  )
}
