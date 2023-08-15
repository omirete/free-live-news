import json
import argparse
from paramiko import AutoAddPolicy, SFTPClient, SSHClient
import requests
from time import sleep
from requests_oauthlib import OAuth2Session, TokenUpdated


def get_ssh_client(ssh_host: str, ssh_usr: str, ssh_pwd: str = None) -> SSHClient:
    ssh = SSHClient()
    ssh.set_missing_host_key_policy(AutoAddPolicy())
    ssh.connect(
        hostname=ssh_host,
        username=ssh_usr,
        password=ssh_pwd,
    )
    return ssh

def get_sftp_client(ssh: SSHClient, ssh_base_dir: str = '.') -> SFTPClient:
    sftp = ssh.open_sftp()
    sftp.chdir(ssh_base_dir)
    return sftp


def parseArgs() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        prog='Free live news: Update list of videos',
        description="Finds all active news videos and saves the result to an FTP directory.",
        epilog='For questions, reach out to the developer (GitHub user: /omirete).')

    parser.add_argument('-k', '--api_key', required=True)
    parser.add_argument('--ssh_host', required=True)
    parser.add_argument('-u', '--ssh_usr', required=False)
    parser.add_argument('-p', '--ssh_pwd', required=False)
    parser.add_argument('-b', '--ssh_base_dir', required=False)
    parser.add_argument('-yp', '--yt_playlist_id', required=True)
    parser.add_argument('-yt', '--yt_token', required=True)
    parser.add_argument('-yrt', '--yt_refresh_token', required=True)
    parser.add_argument('-ytci', '--yt_client_id', required=True)
    parser.add_argument('-ytcs', '--yt_client_secret', required=True)
    parser.add_argument('-d', '--debug', required=False, action='store_true')

    return parser.parse_args()


