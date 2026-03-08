

# Community + Creator Studio + Profile Activity Redesign

## Overview
Transform the Community page into a full social feed showing creator posts (text, image, short/long video) with engagement features. Expand Creator Studio to support three content types. Add creator search + follow. Add activity tabs to Profile page.

## 1. Expand Data Model — `src/contexts/DataContext.tsx`

### New/Updated Types
- **Extend `Post` interface** to support creator content:
  ```
  Post {
    ...existing fields,
    type: 'text' | 'image' | 'short-video' | 'long-video',
    imageUrl?: string,
    videoUrl?: string,
    thumbnailUrl?: string,
    videoDuration?: number,
    saves: string[],        // user IDs who saved
    shares: number,
  }
  ```
- **Add `savedPosts: string[]`** to localStorage (like savedReels)
- **Add new context methods**: `toggleSavePost`, `isSavedPost`, `togglePostLike` (update existing `toggleLike` to use userId array like reels do)

### New Seed Data
- Add 3-4 seed posts with mixed types (text, image, long-video) attributed to existing creators (creator-001, creator-002, creator-003)

## 2. Redesign Community Page — `src/pages/Community.tsx`

### Layout
- **Header**: Title + Search icon (navigates to `/community/search`)
- **Filters**: All, Text, Photos, Short Videos, Long Videos
- **Feed**: Cards from DataContext posts, sorted by date descending

### Post Card Design
- **Author row**: Avatar initial, name (clickable → `/creator/{id}`), Follow button, time
- **Content**: Text body
- **Media**: 
  - Image posts: full-width image
  - Short video: inline video player with play overlay
  - Long video: YouTube-style thumbnail with duration badge, clickable → `/community/video/{postId}` 
- **Actions bar**: Like (heart + count), Comment (icon + count), Share, Save (bookmark)
- **Comments**: Expandable section showing comments with input to add new

### Functional
- Like/save/comment all wired to DataContext
- Filter chips actually filter by `post.type`

## 3. Long Video Player Page — `src/pages/CommunityVideo.tsx` (new)

- YouTube-style layout: video player on top, below: title, creator info + follow button, description, like/comment/share/save actions, comment section
- Route: `/community/video/:postId`

## 4. Creator Search Page — `src/pages/CommunitySearch.tsx` (new)

- Search input at top
- Shows list of creators matching search query (filters `creatorProfiles` by name/bio)
- Each result: avatar, name, bio snippet, follower count, Follow/Following button
- Clicking creator → `/creator/{id}`
- Route: `/community/search`

## 5. Expand Creator Studio — `src/pages/CreatorStudio.tsx`

### Add Tabs for Content Types
- Current "My Videos" tab renamed to "Reels" (short videos)
- Add "Posts" tab showing text/image posts by this creator
- Add "Long Videos" tab showing long-format videos
- Upload button opens a choice: "Text Post", "Short Video (Reel)", "Long Video"

### New Upload Flows
- **Text/Image Post**: Simple form — text content + optional image file picker → calls `addPost` with `type: 'text' | 'image'`
- **Short Video**: Existing `UploadReel` flow (unchanged)
- **Long Video**: Similar to UploadReel but with `type: 'long-video'`, adds to posts instead of reels

## 6. Profile Page Activity Tabs — `src/pages/Profile.tsx`

### Add Activity Section with Tabs
Below existing profile info, add:
- **Following** tab: List of creators the user follows (from `subscriptions`), each with avatar, name, unfollow button
- **Liked** tab: Posts + Reels the user has liked (filter posts/reels where `likes` includes `user.id`)
- **Commented** tab: Posts where user has commented
- **Saved** tab: Saved posts + saved reels

Each item shown as a compact card (thumbnail/text preview, creator name, type badge).

## 7. Routes — `src/App.tsx`

Add:
- `/community/video/:postId` → `CommunityVideo`
- `/community/search` → `CommunitySearch`

## Files Summary

| File | Action |
|------|--------|
| `src/contexts/DataContext.tsx` | Edit — extend Post type, add save/like methods, seed data |
| `src/pages/Community.tsx` | Rewrite — full social feed with real data |
| `src/pages/CommunityVideo.tsx` | Create — YouTube-style long video page |
| `src/pages/CommunitySearch.tsx` | Create — creator search + follow |
| `src/pages/CreatorStudio.tsx` | Edit — add post types, content tabs |
| `src/pages/Profile.tsx` | Edit — add activity tabs section |
| `src/App.tsx` | Edit — add new routes |

