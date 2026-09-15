# Logo siwek.cloud

Pixel art na siatce 16 x 16. Rozmiar rodzimy, nie zmniejszony — favicon wyglada dokladnie tak, jak zostal zaprojektowany.

## Pliki
| Plik | Uzycie |
|---|---|
| `siwek-cloud-mark.svg` | znak podstawowy, na ciemnym tle |
| `siwek-cloud-mark-mono.svg` | jednokolorowy: haft, stempel, druk 1-kolorowy |
| `siwek-cloud-mark-light.svg` | wersja na jasne tlo (sierc o ton ciemniejsza) |
| `siwek-cloud-cloud.svg` | chmurka: punktor, znacznik przypisu, separator — nigdy samodzielne logo |
| `siwek-cloud-lockup-pixel.svg` | lockup poziomy, wersja pikselowa (wymaga Press Start 2P) |
| `favicon-16/32/48/180/512.png` | favicon i ikony aplikacji |
| `apple-touch-icon.png` | 512 px z pelnym tlem #0F1322 |

## Paleta
```
#0F1322  kontur, tlo
#2B3040  pas maski
#8A9099  siersc (siwy szop)
#FFFFFF  brwi, pysk
#5BC9B0  oczy, akcent
```

## Reguly
- **Skalowanie:** tylko calkowite wielokrotnosci (16, 32, 48, 64, 128, 288). Nigdy 1,5x, nigdy z wygladzaniem.
- **Format:** SVG z `shape-rendering="crispEdges"` jako zrodlo; przy bitmapach zawsze `image-rendering: pixelated`.
- **Odstep:** min. 2 piksele siatki wolnego pola wokol znaku; w lockupie odstep od nazwy = 3 piksele siatki.
- **Nie:** obracac, dodawac cieni i obwodek, zmieniac palety, animowac pikseli pojedynczo, laczyc w jednym kadrze z ilustrowanym szopem.

## Dwa szopy, dwie role
Pikselowy = znak marki (favicon, avatar, naklejki, stopka strony).
Ilustrowany = bohater slajdow, cztery warianty (operator, architekt, po incydencie, machajacy).

## PowerPoint

Folder `pptx/` — PNG gotowe do wstawienia w slajd (Wstaw > Obraz).

| Plik | Uzycie |
|---|---|
| `lockup-dark.png` | lockup na ciemny slajd, przezroczyste tlo, 2048 x 512 |
| `lockup-light.png` | lockup na jasny slajd, przezroczyste tlo |
| `lockup-dark-bg.png` | lockup z wypelnionym tlem #0F1322 (gdy slajd ma obraz pod spodem) |
| `mark-256/512/1024.png` | sam znak, przezroczyste tlo |
| `mark-light-*.png` | sam znak na jasne tlo |
| `mark-mono-*.png` | sam znak jednokolorowy |

Zasady w PowerPoincie:
- Wstawiaj w rozmiarach bedacych wielokrotnoscia 16 px, inaczej piksele sie rozmyja.
- Nie skaluj lockupu ponizej 640 px szerokosci — podtytul przestaje byc czytelny.
- Na slajdzie tytulowym i koncowym: znak 220 px w rogu. Na slajdach tresciowych znaku nie ma, wystarczy krotki link w linijce.
- Typografia w lockupach jest wypalona w obraz, wiec nie wymaga instalacji fontow na maszynie prezentujacej.

## HTML
```html
<link rel="icon" href="/logo/siwek-cloud-mark.svg" type="image/svg+xml">
<link rel="icon" href="/logo/favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="/logo/apple-touch-icon.png">
```

## Motto
AZURE WELL-ARCHITECTED · RESILIENCY · AIOPS
