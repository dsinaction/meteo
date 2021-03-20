import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    pl: {
        translation: {
            // General
            'Select...': 'Wybierz...',
            'Poland': 'POLSKA',
            'temperature': 'Temperatura',
            'Temperature': 'Temperatura',
            'date': 'Data',
            'Date': 'Data',
            'Mean temperature': 'Średnia temperatura',
            'Max temperature': 'Maksymalna temperatura',
            'Min temperature': 'Minimalna temperatura',
            'Search': 'Wyszukaj',
            'Trend Line': 'Linia trendu',
            'Year': 'Rok',
            'Month': 'Miesiąc',

            'Jan': 'STY',
            'Feb': 'LUT',
            'Mar': 'MAR',
            'Apr': 'KWI',
            'May': 'MAJ',
            'Jun': 'CZE',
            'Jul': 'LIP',
            'Aug': 'SIE',
            'Sep': 'WRZ',
            'Oct': 'PAZ',
            'Nov': 'LIS',
            'Dec': 'GRU',

            'nextIconButtonText': 'Następna strona',
            'backIconButtonText': 'Poprzednia strona',
            'labelRowsPerPage': 'Wiersze na stronę',

            'Nav Summary': 'Strona Główna',
            'Nav Stations': 'Stacje Meterologiczne',
            'Nav Trends': 'Trendy',
            'Nav Deviations': 'Odchylenia',
            'Nav Intervals': 'Przedziały',
            'Nav Monthly Data': 'Dane miesięczne',
            'Nav About': 'O stronie',

            // Dashboard
            'DashboardView Title': 'Meteo - Data Science In Action',

            'Average temperature in {{date}}': 'Średnia temperatura w {{date}}',
            'Comparing to long-term average for that month': 'W porównaniu do średniej długoterminowej dla tego miesiąca.',

            'Max temperature in {{date}}': 'Maksymalna temperatura w {{date}}',
            'Comparing to max temperature in the previous year': 'W porównaniu do maksymalnej temperatury w zeszłym roku.',

            'Min temperature in {{date}}': 'Minimalna temperatura w {{date}}',
            'Comparing to min temperature in the previous year': 'W porównaniu do minimalnej temperatury w zeszłym roku.',

            'Average temperature in {{date}} in synop stations': 'Średnia temperatura w {{date}} dla poszczególnych stacji meterologicznych.',
            'Average temperature in the same month in the previous years': 'Średnia temperatura dla danego miesiąca w w poprzednich latach.',

            // StationListView
            'StationListView Title': 'Meteo - Stacje Meterologiczne',
            'Station Name': 'Stacja',
            'Latest Observation': 'Najnowsza obserwacja',

            // TrendsView
            'TrendsView Title': 'Meteo - Trendy',
            '12 months moving average and trend': 'Średnia ruchoma z ostatnich 12 miesięcy oraz trend długoterminowy.',
            '12 months moving average and trend - Description': 'Wykres przedstawia 12 miesięczną średnią ruchomą liczoną na podstawie średniej miesięcznej temperatury z ostatnich 12 miesięcy oraz długoterminowy trend liniowy dopasowany metodą najmniejszych kwadratów.',

            'Deviation from trend': 'Odchylenia 12 miesięcznej średniej ruchomej od trendu długoterminowego.',
            'Deviation from Trend - Description': 'Wykres przedstawia odchylenia 12 miesięcznej średniej ruchomej od trendu długoterminowego liczone jako różnica pomiędzy pierwszym a drugim. Dodatnie/Ujemne wartości wskazują na wyższą/niższą zaaobserwowaną temperaturę niż wynikałoby to z trendu.',

            'Trend Deviation': 'Odchylenie od trendu',

            // DeviationsView
            'DeviationsView Title': 'Meteo - Odchylenia Od Średniej',

            'Deviations from long-term averages': 'Odchylenia średnich miesięcznych temperatur od średnich długoterminowych.',
            'Deviations from long-term averages - Description': 'Wykres przedstawia odchylenia średnich miesięcznych temperatur od średnich długoterminowych dla poszczególnych miesiąca. Średnia długoterminowa dla danego miesiąca liczona jest jako średnia ze wszysktich miesięcy z poprzednich lat. Np. średnia długoterminowa dla stycznia liczona jest na podstawie średnich miesięcznych temperatur z 2021-01, 2020-01, 2019-01 itd.',

            'Deviations from long-term averages (Heatmap)': 'Odchylenia średnich miesięcznych temperatur od średnich długoterminowych przedstawione przy pomocy mapy ciepła (ang. heatmap).',
            'Deviations from long-term averages (Heatmap) - Description': 'Wykres przedstawia odchylenia średnich miesięcznych temperatur od średnich długoterminowych dla poszczególnych miesiąca przy wykorzystaniu mapy ciepła. Wykres tego typu pozwala w szybki sposób zidentyfikować obszary, w których następujące koncentracja danego zjawiska',
            'Deviations from long-term averages (Table)': 'Odchylenia średnich miesięcznych temperatur od średnich długoterminowych - Dane.',

            'Average Deviation': 'Odchylenie od średniej',

            // IntervalsView
            'IntervalsView Title': 'Meteo - Przedziały Ufności',
            'CI - lower': 'Dolna granica przedziału',
            'CI - upper': 'Górna granica przedziału',

            'Temperature confidence intervals': '95% przedział ufności dla średnich miesięcznych temperatur oraz średnie miesięczne temperatury dla wybranych lat.',
            'Temperature confidence intervals - Description': 'Wykres przedstaiwa 95% przedział ufności dla średnich miesięcznych temperatur. Jest to przedział obejmujący najbardziej typowe średnie miesięczne temperatury, których możemy oczekiwać w poszczególnych miesiącach. W przypadku kiedy temperatura w danym miesiącu dla danego roku wykracza poza ten przedział, możemy mówić od dość nietypowej temperaturze, która istotnie odbiega od normy.',

            // MonthlyDataView
            'MonthlyDataView Title': 'Meteo - Dane Miesięczne',
            'Chart with monthly data (tavg)': 'Średnia miesięczna temperatura.',
            'Chart with monthly data (tmax)': 'Maksymalna miesięczna temperatura.',
            'Chart with monthly data (tmin)': 'Minimalna miesięczna temperatura.',
            'Monthly data table': 'Dane miesięczne.',

            // AboutView
            'AboutView Title': 'Meteo - O Stronie',
            'Data Source Header': 'Źródło Danych',
            'Data Source Info': 'Dane wykorzystane na stronie zostały udostępnione prez Instytut Meteorologii i Gospodarki Wodnej – Państwowy Instytut Badawczy. Dane dostępne są za pośrednictwem systemu teleinformatycznego pod adresem: https://danepubliczne.imgw.pl oraz na stronie https://meteo.imgw.pl.',


            // StationSelect

            'Select Station': 'Wybierz stację meterologiczną ...',
            'Loading Stations': 'Wczytywanie stacji meterologicznych ...',
            'Stations Loading Error': 'Wysąpił nieczekiwany błąd. Nie udało się wczytać stacji meterologicznych.',
            'Lack of Stations': 'Brak stacji meterologicznych.',
            'Station List': 'Lista Stacji',
            'Monthly Data': 'Dane miesięczne',

        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "pl",
        fallbackLng: "pl",
        keySeparator: false,
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;