import requests


# curl 'https://hydro.imgw.pl/api/map/?category=meteo' -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:85.0) Gecko/20100101 Firefox/85.0' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Accept-Language: en-US,en;q=0.5' --compressed -H 'X-Requested-With: XMLHttpRequest' -H 'Connection: keep-alive' -H 'Referer: https://hydro.imgw.pl/'




if __name__ == "__main__":
    url = "https://hydro.imgw.pl/api/map/?category=meteo"
    headers = {
        "Host": "hydro.imgw.pl",
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:85.0) Gecko/20100101 Firefox/85.0",
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "X-Requested-With": "XMLHttpRequest",
        "Connection": "keep-alive",
        "Referer": "https://hydro.imgw.pl/",
    }

    response = requests.get(url, headers=headers)
    data = response.json()

    station_data = data[0]

    query = """
    INSERT INTO {table} (id, name, latitude, longitude, a, s) VALUES
    ({id}, {name}, {latitude}, {longitude}, {a}, {s}
    """.format(
        table = "imgw.station",
        id = station_data["i"],
        name = station_data["n"],
        latitude = station_data["la"],
        longitude = station_data["lo"],
        a = station_data["a"],
        s = station_data["s"]
    )