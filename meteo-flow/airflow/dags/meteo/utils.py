from importlib import import_module
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup


def get_cls(cls_name, module_name="meteo.operators"):
    module = import_module(module_name)
    return getattr(module, cls_name)


class MeteoFilesHunter:

    def __init__(self, root_url, filetype="zip"):
        self.root_url = root_url
        self.filetype = filetype

    def find(self, url=None):
        for f in self.find_links(url or self.root_url): yield f
        for url in self.list_webdirs(url or self.root_url):
            yield from self.find(url)

    def list_webdirs(self, url):
        soup = BeautifulSoup(self.load_page(url), "html.parser")
        rows = soup.find("table").find_all("tr")
        return (
            urljoin(url, row.find("a").get("href"))
            for row in rows if (dir_img := row.find("img", alt="[DIR]"))
        )

    def find_links(self, url):
        soup = BeautifulSoup(self.load_page(url), "html.parser")
        return (urljoin(url, href) for link in soup.find_all("a")
                if (href := link.get("href")).endswith(self.filetype))

    def load_page(self, url):
        response = requests.get(url, allow_redirects=True)
        return response.text
