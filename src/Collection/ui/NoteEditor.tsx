import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { theme } from '../../Common/core/themeClasses'
import type { WatchlistMediaType } from '../core/schemas'
import { collectionStore } from '../data/CollectionStore'

const MAX_LENGTH = 300
const WARN_AT = 20

type NoteEditorProps = {
  mediaId: number
  mediaType: WatchlistMediaType
  note?: string
}

export const NoteEditor = observer(function NoteEditor({
  mediaId,
  mediaType,
  note,
}: NoteEditorProps) {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(note ?? '')

  const remaining = MAX_LENGTH - draft.length
  const isWarn = remaining <= WARN_AT

  const openEditor = () => {
    setDraft(note ?? '')
    setIsEditing(true)
  }

  const cancel = () => {
    setDraft(note ?? '')
    setIsEditing(false)
  }

  const save = () => {
    collectionStore.updateNote(mediaId, mediaType, draft)
    setIsEditing(false)
  }

  const clear = () => {
    collectionStore.updateNote(mediaId, mediaType, '')
    setDraft('')
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div className="space-y-1.5">
        <p className={`text-xs font-medium ${theme.label}`}>
          {t('collection.note.label')}
        </p>
        {note ? (
          <p className={`line-clamp-3 text-xs leading-relaxed ${theme.subheading}`}>
            {note}
          </p>
        ) : (
          <p className={`text-xs italic ${theme.hint}`}>
            {t('collection.note.placeholder')}
          </p>
        )}
        <button
          type="button"
          onClick={openEditor}
          className="text-xs font-medium text-red-500 transition hover:text-red-400"
        >
          {t('collection.note.edit')}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2 rounded-lg border border-zinc-200 p-2 dark:border-zinc-700">
      <label className={`block text-xs font-medium ${theme.label}`}>
        {t('collection.note.label')}
        <textarea
          value={draft}
          maxLength={MAX_LENGTH}
          rows={3}
          autoFocus
          onChange={(event) => setDraft(event.target.value)}
          className={`${theme.input} mt-1 resize-none text-xs`}
        />
      </label>
      <p
        className={`text-right text-xs font-medium ${
          isWarn ? 'text-red-500' : theme.hint
        }`}
      >
        {t('collection.note.charsRemaining', { count: remaining })}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={save}
          className={`${theme.btnPrimary} px-3 py-1.5 text-xs`}
        >
          {t('collection.note.save')}
        </button>
        <button
          type="button"
          onClick={cancel}
          className={`${theme.btnSecondary} px-3 py-1.5 text-xs`}
        >
          {t('collection.note.cancel')}
        </button>
        {(note || draft.trim()) && (
          <button
            type="button"
            onClick={clear}
            className="px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-400"
          >
            {t('collection.note.clear')}
          </button>
        )}
      </div>
    </div>
  )
})