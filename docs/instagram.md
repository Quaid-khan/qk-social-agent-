# Instagram Graph API Integration Guide

## Meta Graph API v21.0 Reel Publishing Flow

1. **Create Media Container**:
   ```http
   POST https://graph.facebook.com/v21.0/{ig_user_id}/media
   video_url=https://storage.googleapis.com/...
   caption=...
   media_type=REELS
   share_to_feed=true
   thumb_offset=2500
   ```

2. **Poll Container Processing Status**:
   ```http
   GET https://graph.facebook.com/v21.0/{creation_id}?fields=status_code
   ```
   Wait for status `FINISHED`.

3. **Publish Container**:
   ```http
   POST https://graph.facebook.com/v21.0/{ig_user_id}/media_publish
   creation_id={creation_id}
   ```

4. **Approval Gate Guard**:
   QK Social Agent guarantees that step 3 is never invoked without an explicit `approval.status == "approved"` state.
