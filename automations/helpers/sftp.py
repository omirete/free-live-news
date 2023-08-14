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
            return sftp


def sftp_path_exists(sftp: SFTPClient, path: str) -> bool:
    try:
        sftp.lstat(path)
        return True
    except FileNotFoundError:
        return False
