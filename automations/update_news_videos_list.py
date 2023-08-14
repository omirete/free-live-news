import json
import argparse
from typing import Literal
import requests
from time import sleep
from paramiko import AutoAddPolicy, SFTPClient, SSHClient


def get_sftp_client(ssh_host: str, ssh_usr: str, ssh_pwd: str = None, ssh_base_dir: str = '.') -> SFTPClient:
    with SSHClient() as ssh:
        ssh.set_missing_host_key_policy(AutoAddPolicy())
        ssh.connect(
            hostname=ssh_host,
            username=ssh_usr,
            password=ssh_pwd,
        )
        with ssh.open_sftp() as sftp:
            sftp.chdir(ssh_base_dir)


def sftp_path_exists(sftp: SFTPClient, path: str) -> bool:
    try:
        sftp.lstat(path)
        return True
    except FileNotFoundError:
        return False


def get_live_videos_from_channel(api_key: str, channel_id: str, max_search_results: int = 10, debug: bool = False) -> list[dict]:

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
    if debug == True:
        print(res.text)
        print(res.json())
    if res.status_code == 200:
        results = res.json()
        items = results["items"]
        return items
    else:
        res.raise_for_status()


def get_interesting_channels() -> dict:
    with open('public/configs/interesting_channels.json', 'r', encoding='utf-8') as f:
        return json.load(f)


def save_videos_list(videos: list[dict], sftp: SFTPClient, type: Literal["active", "inactive"] = "active"):
    filename = "news_videos.json" if type == "active" else "inactive_videos.json"
    if sftp_path_exists(sftp, 'configs') == False:
        sftp.mkdir('configs')
    with sftp.open(f'configs/{filename}', 'w') as f:
        json.dump(videos, f, ensure_ascii=False)


def parseArgs() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog='Free live news: Update list of videos',
        description="Finds all active news videos and saves the result to an SFTP directory.",
        epilog='For questions, reach out to the developer (GitHub user: /omirete).')

    parser.add_argument('-k', '--api_key', required=True)
    parser.add_argument('--ssh_host', required=True)
    parser.add_argument('-u', '--ssh_usr', required=False)
    parser.add_argument('-p', '--ssh_pwd', required=False)
    parser.add_argument('-b', '--ssh_base_dir', required=False)
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
            channel_id,
            debug=debug
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


def get_inactive_live_videos(active_videos: list[dict], sftp: SFTPClient, debug: bool = False) -> list[dict]:
    active_videos_ids = [v["id"] for v in active_videos]

    # Get videos that went inactive since we last checked ----------------------
    try:
        with sftp.open(f'configs/news_videos.json', 'r') as f:
            previously_active_videos: list[dict] = json.load(f)
    except FileNotFoundError:
        previously_active_videos: list[dict] = []
    newly_inactive_videos = [
        v for v in previously_active_videos if v["id"] not in active_videos_ids]
    # --------------------------------------------------------------------------

    # Add those videos to the full list of inactive ones -----------------------
    try:
        with sftp.open(f'configs/inactive_videos.json', 'r') as f:
            inactive_videos: list[dict] = json.load(f)
    except FileNotFoundError:
        inactive_videos: list[dict] = []
    inactive_videos.extend(newly_inactive_videos)
    # --------------------------------------------------------------------------

    # Remove from the inactive list any video that might have been reactivated -
    inactive_videos = [v for v in inactive_videos if v["id"]
                       not in active_videos_ids]
    # --------------------------------------------------------------------------

    return inactive_videos


def main(api_key: str, ssh_host: str, ssh_usr: str = None, ssh_pwd: str = None, ssh_base_dir: str = '.', debug: bool = False):
    videos = get_active_live_videos(api_key, debug)
    with get_sftp_client(ssh_host, ssh_usr, ssh_pwd, ssh_base_dir) as sftp:
        inactive_videos = get_inactive_live_videos(videos, sftp, debug)
        save_videos_list(videos, sftp, 'active')
        save_videos_list(inactive_videos, sftp, 'inactive')


if __name__ == "__main__":
    args = parseArgs()
    main(args.api_key, args.ssh_host, args.ssh_usr,
         args.ssh_pwd, args.ssh_base_dir, args.debug)
