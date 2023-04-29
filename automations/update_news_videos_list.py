import json
import argparse
from typing import Literal
import requests
from time import sleep
from ftputil import FTPHost
from ftputil.error import FTPIOError


def get_live_videos_from_channel(api_key: str, channel_id: str, max_search_results: int = 10) -> list[dict]:

    # Setup search params ------------------------------------------------------
    params = {
        # The "part" paramenter needs to be set to "snippet" as per the docs:
        # https://developers.google.com/youtube/v3/docs/search/list
        "part": "snippet",
        "key": api_key,
        "maxResults": max_search_results,
        "channelId": channel_id,
        "eventType": "live",
        "type": "video",  # needed if "eventType" is set to "live"
    }
    # --------------------------------------------------------------------------

    base_endpoint = "https://www.googleapis.com/youtube/v3/search"

    res = requests.get(base_endpoint, params)
    if res.status_code == 200:
        results = res.json()
        items = results["items"]
        return items
    else:
        res.raise_for_status()


def get_interesting_channels() -> dict:
    with open('public/configs/interesting_channels.json', 'r', encoding='utf-8') as f:
        return json.load(f)


def save_videos_list(videos: list[dict], ftp: FTPHost, type: Literal["active", "inactive"] = "active"):
    filename = "news_videos.json" if type == "active" else "inactive_videos.json"
    with ftp.open(f'freelivenews.rocks/configs/{filename}', 'w', encoding='utf-8') as f:
        json.dump(videos, f, ensure_ascii=False)


def parseArgs() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog='Free live news: Update list of videos',
        description="Finds all active news videos and saves the result to an FTP directory.",
        epilog='For questions, reach out to the developer (GitHub user: /omirete).')

    parser.add_argument('-k', '--api_key', required=True)
    parser.add_argument('--ftp_host', required=True)
    parser.add_argument('-u', '--ftp_usr', required=False)
    parser.add_argument('-p', '--ftp_pwd', required=False)
    parser.add_argument('-d', '--debug', required=False, action='store_true')

    return parser.parse_args()


def get_active_live_videos(api_key: str, debug: bool = False) -> list[dict]:
    channels = get_interesting_channels()
    videos = []
    channel_ids = list(channels.keys())
    for i in range(len(channel_ids)):
        channel_id = channel_ids[i]
        c = channels[channel_id]
        if debug:
            print(f"Working on channel: {c['alias']}")
        channel_videos = get_live_videos_from_channel(
            api_key,
            channel_id
        )
        for v in channel_videos:
            v["custom_metadata"] = {
                "lang": c["lang"],
                "region": c["region"],
                "type": c["type"]
            }
            videos.append(v)
        if i + 1 < len(channels):
            # Wait 5 seconds between each call
            sleep(3)
    return videos


def get_inactive_live_videos(active_videos: list[dict], ftp: FTPHost, debug: bool = False) -> list[dict]:
    active_videos_ids = [v["id"] for v in active_videos]

    # Get videos that went inactive since we last checked ----------------------
    try:
        with ftp.open(f'freelivenews.rocks/configs/news_videos.json', 'r', encoding='utf-8') as f:
            previously_active_videos: list[dict] = json.load(f)
    except FTPIOError:
            previously_active_videos: list[dict] = []
    newly_inactive_videos = [
        v for v in previously_active_videos if v["id"] not in active_videos_ids]
    # --------------------------------------------------------------------------

    # Add those videos to the full list of inactive ones -----------------------
    try:
        with ftp.open(f'freelivenews.rocks/configs/inactive_videos.json', 'r', encoding='utf-8') as f:
            inactive_videos: list[dict] = json.load(f)
    except FTPIOError:
            inactive_videos: list[dict] = []
    inactive_videos.extend(newly_inactive_videos)
    # --------------------------------------------------------------------------

    # Remove from the inactive list any video that might have been reactivated -
    inactive_videos = [v for v in inactive_videos if v["id"]
                       not in active_videos_ids]
    # --------------------------------------------------------------------------

    return inactive_videos


def main(api_key: str, ftp_host: str, ftp_usr: str = None, ftp_pwd: str = None, debug: bool = False):
    videos = get_active_live_videos(api_key, debug)
    with FTPHost(ftp_host, ftp_usr, ftp_pwd) as ftp:
        inactive_videos = get_inactive_live_videos(videos, ftp, debug)
        save_videos_list(videos, ftp, 'active')
        save_videos_list(inactive_videos, ftp, 'inactive')


if __name__ == "__main__":
    args = parseArgs()
    main(args.api_key, args.ftp_host, args.ftp_usr, args.ftp_pwd, args.debug)
