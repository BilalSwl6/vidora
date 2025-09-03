def format_video_data(video):
    return {
        "id": video.id,
        "title": video.title,
        "description": video.description,
        "url": video.url,
        "user_id": video.user_id,
    }

def format_channel_data(channel):
    return {
        "id": channel.id,
        "name": channel.name,
        "user_id": channel.user_id,
    }

def format_recommendation_data(recommendation):
    return {
        "user_id": recommendation.user_id,
        "recommended_videos": [format_video_data(video) for video in recommendation.videos],
    }

def validate_video_data(video_data):
    required_fields = ["title", "description", "url", "user_id"]
    for field in required_fields:
        if field not in video_data:
            raise ValueError(f"Missing required field: {field}")
    return True

def validate_channel_data(channel_data):
    required_fields = ["name", "user_id"]
    for field in required_fields:
        if field not in channel_data:
            raise ValueError(f"Missing required field: {field}")
    return True