## Meta Graph API v26.0 Reel Publishing Flow

The application now renders each generated Reel into an H.264/AAC MP4 under `data/media/` and serves it from `/api/media/<reel-id>.mp4`. The service must be deployed at a public HTTPS `APP_URL`, because Meta downloads the video from the supplied URL during container creation.[1]

1. **Render the Reel.** The backend uses FFmpeg to create a 1080x1920 MP4 with a 9:16 layout, H.264 video, AAC audio, `yuv420p` pixel format, and `+faststart` metadata.

2. **Create a Reel container.** The backend calls `POST /<IG_ID>/media` with `media_type=REELS`, `video_url=<public APP_URL>/api/media/<reel-id>.mp4`, `caption`, `share_to_feed=true`, and `is_ai_generated=true`.[1]

3. **Poll processing status.** The backend calls `GET /<IG_CONTAINER_ID>?fields=status_code` once per minute, for up to five checks by default. It only continues when the status is `FINISHED`; `ERROR`, `EXPIRED`, or a timeout returns a failed publish result.[1]

4. **Publish the container.** The backend calls `POST /<IG_ID>/media_publish` with the `creation_id` only after the explicit human `publish_now` action has set the approval state to `approved`.[1]

5. **Read comments.** `GET /api/engagement/comments` queries `GET /<IG_MEDIA_ID>/comments?fields=id,text,username,timestamp` for published media. A webhook can be added later for lower-latency ingestion; polling is provided as a working baseline.[2]

6. **Reply to comments.** `POST /api/engagement/reply` generates a reply using Gemini or a deterministic fallback and, when a real comment ID and Meta token are present, calls `POST /<IG_COMMENT_ID>/replies` with the `message` parameter.[2]

### Required Meta access

For the Facebook Login route, the account and app need the content-publishing and comment-management permissions described by Meta, including `instagram_content_publish`, `instagram_manage_comments`, and `pages_read_engagement`. For Instagram Login, use the corresponding `instagram_business_content_publish` and `instagram_business_manage_comments` permissions.[1][2]

### Local development limitation

The browser can preview generated MP4 files locally, but Meta cannot fetch a `localhost` URL. To publish from a local machine, expose the service through a public HTTPS tunnel and set `APP_URL` to that tunnel URL. For production, use a stable public host and durable object storage if the deployment can restart or scale across instances.

[1]: https://developers.facebook.com/documentation/instagram-platform/content-publishing "Meta Content Publishing"
[2]: https://developers.facebook.com/documentation/instagram-platform/comment-moderation "Meta Comment Moderation"
