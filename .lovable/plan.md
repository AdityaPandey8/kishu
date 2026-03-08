

# Replace URL inputs with File Upload for Video & Thumbnail

## Overview
Replace the video URL input and sample video buttons with a native file picker (`<input type="file" accept="video/*">`), and replace the thumbnail URL input with an image file picker (`<input type="file" accept="image/*">`). Selected files will be converted to local blob URLs for preview and stored via the existing `addReel` data context (using blob URLs since this is a demo/localStorage-based app — no Supabase storage needed).

## Changes — `src/pages/UploadReel.tsx`

### State changes
- Replace `videoUrl`/`thumbnailUrl` string states with `videoFile: File | null` and `thumbnailFile: File | null`
- Add `videoPreview` and `thumbnailPreview` string states (created via `URL.createObjectURL`)

### Video upload section
- Remove the URL text input, sample video buttons, and "For demo" text
- Add a styled drop-zone / file picker button that triggers a hidden `<input type="file" accept="video/*" capture="environment">` 
- Show file name + size after selection
- Keep the existing video preview using the blob URL

### Thumbnail upload section
- Remove the URL text input
- Add a file picker button with `<input type="file" accept="image/*">`
- Show a small image preview of the selected thumbnail

### Submit handler
- Use `URL.createObjectURL(videoFile)` and `URL.createObjectURL(thumbnailFile)` as the URLs passed to `addReel` (works for the demo since data stays in-memory/localStorage)
- Validation: check `videoFile` instead of `videoUrl`

### Cleanup
- Remove `sampleVideos` array, `Play` icon import
- Add `useRef` for hidden file inputs
- Revoke object URLs on unmount via `useEffect` cleanup

