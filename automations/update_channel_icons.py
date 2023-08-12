import json
import argparse
import requests
from paramiko import SFTPClient
from helpers import sftp_path_exists, get_sftp_client


def get_channel_info(api_key: str, channel_ids: list[str]) -> dict:

    # Setup search params ------------------------------------------------------
    parts = [
        "snippet",
        "statistics",
        "brandingSettings",
        "status",  # contains the "madeForKids" property
        "topicDetails"
    ]

    params = {
        # The "part" paramenter needs to be set to "snippet" as per the docs:
        # https://developers.google.com/youtube/v3/docs/search/list
        "part": ','.join(parts),
        "key": api_key,
        "id": ','.join(channel_ids),
    }
    # --------------------------------------------------------------------------

    base_endpoint = 'https://www.googleapis.com/youtube/v3/channels'

    res = requests.get(base_endpoint, params)
    if res.status_code == 200:
        results = res.json()
        items = results["items"]
        channel_info = {}
        for i in items:
            channel_info[i["id"]] = i
        return channel_info
    else:
        res.raise_for_status()


def get_interesting_channels() -> dict:
    with open('public/configs/interesting_channels.json', 'r', encoding='utf-8') as f:
        return json.load(f)


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
    parser.add_argument('-d', '--debug', required=False, action='store_true')

    return parser.parse_args()


def store_channel_images(channel_info: dict, sftp: SFTPClient, debug: bool = False) -> list[dict]:
    channels = get_interesting_channels()

    for id in channels.keys():
        if id in channel_info.keys():
            channels[id]["iconUrl"] = channel_info[id]["snippet"]["thumbnails"]["medium"]["url"]
            channels[id]["bannerUrl"] = channel_info[id]["brandingSettings"]["image"]["bannerExternalUrl"]
            channels[id]["title"] = channel_info[id]["snippet"]["title"]
            channels[id]["description"] = channel_info[id]["snippet"]["description"]

    if sftp_path_exists(sftp, 'configs') == False:
        sftp.mkdir('configs')
    with sftp.open('configs/interesting_channels.json', 'w') as f:
        json.dump(channels, f, ensure_ascii=False)


def main(api_key: str, ssh_host: str, ssh_usr: str = None, ssh_pwd: str = None, ssh_base_dir: str = '.', debug: bool = False):
    channels = get_interesting_channels()
    channel_ids = list(channels.keys())
    channel_info = get_channel_info(api_key, channel_ids)

    with get_sftp_client(ssh_host, ssh_usr, ssh_pwd, ssh_base_dir) as sftp:
        store_channel_images(channel_info, sftp, debug)


if __name__ == "__main__":
    args = parseArgs()
    main(args.api_key, args.ssh_host, args.ssh_usr,
         args.ssh_pwd, args.ssh_base_dir, args.debug)
