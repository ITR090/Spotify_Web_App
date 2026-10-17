import React, { useEffect, useRef, useState } from 'react'
// import edit from '../assets/icons/edit.png'
// UI
import SecondaryButton from './Buttons/SecondaryButton'
import { useNavigate } from 'react-router-dom'
// icons
import { X, Music } from 'lucide-react';

const PLAYLIST_NAME_MAX = 100        // Spotify's playlist name limit
const PLAYLIST_DESCRIPTION_MAX = 300 // Spotify client's description limit

// Spotify-style playlist details dialog, used for both "Create playlist" and "Edit details".
// onSave(name, description) should resolve to a truthy value on success; the dialog shows an error otherwise.
//  - create mode: name only
//  - edit mode:   name + description, prefilled with the current values, shows the current cover
function PlaylistDetailsDialog({ mode = 'create', onClose, onSave, defaultName = '', defaultDescription = '', image }) {

  const isEdit = mode === 'edit'
  const [name, setName] = useState(defaultName)
  const [description, setDescription] = useState(defaultDescription)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef()

  // focus the name and select it so typing replaces it
  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  // close on Escape
  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape' && !saving) onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [saving, onClose])

  const trimmedName = name.trim()
  // Spotify descriptions are a single line
  const cleanDescription = description.replace(/\s*\n+\s*/g, ' ').trim()
  const unchanged = isEdit && trimmedName === defaultName.trim() && cleanDescription === defaultDescription.trim()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!trimmedName || saving) return
    if (unchanged) return onClose()
    setSaving(true)
    setError(null)
    const saved = await onSave?.(trimmedName, cleanDescription)
    if (!saved) {
      setSaving(false)
      setError(isEdit ? "Couldn't save your changes. Please try again." : "Couldn't create the playlist. Please try again.")
    }
  }

  const FIELD = 'peer block w-full rounded px-3 bg-white/10 text-white text-sm placeholder:text-sp-muted border border-transparent focus:bg-[#333333] focus:border-white/40 focus:outline-none transition-colors'
  const FLOATING_LABEL = 'absolute -top-2 left-2.5 px-1 text-[11px] font-bold rounded bg-sp-highlight text-white opacity-0 peer-focus:opacity-100 transition-opacity'

  return (
    <div onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) onClose() }} className='fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/70'>
      <form onSubmit={handleSubmit} role='dialog' aria-modal='true' aria-labelledby='playlist-details-title' className='bg-sp-highlight text-white p-6 rounded-lg shadow-2xl shadow-black/60 w-full max-w-lg animate-fadeIn'>
        <div className='flex justify-between items-center'>
          <h5 id='playlist-details-title' className='text-2xl font-bold'>{isEdit ? 'Edit details' : 'Create playlist'}</h5>
          <button type='button' onClick={onClose} disabled={saving} aria-label='Close' className='w-8 h-8 flex items-center justify-center rounded-full text-sp-subdued hover:text-white hover:bg-white/10 cursor-pointer disabled:opacity-50'>
            <X size={20} />
          </button>
        </div>

        <div className='mt-5 flex flex-col sm:flex-row gap-4'>
          {image
            ? <img src={image} alt='' className='w-36 h-36 sm:w-44 sm:h-44 shrink-0 self-center sm:self-auto rounded object-cover shadow-xl shadow-black/40' />
            : <div className='w-36 h-36 sm:w-44 sm:h-44 shrink-0 self-center sm:self-auto rounded bg-[#333333] text-sp-subdued flex items-center justify-center shadow-xl shadow-black/40'>
                <Music size={56} />
              </div>
          }

          <div className={`flex-1 min-w-0 flex flex-col ${isEdit ? 'gap-3' : 'justify-center'}`}>
            {/* floating labels, like Spotify's "Edit details" dialog */}
            <div>
              <div className='relative'>
                <input
                  ref={inputRef}
                  id='playlist-name'
                  type='text'
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(null) }}
                  maxLength={PLAYLIST_NAME_MAX}
                  placeholder='Add a name'
                  autoComplete='off'
                  className={`${FIELD} h-11`}
                />
                <label htmlFor='playlist-name' className={FLOATING_LABEL}>Name</label>
              </div>
              <div className='mt-1.5 flex justify-between text-xs'>
                <span className='text-[#f15e6c]'>{!trimmedName ? 'Playlist name is required.' : ''}</span>
                <span className='text-sp-subdued tabular-nums'>{name.length}/{PLAYLIST_NAME_MAX}</span>
              </div>
            </div>

            {isEdit &&
              <div>
                <div className='relative'>
                  <textarea
                    id='playlist-description'
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); setError(null) }}
                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
                    maxLength={PLAYLIST_DESCRIPTION_MAX}
                    placeholder='Add an optional description'
                    rows={4}
                    className={`${FIELD} py-2.5 resize-none`}
                  />
                  <label htmlFor='playlist-description' className={FLOATING_LABEL}>Description</label>
                </div>
                <div className='mt-1 flex justify-end text-xs'>
                  <span className='text-sp-subdued tabular-nums'>{description.length}/{PLAYLIST_DESCRIPTION_MAX}</span>
                </div>
              </div>
            }
          </div>
        </div>

        {error && <p role='alert' className='mt-3 text-sm text-[#f15e6c]'>{error}</p>}

        <div className='mt-5 flex justify-end'>
          <SecondaryButton type='submit' variant='primary' disabled={!trimmedName || saving} className='mr-0! disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed'>
            {saving ? 'Saving…' : 'Save'}
          </SecondaryButton>
        </div>
      </form>
    </div>
  )
}


