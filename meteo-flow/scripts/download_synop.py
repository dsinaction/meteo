import os
import argparse

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin


def webdir_ls(url):
    soup = BeautifulSoup(load_page(url), "html.parser")
    rows = soup.find("table").find_all("tr")
    return (
        urljoin(url, row.find("a").get("href"))
        for row in rows if (dir_img := row.find("img", alt="[DIR]"))
    )


def find_links(url, filetype="zip"):
    soup = BeautifulSoup(load_page(url), "html.parser")
    return ( urljoin(url, href) for link in soup.find_all("a") if (href := link.get("href")).endswith(filetype) )


def load_page(url):
    response = requests.get(url)
    return response.text


def find_zip_files(url):
    for f in find_links(url, "zip"): yield f
    for url in webdir_ls(url):
        for f in find_zip_files(url):
            yield f


def get_file_size(uri):
    response = requests.head(uri, allow_redirects=True)
    response.raise_for_status()
    return int(response.headers["content-length"])


def download_file(url, directory, verbose=True, chunk_size=8192):
    filename = url.split("/")[-1]
    path = os.path.join(directory, filename)
    uri_size = get_file_size(url)

    with requests.get(url, stream=True, allow_redirects=True) as r:
        r.raise_for_status()
        bytes_downloaded = 0
        with open(path, "wb") as f:
            for chunk in r.iter_content(chunk_size=chunk_size):
                bytes_downloaded += f.write(chunk)
                if verbose:
                    print("progress: %d/%d\r" % (bytes_downloaded, uri_size), end="")

        if uri_size != bytes_downloaded:
            os.remove(f.name)
            raise RuntimeError("No whole file has been downloaded (%d != %d)." % (uri_size, bytes_downloaded))

    return bytes_downloaded


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download data from IMGW")
    parser.add_argument("dest", metavar="d", type=str,
        help="Dest directory where to save the files")
    args = parser.parse_args()

    can_continue = False

    ROOT_PAGE = "http://danepubliczne.imgw.pl/data/dane_pomiarowo_obserwacyjne/dane_meteorologiczne/dobowe/synop/"
    for url in find_zip_files(ROOT_PAGE):
        if url == "http://danepubliczne.imgw.pl/data/dane_pomiarowo_obserwacyjne/dane_meteorologiczne/dobowe/synop/2011/2011_205_s.zip":
            can_continue = True
        print(url)
        if can_continue:
            download_file(url, args.dest)