def get_live_videos(sftp: SFTPClient, debug: bool = False) -> list[dict]:
    # Get videos that went inactive since we last checked ----------------------
    try:
        with sftp.open(f'freelivenews.rocks/configs/news_videos.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    # --------------------------------------------------------------------------


def get_inactive_videos(sftp: SFTPClient, debug: bool = False) -> list[dict]:
    # Get videos that went inactive since we last checked ----------------------
    try:
        with sftp.open(f'freelivenews.rocks/configs/inactive_videos.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    # --------------------------------------------------------------------------


def get_playlist_items(api_key: str, yt_playlist_id: str, pageToken: str = None):
    endpoint = "https://www.googleapis.com/youtube/v3/playlistItems"
    params = {
        "key": api_key,
        "playlistId": yt_playlist_id,
        "part": "id,snippet"
    }
    if pageToken != None:
        params["pageToken"] = pageToken

    res = requests.get(endpoint, params)
    if res.status_code == 200:
        results = res.json()
        items = results["items"]
        if "nextPageToken" in results.keys() and results["nextPageToken"] != "":
            nextPageToken = results["nextPageToken"]
            # Wait 2 seconds before the next call, so youtube doesn't get angry.
            sleep(2)
            return [*items, *get_playlist_items(api_key, yt_playlist_id, nextPageToken)]
        else:
            return items
    else:
        res.raise_for_status()


def get_video_ids_to_be_added_to_playlist(videos: list[dict], playlist_items: list[dict]) -> list[str]:
    video_ids_in_playlist = [x["snippet"]["resourceId"]
                             ["videoId"] for x in playlist_items]
    video_ids_to_be_added = []
    for v in videos:
        video_id = v["id"]["videoId"]
        if video_id not in video_ids_in_playlist:
            video_ids_to_be_added.append(video_id)
    return video_ids_to_be_added


def get_playlist_item_ids_to_be_removed(videos: list[dict], playlist_items: list[dict]) -> list[str]:
    video_ids = [v["id"]["videoId"] for v in videos]
    playlist_item_ids_to_be_removed = []
    for x in playlist_items:
        video_id = x["snippet"]["resourceId"]["videoId"]
        playlist_item_id = x["id"]
        if video_id not in video_ids:
            playlist_item_ids_to_be_removed.append(playlist_item_id)
    return playlist_item_ids_to_be_removed


def add_videos_to_playlist(client: OAuth2Session, api_key: str, yt_token: str, video_ids: list[str], yt_playlist_id: str):
    if len(video_ids) > 0:
        endpoint = "https://www.googleapis.com/youtube/v3/playlistItems"
        params = {
            "part": "snippet",
            "key": api_key,
        }

        for id in video_ids:
            body = {
                "snippet": {
                    "playlistId": yt_playlist_id,
                    "position": 0,
                    "resourceId": {
                        "kind": "youtube#video",
                        "videoId": id,
                    },
                }
            }
            print(body)
            res = client.post(endpoint, json=body, params=params)
            # headers = {'Authorization': f'Bearer {yt_token}'}
            # res = requests.post(endpoint, json=body, params=params, headers=headers)

            if res.status_code != 200:
                res.raise_for_status()
            else:
                sleep(2)


def remove_videos_from_playlist(client: OAuth2Session, api_key: str, yt_token: str, playlist_item_ids_to_be_removed: list[str]):
    if len(playlist_item_ids_to_be_removed) > 0:
        endpoint = "https://www.googleapis.com/youtube/v3/playlistItems"

        for id in playlist_item_ids_to_be_removed:
            params = {
                "key": api_key,
                "id": id,
            }
            res = client.delete(endpoint, params=params)
            # headers = {'Authorization': f'Bearer {yt_token}'}
            # res: requests.Response = requests.delete(endpoint, params=params, headers=headers)
            if res.status_code != 200:
                res.raise_for_status()
            else:
                sleep(2)


def main(client: OAuth2Session, api_key: str, yt_token: str, yt_playlist_id: str, ssh_host: str, ssh_usr: str = None, ssh_pwd: str = None, ssh_base_dir: str = '.', debug: bool = False):
    ssh = get_ssh_client(ssh_host, ssh_usr, ssh_pwd)
    with ssh:
        sftp = get_sftp_client(ssh, ssh_base_dir)
        with sftp:
            print("Getting active videos...")
            videos = get_live_videos(sftp, debug)
            # inactive_videos = get_inactive_videos(ftp, debug)
            print("Getting current videos in playlist...")
            playlist_items = get_playlist_items(api_key, yt_playlist_id)
            print("Finding items to be added...")
            video_ids_to_be_added_to_playlist = get_video_ids_to_be_added_to_playlist(
                videos, playlist_items)
            print("Finding items to be removed...")
            playlist_item_ids_to_be_removed = get_playlist_item_ids_to_be_removed(
                videos, playlist_items)
            print("Adding new items...")
            add_videos_to_playlist(client, api_key, yt_token,
                                video_ids_to_be_added_to_playlist, yt_playlist_id)
            print("Removing old items...")
            remove_videos_from_playlist(
                client, api_key, yt_token, playlist_item_ids_to_be_removed)


if __name__ == "__main__":
    args = parseArgs()
    token = {
        'access_token': args.yt_token,
        'refresh_token': args.yt_refresh_token,
        'token_type': 'Bearer',
        'expires_in': '-30',     # initially 3600, need to be updated by you
    }
    client_id = args.yt_client_id
    refresh_url = 'https://oauth2.googleapis.com/token'

    client = OAuth2Session(
        client_id,
        token=token,
        auto_refresh_url=refresh_url,
        auto_refresh_kwargs={
            'client_id': client_id,
            'client_secret': args.yt_client_secret,
        }
    )  # , token_updater=token_saver
    try:
        client.get('https://www.googleapis.com/youtube/v3/playlistItems')
    except TokenUpdated as e:
        print('updated token')
        client = OAuth2Session(
            client_id,
            token=e.token,
            auto_refresh_url=refresh_url,
            auto_refresh_kwargs={
                'client_id': client_id,
                'client_secret': args.yt_client_secret,
            }
        )

    main(
        client=client,
        api_key=args.api_key,
        yt_token=args.yt_token,
        yt_playlist_id=args.yt_playlist_id,
        ssh_host=args.ssh_host,
        ssh_usr=args.ssh_usr,
        ssh_pwd=args.ssh_pwd,
        ssh_base_dir=args.ssh_base_dir,
        debug=args.debug)
