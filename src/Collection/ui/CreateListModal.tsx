import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { theme } from '../../Common/core/themeClasses'
import { collectionStore } from '../data/CollectionStore'

const createListFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(60),
  description: z.string().max(200).optional(),
})

type CreateListModalProps = {
  isOpen: boolean
  onClose: () => void
  onCreated?: (listId: string) => void
}

export function CreateListModal({
  isOpen,
  onClose,
  onCreated,
}: CreateListModalProps) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      setName('')
      setDescription('')
      setError(null)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = createListFormSchema.safeParse({ name, description })
    if (!result.success) {
      setError(t('collection.lists.nameInvalid'))
      return
    }

    const listId = collectionStore.createList(
      result.data.name,
      result.data.description,
    )

    if (!listId) {
      setError(t('collection.lists.nameInvalid'))
      return
    }

    onCreated?.(listId)
    onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-list-title"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-md p-6 ${theme.cardShadow}`}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="create-list-title" className={`text-xl font-bold ${theme.heading}`}>
          {t('collection.lists.createTitle')}
        </h2>
        <p className={`mt-1 text-sm ${theme.subheading}`}>
          {t('collection.lists.createSubtitle')}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className={`block text-sm ${theme.label}`}>
            {t('collection.lists.nameLabel')}
            <input
              type="text"
              value={name}
              maxLength={60}
              onChange={(event) => setName(event.target.value)}
              placeholder={t('collection.lists.namePlaceholder')}
              className={`${theme.input} mt-1`}
              autoFocus
            />
            <span className={`mt-1 block text-xs ${theme.hint}`}>
              {name.trim().length}/60
            </span>
          </label>

          <label className={`block text-sm ${theme.label}`}>
            {t('collection.lists.descriptionLabel')}
            <textarea
              value={description}
              rows={3}
              maxLength={200}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={t('collection.lists.descriptionPlaceholder')}
              className={`${theme.input} mt-1 resize-none`}
            />
          </label>

          {error && <p className={theme.errorBox}>{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className={theme.btnSecondary}>
              {t('collection.lists.cancel')}
            </button>
            <button type="submit" className={theme.btnPrimary}>
              {t('collection.lists.create')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}