// Spotify-style "Delete from Your Library?" confirmation.
// onConfirm() should resolve to true on success; the dialog shows an error otherwise.
function DeletePlaylistDialog({ onClose, onConfirm, playlistName }) {

  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)
  const cancelRef = useRef()

  // focus Cancel (the safe choice) when the dialog opens
  useEffect(() => {
    cancelRef.current?.focus()
  }, [])

  // close on Escape
  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape' && !deleting) onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [deleting, onClose])

  const handleDelete = async () => {
    if (deleting) return
    setDeleting(true)
    setError(null)
    const deleted = await onConfirm?.()
    if (!deleted) {
      setDeleting(false)
      setError("Couldn't delete the playlist. Please try again.")
    }
  }

  return (
    <div onMouseDown={(e) => { if (e.target === e.currentTarget && !deleting) onClose() }} className='fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/70'>
      <div role='alertdialog' aria-modal='true' aria-labelledby='delete-playlist-title' aria-describedby='delete-playlist-desc' className='bg-white text-black rounded-lg shadow-2xl w-full max-w-md p-6 relative animate-fadeIn'>
        <h6 id='delete-playlist-title' className='text-2xl font-bold my-2'>Delete from Your Library?</h6>
        <p id='delete-playlist-desc' className='text-sm text-sp-highlight'>
          This will delete <span className='font-bold'>{playlistName || 'this playlist'}</span> from <span className='font-bold'>Your Library</span>.
        </p>
        {error && <p role='alert' className='mt-3 text-sm font-medium text-[#e91429]'>{error}</p>}
        <div className='flex justify-end items-center gap-2 mt-6'>
          <button ref={cancelRef} type='button' onClick={onClose} disabled={deleting} className='rounded-full px-6 py-3 text-sm font-bold text-black hover:scale-[1.04] transition-transform cursor-pointer disabled:opacity-50 disabled:hover:scale-100'>
            Cancel
          </button>
          <SecondaryButton type='button' clickFun={handleDelete} variant='green' disabled={deleting} className='mr-0! disabled:opacity-60 disabled:hover:scale-100 disabled:cursor-not-allowed'>
            {deleting ? 'Deleting…' : 'Delete'}
          </SecondaryButton>
        </div>
      </div>
    </div>
  )
}

export default function Modal({ type, open, onClose, onClick, children, ...props }) {

  
  let navigate = useNavigate();

  const handleLoginButton = () => {
    localStorage.removeItem("userToken")
    navigate('/login')
  }
  const handleCloseModle = () => {
    onClose(false)
  }

  switch (type) {

    case 'create-playlist':
      // mounted only while open, so the name/error state resets every time
      return open
        ? <PlaylistDetailsDialog mode='create' onClose={handleCloseModle} onSave={onClick} defaultName={props.defaultName} />
        : null

    case 'edit-playlist':
      // mounted only while open, so it always starts from the playlist's current details
      return open
        ? <PlaylistDetailsDialog mode='edit' onClose={handleCloseModle} onSave={onClick}
            defaultName={props.defaultName} defaultDescription={props.defaultDescription} image={props.image} />
        : null

    case 'token-expired':
      return (
        <div className={`fixed top-0 right-0 left-0 z-50 inset-0 flex justify-center items-center p-4 transition-colors ${open ? "visible bg-black/80" : "invisible"}`}>
          <div className='bg-sp-highlight text-white p-8 rounded-lg shadow-2xl shadow-black/60 w-full max-w-md text-center animate-fadeIn'>
            <h6 className='text-2xl font-bold my-2'>Your session has expired</h6>
            <p className='text-sp-subdued mb-6'>Your token has expired, please log in again to continue.</p>
            <SecondaryButton clickFun={handleLoginButton} variant='green' className='mr-0!'>Log in</SecondaryButton>
          </div>
        </div>
      )

    case 'delete-playlist':
      // mounted only while open, so the deleting/error state resets every time
      return open
        ? <DeletePlaylistDialog onClose={handleCloseModle} onConfirm={onClick} playlistName={props.playlistName} />
        : null

  }
  
}

// export default function Modal({
//   open,
//   title,
//   children,
//   onClose,
//   actions,
//   size = "md", // sm | md | lg
// }) {
//    console.log('Modal opened');
//   if (!open) return null;
   
//   const sizes = {
//     sm: "max-w-sm",
//     md: "max-w-md",
//     lg: "max-w-xl",
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//       <div className={`bg-white rounded-xl p-6 w-full ${sizes[size]} relative`}>
        
//         {/* Close */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-black"
//         >
//           <X/>
//         </button>

//         {/* Title */}
//         {title && (
//           <h2 className="text-xl font-semibold mb-4">
//             {title}
//           </h2>
//         )}

//         {/* Body */}
//         <div className="mb-4">
//           {children}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-end gap-3">
//           {actions}
//         </div>
//       </div>
//     </div>
//   );
// }

